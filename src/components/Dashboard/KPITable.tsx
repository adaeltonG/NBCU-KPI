import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { KPI, KPIScore, Category } from '../../types';
import { getMonthName } from '../../data/mockData';

interface KPITableProps {
  kpis: KPI[];
  scores: KPIScore[];
  categories: Category[];
  onKPIClick?: (kpi: KPI) => void;
}

// Positive status indicators
const StatusIcon = ({ status }: { status: 'ACHIEVED' | 'PROGRESSING' | 'PENDING' | 'DEVELOPING' }) => {
  switch (status) {
    case 'ACHIEVED':
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    case 'PROGRESSING':
      return <TrendingUp className="w-5 h-5 text-amber-500" />;
    case 'DEVELOPING':
      return <Sparkles className="w-5 h-5 text-teal-500" />;
    default:
      return <Clock className="w-5 h-5 text-stone-400" />;
  }
};

const getStatus = (score: number | undefined): 'ACHIEVED' | 'PROGRESSING' | 'PENDING' | 'DEVELOPING' => {
  if (score === undefined || score === null) return 'PENDING';
  if (score >= 0.95 || score >= 4.5) return 'ACHIEVED';
  if (score >= 0.85 || score >= 4) return 'DEVELOPING';
  return 'PROGRESSING';
};

export const KPITable = ({ kpis, scores, categories, onKPIClick }: KPITableProps) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const getKPIScoreForMonth = (kpiId: string, month: number): KPIScore | undefined => {
    return scores.find(s => s.kpiId === kpiId && s.periodId === `period-${month}`);
  };

  const getCategoryColor = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.color || '#78716c';
  };

  const calculateYTD = (kpiId: string): { value: number; count: number } => {
    const kpiScores = scores.filter(s => s.kpiId === kpiId && s.numericValue !== undefined);
    if (kpiScores.length === 0) return { value: 0, count: 0 };
    const sum = kpiScores.reduce((acc, s) => acc + (s.numericValue || 0), 0);
    return { value: sum / kpiScores.length, count: kpiScores.length };
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-950 text-white">
              <th className="sticky left-0 bg-indigo-950 z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-12">
                #
              </th>
              <th className="sticky left-12 bg-indigo-950 z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider min-w-[200px]">
                KPI
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-24">
                Status
              </th>
              {months.map(month => (
                <th key={month} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider w-16">
                  {getMonthName(month)}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider bg-orange-500 text-stone-900 w-20">
                YTD
              </th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {kpis.map((kpi, idx) => {
              const ytd = calculateYTD(kpi.id);
              const latestScore = scores
                .filter(s => s.kpiId === kpi.id && s.numericValue !== undefined)
                .sort((a, b) => parseInt(b.periodId.split('-')[1]) - parseInt(a.periodId.split('-')[1]))[0];
              const status = getStatus(latestScore?.numericValue);

              return (
                <motion.tr
                  key={kpi.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  onClick={() => onKPIClick?.(kpi)}
                  className="group hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="sticky left-0 bg-white group-hover:bg-stone-50 px-4 py-3 text-sm font-medium text-stone-500 transition-colors">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1 h-8 rounded-full"
                        style={{ backgroundColor: getCategoryColor(kpi.categoryId) }}
                      />
                      {kpi.kpiNumber}
                    </div>
                  </td>
                  <td className="sticky left-12 bg-white group-hover:bg-stone-50 px-4 py-3 transition-colors">
                    <div className="max-w-[200px]">
                      <p className="text-sm font-medium text-stone-800 truncate">{kpi.objective}</p>
                      <p className="text-xs text-stone-400 truncate">{kpi.serviceLine?.name || 'All Services'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusIcon status={status} />
                  </td>
                  {months.map(month => {
                    const score = getKPIScoreForMonth(kpi.id, month);
                    const displayValue = score?.actualValue;
                    const numValue = score?.numericValue;
                    const cellStatus = getStatus(numValue);

                    return (
                      <td key={month} className="px-3 py-3 text-center">
                        {displayValue !== undefined ? (
                          <span className={`inline-flex items-center justify-center min-w-[48px] px-2 py-1 rounded-lg text-xs font-medium ${
                            cellStatus === 'ACHIEVED' ? 'bg-emerald-100 text-emerald-700' :
                            cellStatus === 'DEVELOPING' ? 'bg-teal-100 text-teal-700' :
                            cellStatus === 'PROGRESSING' ? 'bg-amber-100 text-amber-700' :
                            'bg-stone-100 text-stone-500'
                          }`}>
                            {numValue !== undefined && numValue <= 5 
                              ? numValue.toFixed(2) 
                              : numValue !== undefined 
                                ? `${Math.round(numValue * 100)}%` 
                                : displayValue}
                          </span>
                        ) : (
                          <span className="text-stone-300">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center bg-orange-50">
                    {ytd.count > 0 ? (
                      <span className="inline-flex items-center justify-center min-w-[48px] px-2 py-1 rounded-lg text-xs font-bold bg-orange-200 text-orange-800">
                        {ytd.value <= 5 ? ytd.value.toFixed(2) : `${Math.round(ytd.value * 100)}%`}
                      </span>
                    ) : (
                      <span className="text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all" />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

