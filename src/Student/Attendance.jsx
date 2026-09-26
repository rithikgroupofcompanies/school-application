import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BarChart2,
  UserCheck,
  UserX,
  CalendarDays,
  TrendingUp,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
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
//   months: [
//     {
//       id: string,            // e.g. "january"
//       label: string,         // e.g. "January"
//       present: number,
//       absent: number,
//       total: number,
//       percentage: number,
//     }
//   ],
//   dailyRecords: [
//     {
//       date: string,          // e.g. "Feb 17, 2026"
//       day: string,           // e.g. "Monday"
//       status: 'present' | 'absent',
//     }
//   ]
// }
// ─────────────────────────────────────────────────────────────
async function fetchAttendance(studentId) {
  // ── REAL API (uncomment when ready) ──────────────────────
  // const res = await fetch(`${API_BASE_URL}/students/${studentId}/attendance`);
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────

  // ── MOCK DATA (delete once API is live) ──────────────────
  await new Promise((r) => setTimeout(r, 700));
  return {
    months: [
      { id: 'january',  label: 'January',  present: 18, absent: 2, total: 20, percentage: 90 },
      { id: 'february', label: 'February', present: 22, absent: 1, total: 23, percentage: 96 },
      { id: 'march',    label: 'March',    present: 15, absent: 1, total: 16, percentage: 94 },
    ],
    dailyRecords: [
      { date: 'Feb 17, 2026', day: 'Tuesday',  status: 'present' },
      { date: 'Feb 16, 2026', day: 'Monday',   status: 'present' },
      { date: 'Feb 15, 2026', day: 'Sunday',   status: 'absent'  },
      { date: 'Feb 14, 2026', day: 'Saturday', status: 'absent'  },
      { date: 'Feb 13, 2026', day: 'Friday',   status: 'present' },
      { date: 'Feb 12, 2026', day: 'Thursday', status: 'present' },
      { date: 'Feb 11, 2026', day: 'Wednesday',status: 'present' },
      { date: 'Feb 10, 2026', day: 'Tuesday',  status: 'present' },
      { date: 'Feb 09, 2026', day: 'Monday',   status: 'absent'  },
      { date: 'Feb 08, 2026', day: 'Sunday',   status: 'present' },
      { date: 'Feb 07, 2026', day: 'Saturday', status: 'present' },
      { date: 'Feb 06, 2026', day: 'Friday',   status: 'present' },
      { date: 'Feb 05, 2026', day: 'Thursday', status: 'present' },
      { date: 'Feb 04, 2026', day: 'Wednesday',status: 'present' },
      { date: 'Feb 03, 2026', day: 'Tuesday',  status: 'present' },
      { date: 'Feb 02, 2026', day: 'Monday',   status: 'absent'  },
      { date: 'Feb 01, 2026', day: 'Sunday',   status: 'present' },
    ],
  };
}
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        Loading attendance…
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
        Failed to load attendance
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

function StatCard({ iconElement, iconColor, label, value, accent }) {
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
        className="text-2xl font-black"
        style={{ color: accent ? 'var(--color-accent)' : (iconColor || 'var(--color-text-primary)') }}
      >
        {value}
      </div>
    </div>
  );
}


function Attendance() {
  const navigate = useNavigate();

  const [months, setMonths]               = useState([]);
  const [dailyRecords, setDailyRecords]   = useState([]);
  const [selectedMonthId, setSelectedMonthId] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAttendance(STUDENT_ID);
      setMonths(data.months);
      setDailyRecords(data.dailyRecords);
      setSelectedMonthId(data.months[0]?.id ?? null);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const currentMonth = months.find((m) => m.id === selectedMonthId);

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
            <BarChart2 size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Attendance
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              Your attendance records
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && currentMonth && (
          <>
            {/* Month Selector */}
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                Select Month
              </h2>
              <div className="flex gap-3 flex-wrap">
                {months.map((month) => {
                  const isActive = selectedMonthId === month.id;
                  return (
                    <button
                      key={month.id}
                      onClick={() => setSelectedMonthId(month.id)}
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
                      {month.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard iconElement={<UserCheck size={18} />} iconColor="#4ade80" label="Present"    value={currentMonth.present}        />
              <StatCard iconElement={<UserX size={18} />}     iconColor="#f87171" label="Absent"     value={currentMonth.absent}         />
              <StatCard iconElement={<CalendarDays size={18} />}                  label="Total Days" value={currentMonth.total}          />
              <StatCard iconElement={<TrendingUp size={18} />} accent              label="Percentage" value={`${currentMonth.percentage}%`} />
            </div>

            {/* Daily Records */}
            <h2 className="mb-4 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Daily Records — {currentMonth.label}
            </h2>
            <div className="flex flex-col gap-2">
              {dailyRecords.map((record, idx) => {
                const isPresent = record.status === 'present';
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 cursor-pointer"
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
                    {/* Status Icon */}
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                      style={
                        isPresent
                          ? { background: 'rgba(74,222,128,0.1)', color: '#4ade80' }
                          : { background: 'rgba(248,113,113,0.1)', color: '#f87171' }
                      }
                    >
                      {isPresent ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    </div>

                    {/* Date Info */}
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {record.date}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {record.day}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
                      style={
                        isPresent
                          ? { color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }
                          : { color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }
                      }
                    >
                      {isPresent ? <UserCheck size={11} /> : <UserX size={11} />}
                      {isPresent ? 'Present' : 'Absent'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Monthly Breakdown */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                Monthly Breakdown
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {months.map((month) => {
                  const isSelected = selectedMonthId === month.id;
                  return (
                    <div
                      key={month.id}
                      className="rounded-xl px-5 py-5 transition-all cursor-pointer"
                      style={{
                        background: 'var(--color-bg-card)',
                        border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        boxShadow: isSelected
                          ? '0 4px 16px var(--color-shadow-accent-sm)'
                          : '0 2px 10px var(--color-shadow-card-sm)',
                      }}
                      onClick={() => setSelectedMonthId(month.id)}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                    >
                      <div className="mb-4 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {month.label}
                      </div>

                      {/* Visual attendance bar */}
                      <div className="mb-4">
                        <div className="flex h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-border)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${month.percentage}%`,
                              background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { label: 'Present', value: month.present },
                          { label: 'Absent',  value: month.absent  },
                          { label: 'Total Days', value: month.total },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-xs">
                            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                            <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                          </div>
                        ))}
                        <div
                          className="flex items-center justify-between pt-2.5"
                          style={{ borderTop: '1px solid var(--color-border)' }}
                        >
                          <span className="text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
                            Percentage
                          </span>
                          <span className="text-lg font-black" style={{ color: 'var(--color-accent)' }}>
                            {month.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;