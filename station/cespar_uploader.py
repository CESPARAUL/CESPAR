#!/usr/bin/env python3
"""CESPAR magnetometer uploader - runs on the station Raspberry Pi.

Every run (cron, every 15 minutes): ask the website which days it has and
how big each loaded copy was, then send any MagData_DD_Mon_YYYY.dat file
in DATA_DIR that is missing there or has grown since (today's file grows
all day). Files the website already has are never sent again. Missed runs
(power or internet down) catch up on the next one.

Standard library only (the Pi runs Python 3.7). Settings come from
/home/pi/.cespar_uploader.env:
    CESPAR_API=https://cespar-api.onrender.com/api
    CESPAR_STATION_TOKEN=...
    CESPAR_DATA_DIR=/home/pi/Rpi_data
    CESPAR_SINCE=2026-11-01      # oldest day to send (optional)
"""
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import uuid

ENV_FILE = os.path.expanduser("~/.cespar_uploader.env")
NAME_RE = re.compile(r"^MagData_(\d{1,2})_([A-Za-z]{3})_(\d{4})\.dat$")
MONTHS = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])}


def log(msg):
    print("%s %s" % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), msg), flush=True)


def load_env():
    conf = {}
    if os.path.exists(ENV_FILE):
        for line in open(ENV_FILE):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                conf[k.strip()] = v.strip()
    conf.update({k: v for k, v in os.environ.items() if k.startswith("CESPAR_")})
    return conf


def file_date(name):
    m = NAME_RE.match(name)
    if not m or m.group(2).title() not in MONTHS:
        return None
    try:
        return datetime.date(int(m.group(3)), MONTHS[m.group(2).title()], int(m.group(1)))
    except ValueError:
        return None


def request(url, token, data=None, headers=None, timeout=120):
    req = urllib.request.Request(url, data=data, headers=dict(headers or {}, **{"X-Station-Token": token}))
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return json.loads(res.read().decode() or "{}")


def upload(api, token, path):
    boundary = uuid.uuid4().hex
    with open(path, "rb") as fh:
        content = fh.read()
    body = (
        ("--%s\r\nContent-Disposition: form-data; name=\"file\"; filename=\"%s\"\r\n"
         "Content-Type: application/octet-stream\r\n\r\n" % (boundary, os.path.basename(path))).encode()
        + content + ("\r\n--%s--\r\n" % boundary).encode()
    )
    return request(api + "/magnetometer/station/upload", token, data=body,
                   headers={"Content-Type": "multipart/form-data; boundary=" + boundary}, timeout=300)


def main():
    conf = load_env()
    api = conf.get("CESPAR_API", "https://cespar-api.onrender.com/api").rstrip("/")
    token = conf.get("CESPAR_STATION_TOKEN", "")
    data_dir = conf.get("CESPAR_DATA_DIR", "/home/pi/Rpi_data")
    since = conf.get("CESPAR_SINCE", "")
    since = datetime.date(*map(int, since.split("-"))) if since else None
    if not token:
        log("CESPAR_STATION_TOKEN missing in %s" % ENV_FILE)
        return 2

    # The free Render server sleeps when idle; retry while it wakes up.
    manifest = None
    for attempt in range(4):
        try:
            manifest = request(api + "/magnetometer/station/manifest", token)["days"]
            break
        except urllib.error.HTTPError as exc:
            if exc.code in (401, 403):
                log("the website refused the station token - check CESPAR_STATION_TOKEN")
                return 2
            log("manifest attempt %d failed: %s" % (attempt + 1, exc))
            time.sleep(30)
        except Exception as exc:  # noqa: BLE001 - network, waking server
            log("manifest attempt %d failed: %s" % (attempt + 1, exc))
            time.sleep(30)
    if manifest is None:
        log("website unreachable - will try again next run")
        return 1

    files = []
    for name in os.listdir(data_dir):
        day = file_date(name)
        if day and (not since or day >= since):
            files.append((day, os.path.join(data_dir, name)))
    files.sort()

    sent = failed = 0
    for day, path in files:
        size = os.path.getsize(path)
        if size <= manifest.get(day.isoformat(), 0):
            continue  # the website already has this copy
        try:
            res = upload(api, token, path)
            sent += 1
            log("%s: %s, %s readings (+%s)" % (os.path.basename(path), res.get("status"),
                                                 res.get("readings"), res.get("newReadings", 0)))
        except urllib.error.HTTPError as exc:
            failed += 1
            log("%s: HTTP %s %s" % (os.path.basename(path), exc.code, exc.read()[:200]))
        except Exception as exc:  # noqa: BLE001
            failed += 1
            log("%s: %s" % (os.path.basename(path), exc))
    log("done: %d sent, %d failed, %d already on the website" % (sent, failed, len(files) - sent - failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
