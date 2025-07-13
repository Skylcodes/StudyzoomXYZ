import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ChevronRight as ArrowRight
} from 'lucide-react';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({ collapsed, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [profileHovered, setProfileHovered] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Library', href: '/dashboard/library', icon: <FileText size={20} /> },
    { name: 'Team', href: '/dashboard/team', icon: <Users size={20} /> },
    { name: 'Analytics', href: '/dashboard/analytics', icon: <BarChart2 size={20} /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  // Handle profile click
  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <motion.div 
      className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out z-10 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      initial={false}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl">🎬</span>
            <span className="ml-2 font-bold text-white">NextTemp</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <span className="text-2xl">🎬</span>
          </Link>
        )}
        <button 
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* New Blueprint Button */}
        <div className="mt-8 px-3">
          <button 
            className={`w-full flex items-center justify-center py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity ${
              collapsed ? 'px-2' : 'px-4'
            }`}
          >
            <PlusCircle size={collapsed ? 20 : 16} />
            {!collapsed && <span className="ml-2">New Blueprint</span>}
          </button>
        </div>
      </div>

      {/* User Profile - Now clickable with visual indicator and animation */}
      <motion.button 
        onClick={handleProfileClick}
        onMouseEnter={() => setProfileHovered(true)}
        onMouseLeave={() => setProfileHovered(false)}
        className="p-4 border-t border-slate-800 w-full text-left hover:bg-slate-900 transition-colors group"
        aria-label="Go to profile page"
        title="Go to profile page"
        whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.7)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white"
              animate={{ scale: profileHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {user?.email?.[0].toUpperCase()}
            </motion.div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                <p className="text-xs text-slate-400 truncate">Account Settings</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <motion.div
              animate={{ x: profileHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
            </motion.div>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
} 