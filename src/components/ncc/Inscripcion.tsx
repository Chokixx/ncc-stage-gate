import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  User,
  Users,
  Plus,
  X,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { submitRegistration } from "@/lib/ncc/registration.functions";

type Participant = { fullName: string; cedula: string; email: string };

const emptyParticipant = (): Participant => ({
  fullName: "",
  cedula: "",
  email: "",
});

const BREB_KEY = "3128737409";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Inscripcion() {
  const submit = useServerFn(submitRegistration);

  const [mode, setMode] = useState<"solo" | "team" | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    emptyParticipant(),
  ]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Participant[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const chooseMode = (m: "solo" | "team") => {
    setMode(m);
    setParticipants([emptyParticipant()]);
  };

  const updateField = (
    idx: number,
    field: keyof Participant,
    value: string,
  ) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    );
  };

  const addParticipant = () => {
    setParticipants((prev) =>
      prev.length < 4 ? [...prev, emptyParticipant()] : prev,
    );
  };
  const removeParticipant = (idx: number) => {
    setParticipants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      setSubmitError("Solo se permiten imágenes JPG, PNG o WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("La imagen debe pesar menos de 5MB.");
      return;
    }
    setSubmitError(null);
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = () => setProofPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BREB_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const validate = (): string | null => {
    for (const [i, p] of participants.entries()) {
      if (!p.fullName.trim() || p.fullName.trim().length < 2)
        return `Falta el nombre del integrante ${i + 1}.`;
      if (!/^[0-9]{4,15}$/.test(p.cedula.trim()))
        return `Cédula inválida del integrante ${i + 1} (solo números).`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
        return `Correo inválido del integrante ${i + 1}.`;
    }
    if (!proofFile) return "Sube una foto del equipo o el comprobante de pago.";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mode) return;
    const err = validate();
    if (err) {
      setSubmitError(err);
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const base64 = proofFile ? await fileToBase64(proofFile) : null;
      await submit({
        data: {
          mode,
          participants: participants.map((p) => ({
            fullName: p.fullName.trim(),
            cedula: p.cedula.trim(),
            email: p.email.trim(),
          })),
          proof: proofFile && base64
            ? {
                filename: proofFile.name,
                contentType: proofFile.type,
                base64,
              }
            : null,
        },
      });
      setSuccess(participants);
    } catch (e) {
      setSubmitError(
        e instanceof Error ? e.message : "No fue posible enviar la inscripción.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setMode(null);
    setParticipants([emptyParticipant()]);
    setProofFile(null);
    setProofPreview(null);
    setSuccess(null);
    setSubmitError(null);
  };

  return (
    <section
      id="inscripcion"
      className="w-full"
      style={{ backgroundColor: "var(--ncc-cream)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--ncc-deep)]">
            Inscripción — NCC 2026
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Completa el formulario para reservar tu cupo
          </p>
        </div>

        {success ? (
          <div className="mx-auto max-w-xl bg-white rounded-xl border border-[var(--ncc-steel)] p-8 shadow-[0_4px_24px_rgba(18,91,80,0.08)] text-center animate-fade-in">
            <div className="mx-auto h-16 w-16 rounded-full bg-[var(--ncc-mint)] flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="h-9 w-9 text-[var(--ncc-deep)]" />
            </div>
            <h3 className="font-serif text-2xl mt-4 text-[var(--ncc-deep)]">
              ¡Inscripción enviada!
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              ¡Nos vemos en la competencia! Revisa tu correo para más
              información.
            </p>
            <div className="mt-5 text-left bg-[var(--ncc-mint)] rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--ncc-deep)]/70 mb-2">
                Participantes registrados
              </p>
              <ul className="space-y-1 text-sm text-[var(--ncc-deep)]">
                {success.map((p, i) => (
                  <li key={i}>
                    • {p.fullName}{" "}
                    <span className="opacity-60">— {p.email}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={resetAll}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border border-[var(--ncc-steel)] px-4 py-2 text-sm text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)] transition-colors"
            >
              Inscribir a otro equipo
            </button>
          </div>
        ) : mode === null ? (
          <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
            <button
              type="button"
              onClick={() => chooseMode("solo")}
              className="group bg-white rounded-xl border border-[var(--ncc-steel)] p-8 text-left hover:border-[var(--ncc-deep)] hover:shadow-[0_4px_24px_rgba(18,91,80,0.10)] transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-[var(--ncc-mint)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-[var(--ncc-deep)]" />
              </div>
              <h3 className="font-serif text-2xl text-[var(--ncc-deep)]">
                Estoy solo
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Busco equipo para la competencia
              </p>
            </button>
            <button
              type="button"
              onClick={() => chooseMode("team")}
              className="group bg-white rounded-xl border border-[var(--ncc-steel)] p-8 text-left hover:border-[var(--ncc-deep)] hover:shadow-[0_4px_24px_rgba(18,91,80,0.10)] transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-[var(--ncc-mint)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-[var(--ncc-deep)]" />
              </div>
              <h3 className="font-serif text-2xl text-[var(--ncc-deep)]">
                Ya tengo equipo
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Inscríbelo con hasta 4 integrantes
              </p>
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="animate-fade-in space-y-6">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="inline-flex items-center gap-1 text-sm text-[var(--ncc-deep)]/70 hover:text-[var(--ncc-deep)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Cambiar selección
            </button>

            <div className="space-y-4">
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[var(--ncc-steel)] p-5 md:p-6 animate-fade-in"
                  style={{ borderTop: "3px solid var(--ncc-deep)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[var(--ncc-deep)]">
                      Integrante {idx + 1}
                      {idx === 0 && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[var(--ncc-mint)] text-[var(--ncc-deep)]">
                          Contacto principal
                        </span>
                      )}
                    </h4>
                    {mode === "team" && idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeParticipant(idx)}
                        className="p-1.5 rounded-md text-[var(--ncc-deep)]/60 hover:text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)]"
                        aria-label="Eliminar integrante"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        required
                        value={p.fullName}
                        onChange={(e) =>
                          updateField(idx, "fullName", e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Número de cédula
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={p.cedula}
                        onChange={(e) =>
                          updateField(
                            idx,
                            "cedula",
                            e.target.value.replace(/[^0-9]/g, ""),
                          )
                        }
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={p.email}
                        onChange={(e) =>
                          updateField(idx, "email", e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                      {idx === 0 && (
                        <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                          Aquí recibirás toda la información del evento
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {mode === "team" && participants.length < 4 && (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-dashed border-[var(--ncc-deep)]/40 text-[var(--ncc-deep)] py-3 text-sm hover:bg-[var(--ncc-mint)] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Agregar integrante ({participants.length}/4)
                </button>
              )}
            </div>

            {/* Upload */}
            <div className="bg-white rounded-xl border border-[var(--ncc-steel)] p-5 md:p-6">
              <label className="block text-sm font-medium text-[var(--ncc-deep)] mb-2">
                Sube una foto de tu equipo o comprobante
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  dragOver
                    ? "border-[var(--ncc-deep)] bg-[var(--ncc-mint)]"
                    : "border-[var(--ncc-steel)] hover:border-[var(--ncc-deep)]/50"
                }`}
              >
                {proofPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={proofPreview}
                      alt="Vista previa"
                      className="max-h-40 rounded-md border border-[var(--ncc-steel)]"
                    />
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Haz clic o arrastra otra imagen para reemplazar
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
                    <Upload className="h-6 w-6" />
                    <p className="text-sm">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs">JPG, PNG · máx. 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Nequi payment */}
            <div className="rounded-xl p-6 text-white shadow-[0_8px_30px_rgba(123,45,139,0.25)]"
              style={{
                background:
                  "linear-gradient(135deg, #7B2D8B 0%, #4A1A6B 100%)",
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    Pago
                  </p>
                  <h4 className="font-serif text-2xl">
                    Realiza tu pago por Nequi
                  </h4>
                </div>
                <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold text-lg">
                  N
                </div>
              </div>
              <div className="mt-5 bg-white/10 backdrop-blur rounded-lg p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide opacity-75">
                    Número Nequi
                  </p>
                  <p className="text-2xl font-semibold tracking-wider">
                    {NEQUI_NUMBER}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyNumber}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white text-[#7B2D8B] px-3 py-2 text-xs font-medium hover:bg-white/90 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar
                    </>
                  )}
                </button>
              </div>
              <a
                href="https://www.nequi.com.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-white text-[#7B2D8B] px-5 py-2.5 text-sm font-semibold hover:bg-white/90 transition"
              >
                Pagar con Nequi
              </a>
              <p className="text-xs opacity-80 mt-3">
                Una vez realizado el pago, sube el comprobante en el campo de
                foto superior.
              </p>
            </div>

            {submitError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[var(--ncc-deep)] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "solo" ? "Inscribirme" : "Inscribir equipo"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
