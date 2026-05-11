import { Lock } from "lucide-react";

type Stage = {
  id: "alpha" | "beta" | "omega";
  name: string;
  description: string;
  accent: string;
  textOnAccent: string;
};

const stages: Stage[] = [
  {
    id: "alpha",
    name: "ALPHA",
    description: "La etapa inicial. Aquí comienza el entrenamiento.",
    accent: "#598c71",
    textOnAccent: "#ffffff",
  },
  {
    id: "beta",
    name: "BETA",
    description: "La competencia toma forma. Equipos y retos definidos.",
    accent: "#125b50",
    textOnAccent: "#ffffff",
  },
  {
    id: "omega",
    name: "OMEGA",
    description: "La etapa final. Solo los mejores llegan aquí.",
    accent: "#9ebcac",
    textOnAccent: "#125b50",
  },
];

export function Etapas() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="w-full" style={{ backgroundColor: "#f1f1ed" }}>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)] text-center">
          Las Etapas
        </h2>
        <p className="text-center text-[var(--muted-foreground)] mt-4 max-w-2xl mx-auto">
          Cada etapa del NCC desbloquea nueva información para los participantes.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {stages.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-lg border border-[var(--ncc-steel)] overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(18,91,80,0.06)]"
            >
              <div className="h-2" style={{ backgroundColor: s.accent }} />
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl text-[var(--ncc-deep)]">
                    {s.name}
                  </h3>
                  <Lock className="h-5 w-5 text-[var(--ncc-medium)]" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-3 flex-1 leading-relaxed">
                  {s.description}
                </p>
                <button
                  onClick={() => scrollTo(s.id)}
                  className="mt-6 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
                  style={{ backgroundColor: s.accent, color: s.textOnAccent }}
                >
                  Acceder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
