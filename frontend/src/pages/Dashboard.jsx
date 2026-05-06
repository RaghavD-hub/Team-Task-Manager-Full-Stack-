import { useState, useEffect } from 'react';
import apiAgent from '../api/axios';
import { Clock, CheckCircle2, CircleDashed, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    byStatus: { Todo: 0, 'In-Progress': 0, Done: 0 },
    overdueCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiAgent.get('/dashboard/metrics');
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Tasks', value: metrics.totalCount, icon: CircleDashed, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'To Do', value: metrics.byStatus.Todo, icon: CircleDashed, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'In Progress', value: metrics.byStatus['In-Progress'], icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Done', value: metrics.byStatus.Done, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Overdue', value: metrics.overdueCount, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here is a snapshot of your team's progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl ${stat.bg} mb-4`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
          );
        })}
      </div>
      
      {metrics.overdueCount > 0 && (
        <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Attention Required</h3>
            <p className="text-red-600 mt-1">
              You have {metrics.overdueCount} task{metrics.overdueCount > 1 ? 's' : ''} past due. Please review your task board immediately to update statuses or adjust deadlines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
