import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NCCLogo } from "./Logo";

const links = [
  { label: "Inicio", target: "inicio" },
  { label: "ALPHA", target: "alpha" },
  { label: "BETA", target: "beta" },
  { label: "OMEGA", target: "omega" },
  { label: "Contacto", target: "contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--ncc-steel)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <button
          onClick={() => scrollTo("inicio")}
          className="flex items-center gap-3"
        >
          <NCCLogo size={40} />
          <span className="text-sm sm:text-base md:text-lg font-medium tracking-tight text-[var(--ncc-deep)] whitespace-nowrap">
            <span className="hidden sm:inline">National Case Competition</span>
            <span className="sm:hidden">NCC</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => scrollTo(l.target)}
              className="px-3 lg:px-4 py-2 text-sm font-medium text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)] rounded-md transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)]"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-[var(--ncc-steel)] bg-white">
          <div className="max-w-7xl mx-auto px-5 py-2 flex flex-col">
            {links.map((l) => (
              <button
                key={l.target}
                onClick={() => scrollTo(l.target)}
                className="text-left px-3 py-3 text-sm font-medium text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)] rounded-md transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
