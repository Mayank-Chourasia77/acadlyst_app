
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useAdmin = () => {
  const { user } = useAuth();

  const fetchUserRole = async () => {
    if (!user) return false;

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    if (error) {
      console.error('Error checking admin role:', error.message);
      throw new Error(error.message);
    }

    return data;
  };

  const { data: isAdmin, isLoading, isError } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: fetchUserRole,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { isAdmin: isAdmin ?? false, isLoading, isError };
};
