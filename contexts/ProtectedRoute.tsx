'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';

// List of public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',  // Add landing page
  '/login', 
  '/signup', 
  '/verify-email', 
  '/reset-password', 
  '/update-password',
  '/onboarding'  // Add onboarding to public routes
];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, needsProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Redirect to login if not authenticated and not on a public route
    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      window.location.assign(redirectUrl);
      return;
    }

    // Redirect to onboarding if authenticated but needs profile
    // Only redirect if not already on onboarding page
    if (user && needsProfile && pathname !== '/onboarding') {
      const redirectUrl = `/onboarding?next=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [user, isLoading, needsProfile, pathname, router]);

  // Show loading state only if actually loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-4 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <div>Loading at lightspeed ⚡️</div>
      </div>
    );
  }

  // Only render children if we're on a public route or user is authenticated
  if (PUBLIC_ROUTES.includes(pathname) || user) {
    return <>{children}</>;
  }

  return null;
} 