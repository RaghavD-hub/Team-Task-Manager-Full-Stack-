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
          <h1 className="page-title">Task Board</h1>
          <p className="text-brand-textMuted mt-1">Manage and track your assigned work.</p>
        </div>
        {currentUser.accessLevel === 'Admin' && (
          <button 
            onClick={openModal}
            className="bg-brand-accent text-[#1A1A18] font-[700] text-[0.875rem] px-[18px] py-[8px] rounded-[6px] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Todo', 'In-Progress', 'Done'].map(statusGroup => {
          const statusColors = {
            'Todo': 'bg-status-todo',
            'In-Progress': 'bg-status-inprogress',
            'Done': 'bg-status-done'
          };
          return (
          <div key={statusGroup} className="bg-transparent min-h-[500px]">
            <div className="flex items-center gap-2 mb-4 px-2">
              <span className={`w-[8px] h-[8px] rounded-full ${statusColors[statusGroup]}`}></span>
              <h3 className="muted-label">{statusGroup}</h3>
            </div>
            <div className="space-y-4">
              {tasks.filter(t => t.currentStatus === statusGroup).map(task => {
                const isOverdue = new Date(task.targetDate) < new Date() && task.currentStatus !== 'Done';
                const dueText = new Date(task.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const assigneeInitial = task.assignedTo?.fullName?.charAt(0) || '?';
                
                return (
                <div key={task._id} className="bg-white p-[18px] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-brand-border">
                  {task.parentProject && (
                    <div className="mb-3">
                      <span className="inline-block bg-[#EDE9E1] text-[#1A1A18] text-[0.68rem] px-[8px] py-[2px] rounded-[4px] font-[600] uppercase tracking-wider">
                        {task.parentProject.title}
                      </span>
                    </div>
                  )}
                  <h4 className="card-title text-[#1A1A18] mb-1">{task.headline}</h4>
                  <p className="text-[0.875rem] text-brand-textMuted mb-4 font-[500]">{task.details}</p>

                  {task.assignedTo && (
                    <div className="mb-4 flex items-center gap-2">
                      <div className="w-[24px] h-[24px] rounded-full bg-[#E8E4DC] text-[#1A1A18] flex items-center justify-center text-xs font-[700]">
                        {assigneeInitial}
                      </div>
                      <span className="text-[0.875rem] font-[500] text-[#1A1A18]">{task.assignedTo.fullName}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-border/50">
                    <span className={`text-[0.875rem] font-[600] ${isOverdue ? 'text-[#E74C3C]' : 'text-brand-textMuted'}`}>
                      {dueText}
                    </span>
                    <select 
                      className="text-[0.875rem] font-[600] bg-transparent border border-transparent hover:border-brand-border rounded-[6px] px-2 py-1 outline-none cursor-pointer text-[#1A1A18]"
                      value={task.currentStatus}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                      disabled={currentUser.accessLevel !== 'Admin' && task.assignedTo?._id !== currentUser._id}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In-Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )})}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A18]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] w-full max-w-lg overflow-hidden shadow-xl border border-brand-border">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-[#F5F3EE]">
              <h2 className="card-title text-[#1A1A18]">Create New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-textMuted hover:text-[#1A1A18]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A18] mb-1">Task Headline</label>
                <input 
                  type="text" 
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Design Homepage UI"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A1A18] mb-1">Details</label>
                <textarea 
                  required
                  rows="3"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Task requirements..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1">Project</label>
                  <select
                    required
                    value={parentProject}
                    onChange={(e) => setParentProject(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a project...</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1">Assign To</label>
                  <select
                    required
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a member...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.fullName} ({u.accessLevel})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A18] mb-1">Target Date</label>
                <input 
                  type="date" 
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-brand-textMuted font-[600] hover:bg-brand-bg rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-accent text-[#1A1A18] font-[700] hover:opacity-90 rounded-lg transition-colors"
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
