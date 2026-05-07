import { useState, useEffect } from 'react';
import apiAgent from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Plus, X } from 'lucide-react';

const Projects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await apiAgent.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiAgent.post('/projects', { title, description });
      setProjects([...projects, data]);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert('Failed to create project. ' + (err.response?.data?.error || ''));
    }
  };

  if (loading) return <div className="p-8">Loading projects...</div>;

  // Only Admins should ideally see this page based on navigation, but we can do a sanity check
  if (currentUser?.accessLevel !== 'Admin') {
    return <div className="p-8 text-red-500">Access Denied. Admins only.</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-brand-textMuted mt-1">Manage all team projects here.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-accent text-[#1A1A18] font-[700] text-[0.875rem] px-[18px] py-[8px] rounded-[6px] transition-colors flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-transparent rounded-[14px] border border-dashed border-brand-border">
            <Briefcase className="w-10 h-10 text-brand-border mx-auto mb-3" />
            <p className="text-brand-textMuted text-[0.875rem]">No projects found. Create one to get started.</p>
          </div>
        ) : (
          projects.map(project => {
            const managerInitial = project.managerId?.fullName?.charAt(0) || '?';
            return (
            <div key={project._id} className="bg-white rounded-[10px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-brand-border hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="card-title text-[#1A1A18] mb-2">{project.title}</h3>
                <p className="text-[#8C8880] mb-4 text-[0.875rem] line-clamp-3 font-[500] leading-relaxed">{project.description}</p>
                <div className="text-[0.75rem] text-brand-border font-[500] uppercase tracking-wider">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              {project.managerId && (
                <div className="w-[32px] h-[32px] rounded-full bg-[#E8E4DC] text-[#1A1A18] flex items-center justify-center text-sm font-[700] flex-shrink-0" title={`Manager: ${project.managerId.fullName}`}>
                  {managerInitial}
                </div>
              )}
            </div>
          )})
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A18]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[14px] w-full max-w-md overflow-hidden shadow-xl border border-brand-border">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-[#F5F3EE]">
              <h2 className="card-title text-[#1A1A18]">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-textMuted hover:text-[#1A1A18]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A18] mb-1">Project Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Website Redesign"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1A1A18] mb-1">Description</label>
                <textarea 
                  required
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                  placeholder="What is this project about?"
                ></textarea>
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
