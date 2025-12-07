import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Upload,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { kpis, kpiScores, categories, periods, getMonthName, serviceLines } from '../data/mockData';
import { KPI } from '../types';

interface LayoutContext {
  selectedPeriod: string;
  scoreMode: 'SODEXO' | 'NBCU' | 'AVERAGE';
}

export const ScoreEntry = () => {
  const navigate = useNavigate();
  const { selectedPeriod } = useOutletContext<LayoutContext>();
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [scoreValue, setScoreValue] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const currentPeriod = periods.find(p => p.id === selectedPeriod);

  // Group KPIs by category
  const kpisByCategory = useMemo(() => {
    const grouped: Record<string, KPI[]> = {};
    categories.forEach(cat => {
      grouped[cat.id] = kpis.filter(k => k.categoryId === cat.id);
    });
    return grouped;
  }, []);

  // Get existing score for selected KPI
  const existingScore = useMemo(() => {
    if (!selectedKPI) return null;
    return kpiScores.find(s => s.kpiId === selectedKPI.id && s.periodId === selectedPeriod);
  }, [selectedKPI, selectedPeriod]);

  const handleSave = () => {
    if (selectedKPI && scoreValue) {
      // In real app, this would call API
      setSaved([...saved, selectedKPI.id]);
      setSelectedKPI(null);
      setScoreValue('');
      setNotes('');
    }
  };

  const getKPIStatus = (kpiId: string) => {
    if (saved.includes(kpiId)) return 'saved';
    const score = kpiScores.find(s => s.kpiId === kpiId && s.periodId === selectedPeriod);
    if (score?.numericValue !== undefined) return 'entered';
    return 'pending';
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
          <h1 className="text-2xl font-bold text-slate-800">Score Entry</h1>
          <p className="text-slate-500">
            Enter scores for {currentPeriod ? `${getMonthName(currentPeriod.month)} ${currentPeriod.year}` : 'selected period'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">
            {currentPeriod?.isClosed ? 'Period Closed' : 'Period Open for Entry'}
          </span>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* KPI List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Select KPI</h2>
            <p className="text-sm text-slate-500">Choose a KPI to enter score</p>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {categories.map(category => (
              <div key={category.id}>
                <div
                  className="px-4 py-2 bg-slate-50 border-b border-slate-100 sticky top-0"
                  style={{ borderLeftColor: category.color, borderLeftWidth: 4 }}
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {category.shortName}
                  </span>
                </div>
                
                {kpisByCategory[category.id]?.map(kpi => {
                  const status = getKPIStatus(kpi.id);
                  const isSelected = selectedKPI?.id === kpi.id;
                  
                  return (
                    <button
                      key={kpi.id}
                      onClick={() => {
                        setSelectedKPI(kpi);
                        const existing = kpiScores.find(s => s.kpiId === kpi.id && s.periodId === selectedPeriod);
                        setScoreValue(existing?.actualValue || '');
                        setNotes(existing?.notes || '');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 border-b border-slate-100 transition-colors ${
                        isSelected
                          ? 'bg-amber-50 border-l-4 border-l-amber-500'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-400 w-6">
                          {kpi.kpiNumber}
                        </span>
                        <span className={`text-sm truncate max-w-[180px] ${
                          isSelected ? 'font-medium text-amber-700' : 'text-slate-700'
                        }`}>
                          {kpi.objective}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {status === 'saved' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        {status === 'entered' && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                        {status === 'pending' && (
                          <div className="w-2 h-2 rounded-full bg-slate-300" />
                        )}
                        <ChevronRight className={`w-4 h-4 ${
                          isSelected ? 'text-amber-500' : 'text-slate-300'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Score Entry Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {selectedKPI ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* KPI Header */}
              <div
                className="h-2"
                style={{ backgroundColor: categories.find(c => c.id === selectedKPI.categoryId)?.color }}
              />
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: categories.find(c => c.id === selectedKPI.categoryId)?.color }}
                  >
                    KPI #{selectedKPI.kpiNumber}
                  </span>
                  <span className="text-sm text-slate-400">{selectedKPI.frequency}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 mb-2">{selectedKPI.objective}</h2>
                <p className="text-sm text-slate-500">{selectedKPI.measurementIntent}</p>
              </div>

              {/* Scoring Info */}
              <div className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Data Source</p>
                    <p className="text-sm font-medium text-slate-700">{selectedKPI.dataSource}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Fail Threshold</p>
                    <p className="text-sm font-medium text-red-600">{selectedKPI.failThreshold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Achieve Threshold</p>
                    <p className="text-sm font-medium text-emerald-600">{selectedKPI.achieveThreshold}</p>
                  </div>
                </div>
              </div>

              {/* Entry Form */}
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Score Value *
                  </label>
                  <input
                    type="text"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(e.target.value)}
                    placeholder="Enter score (e.g., 0.95, 4.5, 100%)"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    {selectedKPI.scoringComment || 'Enter the actual measured value'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes / Comments
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or context for this score..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={!scoreValue}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save Score
                  </button>
                  <button className="btn btn-outline">
                    <Upload className="w-4 h-4" />
                    Add Evidence
                  </button>
                  <button
                    onClick={() => navigate(`/kpis/${selectedKPI.id}`)}
                    className="btn btn-outline"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Previous Values */}
              {existingScore && (
                <div className="p-6 border-t border-slate-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Previous Entry</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Value: <strong>{existingScore.actualValue}</strong>
                    {existingScore.notes && ` - ${existingScore.notes}`}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a KPI</h3>
              <p className="text-slate-500">
                Choose a KPI from the list on the left to enter or update its score
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200 p-6"
      >
        <h3 className="font-semibold text-slate-800 mb-4">Entry Progress</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {kpiScores.filter(s => s.periodId === selectedPeriod).length + saved.length}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-sm text-slate-600">Pending</span>
            </div>
            <p className="text-2xl font-bold text-slate-600">
              {kpis.length - kpiScores.filter(s => s.periodId === selectedPeriod).length - saved.length}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{kpis.length}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{
                width: `${((kpiScores.filter(s => s.periodId === selectedPeriod).length + saved.length) / kpis.length) * 100}%`
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

