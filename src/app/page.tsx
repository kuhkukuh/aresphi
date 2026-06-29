import { HeroSection } from '@/presentation/components/sections/HeroSection';
import { AboutSection } from '@/presentation/components/sections/AboutSection';
import { StatsSection } from '@/presentation/components/sections/StatsSection';
import { FeaturedProperties } from '@/presentation/components/sections/FeaturedProperties';
import { TestimonialsSection } from '@/presentation/components/sections/TestimonialsSection';
import { TeamSection } from '@/presentation/components/sections/TeamSection';
import { ContactCTA } from '@/presentation/components/sections/ContactCTA';
import { PartnerLogos } from '@/presentation/components/sections/PartnerLogos';
import { FloatingWhatsApp } from '@/presentation/components/features/FloatingWhatsApp';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PartnerLogos />
      <AboutSection />
      <StatsSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <TeamSection />
      <ContactCTA />
      <FloatingWhatsApp />
    </>
  );
}
