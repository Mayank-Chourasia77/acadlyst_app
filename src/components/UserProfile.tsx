
import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileLoadingState } from './profile/ProfileLoadingState';
import { ProfileErrorState } from './profile/ProfileErrorState';
import { ProfileBreadcrumb } from './profile/ProfileBreadcrumb';
import { ProfileTabs } from './profile/ProfileTabs';
import { useProfileData, useProfileBadges, useProfileUploads } from '@/hooks/useProfileData';

interface UserProfileProps {
  username: string | null;
  userId?: string | null;
}

export const UserProfile = ({ username, userId }: UserProfileProps) => {
  const { user } = useAuth();
  const isPublicView = !!(username || userId);
  const loggedInUserId = user?.id;

  console.log("--- UserProfile Debug ---");
  console.log("Props username:", username);
  console.log("Props userId:", userId);
  console.log("isPublicView:", isPublicView);
  console.log("loggedInUserId:", loggedInUserId);

  // Update page title based on profile
  useEffect(() => {
    const updateTitle = () => {
      if (isPublicView && username) {
        document.title = `${username}'s Profile - EduShare`;
      } else if (isPublicView && userId) {
        document.title = 'User Profile - EduShare';
      } else {
        document.title = 'My Profile - EduShare';
      }
    };

    updateTitle();
    
    // Cleanup on unmount
    return () => {
      document.title = 'EduShare';
    };
  }, [isPublicView, username, userId]);

  // Profile data query - pass both username and userId
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfileData(username, loggedInUserId, userId);

  const isMyProfile = profile && loggedInUserId ? profile.id === loggedInUserId : false;
  const profileUserId = profile?.id;
  
  console.log("Profile resolved - isMyProfile:", isMyProfile, "profileUserId:", profileUserId);

  // Dependent queries
  const { data: badges = [], isLoading: badgesLoading } = useProfileBadges(profileUserId);
  const { data: uploads = [], isLoading: uploadsLoading } = useProfileUploads(profileUserId, isPublicView, isMyProfile);

  // Loading state
  if (profileLoading) {
    return (
      <div className="space-y-8">
        <ProfileBreadcrumb isPublicView={isPublicView} />
        <ProfileLoadingState />
      </div>
    );
  }

  // Error or not found state
  if (profileError || !profile) {
    return (
      <div className="space-y-8">
        <ProfileBreadcrumb isPublicView={isPublicView} username={username} />
        <ProfileErrorState 
          error={profileError} 
          isPublicView={isPublicView} 
          username={username}
        />
      </div>
    );
  }

  const isDataLoading = badgesLoading || uploadsLoading;

  return (
    <div className="space-y-8">
      <ProfileBreadcrumb 
        isPublicView={isPublicView} 
        profileName={profile.name} 
        username={profile.username}
      />

      <ProfileHeader 
        profile={profile}
        isMyProfile={isMyProfile}
        isPublicView={isPublicView}
      />

      <ProfileTabs
        profile={profile}
        isMyProfile={isMyProfile}
        isPublicView={isPublicView}
        badges={badges}
        uploads={uploads}
        isDataLoading={isDataLoading}
      />
    </div>
  );
};
