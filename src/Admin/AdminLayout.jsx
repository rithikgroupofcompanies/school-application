import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  LogOut, 
  Calendar, 
  BookOpen, 
  BarChart2, 
  Heart, 
  Award, 
  MessageSquare, 
  Settings, 
  Menu, 
  X,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const navItems = isSuperAdmin ? [
    { name: 'View All Users', path: '/admin/view-users', icon: Users, desc: 'Manage all accounts' },
    { name: 'Add Student', path: '/admin/add-student', icon: UserPlus, desc: 'Register new students' },
    { name: 'Add Staff', path: '/admin/add-staff', icon: UserPlus, desc: 'Register teachers & staff' },
    { name: 'Attendance Monitor', path: '/admin/attendance', icon: Calendar, desc: 'Track & override locks' },
    { name: 'Homework Manager', path: '/admin/homework', icon: BookOpen, desc: 'View global homework log' },
    { name: 'Tests & Analytics', path: '/admin/tests', icon: BarChart2, desc: 'School academic performance' },
    { name: 'Behaviour Logs', path: '/admin/behaviour', icon: Heart, desc: 'Student character tracker' },
    { name: 'Release Reports', path: '/admin/reports', icon: Award, desc: 'Publish transcripts' },
    { name: 'WhatsApp Broadcast', path: '/admin/whatsapp', icon: MessageSquare, desc: 'Emergency school alert' },
    { name: 'System Settings', path: '/admin/settings', icon: Settings, desc: 'API keys & snapshots' },
  ] : [
    { name: 'Class Student List', path: '/admin/view-users', icon: Users, desc: 'Manage class registry' },
    { name: 'Add Class Student', path: '/admin/add-student', icon: UserPlus, desc: 'Register class student' },
    { name: 'Mark Attendance', path: '/admin/attendance', icon: Calendar, desc: 'Submit daily attendance' },
    { name: 'Class Homework', path: '/admin/homework', icon: BookOpen, desc: 'Assign class tasks' },
    { name: 'Enter Marks', path: '/admin/tests', icon: BarChart2, desc: 'Record test grades' },
    { name: 'Behaviour Remarks', path: '/admin/behaviour', icon: Heart, desc: 'Log student remarks' },
    { name: 'Class WhatsApp', path: '/admin/whatsapp', icon: MessageSquare, desc: 'Alert class parents' },
    { name: 'Class Reports', path: '/admin/reports', icon: Award, desc: 'Draft academic reports' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-gray-800 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2">
          {isSuperAdmin ? (
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
          ) : (
            <UserCheck className="w-6 h-6 text-blue-600" />
          )}
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {isSuperAdmin ? 'Super Admin' : 'Class Admin'}
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static transition-transform duration-300 ease-in-out
        w-72 bg-slate-900 text-slate-300 flex flex-col justify-between shadow-2xl border-r border-slate-800 z-30 md:z-10
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40">
            <div className={`p-2.5 rounded-xl ${isSuperAdmin ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'}`}>
              {isSuperAdmin ? <ShieldAlert className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-white font-extrabold text-lg leading-tight truncate">
                {isSuperAdmin ? 'Super Admin' : 'Class Admin'}
              </h2>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mt-0.5">
                {isSuperAdmin ? 'School Console' : `${user.className}-${user.section} Panel`}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-slate-800 hover:text-white text-slate-400'}
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`} />
                  <div className="min-w-0">
                    <span className="block truncate">{item.name}</span>
                    <span className={`text-[10px] block font-normal truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center justify-between gap-3 p-2 bg-slate-950/40 rounded-2xl border border-slate-800/60 mb-3">
            <div className="min-w-0">
              <span className="block text-xs font-bold text-white truncate">{user.name}</span>
              <span className="block text-[10px] text-slate-500 truncate">{user.email}</span>
            </div>
            {isSuperAdmin && (
              <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-extrabold font-mono shrink-0">SA</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 text-sm font-bold rounded-xl transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300"
        />
      )}
    </div>
  );
}
