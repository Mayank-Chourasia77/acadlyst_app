
import React from 'react';
import { TopCreatorSection } from '@/components/TopCreatorSection';
import { BadgesBanner } from '@/components/BadgesBanner';

const Leaderboard = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <TopCreatorSection />
      <BadgesBanner />
    </div>
  );
};

export default Leaderboard;
