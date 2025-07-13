'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

function VerifyEmailContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // Redirect if user is already verified
  useEffect(() => {
    if (user?.email_confirmed_at) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We sent a verification link to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Please check your email and click the verification link to continue.</p>
            <p className="mt-4">
              Please check your email for the verification link. If you don&apos;t see it, check your spam folder.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-primary-darker hover:text-primary"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailContent />
    </Suspense>
  );
} 