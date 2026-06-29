import React from 'react';
import { useNavigate, Link,useParams } from 'react-router-dom';
import {
  BookA,
  NotebookPen,
  CalendarDays,
  Megaphone,
  ClipboardList,
  Trophy,
  ChevronRight,
  LogOut,
} from 'lucide-react';

// ─── Mock API Response ────────────────────────────────────────────────────────
// Replace this with: const dashboardData = await fetch('/api/dashboard').then(r => r.json())
// Shape must stay the same — only the values will come from the server.
const dashboardData = {
  student: {
    name: 'Alex Morgan',
    roleno: '26A02',
    initials: 'AM',
  },
  attendance: {
    percentage: 92,
    label: 'Keep it up!',
  },
  upcomingTests: [
    { id: 1, title: 'Chemistry Periodic Table Test', subject: 'Elements & Compounds',       date: 'Feb 18' },
    { id: 2, title: 'Biology Unit Test',             subject: 'Photosynthesis & Respiration', date: 'Feb 22' },
  ],
  pendingHomework: [
    { id: 1, title: 'Math Worksheet', subject: 'Algebra: Linear Equations', date: 'Feb 22' },
    { id: 2, title: 'History Essay',  subject: 'The Renaissance Period',    date: 'Friday'  },
  ],

  quickActions: [
    { id: 'ApplyforLeave', label: 'Apply for Leave' },
    { id: 'RankCard',      label: 'Rank Card'        },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────


const quickActionIcons = {
  ApplyforLeave: <ClipboardList size={22} strokeWidth={1.8} />,
  RankCard:      <Trophy        size={22} strokeWidth={1.8} />,
};

export default function Dashboard() {

  const id=useParams();
  
  const navigate = useNavigate();

  const handleItemClick = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    navigate(-1);
  };

  const { student, attendance, upcomingTests, pendingHomework, quickActions } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">

      {/* Header */}
      <div className="sticky top-0 z-100 flex items-center gap-3 border-b-4 border-[var(--color-accent)] bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary-darker)] px-5 py-4 shadow-lg">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] text-base font-bold text-white"
          style={{ boxShadow: '0 2px 8px var(--color-shadow-avatar)' }}
        >
          {student.initials}
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-bold tracking-wide text-white">{student.name}</h3>
          <p className="text-xs text-[var(--color-text-header-sub)]">{student.roleno}</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/40 active:scale-95"
          title="Logout"
        >
          <LogOut size={14} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-6">

        {/* Attendance */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Attendance</h2>
          <Link to="Attendance" className="text-x6 font-bold text-[var(--color-accent)] transition-all hover:text-[var(--color-accent-hover)] hover:underline">
            view all
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="flex flex-col items-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-6 text-center transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:-translate-y-1"
            style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
            onClick={() => handleItemClick('Attendance')}
          >
            <div className="mb-3.5 text-xs font-black uppercase tracking-widest text-[var(--color-text-primary)]">
              Attendance
            </div>
            <div
              className="relative mb-3.5 flex h-28 w-28 items-center justify-center rounded-full bg-[var(--color-accent)]"
              style={{ boxShadow: '0 0 24px var(--color-shadow-accent-md)' }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--color-bg-card)]">
                <span className="text-4xl font-black text-[var(--color-accent)] leading-none">
                  {attendance.percentage}%
                </span>
              </div>
            </div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">{attendance.label}</div>
          </div>
        </div>

        {/* Upcoming Tests */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Upcoming Tests</h2>
          <Link to="TestPage" className="text-x6 font-bold text-[var(--color-accent)] transition-all hover:text-[var(--color-accent-hover)] hover:underline">
            view all
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          {upcomingTests.map((test) => (
            <div
              key={test.id}
              className="flex items-center gap-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
              style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
            > 
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]">
                {<NotebookPen size={18} strokeWidth={1.8} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[var(--color-text-primary)]">{test.title}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{test.subject}</div>
              </div>
              <div
                className="whitespace-nowrap rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-bold text-white"
                style={{ boxShadow: '0 2px 6px var(--color-shadow-badge)' }}
              >
                {test.date}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Homework */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Pending Homework</h2>
          <Link to="Homework" className="text-x6 font-bold text-[var(--color-accent)] transition-all hover:text-[var(--color-accent)] hover:underline">
            view all
          </Link>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          {pendingHomework.map((hw, index) => (
            <div
              key={hw.id}
              className="flex items-center gap-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
              style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]">
                {<BookA    size={18} strokeWidth={1.8} />}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[var(--color-text-primary)]">{hw.title}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{hw.subject}</div>
              </div>
              <div
                className="whitespace-nowrap rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-bold text-white"
                style={{ boxShadow: '0 2px 6px var(--color-shadow-badge)' }}
              >
                {hw.date}
              </div>
            </div>
          ))}
        </div>

        {/* Timetable */}
        <h2 className="mb-4 mt-7 text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Timetable</h2>
        <div className="mb-6 flex flex-col gap-3">
          <div
            className="group flex items-center gap-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
            style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
            onClick={() => handleItemClick('Timetable')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)] transition-colors duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
              <CalendarDays size={18} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--color-text-primary)]">Weekly Schedule</div>
              <div className="text-xs text-[var(--color-text-muted)]">View Your Classes</div>
            </div>
            <ChevronRight size={16} className="text-[var(--color-text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />
          </div>
        </div>

        {/* Circulars & Events */}
        <h2 className="mb-4 mt-7 text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Circulars & Events</h2>
        <div className="mb-6 flex flex-col gap-3">
          <div
            className="group flex items-center gap-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
            style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
            onClick={() => handleItemClick('CircularEvent')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)] transition-colors duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
              <Megaphone size={18} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--color-text-primary)]">Announcements</div>
            </div>
            <ChevronRight size={16} className="text-[var(--color-text-muted)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="mb-4 mt-7 text-lg font-bold tracking-wide text-[var(--color-text-primary)]">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {quickActions.map(({ id, label }) => (
            <div
              key={id}
              className="group flex flex-col items-center gap-2.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-5 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:-translate-y-1"
              style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
              onClick={() => handleItemClick(id)}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-bg-icon)] text-[var(--color-text-primary)] transition-colors duration-300 group-hover:bg-[var(--color-accent)] group-hover:text-white">
                {<ClipboardList size={22} strokeWidth={1.8} />}
              </div>
              <div className="text-center text-sm font-bold text-[var(--color-text-primary)]">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}