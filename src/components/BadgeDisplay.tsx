
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star } from 'lucide-react';

interface BadgeData {
  id: string;
  badge_type: string;
  description: string | null;
  icon: string | null;
  awarded_at: string | null;
}

interface BadgeDisplayProps {
  badges: BadgeData[];
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  const getBadgeInfo = (badgeType: string) => {
    const badgeMap: Record<string, { name: string; color: string; description: string; icon: React.ReactNode }> = {
      rising_star: {
        name: 'Rising Star',
        color: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
        description: 'Awarded for 10+ uploads',
        icon: <Star className="h-6 w-6" />
      },
      contributor: {
        name: 'Contributor',
        color: 'bg-gradient-to-br from-sky-200 to-sky-400',
        description: 'Awarded for 50+ uploads',
        icon: <Trophy className="h-6 w-6" />
      },
      veteran: {
        name: 'Veteran',
        color: 'bg-gradient-to-br from-violet-400 to-purple-500',
        description: 'Awarded for 100+ uploads',
        icon: <Trophy className="h-6 w-6" />
      },
      expert: {
        name: 'Expert',
        color: 'bg-gradient-to-br from-emerald-500 to-green-600',
        description: 'Awarded for exceptional quality',
        icon: <Trophy className="h-6 w-6" />
      },
      legend: {
        name: 'Legend',
        color: 'bg-gradient-to-br from-red-600 to-red-800',
        description: 'Awarded for legendary contributions',
        icon: <Trophy className="h-6 w-6" />
      },
      champion: {
        name: 'Champion',
        color: 'bg-gradient-to-br from-amber-400 to-yellow-500',
        description: 'Awarded for being a champion',
        icon: <Trophy className="h-6 w-6" />
      },
      upvote_hunter: {
        name: 'Upvote Hunter',
        color: 'bg-gradient-to-br from-orange-400 to-orange-500',
        description: 'Awarded for 500+ total votes',
        icon: <Trophy className="h-6 w-6" />
      },
      consistent_creator: {
        name: 'Consistent Creator',
        color: 'bg-gradient-to-br from-indigo-300 to-indigo-500',
        description: 'Awarded for consistent uploads',
        icon: <Trophy className="h-6 w-6" />
      },
      lecture_master: {
        name: 'Lecture Master',
        color: 'bg-gradient-to-br from-pink-400 to-fuchsia-500',
        description: 'Awarded for 20+ lecture uploads',
        icon: <Trophy className="h-6 w-6" />
      },
      referral_king: {
        name: 'Referral King',
        color: 'bg-gradient-to-br from-teal-300 to-cyan-400',
        description: 'Awarded for 5+ referrals',
        icon: <Trophy className="h-6 w-6" />
      },
    };

    return badgeMap[badgeType] || {
      name: badgeType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      color: 'bg-gradient-to-br from-slate-400 to-slate-600',
      description: 'Special achievement badge',
      icon: <Award className="h-6 w-6" />
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Badges ({badges.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No badges earned yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload resources and get votes to earn badges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const badgeInfo = getBadgeInfo(badge.badge_type);
              return (
                <div
                  key={badge.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${badgeInfo.color} flex items-center justify-center text-white`}>
                      {badge.icon ? <span className="text-2xl">{badge.icon}</span> : badgeInfo.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{badgeInfo.name}</h3>
                      <p className="text-sm text-gray-600">
                        {badge.description || badgeInfo.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Earned {new Date(badge.awarded_at!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
