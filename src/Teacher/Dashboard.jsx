import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardCheck,
  NotebookPen,
  BookOpen,
  LogOut,
  Users,
  CheckCircle2,
  XCircle,
  BarChart3,
  GraduationCap,
  ChevronRight,
  Trophy,
  CalendarOff,
  Plus,
} from 'lucide-react';

// ─── API LAYER ────────────────────────────────────────────────────────────────
// To connect your backend, replace each mock return with a real fetch():
//
//   async getDashboard() {
//     return await fetch('/api/teacher/dashboard').then(r => r.json());
//   }
//
// The shape of data returned must remain the same.
// ─────────────────────────────────────────────────────────────────────────────
const api = {
  async getDashboard() {
    // return await fetch('/api/teacher/dashboard').then(r => r.json());
    return {
      teacher: {
        name: 'Mrs. Priya Sharma',
        employeeId: 'TCH-204',
        subject: 'Mathematics',
        initials: 'PS',
      },
      classOverview: {
        totalStudents: 42,
        presentToday: 38,
        absentToday: 4,
        attendancePercentage: 90,
        attendanceSubmitted: false, // false = show "Mark Attendance" banner
      },
      todaysClasses: [
        { id: 1, class: '10-A', subject: 'Algebra',    time: '9:00 AM',  room: 'Room 12', status: 'completed' },
        { id: 2, class: '11-B', subject: 'Calculus',   time: '11:00 AM', room: 'Room 7',  status: 'ongoing'   },
        { id: 3, class: '9-C',  subject: 'Geometry',   time: '1:00 PM',  room: 'Room 3',  status: 'upcoming'  },
        { id: 4, class: '12-A', subject: 'Statistics', time: '3:00 PM',  room: 'Room 9',  status: 'upcoming'  },
      ],
      exams: [
        { id: 1, title: 'Algebra Unit Test', class: '10-A', date: 'Feb 18', syllabus: 'Ch. 4-6' },
        { id: 2, title: 'Calculus Mid-Term', class: '11-B', date: 'Feb 25', syllabus: 'Ch. 1-5' },
      ],
      homework: [
        { id: 1, title: 'Algebra Worksheet',   class: '10-A', submitted: 36, total: 42, due: 'Today'   },
        { id: 2, title: 'Calculus Problem Set', class: '11-B', submitted: 28, total: 38, due: 'Feb 22'  },
      ],
      leaveRequests: [
        { id: 1, student: 'Riya Nair',   class: '10-A', reason: 'Medical', from: 'Feb 16', to: 'Feb 17', status: 'pending'  },
        { id: 2, student: 'Arun Menon',  class: '11-B', reason: 'Family',  from: 'Feb 20', to: 'Feb 20', status: 'pending'  },
        { id: 3, student: 'Sara Thomas', class: '9-C',  reason: 'Medical', from: 'Feb 15', to: 'Feb 15', status: 'approved' },
      ],
      rankCards: [
        { id: 1, class: '10-A', exam: 'Unit Test 1', published: true,  students: 42 },
        { id: 2, class: '11-B', exam: 'Unit Test 1', published: false, students: 38 },
      ],
    };
  },
};

