
import React from 'react';
import { PublicNavigation } from '@/components/PublicNavigation';
import { Hero } from '@/components/Hero';
import { TrendingSection } from '@/components/TrendingSection';
import { TopCreatorSection } from '@/components/TopCreatorSection';
import { BrowseByCourse } from '@/components/BrowseByCourse';
import { Footer } from '@/components/Footer';
import { FloatingAiChat } from '@/components/FloatingAiChat';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavigation />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <TrendingSection />
        <TopCreatorSection />
        <BrowseByCourse />
      </div>
      <Footer />
      <FloatingAiChat />
    </div>
  );
};

export default Index;
