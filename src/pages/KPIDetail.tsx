import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
  Upload,
  Star,
  Save,
  Plus,
  ExternalLink,
  User,
  Target,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { ScoreRing } from '../components/Dashboard/ScoreRing';
import { kpis, kpiScores, categories, periods, getMonthName, users, serviceLines } from '../data/mockData';

export const KPIDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'comments' | 'client'>('overview');
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [clientScore, setClientScore] = useState(4);
  const [clientJustification, setClientJustification] = useState('');

  const kpi = kpis.find(k => k.id === id);
  const category = categories.find(c => c.id === kpi?.categoryId);
  const serviceLine = serviceLines.find(s => s.id === kpi?.serviceLineId);
  const responsible = users.find(u => u.id === kpi?.responsiblePersonId);
  const scores = kpiScores.filter(s => s.kpiId === id);

  if (!kpi) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <p className="text-xl text-slate-500">KPI not found</p>
        <button onClick={() => navigate('/kpis')} className="btn btn-primary mt-4">
          Back to KPIs
        </button>
      </div>
    );
  }

  const latestScore = scores.sort((a, b) => 
    parseInt(b.periodId.split('-')[1]) - parseInt(a.periodId.split('-')[1])
  )[0];

  const ytdAverage = scores.length > 0
    ? scores.reduce((sum, s) => sum + (s.numericValue || 0), 0) / scores.length
    : 0;

  const getStatus = () => {
    if (!latestScore?.numericValue) return 'PENDING';
    const val = latestScore.numericValue;
    if (val >= 0.95 || val >= 4.5) return 'ACHIEVED';
    if (val >= 0.85 || val >= 4) return 'DEVELOPING';
    return 'IMPROVING';
  };

  const status = getStatus();

  // Mock comments
  const comments = [
    { id: 1, author: 'Account Manager', content: 'Great progress this month. Team exceeded expectations.', date: '2025-08-15', type: 'ACHIEVEMENT' },
    { id: 2, author: 'Technical Manager', content: 'Need to address the pending items from last audit.', date: '2025-08-10', type: 'ACTION_REQUIRED' },
  ];

  // Mock evidence
  const evidence = [
    { id: 1, title: 'August Training Report', type: 'DOCUMENT', fileName: 'training_report_aug.pdf', uploadedBy: 'Account Manager', date: '2025-08-20' },
    { id: 2, title: 'Safety Audit Results', type: 'REPORT', fileName: 'safety_audit_q3.xlsx', uploadedBy: 'Technical Manager', date: '2025-08-18' },
  ];

  const tabs: Array<{ id: 'overview' | 'evidence' | 'comments' | 'client'; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'evidence', label: 'Evidence', icon: FileText, count: evidence.length },
    { id: 'comments', label: 'Comments', icon: MessageSquare, count: comments.length },
    { id: 'client', label: 'Client Scoring', icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to KPIs
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        {/* Color Banner */}
        <div
          className="h-2"
          style={{ backgroundColor: category?.color || '#64748b' }}
        />
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* KPI Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: category?.color || '#64748b' }}
                >
                  {category?.shortName}
                </span>
                <span className="text-sm text-slate-400">KPI #{kpi.kpiNumber}</span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  status === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-700' :
                  status === 'DEVELOPING' ? 'bg-teal-100 text-teal-700' :
                  status === 'IMPROVING' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-500'
                }`}>
                  {status === 'ACHIEVED' && <CheckCircle2 className="w-3 h-3" />}
                  {status === 'IMPROVING' && <TrendingUp className="w-3 h-3" />}
                  {status === 'DEVELOPING' && <AlertCircle className="w-3 h-3" />}
                  {status === 'PENDING' && <Clock className="w-3 h-3" />}
                  {status}
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{kpi.objective}</h1>
              <p className="text-slate-500 mb-4">{kpi.measurementIntent}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Service Line</p>
                  <p className="text-sm font-medium text-slate-700">{serviceLine?.name || 'All Services'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Responsible</p>
                  <p className="text-sm font-medium text-slate-700">{responsible?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Frequency</p>
                  <p className="text-sm font-medium text-slate-700">{kpi.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Weighting</p>
                  <p className="text-sm font-medium text-slate-700">{(kpi.weighting * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <ScoreRing
                score={ytdAverage <= 1 ? ytdAverage * 100 : (ytdAverage / 5) * 100}
                size="lg"
                label="YTD Score"
              />
              <div className="text-center lg:text-right">
                <p className="text-sm text-slate-400">Scoring Criteria</p>
                <p className="text-xs text-slate-500">
                  Fail: {kpi.failThreshold} | Achieve: {kpi.achieveThreshold}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-amber-200 text-amber-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI Definition */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">KPI Definition</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Definition</p>
                  <p className="text-sm text-slate-600">{kpi.definition}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Expected Output</p>
                  <p className="text-sm text-slate-600">{kpi.output}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Data Source</p>
                  <p className="text-sm text-slate-600">{kpi.dataSource}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Calculation</p>
                  <p className="text-sm text-slate-600">{kpi.calculation || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Monthly Scores */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Month</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Value</th>
                      <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Status</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periods.slice(0, 8).map(period => {
                      const score = scores.find(s => s.periodId === period.id);
                      const val = score?.numericValue;
                      const cellStatus = !val ? 'PENDING' : val >= 0.9 || val >= 4 ? 'ACHIEVED' : 'IMPROVING';

                      return (
                        <tr key={period.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-3 px-4">
                            <span className="text-sm font-medium text-stone-700">
                              {getMonthName(period.month)} {period.year}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {val !== undefined ? (
                              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                                cellStatus === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-700' :
                                cellStatus === 'IMPROVING' ? 'bg-amber-100 text-amber-700' :
                                'bg-stone-100 text-stone-500'
                              }`}>
                                {val <= 1 ? `${(val * 100).toFixed(0)}%` : val.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-stone-300">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {cellStatus === 'ACHIEVED' && <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />}
                            {cellStatus === 'IMPROVING' && <TrendingUp className="w-5 h-5 text-amber-500 mx-auto" />}
                            {cellStatus === 'PENDING' && <Clock className="w-5 h-5 text-stone-300 mx-auto" />}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-stone-500">{score?.notes || '—'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'evidence' && (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Evidence & Attachments</h3>
              <button className="btn btn-primary">
                <Upload className="w-4 h-4" />
                Upload Evidence
              </button>
            </div>

            <div className="space-y-3">
              {evidence.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.fileName} • Uploaded by {item.uploadedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">{item.date}</span>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'comments' && (
          <motion.div
            key="comments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Comments & Notes</h3>
              <button onClick={() => setShowAddComment(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Add Comment
              </button>
            </div>

            {showAddComment && (
              <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter your comment..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => setShowAddComment(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    <Save className="w-4 h-4" />
                    Save Comment
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-800">{comment.author}</span>
                      <span className="text-sm text-slate-400">{comment.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        comment.type === 'ACHIEVEMENT' ? 'bg-emerald-100 text-emerald-700' :
                        comment.type === 'ACTION_REQUIRED' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {comment.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'client' && (
          <motion.div
            key="client"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Client Score Entry */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">NBCU Client Score</h3>
              
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-3">Rate this KPI (1-5 stars)</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setClientScore(rating)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= clientScore ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-slate-400 mt-2">Selected: {clientScore} / 5</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Justification / Comments
                </label>
                <textarea
                  value={clientJustification}
                  onChange={(e) => setClientJustification(e.target.value)}
                  placeholder="Provide justification for your score..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  rows={4}
                />
              </div>

              <button className="btn btn-primary w-full">
                <Save className="w-4 h-4" />
                Submit Client Score
              </button>
            </div>

            {/* Score Comparison */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Score Comparison</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Sodexo Score</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {ytdAverage <= 1 ? `${(ytdAverage * 100).toFixed(0)}%` : ytdAverage.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <div>
                    <p className="text-sm font-medium text-purple-700">NBCU Score</p>
                    <p className="text-2xl font-bold text-purple-800">{clientScore} / 5</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div>
                    <p className="text-sm font-medium text-amber-700">Average Score</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {(((ytdAverage <= 1 ? ytdAverage * 5 : ytdAverage) + clientScore) / 2).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

