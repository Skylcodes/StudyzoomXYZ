import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-800/50 shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-800/50 rounded-lg text-blue-400">
          {icon}
        </div>
        <div className={`flex items-center ${
          trend === 'up' ? 'text-emerald-500' : 
          trend === 'down' ? 'text-rose-500' : 'text-slate-400'
        }`}>
          <span className="text-sm font-medium">{change}</span>
          {trend === 'up' && <TrendingUp size={16} className="ml-1" />}
          {trend === 'down' && <TrendingDown size={16} className="ml-1" />}
        </div>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  );
} 