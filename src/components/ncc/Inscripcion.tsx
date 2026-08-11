import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  User,
  Users,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { submitRegistration } from "@/lib/ncc/registration.functions";
import consentAsset from "@/assets/consentimiento-ncc.pdf.asset.json";

type Participant = {
  fullName: string;
  cedula: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  semester: string;
};

const emptyParticipant = (): Participant => ({
  fullName: "",
  cedula: "",
  email: "",
  phone: "",
  university: "",
  program: "",
  semester: "",
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
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    emptyParticipant(),
  ]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [consentFiles, setConsentFiles] = useState<(File | null)[]>([null]);
  const consentInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Participant[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const chooseMode = (m: "solo" | "team") => {
    setMode(m);
    setTeamName("");
    setParticipants(
      m === "team"
        ? [
            emptyParticipant(),
            emptyParticipant(),
            emptyParticipant(),
            emptyParticipant(),
          ]
        : [emptyParticipant()],
    );
    setConsentFiles(m === "team" ? [null, null, null, null] : [null]);
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

  const handleConsent = (idx: number, file: File | null) => {
    if (!file) return;
    if (!/^(application\/pdf|image\/(jpeg|jpg|png|webp))$/i.test(file.type)) {
      setSubmitError("El consentimiento debe ser PDF o imagen (JPG, PNG).");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setSubmitError("El consentimiento debe pesar menos de 6MB.");
      return;
    }
    setSubmitError(null);
    setConsentFiles((prev) => {
      const next = [...prev];
      while (next.length < participants.length) next.push(null);
      next[idx] = file;
      return next;
    });
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
    if (mode === "team") {
      if (!teamName.trim() || teamName.trim().length < 2)
        return "El nombre del equipo es obligatorio.";
      if (participants.length !== 4)
        return "El equipo debe tener exactamente 4 integrantes.";
    }
    for (const [i, p] of participants.entries()) {
      if (!p.fullName.trim() || p.fullName.trim().length < 2)
        return `Falta el nombre del integrante ${i + 1}.`;
      if (!/^[0-9]{4,15}$/.test(p.cedula.trim()))
        return `Cédula inválida del integrante ${i + 1} (solo números).`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
        return `Correo inválido del integrante ${i + 1}.`;
      if (!/^[0-9]{7,15}$/.test(p.phone.trim()))
        return `Celular inválido del integrante ${i + 1} (solo números).`;
      if (!p.university.trim() || p.university.trim().length < 2)
        return `Falta la universidad del integrante ${i + 1}.`;
      if (!p.program.trim() || p.program.trim().length < 2)
        return `Falta el pregrado del integrante ${i + 1}.`;
      if (!p.semester.trim())
        return `Falta el semestre del integrante ${i + 1}.`;
    }
    for (let i = 0; i < participants.length; i++) {
      if (!consentFiles[i])
        return `Falta el consentimiento firmado del integrante ${i + 1}.`;
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
      const consents = await Promise.all(
        participants.map(async (_, i) => {
          const f = consentFiles[i];
          if (!f) return null;
          return {
            filename: f.name,
            contentType: f.type || "application/pdf",
            base64: await fileToBase64(f),
          };
        }),
      );
      await submit({
        data: {
        mode,
          teamName: teamName.trim() || null,
          participants: participants.map((p) => ({
            fullName: p.fullName.trim(),
            cedula: p.cedula.trim(),
            email: p.email.trim(),
            phone: p.phone.trim(),
            university: p.university.trim(),
            program: p.program.trim(),
            semester: p.semester.trim(),
          })),
          proof: proofFile && base64
            ? {
                filename: proofFile.name,
                contentType: proofFile.type,
                base64,
              }
            : null,
          consents,
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
    setTeamName("");
    setParticipants([emptyParticipant()]);
    setProofFile(null);
    setProofPreview(null);
    setConsentFiles([null]);

    setSuccess(null);
    setSubmitError(null);
  };

  return (
    <section
      id="inscripcion"
      className="w-full"
      style={{ backgroundColor: "var(--ncc-cream)" }}
    >
      <div className="max-w-xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[var(--ncc-mint)] text-[var(--ncc-deep)] text-[10px] font-bold tracking-widest uppercase border border-[var(--ncc-deep)]/10">
            Registro abierto
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-[var(--ncc-deep)]">
            Inscripción <span className="opacity-40">—</span>
            <br />
            <span className="relative inline-block italic">
              NCC 2026
              <span className="absolute -bottom-1 left-0 w-full h-1 rounded-full bg-[var(--ncc-mint)]" />
            </span>
          </h2>
          <p className="mt-4 text-sm font-medium tracking-wide text-[var(--ncc-deep)]/70">
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
          <div className="space-y-4 animate-fade-in">
            {/* Solo — dark filled */}
            <button
              type="button"
              onClick={() => chooseMode("solo")}
              className="group relative w-full overflow-hidden rounded-2xl bg-[var(--ncc-deep)] p-6 text-left shadow-xl shadow-[rgba(10,61,46,0.18)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ncc-mint)] shadow-inner">
                  <User className="h-6 w-6 text-[var(--ncc-deep)]" />
                </div>
                <h3 className="font-serif text-2xl text-white">Estoy solo</h3>
                <p className="mt-1 text-sm text-[var(--ncc-mint)]/80">
                  Busco equipo para la competencia
                </p>
              </div>
              <ArrowRight className="absolute bottom-4 right-6 h-5 w-5 text-[var(--ncc-mint)] opacity-0 transition-opacity group-hover:opacity-100" />
            </button>

            {/* Team — light outlined */}
            <button
              type="button"
              onClick={() => chooseMode("team")}
              className="group relative w-full overflow-hidden rounded-2xl border-2 border-[var(--ncc-deep)]/10 bg-white p-6 text-left shadow-sm transition-all hover:border-[var(--ncc-mint)] hover:bg-[var(--ncc-mint)]/10 active:scale-95"
            >
              <div className="relative z-10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--ncc-mint)] bg-[var(--ncc-mint)]/30">
                  <Users className="h-6 w-6 text-[var(--ncc-deep)]" />
                </div>
                <h3 className="font-serif text-2xl text-[var(--ncc-deep)]">
                  Ya tengo equipo
                </h3>
                <p className="mt-1 text-sm text-[var(--ncc-deep)]/60">
                  Inscríbelo con hasta 4 integrantes
                </p>
              </div>
              <ArrowRight className="absolute bottom-4 right-6 h-5 w-5 text-[var(--ncc-deep)] opacity-20 transition-opacity group-hover:opacity-100" />
            </button>

            <div className="mt-10 flex justify-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--ncc-deep)]/20" />
              <span className="h-1 w-1 rounded-full bg-[var(--ncc-deep)]/40" />
              <span className="h-1 w-1 rounded-full bg-[var(--ncc-deep)]/20" />
            </div>
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

            <div
              className="bg-white rounded-xl border border-[var(--ncc-steel)] p-5 md:p-6 animate-fade-in"
              style={{ borderTop: "3px solid var(--ncc-deep)" }}
            >
              <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                {mode === "team" ? "Nombre del equipo" : "Nombre de tu equipo / participación"}
              </label>
              <input
                type="text"
                required={mode === "team"}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder={mode === "team" ? "Ej. Los Estrategas" : "Opcional — ej. Los Estrategas"}
                className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
              />
            </div>

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
                    <div>
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Número celular
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        required
                        value={p.phone}
                        onChange={(e) =>
                          updateField(
                            idx,
                            "phone",
                            e.target.value.replace(/[^0-9]/g, ""),
                          )
                        }
                        placeholder="3001234567"
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Universidad
                      </label>
                      <input
                        type="text"
                        required
                        value={p.university}
                        onChange={(e) =>
                          updateField(idx, "university", e.target.value)
                        }
                        placeholder="Ej. Universidad de los Andes"
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Pregrado
                      </label>
                      <input
                        type="text"
                        required
                        value={p.program}
                        onChange={(e) =>
                          updateField(idx, "program", e.target.value)
                        }
                        placeholder="Ej. Administración"
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--ncc-deep)]/70">
                        Semestre
                      </label>
                      <select
                        required
                        value={p.semester}
                        onChange={(e) =>
                          updateField(idx, "semester", e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[var(--ncc-steel)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
                      >
                        <option value="">Selecciona…</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={String(n)}>
                            {n}º semestre
                          </option>
                        ))}
                        <option value="Egresado">Egresado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {mode === "team" && (
                <p className="text-xs text-[var(--muted-foreground)] text-center">
                  Los equipos deben tener <strong>exactamente 4 integrantes</strong> para poder inscribirse.
                </p>
              )}
            </div>

            {/* Consentimiento informado */}
            <div className="bg-white rounded-xl border border-[var(--ncc-steel)] p-5 md:p-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-serif text-xl text-[var(--ncc-deep)]">
                    Consentimiento informado
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-md">
                    Descarga el documento, fírmalo y súbelo firmado antes de
                    adjuntar el comprobante de pago.
                  </p>
                </div>
                <a
                  href={consentAsset.url}
                  download="Consentimiento_informado_NCC.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--ncc-deep)] text-[var(--ncc-deep)] px-4 py-2 text-sm font-medium hover:bg-[var(--ncc-mint)] transition"
                >
                  <Download className="h-4 w-4" /> Descargar consentimiento
                </a>
              </div>

              <div
                onClick={() => consentInputRef.current?.click()}
                className="mt-5 cursor-pointer rounded-lg border-2 border-dashed border-[var(--ncc-steel)] hover:border-[var(--ncc-deep)]/50 p-5 text-center transition-colors"
              >
                {consentFile ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--ncc-deep)]">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{consentFile.name}</span>
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
                    <Upload className="h-6 w-6" />
                    <p className="text-sm">
                      Sube el consentimiento firmado (obligatorio)
                    </p>
                    <p className="text-xs">PDF o imagen · máx. 6MB</p>
                  </div>
                )}
                <input
                  ref={consentInputRef}
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => handleConsent(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>
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

            {/* Bre-B payment */}
            <div className="rounded-xl border border-[var(--ncc-steel)] bg-white p-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--ncc-deep)]/60">
                    Pago
                  </p>
                  <h4 className="font-serif text-2xl text-[var(--ncc-deep)]">
                    Paga por Bre-B
                  </h4>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-[var(--ncc-mint)] p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[var(--ncc-deep)]/70">
                    Llave Bre-B
                  </p>
                  <p className="text-2xl font-semibold tracking-wider text-[var(--ncc-deep)]">
                    {BREB_KEY}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyNumber}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--ncc-deep)] text-white px-3 py-2 text-xs font-medium hover:opacity-90 transition"
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
              <p className="text-xs text-[var(--muted-foreground)] mt-3">
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
