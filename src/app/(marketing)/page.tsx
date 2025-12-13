// src/app/(marketing)/page.tsx
import HeroSection from '@/components/marketing/HeroSection';
import HowItWorks from '@/components/marketing/HowItWorks';
import FeaturedCarousel from '@/components/marketing/FeaturedCarousel'; // <-- 1. Import
import AiFeatures from '@/components/marketing/AiFeatures';
import CallToAction from '@/components/marketing/CallToAction'; 

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <FeaturedCarousel /> 
      <AiFeatures />
      <CallToAction />
    </div>
  );
}