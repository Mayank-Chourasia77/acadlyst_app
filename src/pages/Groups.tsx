
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Check, Send as TelegramIcon, MessagesSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Group = Tables<'groups'>;

const GroupsContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading: isLoadingGroups } = useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: joinedGroupIds, isLoading: isLoadingJoinedGroups } = useQuery({
    queryKey: ['user-group-memberships', user?.id],
    queryFn: async () => {
      if (!user) return new Set();
      const { data, error } = await supabase.from('group_members').select('group_id').eq('user_id', user.id);
      if (error) throw error;
      return new Set(data.map(m => m.group_id));
    },
    enabled: !!user,
  });

  const joinGroupMutation = useMutation({
    mutationFn: async ({ group, linkToOpen }: { group: Group, linkToOpen: string | null }) => {
      if (!user) throw new Error('You must be logged in to join a group.');
      
      const isAlreadyMember = joinedGroupIds?.has(group.id);

      if (!isAlreadyMember) {
        const { error } = await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id });
        if (error && error.code !== '23505') { // ignore unique constraint violation if already a member
          throw error;
        }
      }
    },
    onSuccess: (_, { group, linkToOpen }) => {
      const wasAlreadyMember = joinedGroupIds?.has(group.id);
      
      queryClient.invalidateQueries({ queryKey: ['user-group-memberships', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-joined-groups', user?.id] });

      if (!wasAlreadyMember) {
        toast({
          title: 'Group Joined!',
          description: `You've successfully joined ${group.name}.`,
        });
      }
      if (linkToOpen) {
        window.open(linkToOpen, '_blank', 'noopener,noreferrer');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Join',
        description: error.message || 'There was an issue joining the group.',
        variant: 'destructive',
      });
    },
  });

  const getPlatform = (group: Group) => {
    const hasTelegram = !!group.telegram_link;
    const hasWhatsapp = !!group.whatsapp_link;

    if (hasTelegram && hasWhatsapp) return 'Both';
    if (hasTelegram) return 'Telegram';
    if (hasWhatsapp) return 'WhatsApp';
    return 'Community';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return <TelegramIcon className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageCircle className="h-5 w-5" />;
      case 'both':
        return <MessagesSquare className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'telegram':
        return 'bg-blue-500';
      case 'discord':
        return 'bg-purple-500';
      case 'whatsapp':
        return 'bg-green-500';
      case 'both':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoadingGroups) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Groups...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Groups</h1>
        <p className="text-lg text-gray-600">Join official study groups and communities for collaborative learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups?.map((group) => {
          const platform = getPlatform(group);
          const isJoined = joinedGroupIds?.has(group.id);
          const isJoining = joinGroupMutation.isPending && joinGroupMutation.variables?.group.id === group.id;

          return (
            <Card key={group.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${getPlatformColor(platform)} rounded-full flex items-center justify-center text-white`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <Badge variant="secondary">{platform}</Badge>
                  </div>
                  {group.is_official && (
                    <Badge variant="default" className="bg-green-500">
                      Official
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-tight">{group.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    {group.university && <p className="text-sm font-medium text-gray-700 mb-1">University: {group.university}</p>}
                    <p className="text-gray-600 text-sm">{group.description}</p>
                  </div>
                </div>
                <div className="w-full mt-4 flex flex-col sm:flex-row gap-2">
                  {isJoined ? (
                    <>
                      {group.telegram_link && (
                        <Button asChild className="flex-1" variant="secondary">
                          <a href={group.telegram_link} target="_blank" rel="noopener noreferrer">
                            <TelegramIcon /> Open Telegram
                          </a>
                        </Button>
                      )}
                      {group.whatsapp_link && (
                        <Button asChild className="flex-1" variant="secondary">
                          <a href={group.whatsapp_link} target="_blank" rel="noopener noreferrer">
                            <MessageCircle /> Open WhatsApp
                          </a>
                        </Button>
                      )}
                      {(!group.telegram_link && !group.whatsapp_link) && (
                        <Button className="w-full" disabled>
                          <Check className="h-4 w-4 mr-2" />
                          Joined
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {group.telegram_link && (
                        <Button
                          className="flex-1"
                          onClick={() => joinGroupMutation.mutate({ group, linkToOpen: group.telegram_link })}
                          disabled={!user || isJoining || isLoadingJoinedGroups}
                        >
                          {isJoining && joinGroupMutation.variables?.linkToOpen === group.telegram_link ? 'Joining...' : (
                            <><TelegramIcon /> Join on Telegram</>
                          )}
                        </Button>
                      )}
                      {group.whatsapp_link && (
                        <Button
                          className="flex-1"
                          onClick={() => joinGroupMutation.mutate({ group, linkToOpen: group.whatsapp_link })}
                          disabled={!user || isJoining || isLoadingJoinedGroups}
                        >
                          {isJoining && joinGroupMutation.variables?.linkToOpen === group.whatsapp_link ? 'Joining...' : (
                            <><MessageCircle /> Join on WhatsApp</>
                          )}
                        </Button>
                      )}
                      {(!group.telegram_link && !group.whatsapp_link) && (
                        <Button
                          className="w-full"
                          onClick={() => joinGroupMutation.mutate({ group, linkToOpen: null })}
                          disabled={!user || isJoining || isLoadingJoinedGroups}
                        >
                          {isJoining ? 'Joining...' : (
                            <><Users className="h-4 w-4 mr-2" /> Join Community</>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
};

const Groups = () => {
  return (
    <AuthProvider>
      <GroupsContent />
    </AuthProvider>
  );
};

export default Groups;
