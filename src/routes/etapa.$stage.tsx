import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import { supabase } from "@/integrations/supabase/client";

type StageId = "alpha" | "beta" | "delta";

const STAGE_CONFIG: Record<
  StageId,
  { label: string; accent: string; tagline: string }
> = {
  alpha: {
    label: "ALPHA",
    accent: "#598c71",
    tagline: "Primera etapa — Fundamentos & framing.",
  },
  beta: {
    label: "BETA",
    accent: "#125b50",
    tagline: "Segunda etapa — Análisis & profundización.",
  },
  delta: {
    label: "DELTA",
    accent: "#9ebcac",
    tagline: "Etapa final — Estrategia & presentación.",
  },
};

export const Route = createFileRoute("/etapa/$stage")({
  component: StagePage,
  head: () => ({
    meta: [
      { title: "Etapa — National Case Competition" },
      { name: "description", content: "Contenido y descargables de la etapa." },
    ],
  }),
});

type StageContent = {
  intro: string;
  sponsor_name: string;
  sponsor_logo_url: string | null;
  sponsor_link: string | null;
  case_pdf_url: string | null;
  case_pdf_name: string | null;
  case_data_url: string | null;
  case_data_name: string | null;
};

function StagePage() {
  const { stage } = Route.useParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<StageContent | null>(null);

  const stageId = stage as StageId;
  const config = STAGE_CONFIG[stageId];

  useEffect(() => {
    if (!config) {
      navigate({ to: "/" });
      return;
    }
    const unlocked =
      typeof window !== "undefined" &&
      localStorage.getItem(`ncc_${stageId}_unlocked`) === "true";
    if (!unlocked) {
      navigate({ to: "/", hash: stageId });
      return;
    }
    setReady(true);
    void supabase
      .from("stage_content")
      .select(
        "intro, sponsor_name, sponsor_logo_url, sponsor_link, case_pdf_url, case_pdf_name, case_data_url, case_data_name",
      )
      .eq("stage", stageId)
      .maybeSingle()
      .then(({ data }) => setContent((data as StageContent) ?? null));
  }, [stageId, config, navigate]);

  if (!ready || !config) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--ncc-cream)" }}
      >
        <p className="text-[var(--muted-foreground)] text-sm">Verificando acceso…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero / header */}
        <section
          className="w-full"
          style={{ backgroundColor: "#125b50" }}
        >
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-white">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <p className="text-xs uppercase tracking-[0.22em] opacity-80">
              Etapa
            </p>
            <h1 className="font-serif text-5xl md:text-7xl mt-2">
              {config.label}
            </h1>
            <p className="mt-4 text-white/85 max-w-2xl text-lg">
              {config.tagline}
            </p>
          </div>
        </section>

        {/* Case description */}
        <section className="w-full">
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
            <div
              className="bg-white rounded-xl border border-[var(--ncc-steel)] p-8 md:p-10 shadow-[0_4px_24px_rgba(18,91,80,0.06)]"
              style={{ borderLeft: `4px solid ${config.accent}` }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                Descripción del caso
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--ncc-deep)] mt-2">
                Caso pendiente de publicación
              </h2>
              <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
                El caso de esta etapa se publicará próximamente. Aquí encontrarás
                el contexto, los objetivos, los entregables esperados y los
                criterios de evaluación.
              </p>
              <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
                Mantente atento — recibirás una notificación cuando el contenido
                esté disponible.
              </p>
            </div>

            {/* Downloadables */}
            <div className="mt-10">
              <h3 className="font-serif text-2xl md:text-3xl text-[var(--ncc-deep)]">
                Descargables
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                Documentos y recursos para trabajar el caso.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  "Brief del caso (PDF)",
                  "Anexos & datos",
                  "Plantilla de presentación",
                  "Criterios de evaluación",
                ].map((title) => (
                  <div
                    key={title}
                    className="flex items-center justify-between gap-4 bg-white rounded-lg border border-[var(--ncc-steel)] p-5 hover:shadow-[0_4px_18px_rgba(18,91,80,0.08)] transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-10 w-10 rounded-md flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--ncc-mint)" }}
                      >
                        <FileText className="h-5 w-5 text-[var(--ncc-deep)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--ncc-deep)] truncate">
                          {title}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Disponible próximamente
                        </p>
                      </div>
                    </div>
                    <button
                      disabled
                      className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md border border-[var(--ncc-steel)] text-[var(--muted-foreground)] cursor-not-allowed opacity-60"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
