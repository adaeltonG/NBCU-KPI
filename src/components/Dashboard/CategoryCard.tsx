import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Category } from '../../types';
import { ScoreRing } from './ScoreRing';

interface CategoryCardProps {
  category: Category;
  score: number;
  kpiCount: number;
  passedCount: number;
  onClick?: () => void;
  delay?: number;
}

export const CategoryCard = ({
  category,
  score,
  kpiCount,
  passedCount,
  onClick,
  delay = 0,
}: CategoryCardProps) => {
  // Dynamically get icon
  const IconComponent = category.icon 
    ? (Icons as Record<string, any>)[category.icon] || Icons.Target 
    : Icons.Target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-stone-200 p-5 cursor-pointer hover:shadow-xl hover:border-stone-300 transition-all duration-300"
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: category.color }}
      />
      
      <div className="flex items-start justify-between mb-4 pl-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <IconComponent className="w-5 h-5" style={{ color: category.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">{category.shortName}</h3>
            <p className="text-xs text-stone-400">{kpiCount} KPIs</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all" />
      </div>

      <div className="flex items-center justify-between pl-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-stone-800">{Math.round(score)}%</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              score >= 90 ? 'bg-emerald-100 text-emerald-700' :
              score >= 70 ? 'bg-teal-100 text-teal-700' :
              score >= 50 ? 'bg-amber-100 text-amber-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Developing' : 'Building'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-emerald-600 font-medium">{passedCount} achieved</span>
            <span className="text-xs text-stone-300">/</span>
            <span className="text-xs text-stone-400">{kpiCount} total</span>
          </div>
        </div>
        
        <ScoreRing score={score} size="sm" showLabel={false} color={category.color} />
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
          className="h-full rounded-full"
          style={{ backgroundColor: category.color }}
        />
      </div>
    </motion.div>
  );
};

