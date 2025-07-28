
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ThumbsUp, Flame, Trophy } from 'lucide-react';

interface UserStatsProps {
  totalUploads: number;
  totalVotes: number;
  uploadStreak: number;
}

export const UserStats = ({ totalUploads, totalVotes, uploadStreak }: UserStatsProps) => {
  const stats = [
    {
      title: 'Total Uploads',
      value: totalUploads,
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Votes',
      value: totalVotes,
      icon: ThumbsUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upload Streak',
      value: uploadStreak,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Level',
      value: Math.floor((totalUploads + totalVotes / 10) / 10) + 1,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
