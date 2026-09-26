import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ClipboardList,
  Stethoscope,
  User,
  CalendarDays,
  HeartPulse,
  Paperclip,
  CheckCircle2,
  Clock,
  XCircle,
  Pin,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = '/api';
const STUDENT_ID   = 'me';

// ─────────────────────────────────────────────────────────────
// DATA FETCHING
//
// fetchLeaveHistory — GET leave history
// Expected response shape:
// {
//   history: [
//     {
//       id: number | string,
//       type: string,
//       startDate: string,     // e.g. "Feb 5, 2026"
//       endDate: string,
//       status: 'Approved' | 'Pending' | 'Rejected',
//       days: number,
//     }
//   ]
// }
//
// submitLeaveRequest — POST new leave application
// Request body:
// {
//   leaveType: string,
//   startDate: string,        // ISO date e.g. "2026-02-19"
//   endDate: string,
//   reason: string,
//   attachment?: File,
// }
// Expected response shape:
// {
//   success: boolean,
//   leave: { id, type, startDate, endDate, status, days }
// }
// ─────────────────────────────────────────────────────────────
async function fetchLeaveHistory(studentId) {
  // ── REAL API (uncomment when ready) ──────────────────────
  // const res = await fetch(`${API_BASE_URL}/students/${studentId}/leaves`);
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────

  // ── MOCK DATA (delete once API is live) ──────────────────
  await new Promise((r) => setTimeout(r, 700));
  return {
    history: [
      { id: 1, type: 'Sick Leave',     startDate: 'Feb 5, 2026',  endDate: 'Feb 6, 2026',  status: 'Approved', days: 2 },
      { id: 2, type: 'Personal Leave', startDate: 'Jan 20, 2026', endDate: 'Jan 21, 2026', status: 'Approved', days: 2 },
      { id: 3, type: 'Casual Leave',   startDate: 'Jan 10, 2026', endDate: 'Jan 10, 2026', status: 'Approved', days: 1 },
    ],
  };
  // ── END MOCK DATA ─────────────────────────────────────────
}

