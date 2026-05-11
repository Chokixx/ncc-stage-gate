import { useState, type FormEvent } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  id: "gmat" | "alpha" | "beta" | "omega";
  label: string;
  labelColor: string;
  borderAccent: string;
  password: string;
};

export function StageGate({
  id,
  label,
  labelColor,
  borderAccent,
  password,
}: Props) {
  const navigate = useNavigate();
  const storageKey = `ncc_${id}_unlocked`;
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [animating, setAnimating] = useState(false);

  const goToStage = () => {
    if (id === "gmat") {
      navigate({ to: "/etapa/gmat" });
    } else {
      navigate({ to: "/etapa/$stage", params: { stage: id } });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value === password && password) {
      setAnimating(true);
      localStorage.setItem(storageKey, "true");
      setTimeout(goToStage, 350);
    } else {
      setError(true);
    }
  };

  return (
    <section id={id} className="w-full" style={{ backgroundColor: "#eff6f2" }}>
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <h2
          className="font-serif text-4xl md:text-5xl mb-8 text-center md:text-left"
          style={{ color: labelColor }}
        >
          {label}
        </h2>

        <div
          className={`mx-auto max-w-md bg-white rounded-lg border border-[var(--ncc-steel)] p-8 shadow-[0_4px_24px_rgba(18,91,80,0.08)] transition-all duration-300 ${animating ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"}`}
          style={{ borderTop: `4px solid ${borderAccent}` }}
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[var(--ncc-deep)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Acceder
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
