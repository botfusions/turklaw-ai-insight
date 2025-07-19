import React from 'react';
import { GuestHeader } from "@/components/layout/GuestHeader";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <GuestHeader transparent />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};