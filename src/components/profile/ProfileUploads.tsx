
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, ThumbsUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Upload {
  id: string;
  title: string;
  course: string;
  subject: string;
  type: string;
  votes: number;
  created_at: string;
}

interface ProfileUploadsProps {
  uploads: Upload[];
  isLoading: boolean;
  isPublicView: boolean;
  isMyProfile: boolean;
  profileName?: string | null;
}

export const ProfileUploads = ({ uploads, isLoading, isPublicView, isMyProfile, profileName }: ProfileUploadsProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Uploads</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>{isPublicView && !isMyProfile ? `Uploads (${uploads.length})` : `My Uploads (${uploads.length})`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {isPublicView && !isMyProfile
              ? (profileName ? `${profileName} hasn't uploaded any resources yet.` : 'This user has not uploaded any resources yet.')
              : "You haven't uploaded any resources yet."
            }
          </p>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{upload.title}</h3>
                    <p className="text-sm text-gray-600">
                      {upload.course} • {upload.subject}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {upload.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{upload.votes}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(upload.created_at!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
