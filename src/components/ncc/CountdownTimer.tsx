import { useEffect, useMemo, useState } from "react";
import { Flame } from "lucide-react";

const DEADLINE_UTC = "2026-09-07T05:00:00.000Z"; // 2026-09-07 00:00:00 Bogotá (UTC-5)

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({
  deadline = DEADLINE_UTC,
  compact = false,
}: {
  deadline?: string;
  compact?: boolean;
}) {
  const target = useMemo(() => new Date(deadline).getTime(), [deadline]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const urgent = diff > 0 && diff < 1000 * 60 * 60;

  const boxes = compact
    ? [
        { value: days, label: "d" },
        { value: hours, label: "h" },
        { value: minutes, label: "m" },
      ]
    : [
        { value: days, label: "Días" },
        { value: hours, label: "Horas" },
        { value: minutes, label: "Min" },
        { value: seconds, label: "Seg" },
      ];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono font-bold tracking-tight shadow-sm ${
        urgent
          ? "border-amber-400 bg-amber-50 text-amber-700 animate-pulse"
          : "border-[var(--ncc-steel)] bg-white/90 text-[var(--ncc-deep)]"
      }`}
      aria-label="Tiempo restante para inscribirse"
    >
      <Flame
        className={`shrink-0 ${urgent ? "text-amber-600" : "text-[var(--ncc-medium)]"}`}
        style={{ width: compact ? 14 : 16, height: compact ? 14 : 16 }}
      />
      {diff === 0 ? (
        <span className="text-xs uppercase tracking-wider">Cierre inminente</span>
      ) : (
        <div className="flex items-center gap-1">
          {boxes.map((box, i) => (
            <div key={box.label} className="flex items-center gap-1">
              <span
                className={`inline-block min-w-[1.4em] text-center ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {pad(box.value)}
              </span>
              <span className={`opacity-70 ${compact ? "text-[9px]" : "text-[10px]"}`}>
                {box.label}
              </span>
              {i < boxes.length - 1 && (
                <span className="opacity-40 mx-0.5">:</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