async function submitLeaveRequest(studentId, formData) {
  // ── REAL API (uncomment when ready) ──────────────────────
  // const body = new FormData();
  // body.append('leaveType',  formData.leaveType);
  // body.append('startDate',  formData.startDate);
  // body.append('endDate',    formData.endDate);
  // body.append('reason',     formData.reason);
  // if (formData.attachment) body.append('attachment', formData.attachment);
  // const res = await fetch(`${API_BASE_URL}/students/${studentId}/leaves`, {
  //   method: 'POST',
  //   body,
  // });
  // if (!res.ok) throw new Error(`Server error: ${res.status}`);
  // return res.json();
  // ─────────────────────────────────────────────────────────

  // ── MOCK SUBMIT (delete once API is live) ─────────────────
  await new Promise((r) => setTimeout(r, 800));
  const leaveType   = LEAVE_TYPES.find((t) => t.value === formData.leaveType);
  const start       = new Date(formData.startDate);
  const end         = new Date(formData.endDate);
  const days        = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const fmt         = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return {
    success: true,
    leave: {
      id:        Date.now(),
      type:      leaveType.label,
      startDate: fmt(start),
      endDate:   fmt(end),
      status:    'Pending',
      days,
    },
  };
  // ── END MOCK SUBMIT ────────────────────────────────────────
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const LEAVE_TYPES = [
  { value: 'sick',     label: 'Sick Leave',     Icon: Stethoscope },
  { value: 'personal', label: 'Personal Leave', Icon: User        },
  { value: 'casual',   label: 'Casual Leave',   Icon: CalendarDays },
  { value: 'medical',  label: 'Medical Leave',  Icon: HeartPulse  },
];

const STATUS_CONFIG = {
  Approved: { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)',  Icon: CheckCircle2 },
  Pending:  { color: 'var(--color-accent)', bg: 'rgba(232,180,79,0.1)', border: 'rgba(232,180,79,0.3)', Icon: Clock },
  Rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', Icon: XCircle },
};

const INITIAL_FORM = { leaveType: 'sick', startDate: '', endDate: '', reason: '', attachment: null };

// ─────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
        Loading leave history…
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
        Failed to load leave history
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

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
function ApplyForLeave() {
  const navigate = useNavigate();

  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [formData, setFormData]     = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaveHistory(STUDENT_ID);
      setHistory(data.history);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await submitLeaveRequest(STUDENT_ID, formData);
      if (res.success) {
        setHistory((prev) => [res.leave, ...prev]);
        setFormData(INITIAL_FORM);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 5000);
      }
    } catch (err) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    borderRadius: '8px',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-bg-icon)',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
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
            <ClipboardList size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Apply for Leave
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              Submit your leave request
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">

        {/* Success Banner */}
        {successMsg && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl px-5 py-4"
            style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1.5px solid rgba(74,222,128,0.3)',
            }}
          >
            <CheckCircle2 size={20} style={{ color: '#4ade80', flexShrink: 0 }} />
            <div>
              <div className="text-sm font-bold" style={{ color: '#4ade80' }}>
                Leave request submitted successfully!
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Your request will be reviewed by the administration.
              </p>
            </div>
          </div>
        )}

        {/* Submit Error Banner */}
        {submitError && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl px-5 py-4"
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1.5px solid rgba(248,113,113,0.3)',
            }}
          >
            <AlertCircle size={20} style={{ color: '#f87171', flexShrink: 0 }} />
            <div className="text-sm font-bold" style={{ color: '#f87171' }}>
              {submitError}
            </div>
          </div>
        )}

        {/* Leave Application Form */}
        <div
          className="mb-8 rounded-2xl px-6 py-6"
          style={{
            background: 'var(--color-bg-card)',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 4px 16px var(--color-shadow-card-sm)',
          }}
        >
          <h2 className="mb-6 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            New Leave Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Leave Type */}
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Leave Type
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {LEAVE_TYPES.map(({ value, label, Icon }) => {
                  const isActive = formData.leaveType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, leaveType: value }))}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-300"
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
                      <Icon size={14} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { label: 'Start Date', name: 'startDate' },
                { label: 'End Date',   name: 'endDate'   },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                    {label}
                  </label>
                  <input
                    type="date"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>
              ))}
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Reason for Leave
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a detailed reason for your leave request…"
                rows={4}
                required
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                Attachments (Optional)
              </label>
              <div
                className="relative cursor-pointer rounded-lg px-4 py-6 text-center transition-all"
                style={{
                  border: '1.5px dashed var(--color-border)',
                  background: 'var(--color-bg-icon)',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <input
                  type="file"
                  onChange={(e) => setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }))}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Paperclip size={24} style={{ color: 'var(--color-text-muted)', margin: '0 auto' }} />
                <div className="mt-2 text-xs font-bold" style={{ color: 'var(--color-text-muted)' }}>
                  {formData.attachment ? formData.attachment.name : 'Click to upload or drag and drop'}
                </div>
                <p className="mt-1 text-[10px]" style={{ color: 'var(--color-text-header-sub)' }}>
                  Medical certificates, doctor's notes, etc.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all"
              style={{
                background: submitting
                  ? 'var(--color-bg-icon)'
                  : 'linear-gradient(90deg, var(--color-accent), var(--color-accent-hover))',
                color: submitting ? 'var(--color-text-muted)' : 'var(--color-primary-darker)',
                boxShadow: submitting ? 'none' : '0 4px 12px var(--color-shadow-accent-md)',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                <><Send size={16} /> Submit Leave Request</>
              )}
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div>
          <h2 className="mb-4 text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            Leave History
          </h2>

          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={loadHistory} />}

          {!loading && !error && (
            <div className="space-y-3">
              {history.map((leave) => {
                const cfg = STATUS_CONFIG[leave.status] ?? STATUS_CONFIG['Pending'];
                return (
                  <div
                    key={leave.id}
                    className="flex items-center gap-3.5 rounded-xl px-4 py-4 transition-all duration-300"
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
                    {/* Leave Type Icon */}
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
                    >
                      {(() => {
                        const lt = LEAVE_TYPES.find((t) => t.label === leave.type);
                        return lt ? <lt.Icon size={18} /> : <ClipboardList size={18} />;
                      })()}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        {leave.type}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {leave.startDate} to {leave.endDate} · {leave.days} day{leave.days > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
                      style={{
                        color: cfg.color,
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      <cfg.Icon size={11} />
                      {leave.status}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leave Policy */}
        <div
          className="mt-8 rounded-xl px-5 py-5"
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
              Leave Policy Information
            </h3>
          </div>
          <ul className="space-y-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <li>• Casual Leave: 10 days per year</li>
            <li>• Sick Leave: Unlimited (with valid medical certificate)</li>
            <li>• Personal Leave: 5 days per year</li>
            <li>• Medical Leave: Subject to medical certificate</li>
            <li>• Applications must be submitted at least 2 days in advance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ApplyForLeave;