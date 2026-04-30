import { HeroEmergency } from "@/components/sections/HeroEmergency";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { WhenToCall } from "@/components/sections/WhenToCall";
import { ServiceCategories } from "@/components/sections/ServiceCategories";
import { WorkGallery } from "@/components/sections/WorkGallery";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { ServiceAreaTeaser } from "@/components/sections/ServiceAreaTeaser";
import { ReviewsCarousel } from "@/components/sections/ReviewsCarousel";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HeroEmergency />
      <TrustMarquee />
      <WhenToCall />
      <ServiceCategories />
      <WorkGallery />
      <ProcessStrip />
      <StatsCounter />
      <ServiceAreaTeaser />
      <ReviewsCarousel />
      <FinalCTA />
    </>
  );
}
