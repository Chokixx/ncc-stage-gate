import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/ncc/Navbar";
import { Hero } from "@/components/ncc/Hero";
import { AnnouncementBanner } from "@/components/ncc/AnnouncementBanner";
import { MisionVision } from "@/components/ncc/MisionVision";
import { StageGate } from "@/components/ncc/StageGate";
import { Patrocinadores } from "@/components/ncc/Patrocinadores";
import { Inscripcion } from "@/components/ncc/Inscripcion";
import { Contacto } from "@/components/ncc/Contacto";
import { Footer } from "@/components/ncc/Footer";
import alphaIcon from "@/assets/alpha-letter.png";
import betaIcon from "@/assets/beta-letter.png";
import deltaIcon from "@/assets/delta-letter.png";


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
        <Inscripcion />
        <StageGate
          id="gmat"
          label="GMAT"
          labelColor="#598c71"
          borderAccent="#598c71"
        />
        <StageGate
          id="alpha"
          label="ALPHA"
          labelColor="#598c71"
          borderAccent="#598c71"
          iconUrl={alphaIcon}
        />
        <StageGate
          id="beta"
          label="BETA"
          labelColor="#125b50"
          borderAccent="#125b50"
          iconUrl={betaIcon}
        />
        <StageGate
          id="delta"
          label="DELTA"
          labelColor="#125b50"
          borderAccent="#9ebcac"
          iconUrl={deltaIcon}
        />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
