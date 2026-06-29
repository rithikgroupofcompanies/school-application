import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Trophy,
  Medal,
  BarChart2,
  BookOpen,
  Star,
  FlaskConical,
  Microscope,
  Calculator,
  Atom,
  BookMarked,
  Globe,
  Landmark,
  Pin,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = '/api';   // TODO: replace with your base URL
const STUDENT_ID   = 'me';    // TODO: pull from auth context / route params

// ─────────────────────────────────────────────────────────────
// DATA FETCHING
// Replace the mock block below with your real fetch call.
//
// Expected response shape:
// {
//   terms: [
//     {
//       id: string,
//       label: string,          // e.g. "Term 1"
//       period: string,         // e.g. "Jan – Mar 2026"
//       overall_rank: number,
//       total_students: number,
//       percentage: number,
//       subjects: [
//         { name: string, marks: number, total: number, grade: string }
//       ]
//     }
//   ]
// }
// ─────────────────────────────────────────────────────────────
async function fetchRankData(studentId) {
  // ── REAL API (uncomment when ready) ──────────────────────
  // const res = await fetch(`${API_BASE_URL}/students/${studentId}/rank-card`);
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────

  // ── MOCK DATA (delete once API is live) ──────────────────
  await new Promise((r) => setTimeout(r, 800));
  return {
    terms: [
      {
        id: 'term1',
        label: 'Term 1',
        period: 'Jan – Mar 2026',
        overall_rank: 12,
        total_students: 150,
        percentage: 88.5,
        subjects: [
          { name: 'Mathematics', marks: 95, total: 100, grade: 'A+' },
          { name: 'Physics',     marks: 88, total: 100, grade: 'A'  },
          { name: 'Chemistry',   marks: 85, total: 100, grade: 'A'  },
          { name: 'Biology',     marks: 92, total: 100, grade: 'A+' },
          { name: 'English',     marks: 82, total: 100, grade: 'B+' },
          { name: 'History',     marks: 87, total: 100, grade: 'A'  },
          { name: 'Geography',   marks: 84, total: 100, grade: 'A'  },
        ],
      },
      {
        id: 'term2',
        label: 'Term 2',
        period: 'Apr – Jun 2025',
        overall_rank: 15,
        total_students: 150,
        percentage: 86.2,
        subjects: [
          { name: 'Mathematics', marks: 92, total: 100, grade: 'A+' },
          { name: 'Physics',     marks: 85, total: 100, grade: 'A'  },
          { name: 'Chemistry',   marks: 83, total: 100, grade: 'A'  },
          { name: 'Biology',     marks: 89, total: 100, grade: 'A'  },
          { name: 'English',     marks: 80, total: 100, grade: 'B+' },
          { name: 'History',     marks: 85, total: 100, grade: 'A'  },
          { name: 'Geography',   marks: 82, total: 100, grade: 'B+' },
        ],
      },
    ],
  };
  // ── END MOCK DATA ─────────────────────────────────────────
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const SUBJECT_ICONS = {
  Mathematics: <Calculator size={20} />,
  Physics:     <Atom size={20} />,
  Chemistry:   <FlaskConical size={20} />,
  Biology:     <Microscope size={20} />,
  English:     <BookMarked size={20} />,
  History:     <Landmark size={20} />,
  Geography:   <Globe size={20} />,
};

const getGradeStyle = (grade) => {
  if (grade === 'A+') return { color: '#4ade80', background: 'rgba(74,222,128,0.1)',   border: '1px solid rgba(74,222,128,0.25)'   };
  if (grade === 'A')  return { color: '#60a5fa', background: 'rgba(96,165,250,0.1)',   border: '1px solid rgba(96,165,250,0.25)'   };
  if (grade === 'B+') return { color: 'var(--color-accent)', background: 'rgba(232,180,79,0.1)', border: '1px solid rgba(232,180,79,0.3)' };
  return               { color: 'var(--color-text-muted)',  background: 'rgba(107,140,160,0.1)', border: '1px solid rgba(107,140,160,0.2)' };
};

const getBarColor = (pct) => {
  if (pct >= 90) return 'var(--color-accent)';
  if (pct >= 80) return '#60a5fa';
  return 'var(--color-text-muted)';
};

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        Loading rank card…
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
        Failed to load data
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

function StatCard({ iconElement, iconColor, label, value, subtext, accent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col items-center rounded-xl px-4 py-5 text-center transition-all"
      style={{
        background: 'var(--color-bg-card)',
        border: accent
          ? '2px solid var(--color-accent)'
          : `1.5px solid ${hovered ? 'var(--color-accent)' : 'var(--color-border)'}`,
        boxShadow: accent
          ? '0 2px 10px var(--color-shadow-accent-sm)'
          : '0 2px 10px var(--color-shadow-card-sm)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: 'var(--color-bg-icon)', color: iconColor || 'var(--color-accent)' }}
      >
        {iconElement}
      </div>
      <div className="mb-1 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
      <div
        className="text-3xl font-black"
        style={{ color: accent ? 'var(--color-accent)' : (iconColor || 'var(--color-text-primary)') }}
      >
        {value}
      </div>
      {subtext && (
        <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{subtext}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
function RankCard() {
  const navigate = useNavigate();

  const [terms, setTerms]                   = useState([]);
  const [selectedTermId, setSelectedTermId] = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRankData(STUDENT_ID);
      setTerms(data.terms);
      setSelectedTermId(data.terms[0]?.id ?? null);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const currentTerm = terms.find((t) => t.id === selectedTermId);

  const summary = currentTerm
    ? {
        avg:   (currentTerm.subjects.reduce((s, x) => s + x.marks, 0) / currentTerm.subjects.length).toFixed(1),
        high:  Math.max(...currentTerm.subjects.map((s) => s.marks)),
        low:   Math.min(...currentTerm.subjects.map((s) => s.marks)),
        aPlus: currentTerm.subjects.filter((s) => s.grade === 'A+').length,
      }
    : null;

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
            <Trophy size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Rank Card
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              Your academic performance
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && currentTerm && (
          <>
            {/* Term Selector */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                Select Term
              </h2>
              <div className="flex gap-3 flex-wrap">
                {terms.map((term) => {
                  const isActive = selectedTermId === term.id;
                  return (
                    <button
                      key={term.id}
                      onClick={() => setSelectedTermId(term.id)}
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
                              background: 'var(--color-bg-card)',
                              color: 'var(--color-text-muted)',
                              border: '1.5px solid var(--color-border)',
                            }
                      }
                    >
                      {term.label}
                      <span style={{ opacity: 0.6, marginLeft: '4px', fontWeight: 400 }}>
                        ({term.period})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overall Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <StatCard
                accent
                iconElement={<Medal size={18} />}
                label="Rank"
                value={currentTerm.overall_rank}
                subtext={`out of ${currentTerm.total_students}`}
              />
              <StatCard
                iconElement={<BarChart2 size={18} />}
                label="Percentage"
                value={`${currentTerm.percentage}%`}
              />
              <StatCard
                iconElement={<BookOpen size={18} />}
                label="Subjects"
                value={currentTerm.subjects.length}
              />
              <StatCard
                iconElement={<Star size={18} />}
                iconColor="#4ade80"
                label="Top Grade"
                value="A+"
              />
            </div>

            {/* Subject Performance */}
            <h2 className="mb-4 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Subject-wise Performance
            </h2>
            <div className="space-y-3">
              {currentTerm.subjects.map((subject, idx) => {
                const pct = (subject.marks / subject.total) * 100;
                return (
                  <div
                    key={idx}
                    className="rounded-xl px-4 py-4 transition-all duration-300 cursor-pointer"
                    style={{
                      background: 'var(--color-bg-card)',
                      border: '1.5px solid var(--color-border)',
                      boxShadow: '0 2px 10px var(--color-shadow-card-sm)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px var(--color-shadow-accent-sm)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-card-sm)';
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                          style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
                        >
                          {SUBJECT_ICONS[subject.name] ?? <BookOpen size={20} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            {subject.name}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {subject.marks} / {subject.total} marks
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md px-2.5 py-1 text-xs font-bold" style={getGradeStyle(subject.grade)}>
                        {subject.grade}
                      </div>
                    </div>

                    <div className="mb-2 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: getBarColor(pct) }}
                      />
                    </div>
                    <div className="text-right text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Performance Summary */}
            <div
              className="mt-8 rounded-xl px-5 py-5"
              style={{
                background: 'var(--color-bg-card)',
                border: '1.5px solid var(--color-border)',
                boxShadow: '0 2px 10px var(--color-shadow-card-sm)',
              }}
            >
              <h3 className="mb-4 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                Performance Summary
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Average Score', value: `${summary.avg}/100`,  Icon: Minus       },
                  { label: 'Highest Score', value: `${summary.high}/100`, Icon: TrendingUp   },
                  { label: 'Lowest Score',  value: `${summary.low}/100`,  Icon: TrendingDown },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                      <Icon size={12} />
                      <span>{label}</span>
                    </div>
                    <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between pt-3 text-xs"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Star size={12} style={{ color: '#4ade80' }} />
                    <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>A+ Subjects</span>
                  </div>
                  <span className="font-black" style={{ color: 'var(--color-accent)' }}>{summary.aPlus}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div
              className="mt-6 rounded-xl px-5 py-5"
              style={{
                background: 'var(--color-bg-card)',
                border: '1.5px solid var(--color-accent)',
                boxShadow: '0 2px 10px var(--color-shadow-accent-sm)',
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-md"
                  style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
                >
                  <Pin size={14} />
                </div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Important Notes
                </h3>
              </div>
              <ul className="space-y-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <li>• This is your official rank card issued by the school</li>
                <li>• Grades are based on internal assessments and final exams</li>
                <li>• Grading Scale: A+ (90–100), A (80–89), B+ (70–79), B (60–69)</li>
                <li>• For any discrepancies, contact the examination department</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RankCard;