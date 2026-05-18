import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Lock,
  ArrowLeft,
  Trash2,
  Plus,
  Upload,
  Save,
  LogOut,
} from "lucide-react";
import { Navbar } from "@/components/ncc/Navbar";
import { Footer } from "@/components/ncc/Footer";
import {
  verifyAdmin,
  adminListSponsors,
  adminUpsertSponsor,
  adminDeleteSponsor,
  adminUploadSponsorLogo,
  adminListTeams,
  adminUpdateTeam,
  adminReplaceTeams,
  adminAddTeam,
  adminDeleteTeam,
  adminListSubmissions,
  adminListStageContent,
  adminUpdateStageContent,
  adminUploadStageFile,
  adminClearStageFile,
} from "@/lib/ncc/admin.functions";
import { answersToLetters, durationMinutes } from "@/lib/ncc/gmat-format";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Administrador — NCC" },
      { name: "description", content: "Panel de administración del NCC." },
    ],
  }),
});

const PASS_KEY = "ncc_admin_pass";

type Sponsor = {
  id: string;
  tier: "official" | "strategic" | "support";
  position: number;
  name: string;
  logo_url: string | null;
};
type Team = { id: string; position: number; name: string };

function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = useServerFn(verifyAdmin);

  useEffect(() => {
    const saved = sessionStorage.getItem(PASS_KEY);
    if (saved) setPassword(saved);
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verify({ data: { password: pwInput } });
      sessionStorage.setItem(PASS_KEY, pwInput);
      setPassword(pwInput);
    } catch {
      setError("Contraseña incorrecta.");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    sessionStorage.removeItem(PASS_KEY);
    setPassword(null);
    setPwInput("");
  };

  if (!password) {
    return (
      <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div
            className="w-full max-w-md bg-white rounded-xl border border-[var(--ncc-steel)] p-8 shadow-[0_4px_24px_rgba(18,91,80,0.08)]"
            style={{ borderTop: "4px solid #125b50" }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
            </Link>
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-[var(--ncc-mint)] flex items-center justify-center">
                <Lock className="h-5 w-5 text-[var(--ncc-deep)]" />
              </div>
            </div>
            <h1 className="font-serif text-2xl text-center mt-4 text-[var(--ncc-deep)]">
              Panel de administrador
            </h1>
            <p className="text-sm text-center text-[var(--muted-foreground)] mt-2">
              Ingresa la contraseña para continuar.
            </p>
            <form onSubmit={onLogin} className="mt-6 space-y-3">
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:border-[var(--ncc-deep)]"
                style={{ borderColor: "#9ebcac" }}
                autoFocus
              />
              {error && (
                <p className="text-sm" style={{ color: "#b3471a" }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !pwInput}
                className="w-full rounded-md bg-[var(--ncc-deep)] text-white py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Verificando…" : "Entrar"}
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return <AdminDashboard password={password} onLogout={onLogout} />;
}

type Tab = "sponsors" | "teams" | "stages" | "submissions";

function AdminDashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("sponsors");
  const tabs: { key: Tab; label: string }[] = [
    { key: "sponsors", label: "Patrocinadores" },
    { key: "teams", label: "Equipos GMAT" },
    { key: "stages", label: "Etapas" },
    { key: "submissions", label: "Resultados" },
  ];
  return (
    <div className="min-h-screen bg-[var(--ncc-cream)] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="w-full" style={{ backgroundColor: "#125b50" }}>
          <div className="max-w-6xl mx-auto px-6 py-10 text-white flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] opacity-80">
                Panel
              </p>
              <h1 className="font-serif text-3xl md:text-4xl mt-1">
                Administrador
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white border border-white/30 hover:border-white/60 rounded-md px-3 py-1.5"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 pt-8">
          <div className="flex gap-1 border-b border-[var(--ncc-steel)]">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm font-medium -mb-px border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[var(--ncc-deep)] text-[var(--ncc-deep)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {tab === "sponsors" && <SponsorsAdmin password={password} />}
          {tab === "teams" && <TeamsAdmin password={password} />}
          {tab === "stages" && <StagesAdmin password={password} />}
          {tab === "submissions" && <SubmissionsAdmin password={password} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ============== SPONSORS ==============
function SponsorsAdmin({ password }: { password: string }) {
  const list = useServerFn(adminListSponsors);
  const upsert = useServerFn(adminUpsertSponsor);
  const remove = useServerFn(adminDeleteSponsor);
  const upload = useServerFn(adminUploadSponsorLogo);

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await list({ data: { password } });
      setSponsors(res.sponsors as Sponsor[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpdateName = async (s: Sponsor, name: string) => {
    setBusyId(s.id);
    try {
      await upsert({
        data: { password, id: s.id, tier: s.tier, name, logo_url: s.logo_url },
      });
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (s: Sponsor) => {
    if (!confirm(`¿Eliminar patrocinador "${s.name}"?`)) return;
    setBusyId(s.id);
    try {
      await remove({ data: { password, id: s.id } });
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const onAdd = async (tier: Sponsor["tier"]) => {
    await upsert({ data: { password, tier, name: "Por anunciar", logo_url: null } });
    await reload();
  };

  const onUploadFile = async (s: Sponsor, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Imagen máx 5MB");
      return;
    }
    setBusyId(s.id);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
      const base64 = btoa(bin);
      await upload({
        data: {
          password,
          sponsorId: s.id,
          filename: file.name,
          contentType: file.type || "image/png",
          base64,
        },
      });
      await reload();
    } catch (e) {
      console.error(e);
      alert("Error al subir la imagen");
    } finally {
      setBusyId(null);
    }
  };

  const onClearLogo = async (s: Sponsor) => {
    setBusyId(s.id);
    try {
      await upsert({
        data: { password, id: s.id, tier: s.tier, name: s.name, logo_url: null },
      });
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const tiers: { key: Sponsor["tier"]; label: string }[] = [
    { key: "official", label: "Patrocinador Oficial" },
    { key: "strategic", label: "Patrocinadores Estratégicos" },
    { key: "support", label: "Patrocinadores de Apoyo" },
  ];

  return (
    <section className="bg-white rounded-xl border border-[var(--ncc-steel)] p-6 md:p-8 shadow-[0_2px_12px_rgba(18,91,80,0.05)]">
      <h2 className="font-serif text-2xl text-[var(--ncc-deep)]">
        Patrocinadores
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mt-1">
        Edita el nombre, sube el logo o agrega/elimina espacios.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--muted-foreground)]">Cargando…</p>
      ) : (
        <div className="mt-6 space-y-8">
          {tiers.map((t) => {
            const items = sponsors.filter((s) => s.tier === t.key);
            return (
              <div key={t.key}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
                    {t.label}
                  </p>
                  <button
                    onClick={() => onAdd(t.key)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ncc-deep)] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Agregar
                  </button>
                </div>
                {items.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Sin elementos.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((s) => (
                      <SponsorCard
                        key={s.id}
                        sponsor={s}
                        busy={busyId === s.id}
                        onSaveName={(name) => onUpdateName(s, name)}
                        onUpload={(f) => onUploadFile(s, f)}
                        onDelete={() => onDelete(s)}
                        onClearLogo={() => onClearLogo(s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SponsorCard({
  sponsor,
  busy,
  onSaveName,
  onUpload,
  onDelete,
  onClearLogo,
}: {
  sponsor: Sponsor;
  busy: boolean;
  onSaveName: (n: string) => void;
  onUpload: (f: File) => void;
  onDelete: () => void;
  onClearLogo: () => void;
}) {
  const [name, setName] = useState(sponsor.name);
  useEffect(() => setName(sponsor.name), [sponsor.name]);
  const dirty = name !== sponsor.name;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUpload(f);
    e.target.value = "";
  };

  return (
    <div className="border border-[var(--ncc-steel)] rounded-lg p-4 flex flex-col gap-3">
      <div className="aspect-[16/10] bg-[var(--ncc-cream)] rounded-md flex items-center justify-center overflow-hidden border border-[var(--ncc-steel)]">
        {sponsor.logo_url ? (
          <img
            src={sponsor.logo_url}
            alt={sponsor.name}
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <span className="text-xs text-[var(--muted-foreground)]">Sin logo</span>
        )}
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm focus:border-[var(--ncc-deep)] outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          disabled={!dirty || busy}
          onClick={() => onSaveName(name)}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-[var(--ncc-deep)] text-white disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" /> Guardar
        </button>
        <label className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--ncc-steel)] cursor-pointer hover:bg-[var(--ncc-mint)]">
          <Upload className="h-3.5 w-3.5" /> Logo
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
            disabled={busy}
          />
        </label>
        {sponsor.logo_url && (
          <button
            onClick={onClearLogo}
            disabled={busy}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] underline"
          >
            Quitar logo
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={busy}
          className="ml-auto inline-flex items-center gap-1 text-xs text-[#b3471a] hover:underline"
        >
          <Trash2 className="h-3.5 w-3.5" /> Eliminar
        </button>
      </div>
    </div>
  );
}

// ============== TEAMS ==============
function TeamsAdmin({ password }: { password: string }) {
  const list = useServerFn(adminListTeams);
  const update = useServerFn(adminUpdateTeam);
  const replace = useServerFn(adminReplaceTeams);
  const add = useServerFn(adminAddTeam);
  const del = useServerFn(adminDeleteTeam);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await list({ data: { password } });
      setTeams(res.teams as Team[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSaveOne = async (t: Team, name: string) => {
    if (name === t.name || !name.trim()) return;
    setSavingId(t.id);
    try {
      await update({ data: { password, id: t.id, name: name.trim() } });
      await reload();
    } finally {
      setSavingId(null);
    }
  };

  const onBulkSubmit = async () => {
    const names = bulk
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (names.length === 0) {
      alert("La lista está vacía");
      return;
    }
    if (
      !confirm(
        `Esto reemplazará TODA la lista actual (${teams.length} equipos) por ${names.length} equipos nuevos. ¿Continuar?`,
      )
    )
      return;
    setBulkBusy(true);
    try {
      await replace({ data: { password, names } });
      setBulk("");
      setShowBulk(false);
      await reload();
    } catch (e) {
      console.error(e);
      alert("Error al reemplazar la lista");
    } finally {
      setBulkBusy(false);
    }
  };

  const onAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await add({ data: { password, name } });
      setNewName("");
      await reload();
    } catch (e) {
      console.error(e);
      alert("Error al agregar equipo");
    } finally {
      setAdding(false);
    }
  };

  const onDeleteOne = async (t: Team) => {
    if (!confirm(`¿Eliminar equipo "${t.name}"?`)) return;
    setSavingId(t.id);
    try {
      await del({ data: { password, id: t.id } });
      await reload();
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-[var(--ncc-steel)] p-6 md:p-8 shadow-[0_2px_12px_rgba(18,91,80,0.05)]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-[var(--ncc-deep)]">
            Equipos GMAT
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Edita un nombre individual o reemplaza la lista completa.
          </p>
        </div>
        <button
          onClick={() => {
            setShowBulk((v) => !v);
            if (!showBulk) setBulk(teams.map((t) => t.name).join("\n"));
          }}
          className="text-xs px-3 py-1.5 rounded-md border border-[var(--ncc-steel)] hover:bg-[var(--ncc-mint)]"
        >
          {showBulk ? "Cerrar lista masiva" : "Pegar lista masiva"}
        </button>
      </div>

      {showBulk && (
        <div className="mt-4 space-y-2">
          <textarea
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={10}
            placeholder="Un nombre de equipo por línea…"
            className="w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm font-mono focus:border-[var(--ncc-deep)] outline-none"
          />
          <div className="flex justify-end">
            <button
              onClick={onBulkSubmit}
              disabled={bulkBusy}
              className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-[var(--ncc-deep)] text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {bulkBusy ? "Guardando…" : "Reemplazar lista"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 items-center border-t border-[var(--ncc-steel)] pt-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void onAdd();
            }
          }}
          placeholder="Nombre del nuevo equipo"
          className="flex-1 min-w-[200px] rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm outline-none focus:border-[var(--ncc-deep)]"
        />
        <button
          onClick={onAdd}
          disabled={adding || !newName.trim()}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-md bg-[var(--ncc-deep)] text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {adding ? "Agregando…" : "Agregar equipo"}
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--muted-foreground)]">Cargando…</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {teams.map((t) => (
            <TeamRow
              key={t.id}
              team={t}
              busy={savingId === t.id}
              onSave={(n) => onSaveOne(t, n)}
              onDelete={() => onDeleteOne(t)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TeamRow({
  team,
  busy,
  onSave,
  onDelete,
}: {
  team: Team;
  busy: boolean;
  onSave: (n: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(team.name);
  useEffect(() => setName(team.name), [team.name]);
  const dirty = name !== team.name;
  return (
    <div className="flex items-center gap-2 border border-[var(--ncc-steel)] rounded-md px-2 py-1.5">
      <span className="text-xs text-[var(--muted-foreground)] w-8 text-right tabular-nums">
        {String(team.position).padStart(3, "0")}
      </span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => dirty && onSave(name)}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={`flex-1 rounded px-2 py-1 text-sm outline-none border ${dirty ? "border-[var(--ncc-deep)]" : "border-transparent"} focus:border-[var(--ncc-deep)]`}
        disabled={busy}
      />
      <button
        onClick={onDelete}
        disabled={busy}
        title="Eliminar equipo"
        className="text-[#b3471a] hover:bg-[var(--ncc-cream)] rounded p-1 disabled:opacity-40"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ============== SUBMISSIONS ==============
type Submission = {
  id: string;
  team: string;
  score: number;
  total: number;
  started_at: string | null;
  submitted_at: string;
  answers: unknown;
};

function normalizeAnswers(a: unknown): number[] {
  if (Array.isArray(a)) return a as number[];
  const inner = (a as { answers?: unknown } | null)?.answers;
  if (Array.isArray(inner)) return inner as number[];
  return [];
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function SubmissionsAdmin({ password }: { password: string }) {
  const list = useServerFn(adminListSubmissions);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await list({ data: { password } });
      setSubs(res.submissions as Submission[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-white rounded-xl border border-[var(--ncc-steel)] p-6 md:p-8 shadow-[0_2px_12px_rgba(18,91,80,0.05)]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl text-[var(--ncc-deep)]">
            Resultados del GMAT
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {subs.length} envío{subs.length === 1 ? "" : "s"} · ordenados por puntaje.
          </p>
        </div>
        <button
          onClick={() => void reload()}
          className="text-xs px-3 py-1.5 rounded-md border border-[var(--ncc-steel)] hover:bg-[var(--ncc-mint)]"
        >
          Refrescar
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-[var(--muted-foreground)]">Cargando…</p>
      ) : subs.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--muted-foreground)]">
          Aún no hay envíos.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-[var(--ncc-medium)] border-b border-[var(--ncc-steel)]">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Equipo</th>
                <th className="py-2 pr-3">Puntaje</th>
                <th className="py-2 pr-3">Tiempo (min)</th>
                <th className="py-2 pr-3">Inicio</th>
                <th className="py-2 pr-3">Envío</th>
                <th className="py-2 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s, i) => {
                const ans = normalizeAnswers(s.answers);
                const dur = durationMinutes(s.started_at, s.submitted_at) || "—";
                const isOpen = open === s.id;
                return (
                  <Fragment key={s.id}>
                    <tr className="border-b border-[var(--ncc-steel)] hover:bg-[var(--ncc-cream)]/40">
                      <td className="py-2 pr-3 tabular-nums text-[var(--muted-foreground)]">
                        {i + 1}
                      </td>
                      <td className="py-2 pr-3 font-medium text-[var(--ncc-deep)]">
                        {s.team}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">
                        <span className="font-semibold text-[var(--ncc-deep)]">
                          {s.score}
                        </span>
                        <span className="text-[var(--muted-foreground)]">
                          /{s.total}
                        </span>
                      </td>
                      <td className="py-2 pr-3 tabular-nums">{dur}</td>
                      <td className="py-2 pr-3 text-[var(--muted-foreground)]">
                        {fmtDate(s.started_at)}
                      </td>
                      <td className="py-2 pr-3 text-[var(--muted-foreground)]">
                        {fmtDate(s.submitted_at)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        <button
                          onClick={() => setOpen(isOpen ? null : s.id)}
                          className="text-xs text-[var(--ncc-deep)] hover:underline"
                        >
                          {isOpen ? "Ocultar" : "Ver respuestas"}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-[var(--ncc-steel)]">
                        <td colSpan={7} className="py-3 pr-3">
                          <p className="text-xs text-[var(--muted-foreground)] font-mono break-all">
                            {ans.length > 0
                              ? answersToLetters(ans)
                              : "Sin datos."}
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ============== STAGES ==============
type StageRow = {
  id: string;
  stage: "alpha" | "beta" | "delta";
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

const STAGE_LABELS: Record<StageRow["stage"], string> = {
  alpha: "ALPHA",
  beta: "BETA",
  delta: "DELTA",
};

function StagesAdmin({ password }: { password: string }) {
  const list = useServerFn(adminListStageContent);
  const update = useServerFn(adminUpdateStageContent);
  const upload = useServerFn(adminUploadStageFile);
  const clear = useServerFn(adminClearStageFile);

  const [stages, setStages] = useState<StageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await list({ data: { password } });
      setStages(res.stages as StageRow[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Cargando…</p>;
  }

  return (
    <div className="space-y-6">
      {stages.map((s) => (
        <StageCard
          key={s.id}
          row={s}
          onSave={async (intro, sponsor_enabled, sponsor_name, sponsor_link) => {
            await update({
              data: {
                password,
                stage: s.stage,
                intro,
                sponsor_enabled,
                sponsor_name,
                sponsor_link: sponsor_link || null,
              },
            });
            await reload();
          }}
          onUpload={async (kind, file) => {
            const buf = await file.arrayBuffer();
            const bytes = new Uint8Array(buf);
            let bin = "";
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            const base64 = btoa(bin);
            await upload({
              data: {
                password,
                stage: s.stage,
                kind,
                filename: file.name,
                contentType: file.type || "application/octet-stream",
                base64,
              },
            });
            await reload();
          }}
          onClear={async (kind) => {
            await clear({ data: { password, stage: s.stage, kind } });
            await reload();
          }}
        />
      ))}
    </div>
  );
}

type FileKind = "sponsor_logo" | "case_pdf" | "case_data";

function StageCard({
  row,
  onSave,
  onUpload,
  onClear,
}: {
  row: StageRow;
  onSave: (intro: string, sponsorEnabled: boolean, sponsorName: string, sponsorLink: string) => Promise<void>;
  onUpload: (kind: FileKind, file: File) => Promise<void>;
  onClear: (kind: FileKind) => Promise<void>;
}) {
  const [intro, setIntro] = useState(row.intro);
  const [sponsorEnabled, setSponsorEnabled] = useState(row.sponsor_enabled);
  const [sponsorName, setSponsorName] = useState(row.sponsor_name);
  const [sponsorLink, setSponsorLink] = useState(row.sponsor_link ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIntro(row.intro);
    setSponsorEnabled(row.sponsor_enabled);
    setSponsorName(row.sponsor_name);
    setSponsorLink(row.sponsor_link ?? "");
  }, [row.id, row.intro, row.sponsor_enabled, row.sponsor_name, row.sponsor_link]);

  const dirty =
    intro !== row.intro ||
    sponsorEnabled !== row.sponsor_enabled ||
    sponsorName !== row.sponsor_name ||
    (sponsorLink || "") !== (row.sponsor_link ?? "");

  const wrap = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Error");
    } finally {
      setBusy(false);
    }
  };

  const fileInput = (kind: FileKind, accept: string, label: string) => (
    <label className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-[var(--ncc-steel)] cursor-pointer hover:bg-[var(--ncc-mint)]">
      <Upload className="h-3.5 w-3.5" />
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void wrap(() => onUpload(kind, f));
        }}
      />
    </label>
  );

  return (
    <section className="bg-white rounded-xl border border-[var(--ncc-steel)] p-6 md:p-8 shadow-[0_2px_12px_rgba(18,91,80,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-[var(--ncc-deep)]">
          Etapa {STAGE_LABELS[row.stage]}
        </h2>
      </div>

      <label className="block text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium mb-2">
        Introducción del caso
      </label>
      <textarea
        value={intro}
        onChange={(e) => setIntro(e.target.value)}
        rows={4}
        placeholder="Breve introducción al caso de esta etapa…"
        className="w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm focus:border-[var(--ncc-deep)] outline-none"
      />

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Sponsor */}
        <div className="border border-[var(--ncc-steel)] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3 gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium">
              Patrocinador del caso
            </p>
            <label className="inline-flex items-center gap-2 text-xs text-[var(--ncc-deep)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sponsorEnabled}
                onChange={(e) => setSponsorEnabled(e.target.checked)}
                className="h-4 w-4 accent-[var(--ncc-deep)]"
              />
              {sponsorEnabled ? "Visible" : "Oculto"}
            </label>
          </div>
          {!sponsorEnabled && (
            <p className="text-xs text-[var(--muted-foreground)] mb-3 italic">
              Esta etapa se mostrará sin sección de patrocinador.
            </p>
          )}
          <div className="aspect-[16/9] bg-[var(--ncc-cream)] rounded-md flex items-center justify-center overflow-hidden border border-[var(--ncc-steel)] mb-3">
            {row.sponsor_logo_url ? (
              <img
                src={row.sponsor_logo_url}
                alt={row.sponsor_name || "Patrocinador"}
                className="w-full h-full object-contain p-3"
              />
            ) : (
              <span className="text-xs text-[var(--muted-foreground)]">Sin logo</span>
            )}
          </div>
          <input
            type="text"
            value={sponsorName}
            onChange={(e) => setSponsorName(e.target.value)}
            placeholder="Nombre del patrocinador"
            className="w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm mb-2 focus:border-[var(--ncc-deep)] outline-none"
          />
          <input
            type="url"
            value={sponsorLink}
            onChange={(e) => setSponsorLink(e.target.value)}
            placeholder="https://… (enlace del patrocinador)"
            className="w-full rounded-md border border-[var(--ncc-steel)] px-3 py-2 text-sm mb-3 focus:border-[var(--ncc-deep)] outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {fileInput("sponsor_logo", "image/*", "Subir logo")}
            {row.sponsor_logo_url && (
              <button
                onClick={() => void wrap(() => onClear("sponsor_logo"))}
                disabled={busy}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] underline"
              >
                Quitar logo
              </button>
            )}
          </div>
        </div>

        {/* Case files */}
        <div className="border border-[var(--ncc-steel)] rounded-lg p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ncc-medium)] font-medium mb-3">
            Archivos del caso
          </p>
          <div className="space-y-3">
            <FileSlot
              label="Brief / PDF del caso"
              url={row.case_pdf_url}
              name={row.case_pdf_name}
              uploadBtn={fileInput("case_pdf", "application/pdf", "Subir PDF")}
              onClear={
                row.case_pdf_url
                  ? () => void wrap(() => onClear("case_pdf"))
                  : undefined
              }
              busy={busy}
            />
            <FileSlot
              label="Base de datos del caso"
              url={row.case_data_url}
              name={row.case_data_name}
              uploadBtn={fileInput(
                "case_data",
                ".csv,.xlsx,.xls,.zip,.json,application/octet-stream",
                "Subir dataset",
              )}
              onClear={
                row.case_data_url
                  ? () => void wrap(() => onClear("case_data"))
                  : undefined
              }
              busy={busy}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          disabled={!dirty || busy}
          onClick={() =>
            void wrap(() => onSave(intro, sponsorName, sponsorLink))
          }
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-[var(--ncc-deep)] text-white disabled:opacity-40"
        >
          <Save className="h-4 w-4" /> Guardar cambios
        </button>
      </div>
    </section>
  );
}

function FileSlot({
  label,
  url,
  name,
  uploadBtn,
  onClear,
  busy,
}: {
  label: string;
  url: string | null;
  name: string | null;
  uploadBtn: React.ReactNode;
  onClear?: () => void;
  busy: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border border-[var(--ncc-steel)] rounded-md p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--ncc-deep)]">{label}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--ncc-medium)] underline truncate block"
          >
            {name ?? "Archivo"}
          </a>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)]">Sin archivo</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {uploadBtn}
        {url && onClear && (
          <button
            onClick={onClear}
            disabled={busy}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--ncc-deep)] underline"
          >
            Quitar
          </button>
        )}
      </div>
    </div>
  );
}
