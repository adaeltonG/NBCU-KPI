import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('period-8'); // August 2025
  const [scoreMode, setScoreMode] = useState<'SODEXO' | 'NBCU' | 'AVERAGE'>('SODEXO');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        <Header
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          scoreMode={scoreMode}
          onScoreModeChange={setScoreMode}
        />
        
        <div className="p-6">
          <Outlet context={{ selectedPeriod, setSelectedPeriod, scoreMode, setScoreMode }} />
        </div>
      </motion.main>
    </div>
  );
};

