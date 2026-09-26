import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpenCheck,
  BookOpen,
  Users,
  CalendarDays,
  FileText,
  Hash,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  ClipboardList,
  Star,
  StickyNote,
  Paperclip,
  Send,
} from 'lucide-react';

// ─── Mock submit ──────────────────────────────────────────────────────────────
const api = {
  async createHomework(data) {
    // return await fetch('/api/teacher/homework', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json());
    return new Promise((res) => setTimeout(() => res({ success: true, id: Date.now() }), 900));
  },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CLASSES   = ['9-A', '9-B', '9-C', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SUBJECTS  = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const PRIORITIES = ['Normal', 'High'];

// ─── Reusable field components (same pattern as ExamAssign) ───────────────────
function InputLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
      {children}
      {required && <span className="ml-1 text-rose-400">*</span>}
    </label>
  );
}

function InputField({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          <Icon size={15} strokeWidth={1.8} />
        </div>
      )}
      <input
        className={`w-full rounded-xl border-2 bg-[var(--color-bg-icon)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:bg-[var(--color-accent-light)] ${
          Icon ? 'pl-10' : ''
        } ${error ? 'border-rose-400' : 'border-[var(--color-border)]'}`}
        {...props}
      />
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}

function SelectField({ icon: Icon, children, error, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          <Icon size={15} strokeWidth={1.8} />
        </div>
      )}
      <select
        className={`w-full appearance-none rounded-xl border-2 bg-[var(--color-bg-icon)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:bg-[var(--color-accent-light)] ${
          Icon ? 'pl-10' : ''
        } ${error ? 'border-rose-400' : 'border-[var(--color-border)]'}`}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
        <ChevronDown size={15} strokeWidth={1.8} />
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}

function TextAreaField({ error, ...props }) {
  return (
    <div>
      <textarea
        rows={3}
        className={`w-full rounded-xl border-2 bg-[var(--color-bg-icon)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:bg-[var(--color-accent-light)] resize-none ${
          error ? 'border-rose-400' : 'border-[var(--color-border)]'
        }`}
        {...props}
      />
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Priority toggle pill (replaces a plain select for 2-option fields) ───────
function PriorityToggle({ value, onChange, error }) {
  return (
    <div>
      <div
        className="flex rounded-xl border-2 overflow-hidden"
        style={{ borderColor: error ? '#f87171' : 'var(--color-border)' }}
      >
        {PRIORITIES.map((p) => {
          const active = value === p.toLowerCase();
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p.toLowerCase())}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all duration-200"
              style={{
                background: active
                  ? p === 'High'
                    ? 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))'
                    : 'var(--color-bg-card)'
                  : 'var(--color-bg-icon)',
                color: active
                  ? p === 'High' ? 'var(--color-accent)' : 'var(--color-text-primary)'
                  : 'var(--color-text-muted)',
                borderRight: p === 'Normal' ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {p === 'High' && <Star size={11} fill={active ? 'currentColor' : 'none'} />}
              {p}
            </button>
          );
        })}
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} />
          {error}
        </div>
      )}
    </div>
  );
}

