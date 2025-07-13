'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { hasUserProfile } from '@/lib/profile';

// Custom error class for email already in use
export class EmailAlreadyInUseError extends Error {
  public readonly code = 'EMAIL_ALREADY_IN_USE';
  
  constructor(message: string = 'Email already in use') {
    super(message);
    this.name = 'EmailAlreadyInUseError';
  }
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  needsProfile: boolean;
  supabase: SupabaseClient;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  }>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ 
    data: { user: User | null } | null; 
    error: Error | null;
  }>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setNeedsProfile: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // Check if user has a profile
  useEffect(() => {
    let isMounted = true;

    async function checkUserProfile() {
      if (!user?.id || isCheckingProfile) return;

      setIsCheckingProfile(true);
      try {
        // hasUserProfile now safely handles errors internally and returns false on error
        const hasProfile = await hasUserProfile(user.id);
        if (isMounted) {
          setNeedsProfile(!hasProfile);
        }
      } catch (error) {
        // This catch block should rarely be hit now since hasUserProfile handles errors
        console.error('Error checking user profile:', 
          error instanceof Error ? error.message : 'Unknown error');
        // Default to assuming they need a profile if we can't check
        if (isMounted) {
          setNeedsProfile(true);
        }
      } finally {
        if (isMounted) {
          setIsCheckingProfile(false);
        }
      }
    }

    checkUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.id, isCheckingProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log("AuthContext - Starting Try in InitializeAuth!");

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !mounted) {
          setIsLoading(false);
          return;
        }

        // Update initial state
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        // Set up listener for future changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!mounted) return;
            
            const newUser = newSession?.user ?? null;
            setSession(newSession);
            setUser(newUser);
            
            // Reset profile check when user changes
            if (newUser?.id !== user?.id) {
              setNeedsProfile(false);
              setIsCheckingProfile(false);
            }
          }
        );

        // Only set loading to false after everything is initialized
        if (mounted) setIsLoading(false);
        
        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();
  }, [user?.id]);

  const value = {
    user,
    session,
    isLoading,
    needsProfile,
    supabase,
    signInWithGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    },
    signInWithEmail: async (email: string, password: string) => {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;

      // Note: Previously checked for soft-deleted users in users table
      // This functionality has been removed as we no longer use the users table
      
      return authData;
    },
    signOut: async () => {
      try {
        // First cleanup all active connections/states
        window.dispatchEvent(new Event('cleanup-before-logout'));
        
        // Wait a small amount of time for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then perform the actual signout
        await supabase.auth.signOut();
        
        // Force redirect to login
        window.location.assign('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },
    signUpWithEmail: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('[Auth] Sign-up error', error);
        throw error; // propagate failures
      }
      
      // Check if email already exists and is confirmed
      // When email confirmation is enabled, Supabase returns a user object with empty identities array for existing confirmed users
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        console.info('[Auth] Duplicate email detected - user already exists and is confirmed', email);
        throw new EmailAlreadyInUseError('An account with this email already exists. Please sign in instead or use a different email.');
      }
      
      if (data?.user) {
        console.info('[Auth] New user created or pending verification', data.user.id);
      }
      
      // Return both data and error so the calling code can handle specific error cases
      return { data, error };
    },
    updatePassword: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    },
    updateEmail: async (newEmail: string) => {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
    },
    resetPassword: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      });
      if (error) throw error;
    },
    deleteAccount: async () => {
      // Note: Previously deleted user data from users and subscriptions tables
      // This functionality has been simplified to only delete the auth user
      
      if (!user?.id) {
        throw new Error('No user to delete');
      }

      // Delete the user's auth account
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );

      if (authError) throw authError;

      // Sign out after successful deletion
      await supabase.auth.signOut();
    },
    setNeedsProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 