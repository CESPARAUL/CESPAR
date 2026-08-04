import Image from "next/image";

export function HeroSatelliteMonitor() {
  return (
    <div className="animate-hero-drift relative h-full w-full">
      <div className="relative h-full w-full origin-left scale-110 sm:scale-120 lg:scale-130">
        <Image
          src="/images/satellite.png"
          alt="Satellite in orbit"
          fill
          sizes="(max-width: 1024px) 90vw, 45vw"
          loading="eager"
          className="object-contain"
          style={{
            filter:
              "drop-shadow(0 25px 40px rgba(0,0,0,0.45)) drop-shadow(0 0 40px rgba(246,144,111,0.2))",
          }}
        />
      </div>
    </div>
  );
}
