import { Instagram, Linkedin } from "lucide-react";
import { NCCLogo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full" style={{ backgroundColor: "#125b50", color: "#fff" }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <NCCLogo size={36} variant="white" />
          <span className="text-sm font-medium">National Case Competition</span>
        </div>
        <p className="font-serif italic text-center text-xl md:text-2xl">
          Train. Compete. Become.
        </p>
        <div className="flex flex-col md:items-end gap-3">
          <p className="text-sm opacity-90">
            Facultad de Administración · Universidad de los Andes
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/nationalcase/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram NCC"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/national-case/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn NCC"
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-center opacity-80">
          © 2026 NCC · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
