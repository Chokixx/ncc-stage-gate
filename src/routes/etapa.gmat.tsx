import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import { getTeams } from "@/lib/ncc/teams";

export const Route = createFileRoute("/etapa/gmat")({
  component: GmatTeamSelectPage,
  head: () => ({
    meta: [
      { title: "GMAT — National Case Competition" },
      { name: "description", content: "Selección de equipo para la etapa GMAT." },
    ],
  }),
});

function GmatTeamSelectPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [team, setTeam] = useState("");
  const teams = getTeams();

  useEffect(() => {
    const unlocked =
      typeof window !== "undefined" &&
      localStorage.getItem("ncc_gmat_unlocked") === "true";
    if (!unlocked) {
      navigate({ to: "/", hash: "gmat" });
      return;
    }
    setReady(true);
  }, [navigate]);

  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--ncc-cream)" }}
      >
        <p className="text-[var(--muted-foreground)] text-sm">Verificando acceso…</p>
      </div>
    );
  }

  const onStart = () => {
    if (!team) return;
    sessionStorage.setItem("ncc_gmat_team", team);
    sessionStorage.setItem("ncc_gmat_started_at", new Date().toISOString());
    navigate({ to: "/etapa/gmat/quiz" });
  };

  return (
    <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full" style={{ backgroundColor: "#125b50" }}>
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-white">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
            <p className="text-xs uppercase tracking-[0.22em] opacity-80">Etapa</p>
            <h1 className="font-serif text-5xl md:text-7xl mt-2">GMAT</h1>
            <p className="mt-4 text-white/85 max-w-2xl text-lg">
              Examen de admisión cronometrado — 20 preguntas, 45 minutos.
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="max-w-3xl mx-auto px-6 py-16 md:py-20">
            <div
              className="bg-white rounded-xl border border-[var(--ncc-steel)] p-8 md:p-10 shadow-[0_4px_24px_rgba(18,91,80,0.06)]"
              style={{ borderLeft: "4px solid #598c71" }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                Paso 1 de 2
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--ncc-deep)] mt-2">
                Selecciona tu equipo
              </h2>

              <div
                className="mt-6 flex gap-3 items-start rounded-md p-4"
                style={{ backgroundColor: "#eff6f2" }}
              >
                <AlertTriangle className="h-5 w-5 text-[var(--ncc-deep)] mt-0.5 shrink-0" />
                <p className="text-sm text-[var(--ncc-deep)] leading-relaxed">
                  Una vez elegido el equipo, tendrás que darle al botón{" "}
                  <strong>Siguiente</strong>. Cuando lo oprimas, un contabilizador de{" "}
                  <strong>45 minutos</strong> empezará de manera automática. Si pones
                  otro equipo diferente al tuyo, serás descalificado automáticamente.{" "}
                  <strong>¡Buena suerte!</strong>
                </p>
              </div>

              <label className="block mt-8 text-sm font-medium text-[var(--ncc-deep)]">
                Equipo
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="mt-2 w-full rounded-md border border-[var(--ncc-steel)] bg-white px-4 py-2.5 text-sm text-[var(--ncc-deep)] outline-none focus:border-[var(--ncc-deep)]"
              >
                <option value="">— Selecciona un equipo —</option>
                {teams.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <button
                onClick={onStart}
                disabled={!team}
                className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[var(--ncc-deep)] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
