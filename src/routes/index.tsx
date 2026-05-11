import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/ncc/Navbar";
import { Hero } from "@/components/ncc/Hero";
import { MisionVision } from "@/components/ncc/MisionVision";
import { StageGate } from "@/components/ncc/StageGate";
import { Contacto } from "@/components/ncc/Contacto";
import { Footer } from "@/components/ncc/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "National Case Competition — Train. Compete. Become." },
      {
        name: "description",
        content:
          "NCC: la competencia universitaria de consultoría estratégica. Vivir la consultoría desde la universidad.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-[var(--ncc-cream)]">
      <Navbar />
      <main>
        <Hero />
        <MisionVision />
        <StageGate
          id="alpha"
          label="ALPHA"
          labelColor="#598c71"
          borderAccent="#598c71"
          password={import.meta.env.VITE_PASS_ALPHA ?? ""}
          successMessage="Bienvenido a la Etapa Alpha. El contenido de esta etapa estará disponible próximamente."
        />
        <StageGate
          id="beta"
          label="BETA"
          labelColor="#125b50"
          borderAccent="#125b50"
          password={import.meta.env.VITE_PASS_BETA ?? ""}
          successMessage="Bienvenido a la Etapa Beta. El contenido de esta etapa estará disponible próximamente."
        />
        <StageGate
          id="omega"
          label="OMEGA"
          labelColor="#9ebcac"
          borderAccent="#9ebcac"
          password={import.meta.env.VITE_PASS_OMEGA ?? ""}
          successMessage="Bienvenido a la Etapa Omega. El contenido de esta etapa estará disponible próximamente."
          labelOnDarkStrip
        />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
