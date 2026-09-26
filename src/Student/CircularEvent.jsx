import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Megaphone,
  FileText,
  CalendarDays,
  ListFilter,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  Inbox,
  Medal,
  Microscope,
  Users,
  Library,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = '/api';
const STUDENT_ID   = 'me';

// ─────────────────────────────────────────────────────────────
// DATA FETCHING
//
// Expected response shape:
// {
//   items: [
//     {
//       id: number | string,
//       title: string,
//       type: 'circular' | 'event',
//       date: string,           // ISO date e.g. "2026-02-28"
//       description: string,
//       priority: 'high' | 'normal',
//     }
//   ]
// }
// ─────────────────────────────────────────────────────────────
async function fetchCirculars(studentId) {
  // ── REAL API (uncomment when ready) ──────────────────────
  // const res = await fetch(`${API_BASE_URL}/students/${studentId}/circulars`);
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────

  // ── MOCK DATA (delete once API is live) ──────────────────
  await new Promise((r) => setTimeout(r, 700));
  return {
    items: [
      {
        id: 1,
        title: 'Annual Sports Day',
        type: 'event',
        date: '2026-02-28',
        description: 'Annual inter-school sports competition. All students are encouraged to participate.',
        priority: 'high',
      },
      {
        id: 2,
        title: 'Mid-term Exam Schedule',
        type: 'circular',
        date: '2026-02-15',
        description: 'Mid-term examinations will commence from February 18th, 2026. Please check the detailed schedule.',
        priority: 'high',
      },
      {
        id: 3,
        title: 'Science Exhibition',
        type: 'event',
        date: '2026-03-05',
        description: 'Annual science exhibition showcasing student projects. Registration deadline: Feb 20th.',
        priority: 'normal',
      },
      {
        id: 4,
        title: 'Parent-Teacher Meeting',
        type: 'event',
        date: '2026-02-22',
        description: 'Quarterly parent-teacher meeting to discuss student progress and performance.',
        priority: 'normal',
      },
      {
        id: 5,
        title: 'Library Timings Update',
        type: 'circular',
        date: '2026-02-14',
        description: 'Library will remain open until 8 PM during exam season.',
        priority: 'normal',
      },
    ],
  };
  // ── END MOCK DATA ─────────────────────────────────────────
}

