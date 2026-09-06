import { Megaphone, ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const DEADLINE_BOGOTA = "2026-09-07T00:00:00-05:00";

function CountdownPill() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(DEADLINE_BOGOTA).getTime();
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;

  if (remaining <= 0) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
        style={{ backgroundColor: "#dc2626", color: "#fff" }}
      >
        <Clock className="h-3.5 w-3.5" />
        Inscripciones cerradas
      </span>
    );
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const text =
    days > 0
      ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
      style={{ backgroundColor: "#dc2626", color: "#fff" }}
      title="Tiempo restante para cerrar inscripciones"
    >
      <Clock className="h-3.5 w-3.5" />
      Cierra en: <span className="font-mono tracking-wider">{text}</span>
    </span>
  );
}

export function AnnouncementBanner() {
  return (
    <a
      href="#inscripcion"
      className="block w-full py-2.5 px-4 text-center text-sm font-medium transition-colors"
      style={{ backgroundColor: "var(--ncc-deep)", color: "#fff" }}
    >
      <span className="inline-flex flex-wrap items-center justify-center gap-2">
        <Megaphone className="h-4 w-4" />
        <span>Las inscripciones ya están abiertas — NCC 2026</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide"
          style={{ backgroundColor: "#f59e0b", color: "#0f172a" }}
        >
          Ampliamos inscripciones hasta el 6 de septiembre
        </span>
        <CountdownPill />
        <span className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 opacity-90">
          Inscríbete ahora
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </a>
  );
}

