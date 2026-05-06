import { useState, useEffect } from 'react';
import apiAgent from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, X } from 'lucide-react';

const Tasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Form State
  const [headline, setHeadline] = useState('');
  const [details, setDetails] = useState('');
  const [parentProject, setParentProject] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [targetDate, setTargetDate] = useState('');

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

  const fetchFormData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        apiAgent.get('/projects'),
        apiAgent.get('/users')
      ]);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch modal data', err);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    fetchFormData();
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiAgent.post('/tasks', {
        headline,
        details,
        parentProject,
        assignedTo,
        targetDate
      });
      // the returned data might not have populated fields, so we re-fetch to be safe
      await fetchTasks();
      setIsModalOpen(false);
      setHeadline('');
      setDetails('');
      setParentProject('');
      setAssignedTo('');
      setTargetDate('');
    } catch (err) {
      alert('Failed to create task. ' + (err.response?.data?.error || ''));
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
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500 mt-1">Manage and track your assigned work.</p>
        </div>
        {currentUser.accessLevel === 'Admin' && (
          <button 
            onClick={openModal}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Task
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
                  
                  {task.parentProject && (
                    <div className="mb-3">
                      <span className="inline-block bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded-md font-medium">
                        {task.parentProject.title}
                      </span>
                    </div>
                  )}

                  {task.assignedTo && (
                    <div className="mb-3 text-xs text-slate-500">
                      Assigned to: <span className="font-medium text-slate-700">{task.assignedTo.fullName}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400">
                      Due: {new Date(task.targetDate).toLocaleDateString()}
                    </span>
                    <select 
                      className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-brand-500"
                      value={task.currentStatus}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      disabled={currentUser.accessLevel !== 'Admin' && task.assignedTo?._id !== currentUser._id}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Create New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Headline</label>
                <input 
                  type="text" 
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. Design Homepage UI"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
                <textarea 
                  required
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                  placeholder="Task requirements..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                  <select
                    required
                    value={parentProject}
                    onChange={(e) => setParentProject(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  >
                    <option value="">Select a project...</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                  <select
                    required
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  >
                    <option value="">Select a member...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.fullName} ({u.accessLevel})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
                <input 
                  type="date" 
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-500 text-white font-medium hover:bg-brand-600 rounded-xl transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
