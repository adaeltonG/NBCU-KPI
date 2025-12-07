import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  label?: string;
  color?: string;
  darkBackground?: boolean;
}

const sizes = {
  sm: { width: 60, strokeWidth: 4, fontSize: 'text-sm' },
  md: { width: 80, strokeWidth: 5, fontSize: 'text-lg' },
  lg: { width: 120, strokeWidth: 6, fontSize: 'text-2xl' },
  xl: { width: 160, strokeWidth: 8, fontSize: 'text-4xl' },
};

export const ScoreRing = ({
  score,
  maxScore = 100,
  size = 'md',
  showLabel = true,
  label,
  color,
  darkBackground = false,
}: ScoreRingProps) => {
  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((score / maxScore) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (color) return color;
    // Gradient of greens - darker/more saturated = better performance
    if (percentage >= 90) return '#059669'; // emerald-600 - Excellent
    if (percentage >= 80) return '#10b981'; // emerald-500 - Great
    if (percentage >= 70) return '#34d399'; // emerald-400 - Good
    if (percentage >= 60) return '#6ee7b7'; // emerald-300 - Fair
    if (percentage >= 50) return '#a7f3d0'; // emerald-200 - Developing
    return '#f59e0b'; // amber-500 - Needs attention (no red)
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={darkBackground ? "text-white/20" : "text-stone-200"}
        />
        {/* Progress ring */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className={`font-bold ${fontSize} ${darkBackground ? 'text-white' : 'text-stone-800'}`}
        >
          {Math.round(percentage)}%
        </motion.span>
        {showLabel && label && (
          <span className={`text-xs mt-0.5 ${darkBackground ? 'text-white/70' : 'text-stone-500'}`}>{label}</span>
        )}
      </div>
    </div>
  );
};

