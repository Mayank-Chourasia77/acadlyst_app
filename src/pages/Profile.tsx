
import React, { useEffect } from 'react';
import { UserProfile } from '@/components/UserProfile';
import { useSearchParams, useLocation } from 'react-router-dom';

const Profile = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const username = searchParams.get('username');
  const userId = searchParams.get('userId'); // Add support for userId fallback

  // Update browser history to include profile info
  useEffect(() => {
    if ((username || userId) && window.history.replaceState) {
      const newTitle = username ? `${username}'s Profile` : `User Profile`;
      window.history.replaceState(
        { username, userId, path: location.pathname + location.search },
        newTitle,
        location.pathname + location.search
      );
    }
  }, [username, userId, location]);

  // A unique key forces the UserProfile component to remount when the username/userId changes.
  // This is crucial for correctly displaying different profiles when navigating
  // between a user's own profile and another user's public profile.
  const profileKey = username || userId || 'my_profile';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile key={profileKey} username={username} userId={userId} />
    </div>
  );
};

export default Profile;
