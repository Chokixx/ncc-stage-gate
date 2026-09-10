import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Users, Trophy } from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import { EQUIPOS_NCC_2026 } from "@/lib/ncc/equipos-2026";

export const Route = createFileRoute("/equipos")({
  component: EquiposPage,
  head: () => ({
    meta: [
      { title: "Equipos inscritos — NCC 2026" },
      {
        name: "description",
        content:
          "Conoce los equipos y participantes inscritos en el National Case Competition 2026.",
      },
      { property: "og:title", content: "Equipos inscritos — NCC 2026" },
      {
        property: "og:description",
        content:
          "Listado oficial de equipos y participantes del National Case Competition 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function EquiposPage() {
  const [q, setQ] = useState("");

  const teams = useMemo(() => {
    const query = normalize(q.trim());
    if (!query) return EQUIPOS_NCC_2026;
    return EQUIPOS_NCC_2026.filter(
      (t) =>
        normalize(t.name).includes(query) ||
        t.members.some((m) => normalize(m).includes(query)),
    );
  }, [q]);

  const totalMembers = EQUIPOS_NCC_2026.reduce(
    (a, t) => a + t.members.length,
    0,
  );

  return (
    <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full" style={{ backgroundColor: "#125b50" }}>
          <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 text-white">
            <p className="text-[11px] uppercase tracking-[0.28em] opacity-80">
              National Case Competition
            </p>
            <h1 className="font-serif text-4xl md:text-6xl mt-2 leading-tight">
              Equipos inscritos <span className="italic opacity-70">2026</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 border border-white/15 px-5 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-2xl font-semibold">
                  <Trophy className="h-5 w-5 opacity-80" />
                  {EQUIPOS_NCC_2026.length}
                </div>
                <p className="text-xs uppercase tracking-widest opacity-75 mt-0.5">
                  Equipos
                </p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/15 px-5 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-2xl font-semibold">
                  <Users className="h-5 w-5 opacity-80" />
                  {totalMembers}
                </div>
                <p className="text-xs uppercase tracking-widest opacity-75 mt-0.5">
                  Participantes
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ncc-deep)]/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar equipo o participante…"
              className="w-full rounded-full border bg-white pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--ncc-deep)] transition-colors"
              style={{ borderColor: "#9ebcac" }}
            />
          </div>
          <p className="mt-3 text-xs text-[var(--muted-foreground)]">
            Mostrando {teams.length} de {EQUIPOS_NCC_2026.length} equipos
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((t, i) => (
              <article
                key={t.name + i}
                className="group bg-white rounded-2xl border border-[var(--ncc-steel)] p-6 shadow-[0_2px_12px_rgba(18,91,80,0.05)] hover:shadow-[0_10px_30px_rgba(18,91,80,0.12)] hover:-translate-y-0.5 transition-all"
                style={{ borderTop: "4px solid #125b50" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-xl leading-snug text-[var(--ncc-deep)]">
                    {t.name}
                  </h2>
                  <span className="shrink-0 rounded-full bg-[var(--ncc-mint)] px-2.5 py-1 text-[10px] font-bold tracking-widest text-[var(--ncc-deep)]">
                    {t.members.length}
                  </span>
                </div>
                <ul className="mt-4 space-y-2">
                  {t.members.map((m, j) => {
                    const key = `${i}-${j}`;
                    const open = openMember === key;
                    return (
                      <li key={j}>
                        <button
                          type="button"
                          onClick={() => setOpenMember(open ? null : key)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-[var(--ncc-mint)]/50 transition-colors"
                          aria-expanded={open}
                        >
                          <span className="h-8 w-8 shrink-0 rounded-full bg-[var(--ncc-mint)] text-[var(--ncc-deep)] text-[11px] font-bold flex items-center justify-center">
                            {initials(m.name)}
                          </span>
                          <span className="text-sm text-[var(--ncc-deep)]/85">
                            {m.name}
                          </span>
                        </button>
                        {open && (
                          <div className="ml-11 mt-1 mb-1 space-y-1 rounded-lg bg-[var(--ncc-mint)]/40 px-3 py-2 text-xs text-[var(--ncc-deep)]/80">
                            <a
                              href={`mailto:${m.email}`}
                              className="flex items-center gap-2 hover:underline break-all"
                            >
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              {m.email}
                            </a>
                            <a
                              href={`tel:${m.phone}`}
                              className="flex items-center gap-2 hover:underline"
                            >
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {m.phone}
                            </a>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

              </article>
            ))}
          </div>

          {teams.length === 0 && (
            <p className="mt-12 text-center text-sm text-[var(--muted-foreground)]">
              No encontramos equipos con “{q}”.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
