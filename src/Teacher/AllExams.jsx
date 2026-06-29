import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  NotebookPen,
  Plus,
  Search,
  BookOpen,
  Users,
  CalendarDays,
  Clock,
  Timer,
  Activity,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

// ─── API LAYER ────────────────────────────────────────────────────────────────
const api = {
  async getExams() {
    // return await fetch('/api/teacher/exams').then(r => r.json());
    return [
      { id: 1,  title: 'Algebra Unit Test',       class: '10-A', subject: 'Mathematics', type: 'Unit Test',  date: '2026-02-18', time: '10:00 AM', duration: '1 hr',    totalMarks: 100, syllabus: 'Ch. 4–6',        status: 'upcoming' },
      { id: 2,  title: 'Calculus Mid-Term',        class: '11-B', subject: 'Mathematics', type: 'Mid-Term',   date: '2026-02-25', time: '11:00 AM', duration: '2 hrs',   totalMarks: 150, syllabus: 'Ch. 1–5',        status: 'upcoming' },
      { id: 3,  title: 'Statistics Quiz',          class: '12-A', subject: 'Mathematics', type: 'Quiz',       date: '2026-03-01', time: '9:00 AM',  duration: '45 min',  totalMarks: 50,  syllabus: 'Ch. 7–8',        status: 'upcoming' },
      { id: 4,  title: 'Geometry Final',           class: '9-C',  subject: 'Mathematics', type: 'Final Exam', date: '2026-01-15', time: '1:00 PM',  duration: '2.5 hrs', totalMarks: 200, syllabus: 'Full Syllabus',  status: 'completed' },
      { id: 5,  title: 'Trigonometry Unit Test',   class: '10-A', subject: 'Mathematics', type: 'Unit Test',  date: '2026-01-28', time: '10:00 AM', duration: '1 hr',    totalMarks: 100, syllabus: 'Ch. 7–9',        status: 'completed' },
      { id: 6,  title: 'Number Theory Quiz',       class: '11-B', subject: 'Mathematics', type: 'Quiz',       date: '2026-02-10', time: '2:00 PM',  duration: '30 min',  totalMarks: 30,  syllabus: 'Ch. 3',          status: 'completed' },
    ];
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
  ongoing:   { label: 'Ongoing',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  completed: { label: 'Completed', color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
};

const TYPE_COLORS = {
  'Unit Test':  { color: '#6366f1', bg: 'rgba(99,102,241,0.10)'  },
  'Mid-Term':   { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
  'Final Exam': { color: '#ef4444', bg: 'rgba(239,68,68,0.10)'   },
  'Quiz':       { color: '#22c55e', bg: 'rgba(34,197,94,0.10)'   },
  'Assignment': { color: '#06b6d4', bg: 'rgba(6,182,212,0.10)'   },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

// ─── Stat summary bar ─────────────────────────────────────────────────────────
function StatBar({ exams }) {
  const upcoming  = exams.filter(e => e.status === 'upcoming').length;
  const completed = exams.filter(e => e.status === 'completed').length;
  return (
    <div className="mb-6 grid grid-cols-3 gap-3">
      {[
        { label: 'Total',     value: exams.length, color: false },
        { label: 'Upcoming',  value: upcoming,     color: '#6366f1', bg: 'rgba(99,102,241,0.10)' },
        { label: 'Completed', value: completed,    color: '#22c55e', bg: 'rgba(34,197,94,0.10)'  },
      ].map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] py-4 text-center"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div
            className="text-2xl font-black leading-none"
            style={{ color: s.color || 'var(--color-accent)' }}
          >
            {s.value}
          </div>
          <div className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Exam card ────────────────────────────────────────────────────────────────
function ExamCard({ exam }) {
  const st = STATUS_CONFIG[exam.status];
  const tc = TYPE_COLORS[exam.type] ?? { color: 'var(--color-accent)', bg: 'var(--color-accent-light)' };
  const days = daysUntil(exam.date);

  return (
    <div
      className="group flex flex-col gap-3 rounded-xl border-2 bg-[var(--color-bg-card)] px-4 py-4 transition-all duration-300 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)] hover:translate-x-1"
      style={{
        borderColor: 'var(--color-border)',
        boxShadow: '0 2px 10px var(--color-shadow-card-sm)',
        borderLeft: exam.status === 'upcoming' ? '4px solid var(--color-accent)' : undefined,
      }}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]">
          <NotebookPen size={18} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">{exam.title}</div>
          <div className="text-xs text-[var(--color-text-muted)]">
            Class {exam.class} · {exam.subject}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Type badge */}
          <span
            className="whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold"
            style={{ background: tc.bg, color: tc.color }}
          >
            {exam.type}
          </span>
          {/* Status badge */}
          <span
            className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
            style={{ background: st.bg, color: st.color }}
          >
            {st.label}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: 'Date',     value: formatDate(exam.date), Icon: CalendarDays },
          { label: 'Time',     value: exam.time,             Icon: Clock        },
          { label: 'Duration', value: exam.duration,         Icon: Timer        },
          { label: 'Marks',    value: exam.totalMarks,       Icon: Activity     },
        ].map(({ label, value, Icon }) => (
          <div
            key={label}
            className="rounded-lg px-3 py-2"
            style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}
          >
            <div className="mb-1 flex items-center gap-1 text-[var(--color-text-muted)]">
              <Icon size={10} />
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-xs font-bold text-[var(--color-text-primary)]">{value}</div>
          </div>
        ))}
      </div>

      {/* Syllabus + days countdown */}
      <div className="flex items-center gap-2">
        <div
          className="flex flex-1 items-center gap-1.5 rounded-lg px-3 py-2"
          style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}
        >
          <BookOpen size={10} className="text-[var(--color-text-muted)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] mr-1">Syllabus</span>
          <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{exam.syllabus}</span>
        </div>
        {exam.status === 'upcoming' && (
          <div
            className="shrink-0 rounded-lg px-3 py-2 text-xs font-black"
            style={{ background: 'var(--color-accent)', color: '#fff', boxShadow: '0 2px 6px var(--color-shadow-badge)' }}
          >
            {days > 0 ? `${days}d left` : 'Today'}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AllExams() {
  const navigate = useNavigate();
  const [exams, setExams]           = React.useState(null);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('all');

  React.useEffect(() => {
    api.getExams().then(setExams);
  }, []);

  if (!exams) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">
        <div className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</div>
      </div>
    );
  }

  const filtered = exams.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.class.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Sort: upcoming first by date, then completed
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
    if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">

      {/* ── Header ── */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 border-b-[3px] border-[var(--color-accent)] px-5 py-4 shadow-lg"
        style={{ background: 'linear-gradient(90deg, var(--color-primary-darker), var(--color-primary-dark))' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white shrink-0">
            <NotebookPen size={17} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold tracking-wide text-white">All Exams</h3>
            <p className="text-xs text-[var(--color-text-header-sub)]">{exams.length} exams scheduled</p>
          </div>
        </div>
        <button
          onClick={() => navigate('../ExamAssign')}
          className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
        >
          <Plus size={14} strokeWidth={2.5} />
          New Exam
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-6">

        {/* Stats */}
        <StatBar exams={exams} />

        {/* Search + filter */}
        <div className="mb-5 flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search exams, classes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] pl-9 pr-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-all placeholder:font-normal placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
            />
          </div>
          {/* Filter chips */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="shrink-0 text-[var(--color-text-muted)]" />
            {['all', 'upcoming', 'completed'].map((f) => {
              const active = filterStatus === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-lg px-3 py-2 text-xs font-bold capitalize transition-all duration-200"
                  style={
                    active
                      ? { background: 'var(--color-accent)', color: '#fff', boxShadow: '0 2px 6px var(--color-shadow-badge)' }
                      : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)', border: '2px solid var(--color-border)' }
                  }
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {sorted.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
            />
          ))}

          {/* Empty state */}
          {sorted.length === 0 && (
            <div
              className="flex flex-col items-center rounded-2xl px-6 py-12 text-center"
              style={{
                background: 'var(--color-bg-card)',
                border: '2px solid var(--color-border)',
                boxShadow: '0 4px 16px var(--color-shadow-card)',
              }}
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-icon)] text-[var(--color-text-muted)]">
                <NotebookPen size={24} />
              </div>
              <div className="mb-2 text-sm font-bold text-[var(--color-text-primary)]">No exams found</div>
              <div className="mb-4 text-xs text-[var(--color-text-muted)]">Try a different search or filter</div>
              <button
                onClick={() => navigate('')}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[var(--color-accent-hover)] active:scale-95"
              >
                <Plus size={13} strokeWidth={2.5} />
                Schedule New Exam
              </button>
            </div>
          )}
        </div>

        <div className="pb-6" />
      </div>
    </div>
  );
}