import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Category } from '../../types';

interface CategoryBreakdownProps {
  categories: Category[];
  scores: Record<string, number>;
  height?: number;
}

export const CategoryBreakdown = ({
  categories,
  scores,
  height = 300,
}: CategoryBreakdownProps) => {
  const data = categories.map(cat => ({
    name: cat.shortName,
    fullName: cat.name,
    score: scores[cat.id] || 0,
    color: cat.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-stone-200 rounded-xl shadow-lg p-4">
        <p className="font-semibold text-stone-800 mb-1">{data.fullName}</p>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-sm text-stone-600">Score:</span>
          <span className="font-semibold text-stone-800">{data.score.toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl border border-stone-200 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-stone-800">Category Performance</h3>
        <p className="text-sm text-stone-500">Score breakdown by category</p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#78716c' }}
            tickLine={false}
            axisLine={{ stroke: '#e7e5e4' }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#78716c' }}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Bar
            dataKey="score"
            radius={[0, 6, 6, 0]}
            barSize={24}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

