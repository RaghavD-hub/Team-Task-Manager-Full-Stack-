import { useState, useEffect } from 'react';
import apiAgent from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await apiAgent.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await apiAgent.patch(`/tasks/${taskId}/status`, { currentStatus: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, currentStatus: newStatus } : t));
    } catch (err) {
      alert('Failed to update status. Check permissions.');
    }
  };

  if (loading) return <div className="p-8">Loading tasks...</div>;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500 mt-1">Manage and track your assigned work.</p>
        </div>
        {currentUser.accessLevel === 'Admin' && (
          <button className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
            + New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Todo', 'In-Progress', 'Done'].map(statusGroup => (
          <div key={statusGroup} className="bg-slate-100 rounded-2xl p-4 min-h-[500px]">
            <h3 className="font-semibold text-slate-700 mb-4 px-2">{statusGroup}</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.currentStatus === statusGroup).map(task => (
                <div key={task._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-1">{task.headline}</h4>
                  <p className="text-sm text-slate-500 mb-4">{task.details}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400">
                      Due: {new Date(task.targetDate).toLocaleDateString()}
                    </span>
                    <select 
                      className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-brand-500"
                      value={task.currentStatus}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
