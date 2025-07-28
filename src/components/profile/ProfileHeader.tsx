
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, User, MapPin, Edit } from 'lucide-react';
import { ProfileDonateButton } from './ProfileDonateButton';
import { EditProfileDialog } from './EditProfileDialog';
import { useQueryClient } from '@tanstack/react-query';

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

interface ProfileHeaderProps {
  profile: Profile;
  isMyProfile: boolean;
  isPublicView: boolean;
}

export const ProfileHeader = ({ profile, isMyProfile, isPublicView }: ProfileHeaderProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const shouldShowDonateButton = isPublicView && !isMyProfile && profile.upi_link && profile.is_upi_public;

  const handleEditSuccess = () => {
    // Invalidate and refetch profile data
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.username && (
                      <p className="text-gray-600">@{profile.username}</p>
                    )}
                  </div>
                  {isMyProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDialogOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
                
                {shouldShowDonateButton && (
                  <ProfileDonateButton
                    upiLink={profile.upi_link}
                    userName={profile.name}
                  />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {isMyProfile && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </div>
              
              {(profile.course || profile.university) && (
                <div className="flex flex-wrap gap-2">
                  {profile.course && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{profile.course}</span>
                    </Badge>
                  )}
                  {profile.university && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{profile.university}</span>
                    </Badge>
                  )}
                </div>
              )}
              
              {profile.bio && (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isMyProfile && (
        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          currentName={profile.name}
          userId={profile.id}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
