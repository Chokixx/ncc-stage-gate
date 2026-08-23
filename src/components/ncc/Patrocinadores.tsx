import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Sponsor = {
  id: string;
  tier: "official" | "strategic" | "support";
  position: number;
  name: string;
  logo_url: string | null;
  website_url?: string | null;
};

type TierConfig = {
  cardClass: string;
  imgPad: string;
  nameClass: string;
  gridClass?: string;
};

function LogoCard({
  sponsor,
  config,
}: {
  sponsor: Sponsor;
  config: TierConfig;
}) {
  const card = (
    <div
      className={`group relative w-full bg-white rounded-2xl border border-[var(--ncc-steel)] shadow-[0_2px_12px_rgba(18,91,80,0.05)] hover:shadow-[0_12px_32px_rgba(18,91,80,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center overflow-hidden ${config.cardClass}`}
    >
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className={`w-full h-full object-contain ${config.imgPad}`}
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-10 w-10 text-[var(--ncc-mist)]" />
          <span className="text-xs text-[var(--muted-foreground)]">
            Por anunciar
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {sponsor.website_url ? (
        <a
          href={sponsor.website_url}
          target="_blank"
          rel="noreferrer"
          className="w-full"
          aria-label={`Sitio web de ${sponsor.name}`}
        >
          {card}
        </a>
      ) : (
        card
      )}
      <p className={`text-center ${config.nameClass}`}>{sponsor.name}</p>
    </div>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <span className="h-px w-10 md:w-14 bg-[var(--ncc-mist)]" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ncc-medium)]">
        {children}
      </span>
      <span className="h-px w-10 md:w-14 bg-[var(--ncc-mist)]" />
    </div>
  );
}

function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, tier, position, name, logo_url")
        .order("tier")
        .order("position");
      if (!error && data && !cancelled) setSponsors(data as Sponsor[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return sponsors;
}

export function Patrocinadores() {
  const sponsors = useSponsors();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const official = sponsors.filter((s) => s.tier === "official");
  const strategic = sponsors.filter((s) => s.tier === "strategic");
  const support = sponsors.filter((s) => s.tier === "support");

  const tiers: {
    key: Sponsor["tier"];
    label: string;
    items: Sponsor[];
    config: TierConfig;
  }[] = [
    {
      key: "official",
      label: "Patrocinador Oficial",
      items: official,
      config: {
        cardClass: "aspect-[3/2] max-w-xl mx-auto",
        imgPad: "p-10 md:p-14",
        nameClass:
          "mt-5 font-serif text-2xl md:text-3xl text-[var(--ncc-deep)]",
      },
    },
    {
      key: "strategic",
      label: "Patrocinadores Estratégicos",
      items: strategic,
      config: {
        gridClass:
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto",
        cardClass: "aspect-[4/3]",
        imgPad: "p-8 md:p-10",
        nameClass:
          "mt-4 font-medium text-base md:text-lg text-[var(--ncc-deep)]",
      },
    },
    {
      key: "support",
      label: "Patrocinadores de Apoyo",
      items: support,
      config: {
        gridClass:
          "grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 max-w-4xl mx-auto",
        cardClass: "aspect-[4/3]",
        imgPad: "p-6 md:p-8",
        nameClass: "mt-3 text-sm font-medium text-[var(--ncc-deep)]",
      },
    },
  ];

  return (
    <section id="patrocinadores" className="w-full bg-[var(--ncc-mint)]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)]">
            Patrocinadores
          </h2>
          <p className="text-[var(--muted-foreground)] mt-4">
            Las organizaciones que hacen posible el NCC.
          </p>
        </div>

        {tiers.map((t, i) =>
          t.items.length > 0 ? (
            <div
              key={t.key}
              className={`transition-all duration-700 ease-out ${
                i === 0 ? "mt-12 md:mt-16" : "mt-14 md:mt-20"
              } ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <TierLabel>{t.label}</TierLabel>
              {t.key === "official" ? (
                <div className="flex flex-wrap justify-center gap-8">
                  {t.items.map((s) => (
                    <LogoCard key={s.id} sponsor={s} config={t.config} />
                  ))}
                </div>
              ) : (
                <div className={t.config.gridClass}>
                  {t.items.map((s) => (
                    <LogoCard key={s.id} sponsor={s} config={t.config} />
                  ))}
                </div>
              )}
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
