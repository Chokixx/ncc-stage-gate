import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";

type Props = {
  id: "alpha" | "beta" | "omega";
  label: string;
  labelColor: string;
  borderAccent: string;
  password: string;
  successMessage: string;
  labelOnDarkStrip?: boolean;
};

export function StageGate({
  id,
  label,
  labelColor,
  borderAccent,
  password,
  successMessage,
  labelOnDarkStrip,
}: Props) {
  const storageKey = `ncc_${id}_unlocked`;
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(storageKey) === "true") {
      setUnlocked(true);
    }
  }, [storageKey]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === password && password) {
      setAnimating(true);
      localStorage.setItem(storageKey, "true");
      setTimeout(() => setUnlocked(true), 250);
    } else {
      setError(true);
    }
  };

  return (
    <section id={id} className="w-full" style={{ backgroundColor: "#eff6f2" }}>
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        {labelOnDarkStrip ? (
          <div
            className="inline-block px-6 py-2 rounded-md mb-8"
            style={{ backgroundColor: "#125b50" }}
          >
            <span className="font-serif text-3xl md:text-4xl" style={{ color: labelColor }}>
              {label}
            </span>
          </div>
        ) : (
          <h2
            className="font-serif text-4xl md:text-5xl mb-8"
            style={{ color: labelColor }}
          >
            {label}
          </h2>
        )}

        {!unlocked ? (
          <div
            className={`mx-auto max-w-md bg-white rounded-lg border border-[var(--ncc-steel)] p-8 shadow-[0_4px_24px_rgba(18,91,80,0.08)] transition-all duration-300 ${animating ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
          >
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-[var(--ncc-mint)] flex items-center justify-center">
                <Lock className="h-5 w-5 text-[var(--ncc-deep)]" />
              </div>
            </div>
            <h3 className="font-serif text-2xl text-center mt-4 text-[var(--ncc-deep)]">
              Etapa {label.charAt(0) + label.slice(1).toLowerCase()}
            </h3>
            <p className="text-sm text-center text-[var(--muted-foreground)] mt-2">
              Ingresa la clave para acceder al contenido de esta etapa.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input
                type="password"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
                placeholder="Clave de acceso"
                className="w-full rounded-md border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ncc-deep)]"
                style={{ borderColor: "#9ebcac" }}
              />
              {error && (
                <p className="text-sm" style={{ color: "#598c71" }}>
                  Clave incorrecta. Intenta de nuevo.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-md bg-[var(--ncc-deep)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Acceder
              </button>
            </form>
          </div>
        ) : (
          <div
            className="bg-white rounded-lg border border-[var(--ncc-steel)] p-8 md:p-10 animate-in fade-in duration-500"
            style={{ borderLeft: `4px solid ${borderAccent}` }}
          >
            <h3 className="font-serif text-3xl text-[var(--ncc-deep)]">
              Acceso concedido
            </h3>
            <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
              {successMessage}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
