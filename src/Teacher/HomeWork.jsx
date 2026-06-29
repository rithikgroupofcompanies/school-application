import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpenCheck,
  BookMarked,
  Activity,
  CalendarDays,
  CheckCircle2,
  Loader2,
  AlertCircle,
  PartyPopper,
  Search,
  Upload,
  Plus,
  Pencil,
  Trash2,
  CheckCheck,
  Users,
  Star,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
async function fetchHomework() {
  await new Promise((r) => setTimeout(r, 700));
  return [
    { id: 1, subject: 'Mathematics', title: 'Math Worksheet',      dueDate: '2026-04-18', priority: 'high',   totalMarks: 50,  submittedCount: 18, totalStudents: 32, status: 'active'    },
    { id: 2, subject: 'Physics',     title: 'Numerical Problems',  dueDate: '2026-04-20', priority: 'high',   totalMarks: 40,  submittedCount: 10, totalStudents: 32, status: 'active'    },
    { id: 3, subject: 'English',     title: 'Essay Writing',       dueDate: '2026-04-21', priority: 'normal', totalMarks: 30,  submittedCount: 25, totalStudents: 30, status: 'active'    },
    { id: 4, subject: 'Chemistry',   title: 'Lab Report',          dueDate: '2026-04-10', priority: 'high',   totalMarks: 50,  submittedCount: 28, totalStudents: 28, status: 'completed' },
    { id: 5, subject: 'Biology',     title: 'Project Work',        dueDate: '2026-04-25', priority: 'normal', totalMarks: 100, submittedCount: 5,  totalStudents: 35, status: 'active'    },
    { id: 6, subject: 'History',     title: 'Research Assignment', dueDate: '2026-03-30', priority: 'normal', totalMarks: 35,  submittedCount: 0,  totalStudents: 29, status: 'overdue'   },
  ];
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const daysRemaining = (d) =>
  Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

const dueDateBadgeStyle = (daysLeft) => {
  if (daysLeft < 0)  return { background: '#ef4444', color: '#fff' };
  if (daysLeft <= 2) return { background: '#f97316', color: '#fff' };
  return { background: 'var(--color-accent)', color: 'var(--color-primary-darker)' };
};

const submissionRate = (submitted, total) =>
  total === 0 ? 0 : Math.round((submitted / total) * 100);

const statusConfig = {
  active:    { label: 'Active',    color: '#6366f1' },
  overdue:   { label: 'Overdue',   color: '#ef4444' },
  completed: { label: 'Completed', color: '#4ade80' },
};

// ─────────────────────────────────────────────────────────────
// LOADING / ERROR / EMPTY
// ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>Loading homework…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
        <AlertCircle size={24} />
      </div>
      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Failed to load</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      <button onClick={onRetry}
        className="mt-2 rounded-lg px-4 py-2 text-xs font-bold"
        style={{ background: 'var(--color-bg-card)', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)' }}>
        Retry
      </button>
    </div>
  );
}

function EmptyState({ onAssign }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-6 py-12 text-center"
      style={{ background: 'var(--color-bg-card)', border: '2px solid var(--color-border)', boxShadow: '0 4px 16px var(--color-shadow-card)' }}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
        <PartyPopper size={24} />
      </div>
      <div className="mb-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>No homework assigned yet!</div>
      <div className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Start by assigning homework to your classes</div>
      <button onClick={onAssign}
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)' }}>
        <Plus size={13} /> Assign Homework
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function ProgressBar({ submitted, total }) {
  const pct   = submissionRate(submitted, total);
  const color = pct === 100 ? '#4ade80' : pct >= 50 ? 'var(--color-accent)' : '#f97316';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-icon)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold shrink-0" style={{ color }}>{submitted}/{total}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOMEWORK CARD  — mirrors student card layout exactly
