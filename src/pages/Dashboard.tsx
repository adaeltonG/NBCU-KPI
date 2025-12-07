import { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { StatCard } from '../components/Dashboard/StatCard';
import { CategoryCard } from '../components/Dashboard/CategoryCard';
import { ScoreRing } from '../components/Dashboard/ScoreRing';
import { TrendChart } from '../components/Dashboard/TrendChart';
import { CategoryBreakdown } from '../components/Dashboard/CategoryBreakdown';
import { ActionsWidget } from '../components/Dashboard/ActionsWidget';
import { KPITable } from '../components/Dashboard/KPITable';
import { categories, kpis, kpiScores, actions, periods, getMonthName } from '../data/mockData';

interface LayoutContext {
  selectedPeriod: string;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { selectedPeriod, scoreMode: _scoreMode } = useOutletContext<LayoutContext>();
  
  const currentPeriod = periods.find(p => p.id === selectedPeriod);

  // Calculate overall stats
  const stats = useMemo(() => {
    const periodScores = kpiScores.filter(s => s.periodId === selectedPeriod);
    const totalKPIs = kpis.length;
    const scoredKPIs = periodScores.length;
    
    // Calculate pass/fail based on thresholds
    let passed = 0;
    let failed = 0;
    
    periodScores.forEach(score => {
      if (score.numericValue !== undefined) {
        // Simple pass/fail logic - can be enhanced
        if (score.numericValue >= 0.9 || score.numericValue >= 4) {
          passed++;
        } else {
          failed++;
        }
      }
    });

    const pending = totalKPIs - scoredKPIs;
    const avgScore = scoredKPIs > 0
      ? periodScores.reduce((sum, s) => sum + (s.numericValue || 0), 0) / scoredKPIs
      : 0;
    
    // Normalize score to percentage
    const overallPercentage = avgScore <= 1 ? avgScore * 100 : (avgScore / 5) * 100;

    return {
      totalKPIs,
      passed,
      failed,
      pending,
      overallScore: avgScore,
      overallPercentage: Math.min(overallPercentage, 100),
    };
  }, [selectedPeriod]);

  // Calculate category scores
  const categoryScores = useMemo(() => {
    const scores: Record<string, number> = {};
    
    categories.forEach(cat => {
      const catKPIs = kpis.filter(k => k.categoryId === cat.id);
      const catScores = kpiScores.filter(
        s => catKPIs.some(k => k.id === s.kpiId) && s.numericValue !== undefined
      );
      
      if (catScores.length > 0) {
        const avg = catScores.reduce((sum, s) => sum + (s.numericValue || 0), 0) / catScores.length;
        scores[cat.id] = avg <= 1 ? avg * 100 : (avg / 5) * 100;
      } else {
        scores[cat.id] = 0;
      }
    });

    return scores;
  }, []);

  // Generate trend data
  const trendData = useMemo(() => {
    return periods.slice(0, 8).map(period => {
      const periodKpiScores = kpiScores.filter(s => s.periodId === period.id);
      const avgSodexo = periodKpiScores.length > 0
        ? periodKpiScores.reduce((sum, s) => {
            const val = s.numericValue || 0;
            return sum + (val <= 1 ? val : val / 5);
          }, 0) / periodKpiScores.length
        : 0;
      
      return {
        month: period.month,
        sodexoScore: avgSodexo,
        clientScore: avgSodexo * (0.9 + Math.random() * 0.15), // Simulated client score
        averageScore: avgSodexo * (0.95 + Math.random() * 0.1),
      };
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            KPI Dashboard
          </h1>
          <p className="text-stone-500">
            {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : 'Select a period'} Performance Overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <Calendar className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn btn-primary">
            <TrendingUp className="w-4 h-4" />
            View Full Report
          </button>
        </div>
      </motion.div>

      {/* Overall Score Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-8 text-white overflow-hidden relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreRing
              score={stats.overallPercentage}
              size="xl"
              label="Overall"
              color="#f97316"
              darkBackground
            />
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : ''} Performance
            </h2>
            <p className="text-emerald-200 text-lg mb-6">
              {stats.passed} of {stats.totalKPIs} KPIs achieved target
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-teal-300 mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-2xl font-bold">{stats.passed}</span>
                </div>
                <p className="text-sm text-emerald-300">Passed</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-400 mb-1">
                  <Target className="w-5 h-5" />
                  <span className="text-2xl font-bold">{stats.failed}</span>
                </div>
                <p className="text-sm text-emerald-300">In Progress</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-300 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">{stats.pending}</span>
                </div>
                <p className="text-sm text-emerald-300">Pending</p>
              </div>
            </div>
          </div>

          <div className="hidden xl:block flex-shrink-0 border-l border-emerald-700 pl-8">
            <p className="text-sm text-emerald-300 mb-2">Score Display Mode</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm">Sodexo: {(stats.overallPercentage).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-600" />
                <span className="text-sm">NBCU: {(stats.overallPercentage * 0.95).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Average: {(stats.overallPercentage * 0.975).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total KPIs"
          value={stats.totalKPIs}
          subtitle="Active metrics"
          icon={Target}
          color="#f97316"
          delay={0.1}
        />
        <StatCard
          title="Achieved"
          value={stats.passed}
          subtitle={`${((stats.passed / stats.totalKPIs) * 100).toFixed(0)}% of total`}
          icon={CheckCircle2}
          trend={5}
          trendLabel="vs last month"
          color="#059669"
          delay={0.15}
        />
        <StatCard
          title="In Progress"
          value={stats.failed}
          subtitle="Improving"
          icon={TrendingUp}
          trend={2}
          trendLabel="vs last month"
          color="#f59e0b"
          delay={0.2}
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          subtitle="Awaiting data"
          icon={Clock}
          color="#78716c"
          delay={0.25}
        />
      </div>

      {/* Category Cards */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Category Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, idx) => {
            const catKPIs = kpis.filter(k => k.categoryId === category.id);
            const catScoresFiltered = kpiScores.filter(
              s => catKPIs.some(k => k.id === s.kpiId) && s.numericValue !== undefined
            );
            const passed = catScoresFiltered.filter(s => (s.numericValue || 0) >= 0.9 || (s.numericValue || 0) >= 4).length;

            return (
              <CategoryCard
                key={category.id}
                category={category}
                score={categoryScores[category.id] || 0}
                kpiCount={catKPIs.length}
                passedCount={passed}
                onClick={() => navigate(`/kpis?category=${category.id}`)}
                delay={0.1 + idx * 0.05}
              />
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={trendData} height={280} />
        <CategoryBreakdown categories={categories} scores={categoryScores} height={280} />
      </div>

      {/* Actions Widget */}
      <ActionsWidget actions={actions} onViewAll={() => navigate('/actions')} />

      {/* KPI Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">KPI Scorecard</h2>
          <button
            onClick={() => navigate('/kpis')}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            View Full Scorecard →
          </button>
        </div>
        <KPITable
          kpis={kpis}
          scores={kpiScores}
          categories={categories}
          onKPIClick={(kpi) => navigate(`/kpis/${kpi.id}`)}
        />
      </div>
    </div>
  );
};

