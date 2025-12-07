import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { KPITable } from '../components/Dashboard/KPITable';
import { kpis, kpiScores, categories, serviceLines, periods, getMonthName } from '../data/mockData';

interface LayoutContext {
  selectedPeriod: string;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
}

export const KPIScorecard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectedPeriod, scoreMode } = useOutletContext<LayoutContext>();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedServiceLine, setSelectedServiceLine] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pass' | 'improving' | 'pending'>('all');

  const currentPeriod = periods.find(p => p.id === selectedPeriod);

  // Filter KPIs
  const filteredKPIs = useMemo(() => {
    return kpis.filter(kpi => {
      // Category filter
      if (selectedCategory !== 'all' && kpi.categoryId !== selectedCategory) {
        return false;
      }

      // Service line filter
      if (selectedServiceLine !== 'all' && kpi.serviceLineId !== selectedServiceLine) {
        return false;
      }

      // Status filter (unified 100% scale: 90%+ is achieved)
      if (selectedStatus !== 'all') {
        const score = kpiScores.find(s => s.kpiId === kpi.id && s.periodId === selectedPeriod);
        const val = score?.numericValue;
        
        if (selectedStatus === 'pending' && val !== undefined) return false;
        if (selectedStatus === 'pass' && (val === undefined || val < 90)) return false;
        if (selectedStatus === 'improving' && (val === undefined || val >= 90)) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedServiceLine, selectedStatus, selectedPeriod]);

  // Calculate summary stats (unified 100% scale: 90%+ is achieved)
  const stats = useMemo(() => {
    let passed = 0, failed = 0, pending = 0;
    
    filteredKPIs.forEach(kpi => {
      const score = kpiScores.find(s => s.kpiId === kpi.id && s.periodId === selectedPeriod);
      const val = score?.numericValue;
      
      if (val === undefined) {
        pending++;
      } else if (val >= 90) {
        passed++;
      } else {
        failed++;
      }
    });

    return { passed, failed, pending, total: filteredKPIs.length };
  }, [filteredKPIs, selectedPeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">KPI Scorecard</h1>
          <p className="text-slate-500">
            {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : ''} - {filteredKPIs.length} KPIs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        <button
          onClick={() => setSelectedStatus('all')}
          className={`p-4 rounded-xl border transition-all ${
            selectedStatus === 'all'
              ? 'border-amber-500 bg-amber-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-sm text-slate-500">Total KPIs</p>
        </button>
        <button
          onClick={() => setSelectedStatus('pass')}
          className={`p-4 rounded-xl border transition-all ${
            selectedStatus === 'pass'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="text-2xl font-bold text-emerald-600">{stats.passed}</p>
          </div>
          <p className="text-sm text-slate-500">Passed</p>
        </button>
        <button
          onClick={() => setSelectedStatus('improving')}
          className={`p-4 rounded-xl border transition-all ${
            selectedStatus === 'improving'
              ? 'border-amber-500 bg-amber-50'
              : 'border-stone-200 bg-white hover:border-stone-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <p className="text-2xl font-bold text-amber-600">{stats.failed}</p>
          </div>
          <p className="text-sm text-stone-500">In Progress</p>
        </button>
        <button
          onClick={() => setSelectedStatus('pending')}
          className={`p-4 rounded-xl border transition-all ${
            selectedStatus === 'pending'
              ? 'border-slate-500 bg-slate-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <p className="text-2xl font-bold text-slate-600">{stats.pending}</p>
          </div>
          <p className="text-sm text-slate-500">Pending</p>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-stone-200 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-w-[180px]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Service Line Filter */}
          <select
            value={selectedServiceLine}
            onChange={(e) => setSelectedServiceLine(e.target.value)}
            className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-w-[180px]"
          >
            <option value="all">All Service Lines</option>
            {serviceLines.map(sl => (
              <option key={sl.id} value={sl.id}>{sl.name}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || selectedServiceLine !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedServiceLine('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {/* KPI Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <KPITable
          kpis={filteredKPIs}
          scores={kpiScores}
          categories={categories}
          onKPIClick={(kpi) => navigate(`/kpis/${kpi.id}`)}
        />
      </motion.div>

      {/* Empty State */}
      {filteredKPIs.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-xl text-stone-500 mb-2">No KPIs found</p>
          <p className="text-stone-400">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

