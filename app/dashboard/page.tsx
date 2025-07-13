"use client";

import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Bell
} from 'lucide-react';

// Import dashboard components
import MetricCard from '@/components/dashboard/MetricCard';
import SalesOverviewChart from '@/components/dashboard/SalesOverviewChart';
import ActiveUsers from '@/components/dashboard/ActiveUsers';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import CircularProgress from '@/components/dashboard/CircularProgress';
import ReferralTracking from '@/components/dashboard/ReferralTracking';

export default function DashboardPage() {
  const [authTimeout] = useState(false);

  // Mock data for dashboard metrics
  const metrics = [
    {
      title: "Today's Users",
      value: "2,350",
      change: "+180.1%",
      icon: <Users className="h-6 w-6" />,
      trend: "up" as const,
      color: "blue"
    },
    {
      title: "Conversions",
      value: "12,234",
      change: "+19%",
      icon: <Users className="h-6 w-6" />,
      trend: "up" as const,
      color: "green"
    },
    {
      title: "Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: <DollarSign className="h-6 w-6" />,
      trend: "up" as const,
      color: "green"
    },
    {
      title: "Active Now",
      value: "573",
      change: "+201",
      icon: <Activity className="h-6 w-6" />,
      trend: "up" as const,
      color: "purple"
    }
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, action: "New user registered", time: "2 minutes ago", icon: <Users className="h-4 w-4" /> },
    { id: 2, action: "Payment received", time: "5 minutes ago", icon: <DollarSign className="h-4 w-4" /> },
    { id: 3, action: "Server maintenance completed", time: "1 hour ago", icon: <Activity className="h-4 w-4" /> },
    { id: 4, action: "New feature deployed", time: "3 hours ago", icon: <ArrowUpRight className="h-4 w-4" /> },
    { id: 5, action: "Database backup completed", time: "6 hours ago", icon: <ArrowDownRight className="h-4 w-4" /> }
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      {/* Welcome Card */}
      <WelcomeCard />
      
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <SalesOverviewChart />
        </div>
        <div className="col-span-3">
          <ReferralTracking 
            invitedCount={145} 
            bonusCount={1445} 
            score={9.3} 
          />
        </div>
      </div>

      {/* Progress and Activities */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <CircularProgress 
            title="Satisfaction Rate" 
            subtitle="From all projects" 
            percentage={95} 
          />
        </div>
        
        {/* Recent Activities */}
        <div className="col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-bold">Recent Activity</h3>
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-blue-400">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.action}</p>
                    <p className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Users - Full width */}
      <div className="grid gap-4">
        <div className="col-span-full">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <ActiveUsers />
          </div>
        </div>
      </div>

      {authTimeout && (
        <div className="text-center text-white">
          Taking longer than usual? Try refreshing the page 😊.
        </div>
      )}
    </div>
  );
}