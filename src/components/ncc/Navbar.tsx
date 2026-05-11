import { NCCLogo } from "./Logo";

const links = [
  { label: "Inicio", target: "inicio" },
  { label: "ALPHA", target: "alpha" },
  { label: "BETA", target: "beta" },
  { label: "OMEGA", target: "omega" },
  { label: "Contacto", target: "contacto" },
];

export function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--ncc-steel)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo("inicio")}
          className="flex items-center gap-3"
        >
          <NCCLogo size={36} />
          <span className="text-sm md:text-base font-medium tracking-tight text-[var(--ncc-deep)]">
            National Case Competition
          </span>
        </button>
        <nav className="flex items-center gap-1 md:gap-2">
          {links.map((l) => (
            <button
              key={l.target}
              onClick={() => scrollTo(l.target)}
              className="px-3 py-2 text-sm font-medium text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)] rounded-md transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
