
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, MessageCircle, Send as TelegramIcon } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type JoinedGroup = Database['public']['Functions']['get_user_joined_groups']['Returns'][number];

interface UserJoinedGroupsProps {
  userId?: string;
  isPublicView?: boolean;
  profileName?: string | null;
}

export const UserJoinedGroups = ({ userId, isPublicView, profileName }: UserJoinedGroupsProps) => {
    const { user } = useAuth();
    const targetUserId = userId || user?.id;

    const { data: joinedGroups, isLoading } = useQuery<JoinedGroup[]>({
        queryKey: ['user-joined-groups', targetUserId],
        queryFn: async () => {
            if (!targetUserId) return [];
            const { data, error } = await supabase.rpc('get_user_joined_groups', { p_user_id: targetUserId });
            if (error) throw error;
            return data || [];
        },
        enabled: !!targetUserId,
    });

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!joinedGroups || joinedGroups.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>{isPublicView ? 'Joined Groups' : 'My Joined Groups'}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-center py-8">
                        {isPublicView
                            ? (profileName ? `${profileName} hasn't joined any groups yet.` : 'This user has not joined any groups yet.')
                            : "You haven't joined any groups yet."
                        }
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{isPublicView ? `Joined Groups (${joinedGroups.length})` : `My Joined Groups (${joinedGroups.length})`}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {joinedGroups.map((group) => (
                        <div key={group.id} className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-grow">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold">{group.name}</h3>
                                    <Badge variant={group.is_official ? 'default' : 'secondary'} className={group.is_official ? 'bg-green-500' : ''}>
                                        {group.is_official ? 'Official' : 'Community'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{group.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                                {group.telegram_link && (
                                    <Button asChild variant="outline" className="w-full sm:w-auto justify-center">
                                        <a href={group.telegram_link} target="_blank" rel="noopener noreferrer">
                                            <TelegramIcon />
                                            <span>Open Telegram</span>
                                        </a>
                                    </Button>
                                )}
                                {group.whatsapp_link && (
                                    <Button asChild variant="outline" className="w-full sm:w-auto justify-center">
                                        <a href={group.whatsapp_link} target="_blank" rel="noopener noreferrer">
                                            <MessageCircle />
                                            <span>Open WhatsApp</span>
                                        </a>
                                    </Button>
                                )}
                                {!group.telegram_link && !group.whatsapp_link && (
                                    <Button variant="outline" className="w-full sm:w-auto" disabled>
                                        No Link Available
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
