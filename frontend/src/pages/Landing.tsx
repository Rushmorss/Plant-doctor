import React from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TechnologySection } from '../components/landing/TechnologySection';
import { FeatureSection } from '../components/landing/FeatureSection';
import { CtaSection } from '../components/landing/CtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export function Landing() {
  return (
    <div className="min-h-screen w-full bg-canvas">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TechnologySection />
        <FeatureSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>);

}