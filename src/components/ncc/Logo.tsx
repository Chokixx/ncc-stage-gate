import logoUrl from "@/assets/ncc-logo.png";

type LogoProps = {
  size?: number;
  variant?: "color" | "white";
  className?: string;
};

export function NCCLogo({ size = 40, variant = "color", className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt="NCC logo"
      className={className}
      style={
        variant === "white"
          ? { filter: "brightness(0) invert(1)" }
          : undefined
      }
    />
  );
}
