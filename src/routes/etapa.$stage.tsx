import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import { Button } from "@/components/ui/button";
import { getStageContent } from "@/lib/ncc/stage-content.functions";

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
      { property: "og:title", content: "Etapa — National Case Competition" },
      { property: "og:description", content: "Contenido y descargables protegidos de la etapa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type StageContent = {
  intro: string;
  sponsor_enabled: boolean;
  sponsor_name: string;
  sponsor_logo_url: string | null;
  sponsor_link: string | null;
  case_pdf_available: boolean;
  case_pdf_name: string | null;
  case_data_enabled: boolean;
  case_data_available: boolean;
  case_data_name: string | null;
};

function StagePage() {
  const { stage } = Route.useParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<StageContent | null>(null);
  const [downloading, setDownloading] = useState<"case_pdf" | "case_data" | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const [downloadEmail, setDownloadEmail] = useState("");

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
    const storedPassword =
      typeof window !== "undefined"
        ? localStorage.getItem(`ncc_${stageId}_password`)
        : null;
    void getStageContent({
      data: { stage: stageId, password: storedPassword },
    }).then((res) => {
      const c = res.content as Partial<StageContent> | null;
      if (!c) return setContent(null);
      setContent({
        intro: c.intro ?? "",
        sponsor_enabled: c.sponsor_enabled ?? false,
        sponsor_name: c.sponsor_name ?? "",
        sponsor_logo_url: c.sponsor_logo_url ?? null,
        sponsor_link: c.sponsor_link ?? null,
        case_pdf_available: c.case_pdf_available ?? false,
        case_pdf_name: c.case_pdf_name ?? null,
        case_data_enabled: c.case_data_enabled ?? true,
        case_data_available: c.case_data_available ?? false,
        case_data_name: c.case_data_name ?? null,
      });
    });
  }, [stageId, config, navigate]);

  const downloadFile = async (kind: "case_pdf" | "case_data", filename: string) => {
    const email = downloadEmail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      setDownloadError("Ingresa un correo electrónico válido para descargar.");
      return;
    }
    const password = localStorage.getItem(`ncc_${stageId}_password`);
    if (!password) {
      navigate({ to: "/", hash: stageId });
      return;
    }
    setDownloading(kind);
    setDownloadError("");
    try {
      const response = await fetch("/api/public/stage-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stageId, kind, password, email }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error ?? "No se pudo preparar la descarga.");
      }
      const objectUrl = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "No se pudo preparar la descarga.");
    } finally {
      setDownloading(null);
    }
  };

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

              <div className="mt-5 max-w-md">
                <label htmlFor="download-email" className="block text-sm font-medium text-[var(--ncc-deep)]">
                  Correo electrónico para la descarga
                </label>
                <input
                  id="download-email"
                  type="email"
                  value={downloadEmail}
                  onChange={(event) => setDownloadEmail(event.target.value)}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="mt-2 w-full rounded-md border border-[var(--ncc-steel)] bg-background px-3 py-2.5 text-sm outline-none focus:border-[var(--ncc-deep)]"
                />
                <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                  Este correo aparecerá en la marca de agua del archivo.
                </p>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Brief del caso (PDF)",
                    available: content?.case_pdf_available,
                    name: content?.case_pdf_name,
                    kind: "case_pdf" as const,
                  },
                  ...(content?.case_data_enabled === false ? [] : [{
                    title: "Base de datos del caso",
                    available: content?.case_data_available,
                    name: content?.case_data_name,
                    kind: "case_data" as const,
                  }]),
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
                          {item.available
                            ? (item.name ?? "Archivo disponible")
                            : "Disponible próximamente"}
                        </p>
                      </div>
                    </div>
                    {item.available ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => void downloadFile(item.kind, item.name ?? "archivo")}
                        disabled={downloading !== null}
                        className="bg-[var(--ncc-deep)] text-primary-foreground hover:opacity-90"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloading === item.kind ? "Preparando…" : "Descargar"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        className="border-[var(--ncc-steel)] text-[var(--muted-foreground)]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Descargar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {downloadError && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {downloadError}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
