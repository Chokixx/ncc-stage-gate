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
  sponsor_enabled: boolean;
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
        "intro, sponsor_enabled, sponsor_name, sponsor_logo_url, sponsor_link, case_pdf_url, case_pdf_name, case_data_url, case_data_name",
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
                {content?.intro
                  ? `Caso ${config.label}`
                  : "Caso pendiente de publicación"}
              </h2>
              {content?.intro ? (
                <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                  {content.intro}
                </p>
              ) : (
                <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
                  El caso de esta etapa se publicará próximamente.
                </p>
              )}
            </div>

            {/* Sponsor */}
            {content?.sponsor_enabled && content?.sponsor_logo_url && (
              <div className="mt-8 bg-white rounded-xl border border-[var(--ncc-steel)] p-6 flex items-center gap-6 flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                    Patrocinador del caso
                  </p>
                  <p className="font-serif text-xl text-[var(--ncc-deep)] mt-1">
                    {content.sponsor_name || "Patrocinador"}
                  </p>
                  {content.sponsor_link && (
                    <a
                      href={content.sponsor_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-sm text-[var(--ncc-deep)] hover:underline"
                    >
                      Visitar sitio <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <a
                  href={content.sponsor_link ?? content.sponsor_logo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-24 w-40 bg-[var(--ncc-cream)] rounded-md border border-[var(--ncc-steel)] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={content.sponsor_logo_url}
                    alt={content.sponsor_name || "Patrocinador"}
                    className="max-h-full max-w-full object-contain p-2"
                    loading="lazy"
                  />
                </a>
              </div>
            )}

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
                  {
                    title: "Brief del caso (PDF)",
                    url: content?.case_pdf_url,
                    name: content?.case_pdf_name,
                  },
                  {
                    title: "Base de datos del caso",
                    url: content?.case_data_url,
                    name: content?.case_data_name,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
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
                          {item.title}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] truncate">
                          {item.url
                            ? (item.name ?? "Archivo disponible")
                            : "Disponible próximamente"}
                        </p>
                      </div>
                    </div>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md bg-[var(--ncc-deep)] text-white hover:opacity-90"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Descargar
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md border border-[var(--ncc-steel)] text-[var(--muted-foreground)] cursor-not-allowed opacity-60"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Descargar
                      </button>
                    )}
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
