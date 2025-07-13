import React from 'react';
import { motion } from 'framer-motion';

export default function SalesOverviewChart() {
  // Mock data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800/50 shadow-lg h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-bold">Sales overview</h3>
          <p className="text-slate-400 text-sm">(+39) more in 2023</p>
        </div>
      </div>
      
      {/* Chart SVG */}
      <div className="min-h-[400px] relative">
        <svg width="100%" height="300" viewBox="0 0 800 300" preserveAspectRatio="none">
          {/* Grid Lines */}
          <g className="grid-lines">
            {[0, 1, 2, 3, 4].map((i) => (
              <line 
                key={i}
                x1="0" 
                y1={i * 60} 
                x2="800" 
                y2={i * 60} 
                stroke="#334155" 
                strokeWidth="1" 
                strokeDasharray="5,5" 
              />
            ))}
          </g>
          
          {/* Area Chart */}
          <motion.path
            d="M0,240 C50,180 100,220 150,200 C200,180 250,100 300,120 C350,140 400,60 450,40 C500,20 550,80 600,60 C650,40 700,100 750,80 L750,240 L0,240 Z"
            fill="url(#areaGradient)"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Data Points */}
          {[
            { x: 0, y: 240 },
            { x: 75, y: 200 },
            { x: 150, y: 200 },
            { x: 225, y: 120 },
            { x: 300, y: 120 },
            { x: 375, y: 40 },
            { x: 450, y: 40 },
            { x: 525, y: 60 },
            { x: 600, y: 60 },
            { x: 675, y: 80 },
            { x: 750, y: 80 }
          ].map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            />
          ))}
          
          {/* Gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Month Labels */}
        <div className="flex justify-between mt-2 px-2 text-xs text-slate-400">
          {months.map((month) => (
            <div key={month}>{month}</div>
          ))}
        </div>
      </div>
    </div>
  );
} 