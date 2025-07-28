
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Award, Crown, Target, Zap, Flame, Shield } from 'lucide-react';

interface BadgeInfo {
  type: string;
  name: string;
  description: string;
  requirement: string;
  color: string;
  icon: React.ReactNode;
  unlockAt: number;
}

export const BadgesBanner = () => {
  const badges: BadgeInfo[] = [
    {
      type: 'rising_star',
      name: 'Rising Star',
      description: 'Your journey begins here',
      requirement: '10+ uploads',
      color: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
      icon: <Star className="h-8 w-8" />,
      unlockAt: 10
    },
    {
      type: 'contributor',
      name: 'Contributor',
      description: 'Making a real impact',
      requirement: '50+ uploads',
      color: 'bg-gradient-to-br from-sky-200 to-sky-400',
      icon: <Trophy className="h-8 w-8" />,
      unlockAt: 50
    },
    {
      type: 'veteran',
      name: 'Veteran',
      description: 'A seasoned creator',
      requirement: '100+ uploads',
      color: 'bg-gradient-to-br from-violet-400 to-purple-500',
      icon: <Shield className="h-8 w-8" />,
      unlockAt: 100
    },
    {
      type: 'expert',
      name: 'Expert',
      description: 'Master of quality content',
      requirement: '200+ uploads',
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
      icon: <Target className="h-8 w-8" />,
      unlockAt: 200
    },
    {
      type: 'upvote_hunter',
      name: 'Upvote Hunter',
      description: 'Community favorite',
      requirement: '500+ total votes',
      color: 'bg-gradient-to-br from-orange-400 to-orange-500',
      icon: <Flame className="h-8 w-8" />,
      unlockAt: 500
    },
    {
      type: 'consistent_creator',
      name: 'Consistent Creator',
      description: 'Reliability at its finest',
      requirement: '30 day upload streak',
      color: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
      icon: <Zap className="h-8 w-8" />,
      unlockAt: 30
    },
    {
      type: 'lecture_master',
      name: 'Lecture Master',
      description: 'Video content specialist',
      requirement: '20+ lecture uploads',
      color: 'bg-gradient-to-br from-pink-400 to-fuchsia-500',
      icon: <Award className="h-8 w-8" />,
      unlockAt: 20
    },
    {
      type: 'referral_king',
      name: 'Referral King',
      description: 'Community builder',
      requirement: '5+ referrals',
      color: 'bg-gradient-to-br from-teal-300 to-cyan-400',
      icon: <Crown className="h-8 w-8" />,
      unlockAt: 5
    },
    {
      type: 'legend',
      name: 'Legend',
      description: 'The ultimate achievement',
      requirement: '500+ uploads',
      color: 'bg-gradient-to-br from-red-600 to-red-800',
      icon: <Crown className="h-8 w-8" />,
      unlockAt: 500
    },
    {
      type: 'champion',
      name: 'Champion',
      description: 'Excellence personified',
      requirement: '1000+ total votes',
      color: 'bg-gradient-to-br from-amber-400 to-yellow-500',
      icon: <Trophy className="h-8 w-8" />,
      unlockAt: 1000
    }
  ];

  return (
    <section className="mb-8 mt-12">
      <div className="flex items-center mb-6">
        <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900">Badge Collection</h2>
        <Badge variant="secondary" className="ml-3">
          {badges.length} Available
        </Badge>
      </div>
      
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl text-gray-800">
            🏆 Unlock Your Achievements 🏆
          </CardTitle>
          <p className="text-center text-gray-600 text-sm">
            Complete challenges to earn badges and showcase your expertise
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.type}
                className="group relative bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-gray-100 hover:border-blue-200"
              >
                {/* Badge Icon */}
                <div className={`w-16 h-16 rounded-full ${badge.color} flex items-center justify-center text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {badge.icon}
                </div>
                
                {/* Badge Info */}
                <div className="text-center">
                  <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {badge.description}
                  </p>
                  
                  {/* Requirement */}
                  <div className="bg-gray-50 rounded-full px-2 py-1">
                    <p className="text-xs font-medium text-gray-700">
                      {badge.requirement}
                    </p>
                  </div>
                </div>
                
                {/* Hover Tooltip */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pro Tip */}
          <div className="mt-6 bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Pro Tip:</span> Upload high-quality content regularly to unlock badges faster and climb the leaderboard!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
