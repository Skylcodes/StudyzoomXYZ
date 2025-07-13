'use client';

/**
 * Debug utilities for development
 */

export function logSupabaseConfig() {
  console.log('🔧 Supabase Configuration Check:');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  
  if (typeof window !== 'undefined') {
    console.log('Running in browser environment');
  } else {
    console.log('Running in server environment');
  }
}

export function debugStorageError(error: any, context: string = 'Storage operation') {
  console.group(`🐛 ${context} Debug Info`);
  console.log('Error object:', error);
  console.log('Error type:', typeof error);
  console.log('Error constructor:', error?.constructor?.name);
  console.log('Error keys:', error && typeof error === 'object' ? Object.keys(error) : 'N/A');
  console.log('Error JSON:', JSON.stringify(error, null, 2));
  
  if (error?.message) {
    console.log('Error message:', error.message);
  }
  
  if (error?.status) {
    console.log('HTTP Status:', error.status);
  }
  
  if (error?.statusText) {
    console.log('Status Text:', error.statusText);
  }
  
  console.groupEnd();
}