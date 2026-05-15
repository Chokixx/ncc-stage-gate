import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Send } from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import {
  GMAT_QUESTIONS,
  GMAT_DURATION_MINUTES,
  GMAT_QUIZ_SIZE,
  type GmatQuestion,
} from "@/lib/ncc/gmat-questions";

export const Route = createFileRoute("/etapa/gmat/quiz")({
  component: GmatQuizPage,
  head: () => ({
    meta: [
      { title: "GMAT Quiz — National Case Competition" },
      { name: "description", content: "Examen GMAT cronometrado." },
    ],
  }),
});

function formatTime(ms: number) {
  if (ms < 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function pickRandomQuestions(): GmatQuestion[] {
  const pool = [...GMAT_QUESTIONS];
  // Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, GMAT_QUIZ_SIZE);
}

function GmatQuizPage() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [questions, setQuestions] = useState<GmatQuestion[] | null>(null);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array(GMAT_QUIZ_SIZE).fill(-1),
  );
  const [now, setNow] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const submittedRef = useRef(false);

  // Verificar acceso + recuperar/crear contexto
  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlocked = localStorage.getItem("ncc_gmat_unlocked") === "true";
    const t = sessionStorage.getItem("ncc_gmat_team");
    const s = sessionStorage.getItem("ncc_gmat_started_at");
    if (!unlocked || !t || !s) {
      navigate({ to: "/etapa/gmat" });
      return;
    }
    setTeam(t);
    setStartedAt(s);

    // Recuperar set de preguntas (para que recargas no cambien el examen)
    const savedIdsRaw = sessionStorage.getItem("ncc_gmat_question_ids");
    let selected: GmatQuestion[] | null = null;
    if (savedIdsRaw) {
      try {
        const ids = JSON.parse(savedIdsRaw) as number[];
        if (Array.isArray(ids) && ids.length === GMAT_QUIZ_SIZE) {
          const map = new Map(GMAT_QUESTIONS.map((q) => [q.id, q]));
          const mapped = ids
            .map((id) => map.get(id))
            .filter((q): q is GmatQuestion => !!q);
          if (mapped.length === GMAT_QUIZ_SIZE) selected = mapped;
        }
      } catch {
        /* ignore */
      }
    }
    if (!selected) {
      selected = pickRandomQuestions();
      sessionStorage.setItem(
        "ncc_gmat_question_ids",
        JSON.stringify(selected.map((q) => q.id)),
      );
    }
    setQuestions(selected);
  }, [navigate]);

  // Tick del cronómetro
  useEffect(() => {
    if (!startedAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const endsAt = useMemo(() => {
    if (!startedAt) return null;
    return new Date(startedAt).getTime() + GMAT_DURATION_MINUTES * 60 * 1000;
  }, [startedAt]);

  const remaining = endsAt ? endsAt - now : GMAT_DURATION_MINUTES * 60 * 1000;

  const submit = useCallback(
    async (auto: boolean) => {
      if (submittedRef.current || !team || !startedAt || !questions) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const res = await fetch("/api/public/gmat/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            team,
            questionIds: questions.map((q) => q.id),
            answers,
            startedAt,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Error al enviar");
        setResult({ score: data.score, total: data.total });
        sessionStorage.removeItem("ncc_gmat_team");
        sessionStorage.removeItem("ncc_gmat_started_at");
        sessionStorage.removeItem("ncc_gmat_question_ids");
      } catch (e) {
        console.error(e);
        if (!auto) {
          submittedRef.current = false;
          alert("No se pudo enviar el examen. Intenta de nuevo.");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [answers, questions, startedAt, team],
  );

  // Auto-submit al acabar el tiempo
  useEffect(() => {
    if (!endsAt) return;
    if (remaining <= 0 && !submittedRef.current) {
      void submit(true);
    }
  }, [remaining, endsAt, submit]);

  if (!team || !startedAt || !questions) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--ncc-cream)" }}
      >
        <p className="text-[var(--muted-foreground)] text-sm">Cargando examen…</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="bg-white rounded-xl border border-[var(--ncc-steel)] p-10 max-w-lg w-full text-center shadow-[0_4px_24px_rgba(18,91,80,0.08)]">
            <h2 className="font-serif text-3xl text-[var(--ncc-deep)]">
              Examen enviado
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              Equipo: <strong className="text-[var(--ncc-deep)]">{team}</strong>
            </p>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Tus respuestas fueron registradas. Los organizadores recibirán los
              resultados.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--ncc-deep)] text-white px-6 py-2.5 text-sm font-medium hover:opacity-90"
            >
              Volver al inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lowTime = remaining <= 5 * 60 * 1000;
  const answeredCount = answers.filter((a) => a >= 0).length;

  return (
    <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Sticky timer */}
        <div
          className="sticky top-16 md:top-20 z-40 border-b border-[var(--ncc-steel)]"
          style={{ backgroundColor: lowTime ? "#fff4ed" : "#eff6f2" }}
        >
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div className="text-sm text-[var(--ncc-deep)]">
              <span className="font-medium">{team}</span>
              <span className="text-[var(--muted-foreground)]"> · {answeredCount}/{questions.length} respondidas</span>
            </div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-sm font-semibold ${lowTime ? "text-[#b3471a]" : "text-[var(--ncc-deep)]"}`}
              style={{ backgroundColor: "white", border: "1px solid var(--ncc-steel)" }}
            >
              <Clock className="h-4 w-4" />
              {formatTime(remaining)}
            </div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto px-6 py-10">
          <ol className="space-y-6">
            {questions.map((q, qi) => (
              <li
                key={q.id}
                className="bg-white rounded-xl border border-[var(--ncc-steel)] p-6 shadow-[0_2px_12px_rgba(18,91,80,0.05)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                  Pregunta {qi + 1}
                </p>
                <p className="mt-2 text-[var(--ncc-deep)] font-medium">{q.text}</p>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    return (
                      <label
                        key={oi}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer border transition-colors ${selected ? "bg-[var(--ncc-mint)] border-[var(--ncc-deep)]" : "bg-white border-[var(--ncc-steel)] hover:border-[var(--ncc-deep)]/40"}`}
                      >
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          checked={selected}
                          onChange={() =>
                            setAnswers((prev) => {
                              const next = [...prev];
                              next[qi] = oi;
                              return next;
                            })
                          }
                          className="accent-[var(--ncc-deep)]"
                        />
                        <span className="text-sm text-[var(--ncc-deep)]">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex justify-end">
            <button
              onClick={() => submit(false)}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--ncc-deep)] text-white px-6 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Enviando…" : "Enviar respuestas"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
