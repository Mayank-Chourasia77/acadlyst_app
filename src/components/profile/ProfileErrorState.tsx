
import React from 'react';
import { AlertCircle, User } from 'lucide-react';

interface ProfileErrorStateProps {
  error?: any;
  isPublicView: boolean;
  username?: string | null;
}

export const ProfileErrorState = ({ error, isPublicView, username }: ProfileErrorStateProps) => {
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Error loading profile</h3>
            <p className="text-gray-500">There was an error loading the profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <User className="h-12 w-12 text-gray-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isPublicView ? 'Profile not found' : 'Please log in'}
          </h3>
          <p className="text-gray-500">
            {isPublicView 
              ? `No user found with username "${username}"`
              : 'Please log in to see your profile.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
