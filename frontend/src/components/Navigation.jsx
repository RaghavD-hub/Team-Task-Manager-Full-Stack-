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

  if (currentUser?.accessLevel === 'Admin') {
    navLinks.push({ path: '/projects', label: 'Projects', icon: Briefcase });
  }

  return (
    <nav className="w-[220px] bg-brand-sidebar text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 mb-8 flex items-center gap-3">
        <div className="bg-brand-accent w-[28px] h-[28px] rounded-lg flex items-center justify-center font-[900] text-brand-sidebar text-sm">
          TS
        </div>
        <span className="text-xl font-[800] tracking-[-0.03em] text-white">TeamSync</span>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {navLinks.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-[0.85rem] font-medium ${
                isActive 
                  ? 'border-l-[3px] border-brand-accent text-white bg-transparent rounded-l-none' 
                  : 'text-[#6B6B65] hover:text-white border-l-[3px] border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-[#2A2A26]">
        <div className="mb-4">
          <p className="text-sm font-medium text-white">{currentUser.fullName}</p>
          <p className="text-xs text-[#6B6B65] mt-0.5">{currentUser.accessLevel}</p>
        </div>
        <button 
          onClick={logoutUser}
          className="w-full flex items-center gap-2 text-brand-textMuted hover:text-white transition-colors py-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
