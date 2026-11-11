import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  School,
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  ShieldCheck,
  Upload,
  LogOut,
  Clock,
  UserCheck,
  Key,
  HeartHandshake,
  BookOpen,
  Megaphone
} from 'lucide-react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, activeSchool, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = role || (user?.user_type === 'platform' ? 'Super Admin' : 'School Admin');

  // Role Checks
  const isSuperAdmin = currentRole === 'Super Admin';
  const isOpsStaff = currentRole === 'Operations Staff';
  const isSchoolAdmin = currentRole === 'School Admin';
  const isClassAdmin = currentRole === 'Class Admin';
  const isTeacher = currentRole === 'Teacher';
  const isStudent = currentRole === 'Student';
  const isParent = currentRole === 'Parent';

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Dynamic Persistent Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-xl border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <School className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">Rithik Group</h1>
              <p className="text-[11px] text-indigo-400 font-medium">Multi-School ERP</p>
            </div>
          </div>

          {/* Active Context Banner */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Authenticated Role</p>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentRole}
            </div>
            <p className="text-slate-300 mt-1 truncate text-[11px]">
              {isParent
                ? 'Parent / Ward Access Only'
                : isStudent
                ? 'Personal Student Workspace'
                : activeSchool?.name
                ? activeSchool.name.split(',')[0]
                : 'Platform-Wide Access'}
            </p>
          </div>

          {/* STRICT ROLE-BASED NAVIGATION ITEMS */}
          <nav className="px-3 py-2 space-y-1 text-xs font-semibold">
            {/* 1. SUPER ADMIN - FULL MASTER PLATFORM ACCESS */}
            {isSuperAdmin && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Platform Command
                </div>
                <NavLink
                  to="/platform/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Super Admin Command Center
                </NavLink>
                <NavLink
                  to="/ops/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  Ops Verification Queue
                </NavLink>
                <NavLink
                  to="/school/announcements"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Megaphone className="h-4 w-4" />
                  Broadcast Circulars & Events
                </NavLink>

                <div className="pt-2 px-3 py-1.5 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Master School Administration
                </div>
                <NavLink
                  to="/school/staff-management"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Key className="h-4 w-4" />
                  Staff Logins & Credentials
                </NavLink>
                <NavLink
                  to="/school/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  Student Directory & Admissions
                </NavLink>
                <NavLink
                  to="/school/teachers-timetables"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Clock className="h-4 w-4" />
                  Teacher Directory & Timetables
                </NavLink>
                <NavLink
                  to="/school/academics"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <CalendarCheck className="h-4 w-4" />
                  Attendance & Report Cards
                </NavLink>
                <NavLink
                  to="/school/homework"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  Homework & Assignments Hub
                </NavLink>
                <NavLink
                  to="/school/behaviour"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <HeartHandshake className="h-4 w-4" />
                  Behaviour & Welfare Analysis
                </NavLink>
                <NavLink
                  to="/class/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <UserCheck className="h-4 w-4" />
                  Class Admin Workspace
                </NavLink>
                <NavLink
                  to="/school/students/import"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Upload className="h-4 w-4" />
                  Bulk Ingestion Wizard
                </NavLink>
              </>
            )}

            {/* 2. OPERATIONS STAFF - AUDIT + STUDENT ADMISSION ACCESS */}
            {isOpsStaff && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Operations & Verification
                </div>
                <NavLink
                  to="/ops/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <ShieldCheck className="h-4 w-4" />
                  Ops Verification Queue
                </NavLink>
                <NavLink
                  to="/school/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  Student Directory & Admissions
                </NavLink>
                <NavLink
                  to="/school/teachers-timetables"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Clock className="h-4 w-4" />
                  Teacher & Timetable Setup
                </NavLink>
                <NavLink
                  to="/school/students/import"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Upload className="h-4 w-4" />
                  Bulk CSV Ingestion Wizard
                </NavLink>
                <NavLink
                  to="/school/announcements"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Megaphone className="h-4 w-4" />
                  Broadcast Circulars & Events
                </NavLink>
              </>
            )}

            {/* 3. SCHOOL ADMIN ONLY */}
            {isSchoolAdmin && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Staff & Logins Management
                </div>
                <NavLink
                  to="/school/staff-management"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Key className="h-4 w-4" />
                  Create Staff Logins & Roles
                </NavLink>

                <div className="pt-2 px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Campus Admissions & Students
                </div>
                <NavLink
                  to="/school/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  Class & Section Roster Filter
                </NavLink>
                <NavLink
                  to="/school/teachers-timetables"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Clock className="h-4 w-4" />
                  Teacher Directory & Timetables
                </NavLink>

                <div className="pt-2 px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Academics, Homework & Welfare
                </div>
                <NavLink
                  to="/school/academics"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <CalendarCheck className="h-4 w-4" />
                  Attendance & Report Cards
                </NavLink>
                <NavLink
                  to="/school/homework"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  Homework & Assignments Hub
                </NavLink>
                <NavLink
                  to="/school/behaviour"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <HeartHandshake className="h-4 w-4" />
                  Behaviour & Welfare Analysis
                </NavLink>
                <NavLink
                  to="/school/announcements"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Megaphone className="h-4 w-4" />
                  Broadcast Circulars & Events
                </NavLink>
                <NavLink
                  to="/school/students/import"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Upload className="h-4 w-4" />
                  Bulk Ingestion Wizard
                </NavLink>
              </>
            )}

            {/* 4. CLASS ADMIN - CLASS TEACHER WORKSPACE & ADMISSIONS */}
            {isClassAdmin && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Class Teacher Portal
                </div>
                <NavLink
                  to="/class/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <UserCheck className="h-4 w-4" />
                  Class Section Workspace
                </NavLink>
                <NavLink
                  to="/school/students"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  My Class Students & Roster
                </NavLink>
                <NavLink
                  to="/school/academics"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <CalendarCheck className="h-4 w-4" />
                  Mark Daily Attendance
                </NavLink>
                <NavLink
                  to="/school/homework"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  Class Homework Tasks
                </NavLink>
                <NavLink
                  to="/school/behaviour"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <HeartHandshake className="h-4 w-4" />
                  Behavioural Observations
                </NavLink>
                <NavLink
                  to="/school/teachers-timetables"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Clock className="h-4 w-4" />
                  My Class Timetable
                </NavLink>
              </>
            )}

            {/* 5. TEACHER ONLY */}
            {isTeacher && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Teacher Portal
                </div>
                <NavLink
                  to="/school/academics"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <CalendarCheck className="h-4 w-4" />
                  Marks Entry & Attendance
                </NavLink>
                <NavLink
                  to="/school/homework"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <BookOpen className="h-4 w-4" />
                  Assign & Grade Homework
                </NavLink>
                <NavLink
                  to="/school/behaviour"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <HeartHandshake className="h-4 w-4" />
                  Behaviour & Observations
                </NavLink>
                <NavLink
                  to="/school/teachers-timetables"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Clock className="h-4 w-4" />
                  My Teaching Timetable
                </NavLink>
              </>
            )}

            {/* 6. STUDENT ONLY */}
            {isStudent && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Student Portal
                </div>
                <NavLink
                  to="/student/portal"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Award className="h-4 w-4" />
                  My Academic Records & Schedule
                </NavLink>
              </>
            )}

            {/* 7. PARENT ONLY */}
            {isParent && (
              <>
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Parent / Guardian Access
                </div>
                <NavLink
                  to="/parent/portal"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      isActive ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  My Ward's Report & Timetable
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Authenticated User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@rithikgroup.com'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Dynamic Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