// ─── Status configs ───────────────────────────────────────────────────────────
const classStatusConfig = {
  completed: { label: 'Done',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  ongoing:   { label: 'Ongoing',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  upcoming:  { label: 'Upcoming', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
};

const leaveStatusConfig = {
  pending:  { label: 'Pending',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  approved: { label: 'Approved', color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
};

// ─── Reusable row card ────────────────────────────────────────────────────────
function CardRow({ icon, title, sub, badge, badgeStyle, onClick }) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
      style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
      onClick={onClick}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">{title}</div>
        {sub && <div className="text-xs text-[var(--color-text-muted)] truncate">{sub}</div>}
      </div>
      {badge && (
        <div className="shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold" style={badgeStyle}>
          {badge}
        </div>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, to, onAdd, addLabel }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-lg font-bold tracking-wide text-[var(--color-text-primary)]">{title}</h2>
      <div className="flex items-center gap-3">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-95"
          >
            <Plus size={13} strokeWidth={2.5} />
            {addLabel ?? 'Add'}
          </button>
        )}
        {to && (
          <Link to={to} className="text-xs font-bold text-[var(--color-accent)] transition-all hover:text-[var(--color-accent-hover)] hover:underline">
            view all
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = React.useState(null);

  React.useEffect(() => {
    api.getDashboard().then(setDashboard);
  }, []);

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">
        <div className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</div>
      </div>
    );
  }

  const { teacher, classOverview, todaysClasses, exams, homework, leaveRequests, rankCards } = dashboard;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');
  const go = (route) => navigate(route);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b-4 border-[var(--color-accent)] bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary-darker)] px-5 py-4 shadow-lg">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] text-base font-bold text-white"
          style={{ boxShadow: '0 2px 8px var(--color-shadow-avatar)' }}
        >
          {teacher.initials}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-bold tracking-wide text-white truncate">{teacher.name}</h3>
          <p className="text-xs text-[var(--color-text-header-sub)]">{teacher.subject} · {teacher.employeeId}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white hover:border-white/40 active:scale-95"
        >
          <LogOut size={14} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">

        {/* ═══════════════════════════════════
            1. ATTENDANCE
        ═══════════════════════════════════ */}
        <SectionHeader title="Attendance" to="MarkAttendance" />

        {/* Overview stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Students', value: classOverview.totalStudents,              icon: <Users        size={18} strokeWidth={1.8} />, accent: false },
            { label: 'Present Today',  value: classOverview.presentToday,               icon: <CheckCircle2 size={18} strokeWidth={1.8} />, accent: true  },
            { label: 'Absent Today',   value: classOverview.absentToday,                icon: <XCircle      size={18} strokeWidth={1.8} />, accent: false },
            { label: 'Attendance %',   value: `${classOverview.attendancePercentage}%`, icon: <BarChart3    size={18} strokeWidth={1.8} />, accent: false },
          ].map((stat, i) => (
            <div
              key={i}
              onClick={() => go('MarkAttendance')}
              className={`flex flex-col items-center rounded-2xl border-2 px-4 py-5 text-center transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                stat.accent
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-accent)]'
              }`}
              style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${stat.accent ? 'bg-white/20 text-white' : 'bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]'}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-black leading-none ${stat.accent ? 'text-white' : 'text-[var(--color-accent)]'}`}>
                {stat.value}
              </div>
              <div className={`mt-1.5 text-xs font-semibold ${stat.accent ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mark attendance banner */}
        {!classOverview.attendanceSubmitted && (
          <div
            onClick={() => go('MarkAttendance')}
            className="mb-4 flex items-center gap-4 rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-accent-light)] px-5 py-4 cursor-pointer transition-all duration-300 hover:bg-[var(--color-accent)] group"
            style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent)] text-white group-hover:bg-white group-hover:text-[var(--color-accent)] transition-colors duration-300">
              <ClipboardCheck size={22} strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-white transition-colors duration-300">Mark Today's Attendance</div>
              <div className="text-xs text-[var(--color-text-muted)] group-hover:text-white/80 transition-colors duration-300">Attendance not yet submitted for today</div>
            </div>
            <ChevronRight size={18} className="text-[var(--color-accent)] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </div>
        )}

        {/* Today's class periods */}
        {/* <div className="mb-10 flex flex-col gap-3">
          {todaysClasses.map((cls) => {
            const st = classStatusConfig[cls.status];
            return (
              <CardRow
                key={cls.id}
                icon={<GraduationCap size={18} strokeWidth={1.8} />}
                title={`Class ${cls.class} — ${cls.subject}`}
                sub={`${cls.time} · ${cls.room}`}
                badge={st.label}
                badgeStyle={{ background: st.bg, color: st.color }}
                onClick={() => go(`MarkAttendance/${cls.id}`)}
              />
            );
          })}
        </div> */}

        {/* ═══════════════════════════════════
            2. EXAMS
        ═══════════════════════════════════ */}
        <SectionHeader title="Exams" to="AllExams" onAdd={() => go('ExamAssign')} addLabel="New Exam" />

        <div className="mb-10 flex flex-col gap-3">
          {exams.map((exam) => (
            <CardRow
              key={exam.id}
              icon={<NotebookPen size={18} strokeWidth={1.8} />}
              title={exam.title}
              sub={`Class ${exam.class} · ${exam.syllabus}`}
              badge={exam.date}
              badgeStyle={{ background: 'var(--color-accent)', color: '#fff', boxShadow: '0 2px 6px var(--color-shadow-badge)' }}
              onClick={() => go(`Exams/${exam.id}`)}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════
            3. HOMEWORK
        ═══════════════════════════════════ */}
        <SectionHeader title="Homework" to="HomeWork" onAdd={() => go('HomeWorkAssign')} addLabel="Assign" />

        <div className="mb-10 flex flex-col gap-3">
          {homework.map((hw) => {
            const pct = Math.round((hw.submitted / hw.total) * 100);
            return (
              <div
                key={hw.id}
                className="flex flex-col gap-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
                style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
                onClick={() => go(`Homework/${hw.id}`)}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]">
                    <BookOpen size={18} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">{hw.title}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">Class {hw.class} · Due {hw.due}</div>
                  </div>
                  <div
                    className="shrink-0 whitespace-nowrap rounded-md bg-[var(--color-accent)] px-2.5 py-1 text-xs font-bold text-white"
                    style={{ boxShadow: '0 2px 6px var(--color-shadow-badge)' }}
                  >
                    {hw.submitted}/{hw.total}
                  </div>
                </div>
                {/* Submission progress bar */}
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-muted)]">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════
            4. LEAVE REQUESTS
        ═══════════════════════════════════ */}
        <SectionHeader title="Leave Requests" to="LeaveRequests" />

        {/* Pending alert */}
        {pendingLeaves.length > 0 && (
          <div
            onClick={() => go('LeaveRequests?filter=pending')}
            className="mb-4 flex items-center gap-3 rounded-xl border-2 border-amber-400/40 bg-amber-50/60 px-4 py-3 cursor-pointer transition-all duration-200 hover:border-amber-400 hover:translate-x-1"
            style={{ boxShadow: '0 2px 10px var(--color-shadow-card-sm)' }}
          >
            <CalendarOff size={18} strokeWidth={1.8} className="text-amber-500 shrink-0" />
            <span className="flex-1 text-sm font-bold text-[var(--color-text-primary)]">
              {pendingLeaves.length} pending leave {pendingLeaves.length === 1 ? 'request' : 'requests'} awaiting review
            </span>
            <ChevronRight size={15} className="text-[var(--color-text-muted)]" />
          </div>
        )}

        <div className="mb-10 flex flex-col gap-3">
          {leaveRequests.slice(0, 3).map((leave) => {
            const st = leaveStatusConfig[leave.status];
            return (
              <CardRow
                key={leave.id}
                icon={<CalendarOff size={18} strokeWidth={1.8} />}
                title={`${leave.student} — Class ${leave.class}`}
                sub={`${leave.reason} · ${leave.from}${leave.from !== leave.to ? ` → ${leave.to}` : ''}`}
                badge={st.label}
                badgeStyle={{ background: st.bg, color: st.color }}
                onClick={() => go(`LeaveRequests/${leave.id}`)}
              />
            );
          })}
        </div>

        {/* ═══════════════════════════════════
            5. RANK CARDS
        ═══════════════════════════════════ */}
        <SectionHeader title="Rank Cards" to="RankCards" onAdd={() => go('RankCards/Assign')} addLabel="Assign" />

        <div className="mb-10 flex flex-col gap-3">
          {rankCards.map((rc) => (
            <CardRow
              key={rc.id}
              icon={<Trophy size={18} strokeWidth={1.8} />}
              title={`Class ${rc.class} — ${rc.exam}`}
              sub={`${rc.students} students`}
              badge={rc.published ? 'Published' : 'Draft'}
              badgeStyle={
                rc.published
                  ? { background: 'rgba(34,197,94,0.12)',  color: '#22c55e' }
                  : { background: 'rgba(99,102,241,0.12)', color: '#6366f1' }
              }
              onClick={() => go(`RankCards/${rc.id}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}