// ─── Summary preview card ─────────────────────────────────────────────────────
function SummaryCard({ form }) {
  const hasData = form.title || form.subject || form.class || form.dueDate || form.totalMarks;
  if (!hasData) return null;

  return (
    <div
      className="rounded-2xl border-2 p-4 flex flex-col gap-2"
      style={{
        borderColor: 'rgba(232,180,79,0.35)',
        background: 'rgba(232,180,79,0.05)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={13} style={{ color: 'var(--color-accent)' }} />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>
          Assignment Preview
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Title',    value: form.title    || '—' },
          { label: 'Subject',  value: form.subject  || '—' },
          { label: 'Class',    value: form.class    || '—' },
          { label: 'Due Date', value: form.dueDate  ? new Date(form.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
          { label: 'Marks',    value: form.totalMarks || '—' },
          { label: 'Priority', value: form.priority ? (form.priority.charAt(0).toUpperCase() + form.priority.slice(1)) : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg px-3 py-2" style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
            <div className="text-xs font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomeworkAssign() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:        '',
    subject:      '',
    class:        '',
    dueDate:      '',
    totalMarks:   '',
    priority:     'normal',
    description:  '',
    instructions: '',
    attachments:  '',
  });

  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const setPriority = (val) => {
    setForm((f) => ({ ...f, priority: val }));
    if (errors.priority) setErrors((prev) => { const n = { ...prev }; delete n.priority; return n; });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Homework title is required';
    if (!form.subject)            errs.subject     = 'Select a subject';
    if (!form.class)              errs.class       = 'Select a class';
    if (!form.dueDate)            errs.dueDate     = 'Pick a due date';
    if (!form.totalMarks)         errs.totalMarks  = 'Enter total marks';
    if (!form.description.trim()) errs.description = 'Describe the homework task';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await api.createHomework(form);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(-1), 1600);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid #4ade80' }}>
          <CheckCircle2 size={38} strokeWidth={1.8} style={{ color: '#4ade80' }} />
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(74,222,128,0.15)' }} />
        </div>
        <div className="text-lg font-black text-[var(--color-text-primary)]">Homework Assigned!</div>
        <div className="text-sm text-[var(--color-text-muted)]">Redirecting to dashboard…</div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
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
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
            <BookOpenCheck size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Assign Homework
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              Create a new homework assignment
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">

        {/* ── Card: Basic Info ── */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">
              Basic Info
            </span>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <InputLabel required>Homework Title</InputLabel>
              <InputField
                icon={BookOpenCheck}
                placeholder="e.g. Math Worksheet — Fractions"
                value={form.title}
                onChange={set('title')}
                error={errors.title}
              />
            </div>

            {/* Marks + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputLabel required>Total Marks</InputLabel>
                <InputField
                  icon={Hash}
                  type="number"
                  placeholder="50"
                  min={1}
                  value={form.totalMarks}
                  onChange={set('totalMarks')}
                  error={errors.totalMarks}
                />
              </div>
              <div>
                <InputLabel required>Priority</InputLabel>
                <PriorityToggle
                  value={form.priority}
                  onChange={setPriority}
                  error={errors.priority}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card: Class & Subject ── */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Users size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">
              Class & Subject
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <InputLabel required>Class</InputLabel>
              <SelectField icon={Users} value={form.class} onChange={set('class')} error={errors.class}>
                <option value="">Select class</option>
                {CLASSES.map((c) => <option key={c}>{c}</option>)}
              </SelectField>
            </div>
            <div>
              <InputLabel required>Subject</InputLabel>
              <SelectField icon={BookOpen} value={form.subject} onChange={set('subject')} error={errors.subject}>
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </SelectField>
            </div>
          </div>
        </div>

        {/* ── Card: Due Date ── */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">
              Due Date
            </span>
          </div>

          <div>
            <InputLabel required>Submission Deadline</InputLabel>
            <InputField
              icon={CalendarDays}
              type="date"
              value={form.dueDate}
              onChange={set('dueDate')}
              error={errors.dueDate}
            />
          </div>
        </div>

        {/* ── Card: Task Description & Instructions ── */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <StickyNote size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">
              Task Details
            </span>
          </div>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <InputLabel required>Task Description</InputLabel>
              <TextAreaField
                placeholder="Describe what students need to do — e.g. Complete exercises 4.1 to 4.5 from the textbook, show all working…"
                value={form.description}
                onChange={set('description')}
                error={errors.description}
              />
            </div>

            {/* Instructions */}
            <div>
              <InputLabel>Special Instructions <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></InputLabel>
              <TextAreaField
                placeholder="Any formatting rules, submission method, or other notes for students…"
                value={form.instructions}
                onChange={set('instructions')}
              />
            </div>

            {/* Attachments / Reference */}
            <div>
              <InputLabel>Reference / Attachments <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></InputLabel>
              <InputField
                icon={Paperclip}
                placeholder="Paste a link or describe reference material…"
                value={form.attachments}
                onChange={set('attachments')}
              />
            </div>
          </div>
        </div>

        {/* ── Assignment Preview ── */}
        <SummaryCard form={form} />

        {/* ── Submit Button ── */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
          style={{
            background: submitting
              ? 'var(--color-bg-card)'
              : 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
            color:     submitting ? 'var(--color-text-muted)' : 'var(--color-accent)',
            border:    submitting ? '2px solid var(--color-border)' : '2px solid var(--color-accent)',
            boxShadow: submitting ? 'none' : '0 4px 20px var(--color-shadow-badge)',
            cursor:    submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Assigning…
            </>
          ) : (
            <>
              <Send size={15} strokeWidth={2} />
              Assign Homework
            </>
          )}
        </button>

        <div className="pb-6" />
      </div>
    </div>
  );
}