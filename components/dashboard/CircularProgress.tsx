import React from 'react';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';

interface CircularProgressProps {
  title: string;
  subtitle: string;
  percentage: number;
  icon?: React.ReactNode;
}

export default function CircularProgress({ 
  title, 
  subtitle, 
  percentage, 
  icon = <Smile className="h-6 w-6" />
}: CircularProgressProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg h-full flex flex-col">
      <h3 className="text-white text-lg font-bold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm mb-4">{subtitle}</p>
      
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
              stroke="url(#circleGradient)"
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
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-blue-400 mb-1">
              {icon}
            </div>
            <div className="text-white text-3xl font-bold">{percentage}%</div>
            <div className="text-xs text-slate-400">based on profiles</div>
          </div>
        </div>
      </div>
      
      {/* Scale indicators */}
      <div className="flex justify-between mt-4 text-xs text-slate-400">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
} 