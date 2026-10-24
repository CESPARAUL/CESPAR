from datetime import datetime, timedelta, timezone

# Confirmed with the station operators (Dr. Victor / Edward), not
# something the logger corrects itself: raw timestamp + 5h = UTC.
RAW_TO_UTC_SHIFT = timedelta(hours=5)


class ParsedFile:
    def __init__(self):
        self.rows = []
        self.skipped = 0


def parse_dat_file(fileobj):
    """Parse a CESPAR MagData_*.dat file into UTC-corrected rows.

    Raw lines are: year month day hour minute second Bx By Bz F flag
    (space-delimited, no header). Two corrections are applied that the
    raw file does not reflect:
      - Bx/By (columns 7/8) are swapped at the logger; swapped back here.
      - timestamps are logger-local, not UTC; shifted by +5h.
    Column 11 (always -50.0 in every file seen so far) is an unused
    placeholder and is dropped.
    """
    result = ParsedFile()
    for line in fileobj:
        if isinstance(line, bytes):
            line = line.decode("utf-8", errors="replace")
        parts = line.split()
        if len(parts) != 11:
            result.skipped += 1
            continue
        try:
            year, month, day, hour, minute, second = (int(p) for p in parts[:6])
            raw_bx, raw_by, z, f = (float(p) for p in parts[6:10])
            timestamp = (
                datetime(year, month, day, hour, minute, second, tzinfo=timezone.utc)
                + RAW_TO_UTC_SHIFT
            )
        except ValueError:
            result.skipped += 1
            continue
        result.rows.append(
            {"timestamp": timestamp, "x": raw_by, "y": raw_bx, "z": z, "f": f}
        )
    return result
