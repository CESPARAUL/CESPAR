import { existsSync } from "fs";
import path from "path";
import Image from "next/image";

const CANDIDATE_FILES = ["earth.png", "earth.jpg", "earth.jpeg", "earth.webp"];

// Looks for a real Earth photo dropped into public/images (any of the
// candidate names above) so this upgrades automatically once one exists —
// falls back to a CSS approximation until then.
function findEarthPhoto(): string | null {
  for (const file of CANDIDATE_FILES) {
    if (existsSync(path.join(process.cwd(), "public/images", file))) {
      return `/images/${file}`;
    }
  }
  return null;
}

export function HeroEarth() {
  const photo = findEarthPhoto();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 overflow-hidden rounded-full ring-1 ring-white/10 sm:-bottom-28 sm:-left-28 sm:h-72 sm:w-72 lg:-bottom-32 lg:-left-32 lg:h-80 lg:w-80"
      style={{ boxShadow: "0 0 60px 14px rgba(90,150,255,0.16)" }}
    >
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes="224px"
          className="object-cover"
          style={{ animation: "ring-spin 160s linear infinite" }}
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 68% 28%, rgba(150,196,255,0.95) 0%, rgba(74,124,214,0.85) 16%, rgba(32,58,120,0.85) 34%, rgba(10,16,36,0.9) 56%, rgba(5,7,15,0.95) 74%)",
            animation: "ring-spin 160s linear infinite",
          }}
        />
      )}
    </div>
  );
}
