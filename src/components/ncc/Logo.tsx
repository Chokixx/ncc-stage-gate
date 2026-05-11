type LogoProps = {
  size?: number;
  variant?: "color" | "white";
  className?: string;
};

export function NCCLogo({ size = 36, variant = "color", className }: LogoProps) {
  const dark = variant === "white" ? "#ffffff" : "#125b50";
  const light = variant === "white" ? "rgba(255,255,255,0.55)" : "#b8ddb8";
  // Four petals: two overlapping circles, each split into quadrants of alternating colors.
  // We render 8 quarter-circle wedges via clipPaths.
  const r = 50;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      aria-label="NCC logo"
    >
      {/* Top petal */}
      <g transform="translate(100 70)">
        <path d={`M -${r} 0 A ${r} ${r} 0 0 1 0 -${r} L 0 0 Z`} fill={light} />
        <path d={`M 0 -${r} A ${r} ${r} 0 0 1 ${r} 0 L 0 0 Z`} fill={dark} />
        <path d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r} L 0 0 Z`} fill={light} />
        <path d={`M 0 ${r} A ${r} ${r} 0 0 1 -${r} 0 L 0 0 Z`} fill={dark} />
      </g>
      {/* Bottom petal */}
      <g transform="translate(100 130)">
        <path d={`M -${r} 0 A ${r} ${r} 0 0 1 0 -${r} L 0 0 Z`} fill={dark} />
        <path d={`M 0 -${r} A ${r} ${r} 0 0 1 ${r} 0 L 0 0 Z`} fill={light} />
        <path d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r} L 0 0 Z`} fill={dark} />
        <path d={`M 0 ${r} A ${r} ${r} 0 0 1 -${r} 0 L 0 0 Z`} fill={light} />
      </g>
    </svg>
  );
}
