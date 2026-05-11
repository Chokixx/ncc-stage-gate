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
        <p className="text-sm md:text-right opacity-90">
          Facultad de Administración · Universidad de los Andes
        </p>
      </div>
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-center opacity-80">
          © 2026 NCC · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
