import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProfileData = (username: string | null, loggedInUserId: string | null, userId?: string | null) => {
  const isPublicView = !!(username || userId);

  return useQuery({
    queryKey: isPublicView ? ['profile', 'public', username, userId] : ['profile', 'my', loggedInUserId],
    queryFn: async () => {
      console.log("Fetching profile data...");
      if (isPublicView) {
        // Try username first, then userId as fallback
        if (username && username !== 'null') {
          console.log(`Fetching public profile for username: ${username}`);
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching public profile by username:", error);
            throw error;
          }
          
          console.log("Public profile data by username:", data);
          return data;
        } else if (userId) {
          console.log(`Fetching public profile for userId: ${userId}`);
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching public profile by userId:", error);
            throw error;
          }
          
          console.log("Public profile data by userId:", data);
          return data;
        } else {
          console.log("No username or userId provided for public view");
          return null;
        }
      } else {
        if (!loggedInUserId) {
          console.log("No logged in user ID");
          return null;
        }
        console.log(`Fetching own profile for user ID: ${loggedInUserId}`);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', loggedInUserId)
          .single();
        
        if (error) {
          console.error("Error fetching own profile:", error);
          throw error;
        }
        
        console.log("Own profile data:", data);
        return data;
      }
    },
    enabled: !!(isPublicView ? (username || userId) : loggedInUserId),
    staleTime: 30000,
  });
};

export const useProfileBadges = (profileUserId: string | null) => {
  return useQuery({
    queryKey: ['badges', profileUserId],
    queryFn: async () => {
      if (!profileUserId) return [];
      console.log(`Fetching badges for user: ${profileUserId}`);
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', profileUserId)
        .order('awarded_at', { ascending: false });

      if (error) {
        console.error("Error fetching badges:", error);
        throw error;
      }
      console.log("Badges data:", data);
      return data;
    },
    enabled: !!profileUserId,
    staleTime: 60000,
  });
};

export const useProfileUploads = (profileUserId: string | null, isPublicView: boolean, isMyProfile: boolean) => {
  return useQuery({
    queryKey: ['uploads', profileUserId, isPublicView ? 'public' : 'private'],
    queryFn: async () => {
      if (!profileUserId) return [];
      console.log(`Fetching uploads for user: ${profileUserId}, public view: ${isPublicView}`);
      
      let query = supabase
        .from('uploads')
        .select('*')
        .eq('user_id', profileUserId)
        .order('created_at', { ascending: false });

      if (isPublicView && !isMyProfile) {
        query = query.eq('is_hidden', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching uploads:", error);
        throw error;
      }
      console.log("Uploads data:", data);
      return data;
    },
    enabled: !!profileUserId,
    staleTime: 30000,
  });
};
