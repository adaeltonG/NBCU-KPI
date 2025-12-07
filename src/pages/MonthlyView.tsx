import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { ScoreRing } from '../components/Dashboard/ScoreRing';
import { kpis, kpiScores, categories, periods, getMonthName } from '../data/mockData';

interface LayoutContext {
  selectedPeriod: string;
  setSelectedPeriod: (id: string) => void;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
}

export const MonthlyView = () => {
  const navigate = useNavigate();
  const { selectedPeriod, setSelectedPeriod } = useOutletContext<LayoutContext>();

  const currentPeriod = periods.find(p => p.id === selectedPeriod);
  const currentIndex = periods.findIndex(p => p.id === selectedPeriod);

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < periods.length) {
      setSelectedPeriod(periods[newIndex].id);
    }
  };

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const periodScores = kpiScores.filter(s => s.periodId === selectedPeriod);
    let passed = 0, failed = 0;
    
    periodScores.forEach(s => {
      const val = s.numericValue;
      if (val !== undefined) {
        if (val >= 0.9 || val >= 4) passed++;
        else failed++;
      }
    });

    const pending = kpis.length - periodScores.length;
    const avgScore = periodScores.length > 0
      ? periodScores.reduce((sum, s) => {
          const val = s.numericValue || 0;
          return sum + (val <= 1 ? val : val / 5);
        }, 0) / periodScores.length
      : 0;

    // Compare with previous month
    const prevPeriodId = currentIndex > 0 ? periods[currentIndex - 1].id : null;
    let trend = 0;
    if (prevPeriodId) {
      const prevScores = kpiScores.filter(s => s.periodId === prevPeriodId);
      const prevAvg = prevScores.length > 0
        ? prevScores.reduce((sum, s) => {
            const val = s.numericValue || 0;
            return sum + (val <= 1 ? val : val / 5);
          }, 0) / prevScores.length
        : 0;
      trend = ((avgScore - prevAvg) / prevAvg) * 100;
    }

    return { passed, failed, pending, avgScore: avgScore * 100, trend };
  }, [selectedPeriod, currentIndex]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const catKPIs = kpis.filter(k => k.categoryId === cat.id);
      const catScores = kpiScores.filter(
        s => catKPIs.some(k => k.id === s.kpiId) && s.periodId === selectedPeriod
      );
      
      let passed = 0, failed = 0;
      catScores.forEach(s => {
        const val = s.numericValue;
        if (val !== undefined) {
          if (val >= 0.9 || val >= 4) passed++;
          else failed++;
        }
      });

      const avgScore = catScores.length > 0
        ? catScores.reduce((sum, s) => {
            const val = s.numericValue || 0;
            return sum + (val <= 1 ? val : val / 5);
          }, 0) / catScores.length
        : 0;

      return {
        category: cat,
        kpiCount: catKPIs.length,
        scored: catScores.length,
        passed,
        failed,
        avgScore: avgScore * 100,
      };
    });
  }, [selectedPeriod]);

  // KPI details for this month
  const kpiDetails = useMemo(() => {
    return kpis.map(kpi => {
      const score = kpiScores.find(s => s.kpiId === kpi.id && s.periodId === selectedPeriod);
      const category = categories.find(c => c.id === kpi.categoryId);
      
      // Get previous month score for trend
      const prevPeriodId = currentIndex > 0 ? periods[currentIndex - 1].id : null;
      const prevScore = prevPeriodId
        ? kpiScores.find(s => s.kpiId === kpi.id && s.periodId === prevPeriodId)
        : null;

      let trend: 'up' | 'down' | 'same' | 'new' = 'new';
      if (score?.numericValue !== undefined && prevScore?.numericValue !== undefined) {
        if (score.numericValue > prevScore.numericValue) trend = 'up';
        else if (score.numericValue < prevScore.numericValue) trend = 'down';
        else trend = 'same';
      }

      return {
        kpi,
        category,
        score: score?.numericValue,
        actualValue: score?.actualValue,
        status: !score?.numericValue ? 'pending' : 
                (score.numericValue >= 0.9 || score.numericValue >= 4) ? 'pass' : 'fail',
        trend,
      };
    });
  }, [selectedPeriod, currentIndex]);

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' | 'new' }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-amber-500" />;
    if (trend === 'same') return <Minus className="w-4 h-4 text-stone-400" />;
    return <span className="text-xs text-stone-400">New</span>;
  };

  return (
    <div className="space-y-6">
      {/* Month Navigator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-stone-200 p-6"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigatePeriod('prev')}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl erer:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-stone-600" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-orange-500" />
              <h1 className="text-3xl font-bold text-stone-800">
                {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : ''}
              </h1>
            </div>
            <p className="text-stone-500">
              Q{currentPeriod?.quarter} • {currentPeriod?.isClosed ? 'Closed' : 'Open for Entry'}
            </p>
          </div>

          <button
            onClick={() => navigatePeriod('next')}
            disabled={currentIndex === periods.length - 1}
            className="p-2 rounded-xl hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-stone-600" />
          </button>
        </div>
      </motion.div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 rounded-2xl p-6 text-white col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Overall Score</p>
              <p className="text-4xl font-bold">{monthlyStats.avgScore.toFixed(0)}%</p>
              {monthlyStats.trend !== 0 && (
                <div className={`flex items-center gap-1 mt-2 ${
                  monthlyStats.trend > 0 ? 'text-teal-300' : 'text-amber-400'
                }`}>
                  {monthlyStats.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm">{monthlyStats.trend > 0 ? '+' : ''}{monthlyStats.trend.toFixed(1)}%</span>
                </div>
              )}
            </div>
            <ScoreRing score={monthlyStats.avgScore} size="md" showLabel={false} darkBackground />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-stone-500">Passed</span>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{monthlyStats.passed}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-stone-500">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{monthlyStats.failed}</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <span className="text-sm text-stone-500">Pending</span>
          </div>
          <p className="text-3xl font-bold text-stone-600">{monthlyStats.pending}</p>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-stone-200 p-6"
      >
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Category Performance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map(stat => (
            <div
              key={stat.category.id}
              className="p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
              style={{ borderLeftColor: stat.category.color, borderLeftWidth: 4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-stone-700">{stat.category.shortName}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.avgScore >= 90 ? 'bg-emerald-100 text-emerald-700' :
                  stat.avgScore >= 70 ? 'bg-teal-100 text-teal-700' :
                  stat.avgScore > 0 ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {stat.avgScore.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="text-emerald-500">{stat.passed} pass</span>
                <span className="text-amber-500">{stat.failed} in progress</span>
                <span>{stat.kpiCount - stat.scored} pending</span>
              </div>
              <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${stat.avgScore}%`, backgroundColor: stat.category.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPI List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
      >
        <div className="p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">KPI Details</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {kpiDetails.map(item => (
            <button
              key={item.kpi.id}
              onClick={() => navigate(`/kpis/${item.kpi.id}`)}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: item.category?.color }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-400">#{item.kpi.kpiNumber}</span>
                    <span className="text-sm font-semibold text-stone-800">{item.kpi.objective}</span>
                  </div>
                  <p className="text-xs text-stone-500">{item.category?.shortName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TrendIcon trend={item.trend} />
                {item.actualValue ? (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    item.status === 'pass' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'fail' ? 'bg-amber-100 text-amber-700' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {item.score !== undefined && item.score <= 1 
                      ? `${(item.score * 100).toFixed(0)}%`
                      : item.actualValue}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-400">
                    Pending
                  </span>
                )}
                {item.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {item.status === 'fail' && <Target className="w-5 h-5 text-amber-500" />}
                {item.status === 'pending' && <Clock className="w-5 h-5 text-stone-300" />}
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

