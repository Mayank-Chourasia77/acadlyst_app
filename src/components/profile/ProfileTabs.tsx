
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserStats } from '../UserStats';
import { BadgeDisplay } from '../BadgeDisplay';
import { ProfileUploads } from './ProfileUploads';
import { UserJoinedGroups } from '../UserJoinedGroups';
import { UpiUnlock } from '../UpiUnlock';
import { useIsMobile } from '@/hooks/use-mobile';

interface Profile {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  course?: string | null;
  university?: string | null;
  bio?: string | null;
  created_at: string;
  upi_link?: string | null;
  is_upi_public?: boolean;
  total_uploads?: number;
  total_votes?: number;
  upload_streak?: number;
}

interface ProfileTabsProps {
  profile: Profile;
  isMyProfile: boolean;
  isPublicView: boolean;
  badges: any[];
  uploads: any[];
  isDataLoading: boolean;
}

export const ProfileTabs = ({ 
  profile, 
  isMyProfile, 
  isPublicView, 
  badges, 
  uploads, 
  isDataLoading 
}: ProfileTabsProps) => {
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="relative">
        <TabsList className={`${
          isMobile 
            ? 'w-full overflow-x-auto overflow-y-hidden flex-nowrap justify-start scrollbar-hide' 
            : 'inline-flex'
        } h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground`}>
          <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
          <TabsTrigger value="badges" className="whitespace-nowrap">Badges</TabsTrigger>
          <TabsTrigger value="uploads" className="whitespace-nowrap">
            {isPublicView && !isMyProfile ? "Uploads" : "My Uploads"}
          </TabsTrigger>
          <TabsTrigger value="groups" className="whitespace-nowrap">
            {isPublicView && !isMyProfile ? "Groups" : "My Groups"}
          </TabsTrigger>
          {isMyProfile && (
            <TabsTrigger value="upi" className="whitespace-nowrap">UPI Unlock</TabsTrigger>
          )}
        </TabsList>
      </div>

      <TabsContent value="overview">
        <UserStats 
          totalUploads={profile.total_uploads || 0}
          totalVotes={profile.total_votes || 0}
          uploadStreak={profile.upload_streak || 0}
        />
      </TabsContent>

      <TabsContent value="badges">
        {isDataLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <BadgeDisplay badges={badges} />
        )}
      </TabsContent>

      <TabsContent value="uploads">
        <ProfileUploads
          uploads={uploads}
          isLoading={isDataLoading}
          isPublicView={isPublicView}
          isMyProfile={isMyProfile}
          profileName={profile?.name}
        />
      </TabsContent>

      <TabsContent value="groups">
        {isDataLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <UserJoinedGroups 
            userId={profile.id} 
            isPublicView={isPublicView} 
            profileName={profile?.name} 
          />
        )}
      </TabsContent>

      {isMyProfile && (
        <TabsContent value="upi">
          <UpiUnlock 
            totalUploads={profile.total_uploads || 0}
            totalVotes={profile.total_votes || 0}
            currentUpiLink={profile.upi_link}
            currentIsUpiPublic={profile.is_upi_public}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
