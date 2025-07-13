import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeCard() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'User';
  // Capitalize the first letter of the first name
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg overflow-hidden relative h-full">
      <div className="flex flex-col h-full">
        <h2 className="text-white text-lg font-medium mb-1">Welcome back,</h2>
        <h1 className="text-white text-2xl font-bold mb-2">{displayName}</h1>
        <p className="text-slate-400 text-sm mb-4">Glad to see you again!</p>
        <p className="text-slate-400 text-sm">Ask me anything.</p>
        
        {/* Jellyfish/Brain Visualization */}
        <div className="mt-4 flex-1 flex items-center justify-center">
          <div className="relative w-full h-40 md:h-48">
            <Image
              src="/jellyfish.jpg"
              alt="Brain visualization"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
        
        {/* Stats at bottom */}
        <div className="flex justify-between mt-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-sm text-slate-400">Tap to record</p>
            <div className="flex items-center justify-center mt-1">
              <span className="text-white">⏺</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 