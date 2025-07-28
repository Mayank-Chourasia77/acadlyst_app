
import React from 'react';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ClickableUsernameProps {
  username: string;
  displayName?: string;
  className?: string;
  userId?: string; // Add userId as fallback
}

export const ClickableUsername = ({ username, displayName, className = "", userId }: ClickableUsernameProps) => {
  // Fetch user profile for hover card
  const { data: hoverProfile } = useQuery({
    queryKey: ['hover-profile', username, userId],
    queryFn: async () => {
      console.log("Fetching hover profile for:", { username, userId });
      
      // Try to fetch by username first, then by userId as fallback
      if (username && username !== 'null') {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, username, total_uploads, total_votes, created_at, badge_level')
          .eq('username', username)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching profile by username:", error);
          return null;
        }
        return data;
      } else if (userId) {
        // Fallback to userId if username is not available
        const { data, error } = await supabase
          .from('users')
          .select('id, name, username, total_uploads, total_votes, created_at, badge_level')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching profile by userId:", error);
          return null;
        }
        return data;
      }
      return null;
    },
    enabled: !!(username || userId),
    staleTime: 60000, // Cache for 1 minute
  });

  // Determine the profile link
  const getProfileLink = () => {
    if (username && username !== 'null') {
      return `/profile?username=${encodeURIComponent(username)}`;
    } else if (userId) {
      // If no username, use userId as a fallback (you might want to modify your profile route to handle this)
      return `/profile?userId=${encodeURIComponent(userId)}`;
    }
    return '#'; // Fallback for cases where neither is available
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const profileLink = getProfileLink();
  const shouldShowHover = !!(hoverProfile || (username && username !== 'null') || userId);

  if (!shouldShowHover) {
    // If no username or userId, just show the display name without link
    return (
      <span className={`text-gray-600 ${className}`}>
        {displayName || 'Anonymous'}
      </span>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link 
          to={profileLink}
          className={`text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium ${className}`}
        >
          {displayName || username || 'View Profile'}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">
              {hoverProfile?.name || displayName || username || 'User'}
            </h4>
            {hoverProfile?.username && (
              <p className="text-sm text-muted-foreground">
                @{hoverProfile.username}
              </p>
            )}
            {hoverProfile && (
              <div className="flex items-center pt-2 space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{hoverProfile.total_uploads || 0}</span>
                  <span>uploads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{hoverProfile.total_votes || 0}</span>
                  <span>votes</span>
                </div>
              </div>
            )}
            {hoverProfile?.badge_level !== undefined && hoverProfile.badge_level > 0 && (
              <div className="pt-2">
                <Badge variant="secondary" className="text-xs">
                  Level {hoverProfile.badge_level}
                </Badge>
              </div>
            )}
            {hoverProfile?.created_at && (
              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>Joined {formatDate(hoverProfile.created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
