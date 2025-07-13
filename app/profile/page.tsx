'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AccountManagement } from '@/components/AccountManagement';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useUserProfile } from '@/hooks/useUserProfile';

function ProfileContent() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  // Add useEffect for auth check
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-red-500">
          Failed to load profile details. Please try refreshing.
        </div>
      }
    >
      <div className="min-h-screen bg-slate-950 p-8 max-w-4xl mx-auto">
        {paymentStatus === 'success' && (
          <div className="mb-8 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
            <p className="text-green-400">
              🎉 Thank you for your payment! Your payment was successful.
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-8 text-white">Profile</h1>
        
        <AccountManagement />

        {/* User Profile Information */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
          
          {profileLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : profileError ? (
            <div className="p-4 text-red-400 bg-red-900/20 rounded-lg">
              Failed to load profile information. Please try again.
            </div>
          ) : profile ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Name</span>
                <span className="text-white font-medium">{profile.name}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Email</span>
                <span className="text-white">{profile.email}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Phone</span>
                <span className="text-white">{profile.phone || 'Not provided'}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-slate-400">Membership</span>
                <div className="flex items-center">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    profile.role === 'paid' 
                      ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                      : profile.role === 'admin'
                      ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                  }`}>
                    {profile.role === 'paid' 
                      ? 'Premium' 
                      : profile.role === 'admin' 
                      ? 'Admin' 
                      : 'Free'}
                  </span>
                  
                  {profile.role === 'free' && (
                  <Link
                    href="/pay"
                      className="ml-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                      Upgrade to Premium
                  </Link>
                  )}
                </div>
                  </div>
              
              <div className="flex flex-col space-y-1 pt-2 border-t border-slate-700/50">
                <span className="text-sm text-slate-400">Member since</span>
                <span className="text-slate-300">
                  {profile.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : 'Unknown'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-yellow-400 bg-yellow-900/20 rounded-lg">
              Profile information not found. Please complete your profile setup.
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg mt-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Need Help?</h2>
          <p className="text-slate-300 mb-4">
            If you have any questions or need assistance with your account, our support team is here to help.
          </p>
                  <Link
            href="/contact"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all"
                  >
            Contact Support
                  </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Wrap with Suspense for loading state
export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileContent />
    </Suspense>
  );
}