// ─────────────────────────────────────────────────────────────
// HELPERS — icon per title keyword (UI concern, not API data)
// If your API later sends an `iconKey` field, map it here instead.
// ─────────────────────────────────────────────────────────────
function resolveIcon(item) {
  const t = item.title.toLowerCase();
  if (t.includes('sport'))    return <Medal size={20} />;
  if (t.includes('science'))  return <Microscope size={20} />;
  if (t.includes('parent') || t.includes('meeting')) return <Users size={20} />;
  if (t.includes('library'))  return <Library size={20} />;
  if (item.type === 'event')    return <CalendarDays size={20} />;
  return <FileText size={20} />;
}

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        Loading announcements…
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
      >
        <AlertCircle size={24} />
      </div>
      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
        Failed to load announcements
      </p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-lg px-4 py-2 text-xs font-bold"
        style={{
          background: 'var(--color-bg-card)',
          color: 'var(--color-accent)',
          border: '1.5px solid var(--color-accent)',
        }}
      >
        Retry
      </button>
    </div>
  );
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-4 py-2 text-xs font-bold transition-all duration-300"
      style={
        isActive
          ? {
              background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
              color: 'var(--color-accent)',
              border: '1.5px solid var(--color-accent)',
              boxShadow: '0 2px 8px var(--color-shadow-accent-md)',
            }
          : {
              background: 'var(--color-bg-icon)',
              color: 'var(--color-text-muted)',
              border: '1.5px solid var(--color-border)',
            }
      }
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
function CircularEvent() {
  const navigate = useNavigate();

  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const [filterType, setFilterType]         = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters]       = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCirculars(STUDENT_ID);
      setItems(data.items);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = items
    .filter((item) => filterType === 'all'     || item.type     === filterType)
    .filter((item) => filterPriority === 'all' || item.priority === filterPriority)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const hasActiveFilters = filterType !== 'all' || filterPriority !== 'all';

  const resetFilters = () => {
    setFilterType('all');
    setFilterPriority('all');
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-page-1), var(--color-bg-page-2))' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 border-b px-5 py-4 shadow-lg"
        style={{
          background: 'linear-gradient(90deg, var(--color-primary-darker), var(--color-primary-dark))',
          borderColor: 'var(--color-accent)',
          borderBottomWidth: '3px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
          >
            <Megaphone size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Circulars & Events
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              {loading ? '—' : `${filtered.length} of ${items.length} items`}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">

        {/* Section Header + Filter Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            All Announcements
          </h2>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
            style={{
              background: showFilters ? 'var(--color-accent)' : 'var(--color-bg-card)',
              color: showFilters ? 'var(--color-primary-darker)' : 'var(--color-accent)',
              border: '1.5px solid var(--color-accent)',
            }}
          >
            <ListFilter size={13} />
            {showFilters ? 'Hide Filters' : 'Filters'}
            {hasActiveFilters && !showFilters && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black"
                style={{ background: 'var(--color-accent)', color: 'var(--color-primary-darker)' }}
              >
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            className="mb-6 rounded-2xl px-5 py-5"
            style={{
              background: 'var(--color-bg-card)',
              border: '1.5px solid var(--color-border)',
              boxShadow: '0 4px 16px var(--color-shadow-card-sm)',
            }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Type Filter */}
              <div>
                <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all',      label: 'All'       },
                    { value: 'circular', label: 'Circulars' },
                    { value: 'event',    label: 'Events'    },
                  ].map(({ value, label }) => (
                    <FilterButton
                      key={value}
                      label={label}
                      isActive={filterType === value}
                      onClick={() => setFilterType(value)}
                    />
                  ))}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Priority
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all',    label: 'All'    },
                    { value: 'high',   label: 'High'   },
                    { value: 'normal', label: 'Normal' },
                  ].map(({ value, label }) => (
                    <FilterButton
                      key={value}
                      label={label}
                      isActive={filterPriority === value}
                      onClick={() => setFilterPriority(value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 flex items-center gap-1 text-xs font-bold transition-all hover:underline"
                style={{ color: 'var(--color-accent)' }}
              >
                <X size={11} /> Reset all filters
              </button>
            )}
          </div>
        )}

        {/* States */}
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadData} />}

        {/* Items List */}
        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 rounded-xl px-4 py-4 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'var(--color-bg-card)',
                  border: `1.5px solid ${item.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderLeft: item.priority === 'high' ? '4px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                  boxShadow: '0 2px 10px var(--color-shadow-card-sm)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                  e.currentTarget.style.boxShadow = '0 6px 20px var(--color-shadow-accent-sm)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.borderColor = item.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)';
                  e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-card-sm)';
                }}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
                >
                  {resolveIcon(item)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.priority === 'high' && (
                        <span
                          className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            background: 'rgba(232,180,79,0.1)',
                            color: 'var(--color-accent)',
                            border: '1px solid rgba(232,180,79,0.3)',
                          }}
                        >
                          URGENT
                        </span>
                      )}
                      <div
                        className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-primary-darker)',
                          boxShadow: '0 2px 6px var(--color-shadow-accent-sm)',
                        }}
                      >
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </div>

                  <p className="mb-2.5 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {item.description}
                  </p>

                  {/* Type Badge */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                      style={
                        item.type === 'event'
                          ? { background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }
                          : { background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }
                      }
                    >
                      {item.type === 'event'
                        ? <><CalendarDays size={9} /> Event</>
                        : <><FileText size={9} /> Circular</>
                      }
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  size={15}
                  className="mt-1 flex-shrink-0"
                  style={{ color: 'var(--color-text-muted)' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div
            className="flex flex-col items-center rounded-2xl px-6 py-12 text-center"
            style={{
              background: 'var(--color-bg-card)',
              border: '2px solid var(--color-border)',
              boxShadow: '0 4px 16px var(--color-shadow-card)',
            }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'var(--color-bg-icon)', color: 'var(--color-text-muted)' }}
            >
              <Inbox size={24} />
            </div>
            <div className="mb-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              No items match your filters
            </div>
            <div className="mb-5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Try adjusting your filter criteria
            </div>
            <button
              onClick={resetFilters}
              className="rounded-lg px-5 py-2.5 text-xs font-bold transition-all"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-primary-darker)',
                boxShadow: '0 2px 8px var(--color-shadow-accent-md)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px var(--color-shadow-accent-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px var(--color-shadow-accent-md)'}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CircularEvent;