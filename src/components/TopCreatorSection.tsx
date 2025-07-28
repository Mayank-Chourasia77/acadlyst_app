import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Upload, ThumbsUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClickableUsername } from '@/components/ClickableUsername';

interface TopCreator {
  user_id: string;
  user_name: string;
  username: string | null;
  total_uploads: number;
  total_votes: number;
  badge_count: number;
}

export const TopCreatorSection = () => {
  const { data: topCreators, isLoading: loadingCreators } = useQuery({
    queryKey: ['top-creators'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_creators' as any, {
        content_type: null,
        limit_count: 6
      });

      if (error) throw error;
      return data as TopCreator[];
    },
  });

  const { data: noteCreators, isLoading: loadingNotes } = useQuery({
    queryKey: ['top-note-creators'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_creators' as any, {
        content_type: 'note',
        limit_count: 6
      });

      if (error) throw error;
      return data as TopCreator[];
    },
  });

  const { data: lectureCreators, isLoading: loadingLectures } = useQuery({
    queryKey: ['top-lecture-creators'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_creators' as any, {
        content_type: 'lecture',
        limit_count: 6
      });

      if (error) throw error;
      return data as TopCreator[];
    },
  });

  const CreatorCard = ({ creator, rank }: { creator: TopCreator; rank: number }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-orange-500">#{rank}</div>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {creator.user_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">
                <ClickableUsername
                  username={creator.username}
                  displayName={creator.user_name}
                  userId={creator.user_id}
                  className="text-gray-900 hover:text-blue-600"
                />
              </h3>
              {creator.username && (
                <p className="text-sm text-gray-500">@{creator.username}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Upload className="h-4 w-4 text-blue-500" />
              <span className="font-semibold">{creator.total_uploads}</span>
            </div>
            <p className="text-xs text-gray-500">Uploads</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <span className="font-semibold">{creator.total_votes}</span>
            </div>
            <p className="text-xs text-gray-500">Votes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{creator.badge_count}</span>
            </div>
            <p className="text-xs text-gray-500">Badges</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loadingCreators || loadingNotes || loadingLectures) {
    return (
      <section>
        <div className="flex items-center mb-8">
          <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
          <h2 className="text-3xl font-bold text-gray-900">Top Contributors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="text-center">
                      <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center mb-8">
        <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900">Top Contributors</h2>
      </div>

      <Tabs defaultValue="overall" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="lectures">Lectures</TabsTrigger>
        </TabsList>

        <TabsContent value="overall">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCreators?.map((creator, index) => (
              <CreatorCard key={creator.user_id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noteCreators?.map((creator, index) => (
              <CreatorCard key={creator.user_id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lectures">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectureCreators?.map((creator, index) => (
              <CreatorCard key={creator.user_id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
