import { Megaphone, ArrowRight } from "lucide-react";

export function AnnouncementBanner() {
  return (
    <a
      href="#inscripcion"
      className="block w-full py-2.5 px-4 text-center text-sm font-medium transition-colors"
      style={{ backgroundColor: "var(--ncc-deep)", color: "#fff" }}
    >
      <span className="inline-flex items-center justify-center gap-2">
        <Megaphone className="h-4 w-4" />
        <span>Las inscripciones ya están abiertas — NCC 2026</span>
        <span className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 opacity-90">
          Inscríbete ahora
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </span>
    </a>
  );
}
