import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Action } from '../../types';
import { format, parseISO, isPast } from 'date-fns';

interface ActionsWidgetProps {
  actions: Action[];
  onViewAll?: () => void;
}

const StatusBadge = ({ status }: { status: Action['status'] }) => {
  const config = {
    OPEN: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Open' },
    IN_PROGRESS: { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', label: 'In Progress' },
    COMPLETED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' },
    OVERDUE: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Overdue' },
    CANCELLED: { icon: AlertCircle, color: 'text-stone-400', bg: 'bg-stone-50', label: 'Cancelled' },
  };
  
  const { icon: Icon, color, bg, label } = config[status];
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export const ActionsWidget = ({ actions, onViewAll }: ActionsWidgetProps) => {
  const openActions = actions.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED');
  const sortedActions = [...openActions].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  }).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl border border-stone-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-stone-800">Action Items</h3>
          <p className="text-sm text-stone-500">{openActions.length} open actions</p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedActions.map((action, idx) => {
          const isOverdue = action.dueDate && isPast(parseISO(action.dueDate)) && action.status !== 'COMPLETED';
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-xl border transition-colors hover:bg-stone-50 ${
                isOverdue ? 'border-red-200 bg-red-50/50' : 'border-stone-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {action.description}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {action.requiredAction}
                  </p>
                </div>
                <StatusBadge status={isOverdue ? 'OVERDUE' : action.status} />
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-stone-400">
                  Raised by: <span className="font-medium text-stone-600">{action.raisedBy}</span>
                </span>
                {action.dueDate && (
                  <span className={isOverdue ? 'text-red-600 font-medium' : 'text-stone-400'}>
                    Due: {format(parseISO(action.dueDate), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}

        {sortedActions.length === 0 && (
          <div className="text-center py-8 text-stone-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No open actions</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

