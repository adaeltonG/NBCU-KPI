import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  FileText,
  Settings,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Target,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/kpis', icon: ClipboardList, label: 'KPI Scorecard' },
  { path: '/monthly', icon: Calendar, label: 'Monthly View' },
  { path: '/trends', icon: TrendingUp, label: 'Trends & YTD' },
  { path: '/scoring', icon: Target, label: 'Score Entry' },
  { path: '/client', icon: Users, label: 'Client Scoring' },
  { path: '/comments', icon: MessageSquare, label: 'Comments' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-[#400095] text-white flex flex-col z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-slate-900" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-semibold text-lg leading-tight">KPI Report</h1>
              <p className="text-xs text-purple-300">NBCU Scorecard</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-purple-300 hover:bg-purple-800/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-purple-800 border border-purple-700 rounded-full flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-700 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User Section */}
      <div className="p-4 border-t border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-slate-900">AM</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-sm font-medium truncate">Account Manager</p>
              <p className="text-xs text-purple-300 truncate">Sodexo</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

