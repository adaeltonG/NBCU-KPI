import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Save,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  User,
  Calendar,
  Target,
  TrendingUp,
} from 'lucide-react';
import { kpis, kpiScores, clientScores as mockClientScores, categories, periods, getMonthName } from '../data/mockData';
import { ScoreRing } from '../components/Dashboard/ScoreRing';

interface LayoutContext {
  selectedPeriod: string;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
}

export const ClientScoring = () => {
  const navigate = useNavigate();
  const { selectedPeriod } = useOutletContext<LayoutContext>();
  const [clientScores, setClientScores] = useState<Record<string, { score: number; justification: string }>>({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentPeriod = periods.find(p => p.id === selectedPeriod);

  // Filter KPIs by category
  const filteredKPIs = useMemo(() => {
    if (selectedCategory === 'all') return kpis;
    return kpis.filter(k => k.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Calculate summary
  const summary = useMemo(() => {
    const scores = Object.values(clientScores).filter(s => s.score > 0);
    if (scores.length === 0) return { average: 0, count: 0 };
    const avg = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    return { average: avg, count: scores.length };
  }, [clientScores]);

  const handleScoreChange = (kpiId: string, score: number) => {
    setClientScores(prev => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], score, justification: prev[kpiId]?.justification || '' }
    }));
  };

  const handleJustificationChange = (kpiId: string, justification: string) => {
    setClientScores(prev => ({
      ...prev,
      [kpiId]: { ...prev[kpiId], justification, score: prev[kpiId]?.score || 0 }
    }));
  };

  const getSodexoScore = (kpiId: string): number | undefined => {
    const score = kpiScores.find(s => s.kpiId === kpiId && s.periodId === selectedPeriod);
    return score?.numericValue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Client Scoring</h1>
          <p className="text-slate-500">
            NBCU client scoring for {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : 'selected period'}
          </p>
        </div>
        <button className="btn btn-primary">
          <Save className="w-4 h-4" />
          Submit All Scores
        </button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-200 text-sm">NBCU Average Score</p>
              <p className="text-4xl font-bold">{summary.average.toFixed(1)}</p>
              <p className="text-purple-200 text-sm mt-1">{summary.count} of {kpis.length} scored</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Star className="w-8 h-8" />
            </div>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(summary.count / kpis.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Sodexo Average</p>
              <p className="text-2xl font-bold text-slate-800">
                {(() => {
                  const scores = kpiScores.filter(s => s.periodId === selectedPeriod && s.numericValue);
                  if (scores.length === 0) return 'N/A';
                  const avg = scores.reduce((sum, s) => sum + (s.numericValue || 0), 0) / scores.length;
                  return avg <= 1 ? `${(avg * 100).toFixed(0)}%` : avg.toFixed(2);
                })()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Combined Average</p>
              <p className="text-2xl font-bold text-slate-800">
                {summary.count > 0 ? ((summary.average + 4.2) / 2).toFixed(2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.shortName}
          </button>
        ))}
      </motion.div>

      {/* KPI Scoring Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredKPIs.map((kpi, idx) => {
          const category = categories.find(c => c.id === kpi.categoryId);
          const sodexoScore = getSodexoScore(kpi.id);
          const clientScore = clientScores[kpi.id]?.score || 0;
          const justification = clientScores[kpi.id]?.justification || '';

          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
            >
              {/* Color Bar */}
              <div className="h-1" style={{ backgroundColor: category?.color }} />
              
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* KPI Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                        style={{ backgroundColor: category?.color }}
                      >
                        KPI #{kpi.kpiNumber}
                      </span>
                      <span className="text-sm text-slate-400">{category?.shortName}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{kpi.objective}</h3>
                    <p className="text-sm text-slate-500 mb-4">{kpi.measurementIntent}</p>

                    {/* Sodexo Score Display */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl">
                      <span className="text-sm text-blue-600">Sodexo Score:</span>
                      <span className="font-bold text-blue-800">
                        {sodexoScore !== undefined
                          ? sodexoScore <= 1 ? `${(sodexoScore * 100).toFixed(0)}%` : sodexoScore.toFixed(2)
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Scoring Section */}
                  <div className="lg:w-80 space-y-4">
                    {/* Star Rating */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Your Score</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => handleScoreChange(kpi.id, rating)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= clientScore
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {clientScore > 0 && (
                        <p className="text-sm text-amber-600 mt-1">{clientScore} / 5</p>
                      )}
                    </div>

                    {/* Justification */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Justification
                      </label>
                      <textarea
                        value={justification}
                        onChange={(e) => handleJustificationChange(kpi.id, e.target.value)}
                        placeholder="Add comments to justify your score..."
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        rows={2}
                      />
                    </div>

                    {/* Score Comparison */}
                    {clientScore > 0 && sodexoScore !== undefined && (
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">Score Comparison</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm">Sodexo: {sodexoScore <= 1 ? `${(sodexoScore * 100).toFixed(0)}%` : sodexoScore.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span className="text-sm">NBCU: {clientScore}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-sm font-medium">
                              Avg: {(((sodexoScore <= 1 ? sodexoScore * 5 : sodexoScore) + clientScore) / 2).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

