/**
 * Represents a user profile in the system
 */
export interface UserProfile {
  /**
   * User ID (matches Supabase Auth user ID)
   */
  id: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * User's full name
   */
  name: string;
  
  /**
   * User's phone number (optional)
   */
  phone: string | null;
  
  /**
   * User's role in the system
   * - free: Free tier user
   * - paid: Paid subscription user
   * - admin: Administrator with elevated permissions
   */
  role: 'free' | 'paid' | 'admin';
  
  /**
   * Timestamp when the profile was created
   */
  created_at?: string;
  
  /**
   * Timestamp when the profile was last updated
   */
  updated_at?: string;
} 