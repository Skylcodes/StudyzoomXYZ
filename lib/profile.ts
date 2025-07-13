'use client';

import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { UserProfile } from '@/types/UserProfile';

// Use admin client to bypass RLS policies temporarily
const adminClient = getSupabaseAdmin();

/**
 * Check if a user profile exists
 * @param userId User ID to check
 * @returns Boolean indicating if profile exists
 */
export async function hasUserProfile(userId: string): Promise<boolean> {
  if (!userId) {
    console.log('hasUserProfile: No userId provided');
    return false;
  }

  try {
    // Use admin client to bypass RLS policies
    const { data, error } = await adminClient
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (error) {
      // If error is not a 'not found' error, log it
      if (error.code !== 'PGRST116') {
        console.error('Error checking user profile:', error.message || error.code || 'Unknown error');
      }
      return false;
    }

    return !!data;
  } catch (err) {
    console.error('Error in hasUserProfile:', err instanceof Error ? err.message : 'Unknown error');
    return false; // Return false instead of throwing to prevent UI errors
  }
}

/**
 * Get a user profile by ID
 * @param userId User ID to fetch
 * @returns UserProfile object or null if not found
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    // Use admin client to bypass RLS policies
    const { data, error } = await adminClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If error is not a 'not found' error, log it
      if (error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      }
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    return null; // Return null instead of throwing to prevent UI errors
  }
}

/**
 * Create a new user profile
 * @param profile UserProfile object to create
 * @returns Created UserProfile or null if creation failed
 */
export async function createUserProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
  try {
    // Use admin client to bypass RLS policies
    const { data, error } = await adminClient
      .from('users')
      .insert([profile])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Error in createUserProfile:', err);
    return null; // Return null instead of throwing to prevent UI errors
  }
}

/**
 * Update an existing user profile
 * @param userId User ID to update
 * @param updates Partial UserProfile with fields to update
 * @returns Updated UserProfile or null if update failed
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at'>>
): Promise<UserProfile | null> {
  try {
    // Use admin client to bypass RLS policies
    const { data, error } = await adminClient
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    return null; // Return null instead of throwing to prevent UI errors
  }
}

/**
 * Admin function to update a user's role
 * @param userId The user's ID
 * @param role The new role
 * @returns True if successful, false otherwise
 */
export async function updateUserRole(userId: string, role: 'free' | 'paid' | 'admin'): Promise<boolean> {
  try {
    // Already using admin client for this operation
    const { error } = await adminClient
      .from('users')
      .update({ role })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateUserRole:', err);
    return false; // Return false instead of throwing to prevent UI errors
  }
} 