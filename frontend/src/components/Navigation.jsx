import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, LogOut, Briefcase } from 'lucide-react';

const Navigation = () => {
  const { currentUser, logoutUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <nav className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 mb-8 flex items-center gap-3">
        <div className="bg-brand-500 p-2 rounded-lg">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">TeamSync</span>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-200">{currentUser.fullName}</p>
          <p className="text-xs text-brand-400">{currentUser.accessLevel}</p>
        </div>
        <button 
          onClick={logoutUser}
          className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors py-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
