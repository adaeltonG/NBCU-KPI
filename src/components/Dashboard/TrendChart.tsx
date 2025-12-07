import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { getMonthName } from '../../data/mockData';

interface TrendData {
  month: number;
  sodexoScore: number;
  clientScore: number;
  averageScore: number;
}

interface TrendChartProps {
  data: TrendData[];
  showClient?: boolean;
  showAverage?: boolean;
  height?: number;
}

export const TrendChart = ({
  data,
  showClient = true,
  showAverage = true,
  height = 300,
}: TrendChartProps) => {
  const chartData = data.map(d => ({
    ...d,
    name: getMonthName(d.month),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    
    return (
      <div className="bg-white border border-stone-200 rounded-xl shadow-lg p-4">
        <p className="font-semibold text-stone-800 mb-2">{label} 2025</p>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-stone-600">{entry.name}:</span>
            <span className="font-semibold text-stone-800">
              {(entry.value * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-stone-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Performance Trend</h3>
          <p className="text-sm text-stone-500">Monthly score comparison</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-sm text-stone-600">Sodexo</span>
          </div>
          {showClient && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-600" />
              <span className="text-sm text-stone-600">NBCU</span>
            </div>
          )}
          {showAverage && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-stone-600">Average</span>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="sodexoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="clientGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#78716c' }}
            tickLine={false}
            axisLine={{ stroke: '#e7e5e4' }}
          />
          <YAxis
            domain={[0.5, 1]}
            tick={{ fontSize: 12, fill: '#78716c' }}
            tickLine={false}
            axisLine={{ stroke: '#e7e5e4' }}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="sodexoScore"
            name="Sodexo Score"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#sodexoGradient)"
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          
          {showClient && (
            <Area
              type="monotone"
              dataKey="clientScore"
              name="NBCU Score"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#clientGradient)"
              dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
          
          {showAverage && (
            <Area
              type="monotone"
              dataKey="averageScore"
              name="Average"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#averageGradient)"
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

