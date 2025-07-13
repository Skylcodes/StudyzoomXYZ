'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/profile';
import { UserProfile } from '@/types/UserProfile';

/**
 * Hook to fetch and cache the current user's profile
 * @returns Object containing profile data, loading state, and error
 */
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        setProfile(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const profileData = await getUserProfile(user.id);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [user?.id]);

  return {
    profile,
    isLoading,
    error,
  };
} 