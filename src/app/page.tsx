"use client";

import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { useScrollParallax } from "@/hooks/use-scroll-parallax";

export default function Home() {
  const { scrollY, scrollContainerRef } = useScrollParallax();

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen w-full snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth bg-white text-text-base transition-colors duration-300 dark:bg-dark-bg-page dark:text-dark-text-base"
    >
      <LandingHeader />
      <main className="flex flex-col">
        <HeroSection scrollY={scrollY} />
        <FeaturesSection scrollY={scrollY} />
        <LandingFooter />
      </main>
    </div>
  );
}
