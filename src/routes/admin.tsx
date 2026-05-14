import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
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
} from "@/lib/ncc/admin.functions";

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

function AdminDashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
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

        <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
          <SponsorsAdmin password={password} />
          <TeamsAdmin password={password} />
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
}: {
  team: Team;
  busy: boolean;
  onSave: (n: string) => void;
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
    </div>
  );
}
