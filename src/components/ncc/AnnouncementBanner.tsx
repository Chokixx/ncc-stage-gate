import { Megaphone, ArrowRight, Clock, Flame } from "lucide-react";
import { useEffect, useState } from "react";

const DEADLINE_BOGOTA = "2026-09-07T00:00:00-05:00";

function TimerUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex min-w-[2.25rem] flex-col items-center leading-none">
      <span className="font-mono text-base font-bold sm:text-lg">{padded}</span>
      <span className="text-[9px] font-semibold uppercase tracking-wider opacity-90 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

function RetentionTimer() {
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
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
        style={{ backgroundColor: "#991b1b", color: "#fff" }}
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
  const urgent = totalSeconds < 3600;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-sm ${
        urgent ? "animate-pulse" : ""
      }`}
      style={{
        backgroundColor: urgent ? "#dc2626" : "#f59e0b",
        color: "#0f172a",
      }}
      title="Tiempo restante para cerrar inscripciones"
    >
      <Flame className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Cierra en</span>
      <span className="inline-flex items-center gap-1 sm:gap-1.5">
        {days > 0 && <TimerUnit value={days} label="d" />}
        <TimerUnit value={hours} label="h" />
        <span className="hidden font-mono sm:inline">:</span>
        <TimerUnit value={minutes} label="m" />
        <span className="hidden font-mono sm:inline">:</span>
        <TimerUnit value={seconds} label="s" />
      </span>
    </span>
  );
}

export function AnnouncementBanner() {
  return (
    <a
      href="#inscripcion"
      className="group block w-full py-2.5 px-4 text-center text-sm font-medium transition-colors"
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
        <RetentionTimer />
        <span className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 opacity-90 group-hover:opacity-100">
          Inscríbete ahora
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </a>
  );
}


