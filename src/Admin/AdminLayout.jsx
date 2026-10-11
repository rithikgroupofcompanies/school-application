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
  UserCheck,
  FileSpreadsheet,
  Clock,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const navItems = isSuperAdmin ? [
    { name: 'School Directory', path: '/admin/schools', icon: Building2, desc: 'Multi-school SaaS onboarding' },
    { name: 'Google Sheets Sync', path: '/admin/sheets', icon: FileSpreadsheet, desc: 'Non-technical admin sheets', badge: 'Sheets' },
    { name: 'Timetable Engine', path: '/admin/timetable', icon: Clock, desc: 'Weekly schedule & conflicts' },
    { name: 'Manage Users', path: '/admin/view-users', icon: Users, desc: 'Global accounts & directory' },
    { name: 'Admission Wizard', path: '/admin/add-student', icon: UserPlus, desc: 'Register students with guardians' },
    { name: 'Staff Management', path: '/admin/add-staff', icon: UserPlus, desc: 'Register teachers & staff' },
    { name: 'Attendance Monitor', path: '/admin/attendance', icon: Calendar, desc: 'Track daily attendance' },
    { name: 'Homework Manager', path: '/admin/homework', icon: BookOpen, desc: 'View global homework log' },
    { name: 'Tests & Analytics', path: '/admin/tests', icon: BarChart2, desc: 'Exams & marks entry' },
    { name: 'Behaviour Logs', path: '/admin/behaviour', icon: Heart, desc: 'Student character ratings' },
    { name: 'Release Reports', path: '/admin/reports', icon: Award, desc: 'Publish transcripts' },
    { name: 'WhatsApp Broadcast', path: '/admin/whatsapp', icon: MessageSquare, desc: 'Emergency school alert' },
    { name: 'System Settings', path: '/admin/settings', icon: Settings, desc: 'API keys & configuration' },
  ] : [
    { name: 'Google Sheets Sync', path: '/admin/sheets', icon: FileSpreadsheet, desc: 'Export & edit in Sheets', badge: 'Sheets' },
    { name: 'Class Timetable', path: '/admin/timetable', icon: Clock, desc: 'Class weekly schedule' },
    { name: 'Class Student List', path: '/admin/view-users', icon: Users, desc: 'Manage class registry' },
    { name: 'Admit Student', path: '/admin/add-student', icon: UserPlus, desc: 'Register class student' },
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
            {isSuperAdmin ? 'Super Admin' : 'School Admin'}
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
                {isSuperAdmin ? 'Super Admin' : 'School Admin'}
              </h2>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mt-0.5">
                {isSuperAdmin ? 'Platform Console' : `${user.schoolName || 'School Console'}`}
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
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group text-sm
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <div className="flex-1 truncate">
                    <div className="leading-tight flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] block truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {item.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center justify-between gap-3 px-2 py-2 mb-2 bg-slate-800/40 rounded-xl">
            <div className="truncate">
              <div className="text-sm font-bold text-white truncate">{user.name || 'Administrator'}</div>
              <div className="text-xs text-slate-400 truncate">{user.email || 'admin@school.edu'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}
