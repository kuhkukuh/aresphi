import Hero from "@/components/Hero";
import PartnerLogos from "@/components/PartnerLogos";
import USPSection from "@/components/USPSection";
import StatsSection from "@/components/StatsSection";
import ProcessSection from "@/components/ProcessSection";
import PropertyShowcase from "@/components/PropertyShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <PartnerLogos />
      <USPSection />
      <StatsSection />
      <ProcessSection />
      <PropertyShowcase />
      <Footer />
    </main>
  );
}
