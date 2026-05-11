import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/ncc/Navbar";
import { Hero } from "@/components/ncc/Hero";
import { MisionVision } from "@/components/ncc/MisionVision";
import { StageGate } from "@/components/ncc/StageGate";
import { Patrocinadores } from "@/components/ncc/Patrocinadores";
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
        <Patrocinadores />
        <StageGate
          id="gmat"
          label="GMAT"
          labelColor="#598c71"
          borderAccent="#598c71"
          password={import.meta.env.VITE_PASS_GMAT ?? ""}
        />
        <StageGate
          id="alpha"
          label="ALPHA"
          labelColor="#598c71"
          borderAccent="#598c71"
          password={import.meta.env.VITE_PASS_ALPHA ?? ""}
        />
        <StageGate
          id="beta"
          label="BETA"
          labelColor="#125b50"
          borderAccent="#125b50"
          password={import.meta.env.VITE_PASS_BETA ?? ""}
        />
        <StageGate
          id="omega"
          label="OMEGA"
          labelColor="#125b50"
          borderAccent="#9ebcac"
          password={import.meta.env.VITE_PASS_OMEGA ?? ""}
        />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