// ─────────────────────────────────────────────────────────────
function HomeworkCard({ task, onEdit, onDelete }) {
  const daysLeft    = daysRemaining(task.dueDate);
  const isOverdue   = daysLeft < 0;
  const isUrgent    = !isOverdue && daysLeft <= 2;
  const isHighPri   = task.priority === 'high';
  const isCompleted = task.status === 'completed';

  return (
    <div
      className="rounded-xl px-5 py-4 transition-all duration-300"
      style={{
        background:  'var(--color-bg-card)',
        border:      `1.5px solid ${isHighPri ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderLeft:  isHighPri ? '4px solid var(--color-accent)' : isOverdue ? '4px solid #ef4444' : '1.5px solid var(--color-border)',
        boxShadow:   '0 2px 10px var(--color-shadow-card-sm)',
        opacity:     isCompleted ? 0.85 : 1,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px var(--color-shadow-accent-sm)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-card-sm)'; e.currentTarget.style.borderColor = isHighPri ? 'var(--color-accent)' : 'var(--color-border)'; }}
    >
      {/* ── Top Row — identical to student card ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
            <BookMarked size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{task.subject}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Priority badge — same as student "Urgent" badge */}
          {isHighPri && (
            <span className="flex items-center gap-0.5 rounded-md px-2 py-0.5 text-[10px] font-bold"
              style={{ background: 'rgba(232,180,79,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(232,180,79,0.3)' }}>
              {isUrgent || isOverdue ? 'Urgent' : <><Star size={9} fill="currentColor" /> High</>}
            </span>
          )}
          {/* Due date badge — exact same style as student card */}
          <div className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
            style={{ ...dueDateBadgeStyle(daysLeft), boxShadow: '0 2px 6px var(--color-shadow-accent-sm)' }}>
            {formatDate(task.dueDate)}
          </div>
        </div>
      </div>

      {/* ── Details grid — same 3-col grid as student card ── */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Marks',     value: task.totalMarks,                                          Icon: Activity,     color: 'var(--color-text-primary)' },
          { label: 'Days Left', value: isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft} days`, Icon: CalendarDays, color: isOverdue ? '#f87171' : isUrgent ? '#f97316' : 'var(--color-accent)' },
          { label: 'Status',    value: statusConfig[task.status]?.label ?? task.status,           Icon: CheckCircle2, color: statusConfig[task.status]?.color ?? 'var(--color-text-muted)' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-lg px-3 py-2"
            style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
              <Icon size={10} />
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-xs font-bold capitalize" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Submission progress — replaces student's Submit button ── */}
      <div className="mt-3 rounded-xl px-4 py-3"
        style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Users size={11} style={{ color: 'var(--color-text-muted)' }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
            Student Submissions
          </span>
        </div>
        <ProgressBar submitted={task.submittedCount} total={task.totalStudents} />
      </div>

      {/* ── Teacher actions — Edit + Delete (where student had Submit) ── */}
      {isCompleted ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5"
          style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCheck size={14} style={{ color: '#4ade80' }} />
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>All students submitted</span>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
              color:  'var(--color-accent)',
              border: '1.5px solid var(--color-accent)',
              boxShadow: '0 2px 10px var(--color-shadow-accent-sm)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px var(--color-shadow-accent-md)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-accent-sm)')}>
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color:  '#f87171',
              border: '1.5px solid rgba(239,68,68,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}>
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function TeacherHomework() {
  const navigate = useNavigate();

  const [tasks, setTasks]               = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHomework();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleEdit   = (task) => navigate(`/teacher/homework/edit/${task.id}`);
  const handleDelete = (id)   => setTasks((prev) => prev.filter((t) => t.id !== id));

  const filtered = tasks
    .filter((t) => {
      const matchFilter = selectedFilter === 'all' || t.priority === selectedFilter;
      const matchSearch = !search.trim() ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--color-bg-page-1), var(--color-bg-page-2))' }}>

      {/* ── Header — same structure as student page ── */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 border-b px-5 py-4 shadow-lg"
        style={{
          background: 'linear-gradient(90deg, var(--color-primary-darker), var(--color-primary-dark))',
          borderColor: 'var(--color-accent)',
          borderBottomWidth: '3px',
        }}
      >
        <button onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2.5 flex-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
            <BookOpenCheck size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Assigned Homework
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              {loading ? '—' : `${filtered.length} assignments`}
            </p>
          </div>
        </div>

        {/* Assign new */}
        <button
          onClick={() => navigate('/teacher/homework/assign')}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
            color: 'var(--color-accent)',
            border: '1.5px solid var(--color-accent)',
            boxShadow: '0 2px 8px var(--color-shadow-accent-sm)',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 14px var(--color-shadow-accent-md)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px var(--color-shadow-accent-sm)')}>
          <Plus size={13} /> Assign
        </button>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && (
          <>
            {/* ── Search + Filter — same row layout as student filter ── */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-muted)' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or subject…"
                  className="w-full rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold outline-none transition-all"
                  style={{ background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>

              {/* Filter chips — same exact style as student page */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-wide mr-1" style={{ color: 'var(--color-text-primary)' }}>
                  My Homework
                </h2>
                {['all', 'high', 'normal'].map((f) => {
                  const isActive = selectedFilter === f;
                  return (
                    <button key={f} onClick={() => setSelectedFilter(f)}
                      className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-300"
                      style={isActive
                        ? { background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)', boxShadow: '0 2px 8px var(--color-shadow-accent-md)' }
                        : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)', border: '1.5px solid var(--color-border)' }}>
                      {f === 'all' ? 'All' : f === 'high' ? 'High Priority' : 'Normal'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Task list ── */}
            {filtered.length === 0 ? (
              <EmptyState onAssign={() => navigate('/teacher/homework/assign')} />
            ) : (
              <div className="space-y-3">
                {filtered.map((task) => (
                  <HomeworkCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}