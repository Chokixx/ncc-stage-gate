import { useEffect, useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { NCCLogo } from "./Logo";

const links = [
  { label: "Inicio", target: "inicio" },
  { label: "Patrocinadores", target: "patrocinadores" },
  { label: "GMAT", target: "gmat" },
  { label: "ALPHA", target: "alpha" },
  { label: "BETA", target: "beta" },
  { label: "DELTA", target: "delta" },
  { label: "Contacto", target: "contacto" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const sections = links
      .map((l) => document.getElementById(l.target))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  const scrollTo = (id: string) => {
    if (!isHome) {
      navigate({ to: "/", hash: id === "inicio" ? undefined : id });
      setOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const navBtn = (target: string, label: string, mobile = false) => {
    const isActive = active === target;
    return (
      <button
        key={target}
        onClick={() => scrollTo(target)}
        className={[
          mobile
            ? "text-left px-3 py-3 text-sm font-medium rounded-md transition-colors"
            : "relative px-2 lg:px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "text-[var(--ncc-deep)] bg-[var(--ncc-mint)]"
            : "text-[var(--ncc-deep)]/80 hover:text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)]",
        ].join(" ")}
      >
        {label}
        {!mobile && isActive && (
          <span className="absolute left-2 right-2 -bottom-[1px] h-[2px] bg-[var(--ncc-deep)] rounded-full" />
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[var(--ncc-steel)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <button
          onClick={() => scrollTo("inicio")}
          className="flex items-center gap-3 group"
        >
          <NCCLogo size={40} className="transition-transform group-hover:rotate-12" />
          <span className="text-sm sm:text-base md:text-lg font-medium tracking-tight text-[var(--ncc-deep)] whitespace-nowrap">
            <span className="hidden sm:inline">National Case Competition</span>
            <span className="sm:hidden">NCC</span>
          </span>
        </button>

        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => navBtn(l.target, l.label))}
          </nav>

          <Link
            to="/admin"
            aria-label="Panel de administrador"
            title="Administrador"
            className="p-2 rounded-md text-[var(--ncc-deep)]/70 hover:text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)] transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-[var(--ncc-deep)] hover:bg-[var(--ncc-mint)]"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${open ? "max-h-[480px]" : "max-h-0"}`}
      >
        <nav className="border-t border-[var(--ncc-steel)] bg-white">
          <div className="max-w-7xl mx-auto px-5 py-2 flex flex-col">
            {links.map((l) => navBtn(l.target, l.label, true))}
          </div>
        </nav>
      </div>
    </header>
  );
}
