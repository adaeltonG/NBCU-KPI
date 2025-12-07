import { useState } from 'react';
import { Bell, Search, ChevronDown, Sun, Moon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { periods, getMonthName } from '../../data/mockData';

interface HeaderProps {
  selectedPeriod: string;
  onPeriodChange: (periodId: string) => void;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
  onScoreModeChange: (mode: 'SODEXO' | 'NBCU' | 'AVERAGE') => void;
}

export const Header = ({ selectedPeriod, onPeriodChange, scoreMode, onScoreModeChange }: HeaderProps) => {
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const currentPeriod = periods.find(p => p.id === selectedPeriod);

  const scoreModes = [
    { value: 'SODEXO', label: 'Sodexo Score', color: 'bg-blue-500' },
    { value: 'NBCU', label: 'NBCU Score', color: 'bg-purple-500' },
    { value: 'AVERAGE', label: 'Average Score', color: 'bg-amber-500' },
  ] as const;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search KPIs, categories, comments..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Score Mode Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm hover:bg-slate-100 transition-colors"
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-700">
              {scoreModes.find(m => m.value === scoreMode)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {showModeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[180px] z-50"
              >
                {scoreModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => {
                      onScoreModeChange(mode.value);
                      setShowModeDropdown(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                      scoreMode === mode.value ? 'bg-amber-50 text-amber-600' : 'text-slate-700'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${mode.color}`} />
                    {mode.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium">
              {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : 'Select Period'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showPeriodDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto min-w-[160px] z-50"
              >
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => {
                      onPeriodChange(period.id);
                      setShowPeriodDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                      selectedPeriod === period.id ? 'bg-amber-50 text-amber-600' : 'text-slate-700'
                    }`}
                  >
                    <span>{getMonthName(period.month)} {period.year}</span>
                    {period.isClosed && (
                      <span className="text-xs text-slate-400">Closed</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
          <Bell className="w-5 h-5 text-stone-500" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
};

