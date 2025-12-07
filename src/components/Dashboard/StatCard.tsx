import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  trend?: number;
  trendLabel?: string;
  color?: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = '#f97316',
  delay = 0,
}: StatCardProps) => {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendColor = trend === undefined || trend === 0 ? 'text-stone-400' : trend > 0 ? 'text-emerald-600' : 'text-red-600';
  const trendBg = trend === undefined || trend === 0 ? 'bg-stone-50' : trend > 0 ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="text-3xl font-bold text-stone-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-stone-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendBg}`}>
            <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
            <span className={`text-sm font-medium ${trendColor}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
          {trendLabel && (
            <span className="text-sm text-stone-400">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

