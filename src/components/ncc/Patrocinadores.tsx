import { ImageIcon } from "lucide-react";

type Sponsor = {
  name: string;
  logo?: string;
};

const official: Sponsor = {
  name: "Por anunciar",
};

const strategic: Sponsor[] = [
  { name: "Por anunciar" },
  { name: "Por anunciar" },
  { name: "Por anunciar" },
];

const support: Sponsor[] = [
  { name: "Por anunciar" },
  { name: "Por anunciar" },
  { name: "Por anunciar" },
];

type LogoSize = "lg" | "md" | "sm";

function LogoCard({ sponsor, size }: { sponsor: Sponsor; size: LogoSize }) {
  const dims = {
    lg: "aspect-[16/9] max-w-2xl",
    md: "aspect-[4/3]",
    sm: "aspect-[4/3]",
  }[size];

  const iconSize = {
    lg: "h-14 w-14",
    md: "h-10 w-10",
    sm: "h-7 w-7",
  }[size];

  const nameClass = {
    lg: "mt-5 font-serif text-2xl md:text-3xl text-[var(--ncc-deep)]",
    md: "mt-4 font-serif text-lg md:text-xl text-[var(--ncc-deep)]",
    sm: "mt-3 text-sm font-medium text-[var(--ncc-deep)]",
  }[size];

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className={`w-full ${dims} bg-white rounded-xl border border-[var(--ncc-steel)] shadow-[0_2px_12px_rgba(18,91,80,0.06)] hover:shadow-[0_8px_28px_rgba(18,91,80,0.12)] transition-shadow flex items-center justify-center overflow-hidden`}
      >
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="w-full h-full object-contain p-6"
          />
        ) : (
          <ImageIcon className={`${iconSize} text-[var(--ncc-mist)]`} />
        )}
      </div>
      <p className={nameClass}>{sponsor.name}</p>
    </div>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-[0.22em] text-[var(--ncc-medium)] font-medium text-center">
      {children}
    </p>
  );
}

export function Patrocinadores() {
  return (
    <section
      id="patrocinadores"
      className="w-full"
      style={{ backgroundColor: "#eff6f2" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)]">
            Patrocinadores
          </h2>
          <p className="text-[var(--muted-foreground)] mt-4">
            Las organizaciones que hacen posible el NCC.
          </p>
        </div>

        {/* Oficial */}
        <div className="mt-14">
          <TierLabel>Patrocinador Oficial</TierLabel>
          <div className="mt-6 flex justify-center">
            <LogoCard sponsor={official} size="lg" />
          </div>
        </div>

        {/* Estratégicos */}
        <div className="mt-16">
          <TierLabel>Patrocinadores Estratégicos</TierLabel>
          <div className="mt-6 grid sm:grid-cols-3 gap-6">
            {strategic.map((s, i) => (
              <LogoCard key={`s-${i}`} sponsor={s} size="md" />
            ))}
          </div>
        </div>

        {/* Apoyo */}
        <div className="mt-16">
          <TierLabel>Patrocinadores de Apoyo</TierLabel>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {support.map((s, i) => (
              <LogoCard key={`a-${i}`} sponsor={s} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
