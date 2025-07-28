
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, User } from 'lucide-react';

interface ProfileBreadcrumbProps {
  isPublicView: boolean;
  profileName?: string;
  username?: string;
}

export const ProfileBreadcrumb = ({ isPublicView, profileName, username }: ProfileBreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="flex items-center hover:text-gray-700">
        <Home className="h-4 w-4" />
        <span className="ml-1">Home</span>
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="flex items-center">
        <User className="h-4 w-4" />
        <span className="ml-1">
          {isPublicView ? `${profileName || username || 'Profile'}` : 'My Profile'}
        </span>
      </span>
    </nav>
  );
};
