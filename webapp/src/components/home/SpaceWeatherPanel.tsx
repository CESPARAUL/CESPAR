const LAYERS = [
  { label: "MAGNETOSPHERE", y: 56 },
  { label: "IONOSPHERE", y: 196 },
  { label: "STRATOSPHERE", y: 336 },
  { label: "TROPOSPHERE", y: 476 },
];

export function SpaceWeatherPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-space-900/70 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <svg
        viewBox="0 0 600 520"
        className="h-full w-full"
        role="img"
        aria-label="Illustrative visualization of atmospheric layers monitored by CESPAR, with signal traces for ionospheric and stratospheric activity"
      >
        <defs>
          <linearGradient id="scanGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-cespar-red)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-cespar-red)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-cespar-red)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {LAYERS.map((layer) => (
          <g key={layer.label}>
            <line
              x1="0"
              y1={layer.y}
              x2="600"
              y2={layer.y}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4 7"
              strokeWidth="1"
            />
            <text
              x="20"
              y={layer.y - 10}
              className="label-mono"
              fontSize="10.5"
              fill="rgba(233,236,245,0.4)"
            >
              {layer.label}
            </text>
          </g>
        ))}

        {/* Ionospheric signal trace */}
        <path
          d="M0,206 C50,178 100,234 150,206 C200,178 250,234 300,206 C350,178 400,234 450,206 C500,178 550,230 600,210"
          fill="none"
          stroke="var(--color-navy-400)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Stratospheric signal trace */}
        <path
          d="M0,346 C60,370 120,322 180,346 C240,370 300,322 360,346 C420,370 480,324 540,346 C565,357 585,340 600,344"
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Live scan marker */}
        <g style={{ animation: "scan-x 6s ease-in-out infinite" }}>
          <rect x="412" y="0" width="16" height="520" fill="url(#scanGlow)" />
          <line x1="420" y1="0" x2="420" y2="520" stroke="var(--color-cespar-red)" strokeWidth="1.5" opacity="0.8" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
        <span className="label-mono text-[10px] text-white/35">
          data illustrative — live feed in development
        </span>
        <div className="text-right">
          <p className="label-mono text-[11px] text-white/70">
            STATION AUL &middot; VLF-01
          </p>
          <p className="label-mono mt-1 flex items-center justify-end gap-1.5 text-[11px] text-emerald-400/90">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            ACTIVE &middot; sampling 2s
          </p>
        </div>
      </div>
    </div>
  );
}
