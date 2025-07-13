import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface ReferralTrackingProps {
  invitedCount: number;
  bonusCount: number;
  score: number;
}

export default function ReferralTracking({ 
  invitedCount = 145, 
  bonusCount = 1445,
  score = 9.3
}: ReferralTrackingProps) {
  // Calculate percentage for the circle (score out of 10)
  const percentage = (score / 10) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg h-full flex flex-col">
      <h3 className="text-white text-lg font-bold mb-1">Referral Tracking</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Background Circle */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
            />
            
            {/* Progress Circle */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="url(#referralGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              transform="rotate(-90 90 90)"
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="referralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-xs text-slate-400">Total score</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-slate-400 text-xs mb-1">Invited</div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-blue-400 mr-2" />
            <span className="text-white font-bold">{invitedCount} people</span>
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-xs mb-1">Bonus</div>
          <div className="text-white font-bold">{bonusCount}</div>
        </div>
      </div>
    </div>
  );
} 