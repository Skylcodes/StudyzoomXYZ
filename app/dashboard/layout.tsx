'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const AUTH_TIMEOUT = 15000; // 15 seconds

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isLoading: isAuthLoading } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);

  // Handle sidebar collapse toggle
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Set auth timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && isAuthLoading) {
        setAuthTimeout(true);
      }
    }, AUTH_TIMEOUT);
    
    return () => clearTimeout(timer);
  }, [user, isAuthLoading]);

  // Auth loading state
  if (!user && isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-white">
            {authTimeout ? 
              "Taking longer than usual? Try refreshing the page 😊." :
              "Verifying access..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={handleToggleSidebar} 
      />
      
      {/* Main Content */}
      <div 
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {children}
      </div>
    </div>
  );
} 