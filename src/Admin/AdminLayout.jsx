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
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  Clock,
  Building2,
  ExternalLink,
  ChevronRight,
  School,
  Sparkles,
  Search,
  Bell
} from 'lucide-react';

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1EOaG3KmoT1K9hYoBABKVTWZLjVB_RnExt6MQ1LLpodQ/edit?usp=sharing";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const navSections = [
    {
      title: "Core Platform",
      items: isSuperAdmin ? [
        { name: 'School Directory', path: '/admin/schools', icon: Building2, desc: 'Multi-tenant onboarding' },
        { name: 'Google Sheets Hub', path: '/admin/sheets', icon: FileSpreadsheet, desc: 'Live spreadsheet sync', badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
        { name: 'Timetable Engine', path: '/admin/timetable', icon: Clock, desc: 'Weekly schedule & conflicts' },
      ] : [
        { name: 'Google Sheets Hub', path: '/admin/sheets', icon: FileSpreadsheet, desc: 'Live spreadsheet sync', badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
        { name: 'Class Timetable', path: '/admin/timetable', icon: Clock, desc: 'Weekly schedule grid' },
      ]
    },
    {
      title: "People & Directory",
      items: isSuperAdmin ? [
        { name: 'User Registry', path: '/admin/view-users', icon: Users, desc: 'Global accounts directory' },
        { name: 'Student Admission', path: '/admin/add-student', icon: UserPlus, desc: '3-step admission wizard' },
        { name: 'Staff Management', path: '/admin/add-staff', icon: UserCheck, desc: 'Faculty & designations' },
      ] : [
        { name: 'Student Registry', path: '/admin/view-users', icon: Users, desc: 'Class student directory' },
        { name: 'Admit Student', path: '/admin/add-student', icon: UserPlus, desc: 'Enroll into assigned class' },
      ]
    },
    {
      title: "Academics & Operations",
      items: [
        { name: 'Daily Attendance', path: '/admin/attendance', icon: Calendar, desc: 'Track class attendance' },
        { name: 'Homework Manager', path: '/admin/homework', icon: BookOpen, desc: 'Curriculum tasks & logs' },
        { name: 'Exams & Marks', path: '/admin/tests', icon: BarChart2, desc: 'Term tests & marksheets' },
        { name: 'Behaviour Ratings', path: '/admin/behaviour', icon: Heart, desc: 'Character remarks & stars' },
        { name: 'Report Cards', path: '/admin/reports', icon: Award, desc: 'Generate transcripts' },
      ]
    },
    {
      title: "Cloud & Broadcast",
      items: [
        { name: 'WhatsApp Alerts', path: '/admin/whatsapp', icon: MessageSquare, desc: 'Instant parent notification' },
        { name: 'System Settings', path: '/admin/settings', icon: Settings, desc: 'API keys & configurations' },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            E
          </div>
          <div>
            <span className="font-extrabold text-sm text-white">EduNexus V2</span>
            <span className="block text-[10px] text-slate-400">{isSuperAdmin ? 'Super Console' : 'School Admin'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            title="Open Google Sheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </a>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern Desktop & Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static transition-transform duration-300 ease-in-out
        w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between z-40 md:z-20 shrink-0
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Brand & School Header */}
          <div className="p-5 border-b border-slate-850 bg-slate-950/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-md shadow-indigo-600/30 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <School className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-extrabold text-base leading-tight">EduNexus V2</h2>
                  <span className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase block">
                    {isSuperAdmin ? 'Super Admin Portal' : 'School Workspace'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>

            {/* School Pill */}
            <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500">Active Tenant</div>
              <div className="font-semibold text-slate-200 truncate">{user.schoolName || 'Dyzen International School'}</div>
            </div>
          </div>

          {/* Connected Google Sheet Quick Card Widget */}
          <div className="px-4 pt-4 pb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/90 border border-emerald-500/20 shadow-sm relative overflow-hidden group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Google Sheet</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 mb-2.5 font-medium">
                1EOaG3KmoT1K9hYo...
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={GOOGLE_SHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open in Sheets</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <Link
                  to="/admin/sheets"
                  className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                  title="Configure Sync"
                >
                  Manage
                </Link>
              </div>
            </div>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="p-3 space-y-5">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-xs font-semibold
                        ${isActive 
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25 font-bold' 
                          : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'}`} />
                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${item.badgeColor || 'bg-indigo-500/20 text-indigo-300'}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-3 border-t border-slate-850 bg-slate-950/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-850 mb-2">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {(user.name || 'Admin').charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{user.name || 'Administrator'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email || 'admin@school.edu'}</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition-all hover:border-rose-500/30 active:scale-98"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-850 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Dyzen International School</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-semibold text-indigo-400">CBSE Affiliation</span>
              </div>
              <h1 className="text-base font-extrabold text-white tracking-tight">
                Academic Year 2026-2027
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Google Sheets Link Button */}
            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-sm group"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Open Master Sheet</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSuperAdmin ? 'Super Admin' : 'Class Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
