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
    { label: 'Total Tasks', value: metrics.totalCount, icon: CircleDashed, color: 'text-blue-500', borderColor: 'border-l-blue-500' },
    { label: 'To Do', value: metrics.byStatus.Todo, icon: CircleDashed, color: 'text-status-todo', borderColor: 'border-l-status-todo' },
    { label: 'In Progress', value: metrics.byStatus['In-Progress'], icon: Clock, color: 'text-status-inprogress', borderColor: 'border-l-status-inprogress' },
    { label: 'Done', value: metrics.byStatus.Done, icon: CheckCircle2, color: 'text-status-done', borderColor: 'border-l-status-done' },
    { label: 'Overdue', value: metrics.overdueCount, icon: AlertTriangle, color: 'text-red-500', borderColor: 'border-l-red-500' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="text-brand-textMuted mt-1">Here is a snapshot of your team's progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-white rounded-[10px] p-6 border border-brand-border border-l-[3px] ${stat.borderColor} flex flex-col items-start`}>
              <div className="mb-4">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[2.5rem] font-[800] leading-none mb-2 text-[#1A1A18]">{stat.value}</span>
              <span className="card-title text-brand-textMuted">{stat.label}</span>
            </div>
          );
        })}
      </div>
      
      {metrics.overdueCount > 0 && (
        <div className="mt-8 bg-[#FFF8F7] border border-[#E74C3C]/20 border-l-[3px] border-l-[#E74C3C] rounded-[10px] p-6 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-[#E74C3C] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="card-title text-[#E74C3C]">Attention Required</h3>
            <p className="text-[#E74C3C]/80 mt-1 text-sm">
              You have {metrics.overdueCount} task{metrics.overdueCount > 1 ? 's' : ''} past due. Please review your task board immediately to update statuses or adjust deadlines.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
