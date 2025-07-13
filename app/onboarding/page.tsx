'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createUserProfile } from '@/lib/profile';

export default function OnboardingPage() {
  const { user, setNeedsProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!user?.id || !user?.email) {
      setError('User information is missing. Please try logging in again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create user profile
      const profile = await createUserProfile({
        id: user.id,
        email: user.email,
        name: name.trim(),
        phone: phone.trim() || null,
        role: 'free'
      });

      if (profile) {
        // Update context to indicate profile is complete
        setNeedsProfile(false);
        
        // Redirect to the next page
        router.replace(nextPath);
      } else {
        throw new Error('Failed to create profile');
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setError('Failed to create your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
          <p className="mt-2 text-slate-300">
            Please provide the following information to complete your account setup.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-slate-500 text-white bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                Phone Number <span className="text-slate-500">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-700 placeholder-slate-500 text-white bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your phone number"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
} 