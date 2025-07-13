'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { EmailAlreadyInUseError } from '@/contexts/AuthContext';
import { hasUserProfile } from '@/lib/profile';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Check if we should start in signup mode based on URL parameter
  const initialSignUpMode = searchParams.get('mode') === 'signup';

  useEffect(() => {
    const checkUserAndRedirect = async () => {
    if (user) {
        // Check if user has a profile
        const hasProfile = await hasUserProfile(user.id);
        
        if (!hasProfile) {
          // Redirect to onboarding if no profile
          router.replace(`/onboarding?next=${encodeURIComponent(redirectPath)}`);
        } else {
          // Redirect to dashboard or specified redirect path
          router.replace(redirectPath);
        }
    } else {
      setIsLoading(false);
    }
    };
    
    checkUserAndRedirect();
  }, [user, router, redirectPath]);

  const handleSubmit = async (email: string, password: string, isSignUp: boolean) => {
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data } = await signUpWithEmail(email, password);
        
        // Check if the user needs to verify their email
        if (data?.user && !data.user.email_confirmed_at) {
          router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        
        // Check if user has a profile
        if (data?.user) {
          const hasProfile = await hasUserProfile(data.user.id);
          if (!hasProfile) {
            router.replace(`/onboarding?next=${encodeURIComponent(redirectPath)}`);
            return;
          }
        }
        
        router.replace(redirectPath);
      } else {
        const { user: signedInUser } = await signInWithEmail(email, password);
        
        // Check if user has a profile
        if (signedInUser) {
          const hasProfile = await hasUserProfile(signedInUser.id);
          if (!hasProfile) {
            router.replace(`/onboarding?next=${encodeURIComponent(redirectPath)}`);
            return;
          }
        }
        
        router.replace(redirectPath);
      }
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        setError('An account with this email already exists. Please sign in instead or use a different email.');
      } else {
        setError(error instanceof Error ? error.message : 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex mt-20 justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* <h1 className="text-4xl font-bold text-center mb-8 text-primary dark:text-white">
          NextTemp
        </h1> */}
        <LoginForm
          onSubmit={handleSubmit}
          onGoogleSignIn={signInWithGoogle}
          isLoading={isLoading}
          error={error}
          initialSignUpMode={initialSignUpMode}
        />
      </div>
    </div>
  );
} 