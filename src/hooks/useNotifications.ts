
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/integrations/supabase/types';

export type Notification = Database['public']['Tables']['notifications']['Row'];

async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data || [];
}

async function markNotificationsAsRead(notificationIds: string[]) {
  if (notificationIds.length === 0) return;
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .in('id', notificationIds);
    
  if (error) throw new Error(error.message);
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [channelId] = useState(() => `notifications-channel-${Math.random()}`);

  const queryKey = useMemo(() => ['notifications', user?.id], [user?.id]);

  const { data: notifications, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchNotifications(user!.id),
    enabled: !!user,
  });
  
  const unreadCount = notifications?.filter(n => !n.is_read).length ?? 0;

  const { mutate: markAsRead } = useMutation({
    mutationFn: (ids: string[]) => markNotificationsAsRead(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (e) => {
        const error = e as Error;
        toast({
            title: "Error",
            description: `Could not mark notifications as read: ${error.message}`,
            variant: "destructive"
        })
    }
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(channelId)
      .on<Notification>(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          queryClient.setQueryData(queryKey, (oldData: Notification[] | undefined) => {
              return [payload.new, ...(oldData || [])]
          });
          toast({
            title: 'New Notification!',
            description: 'You have a new notification.',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast, queryKey, channelId]);

  return { notifications, isLoading, error, unreadCount, markAsRead };
};
