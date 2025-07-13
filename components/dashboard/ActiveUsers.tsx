import React from 'react';
import { motion } from 'framer-motion';
import { Users, MousePointerClick, BarChart, Package } from 'lucide-react';

export default function ActiveUsers() {
  // Mock data for the active users
  const stats = [
    { label: 'Users', value: '32,984', icon: <Users size={16} /> },
    { label: 'Clicks', value: '2.42m', icon: <MousePointerClick size={16} /> },
    { label: 'Sales', value: '2,400$', icon: <BarChart size={16} /> },
    { label: 'Items', value: '320', icon: <Package size={16} /> }
  ];
  
  // Mock data for the bar chart
  const barData = [400, 300, 100, 320, 220, 400, 350, 400, 300, 200];
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Active Users</h3>
          <p className="text-slate-400 text-sm">(+23) than last week</p>
        </div>
      </div>
      
      {/* Bar Chart */}
      <div className="flex items-end justify-between h-48 mb-8">
        {barData.map((value, index) => (
          <motion.div
            key={index}
            className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md"
            style={{ height: `${value / 4}px` }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `${value / 4}px`, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          />
        ))}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 mb-2">
              <div className="text-blue-400">{stat.icon}</div>
            </div>
            <div className="text-white font-bold text-xl">{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 