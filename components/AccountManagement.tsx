import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function AccountManagement() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user signed in with OAuth
  const isOAuthUser = user?.app_metadata?.provider === 'google';

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/user/delete?userId=${user.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Account Information</h2>
      
      {/* User Information */}
      <div className="mb-6 space-y-3 text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{user?.email}</p>
            <p className="text-sm text-slate-400">{isOAuthUser ? 'Google Account' : 'Email Account'}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50">
          <p><span className="font-medium text-white">Last Sign In:</span> {new Date(user?.last_sign_in_at || '').toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {!isOAuthUser && (
          <button
            onClick={() => router.push(`/reset-password?email=${encodeURIComponent(user?.email || '')}`)}
            className="block w-full text-left px-4 py-3 bg-slate-800/80 rounded-lg hover:bg-slate-700/80 transition-colors text-white"
          >
            Reset Password
          </button>
        )}
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Delete Account?</h3>
            <p className="text-slate-300 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            {error && (
              <p className="text-red-400 mb-4">{error}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-90 text-white rounded-lg transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 