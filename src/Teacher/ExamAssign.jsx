import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  NotebookPen,
  BookOpen,
  Users,
  CalendarDays,
  Clock,
  FileText,
  Hash,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

// ─── Mock submit ──────────────────────────────────────────────────────────────
const api = {
  async createExam(data) {
    // return await fetch('/api/teacher/exams', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json());
    return new Promise((res) => setTimeout(() => res({ success: true, id: Date.now() }), 900));
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CLASSES = ['9-A', '9-B', '9-C', '10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const EXAM_TYPES = ['Unit Test', 'Mid-Term', 'Final Exam', 'Quiz', 'Assignment'];

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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExamAssign() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: '',
    class: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    totalMarks: '',
    syllabus: '',
    instructions: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim())     errs.title     = 'Exam title is required';
    if (!form.type)             errs.type      = 'Select exam type';
    if (!form.class)            errs.class     = 'Select a class';
    if (!form.subject)          errs.subject   = 'Select a subject';
    if (!form.date)             errs.date      = 'Pick a date';
    if (!form.time)             errs.time      = 'Pick a time';
    if (!form.duration.trim())  errs.duration  = 'Enter duration';
    if (!form.totalMarks)       errs.totalMarks = 'Enter total marks';
    if (!form.syllabus.trim())  errs.syllabus  = 'Describe the syllabus';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    await api.createExam(form);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => navigate(-1), 1500);
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)] shadow-lg">
          <CheckCircle2 size={40} strokeWidth={1.8} className="text-white" />
        </div>
        <div className="text-lg font-black text-[var(--color-text-primary)]">Exam Scheduled!</div>
        <div className="text-sm text-[var(--color-text-muted)]">Redirecting to dashboard…</div>
      </div>
    );
  }

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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
            <NotebookPen size={17} strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">New Exam</h3>
            <p className="text-xs text-[var(--color-text-header-sub)]">Schedule a new exam</p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">

        {/* Card: Basic Info */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">Basic Info</span>
          </div>

          <div className="space-y-4">
            <div>
              <InputLabel required>Exam Title</InputLabel>
              <InputField
                icon={NotebookPen}
                placeholder="e.g. Algebra Unit Test"
                value={form.title}
                onChange={set('title')}
                error={errors.title}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputLabel required>Exam Type</InputLabel>
                <SelectField icon={FileText} value={form.type} onChange={set('type')} error={errors.type}>
                  <option value="">Select type</option>
                  {EXAM_TYPES.map((t) => <option key={t}>{t}</option>)}
                </SelectField>
              </div>
              <div>
                <InputLabel required>Total Marks</InputLabel>
                <InputField
                  icon={Hash}
                  type="number"
                  placeholder="100"
                  min={1}
                  value={form.totalMarks}
                  onChange={set('totalMarks')}
                  error={errors.totalMarks}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Class & Subject */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Users size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">Class & Subject</span>
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

        {/* Card: Schedule */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">Schedule</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <InputLabel required>Date</InputLabel>
              <InputField
                icon={CalendarDays}
                type="date"
                value={form.date}
                onChange={set('date')}
                error={errors.date}
              />
            </div>
            <div>
              <InputLabel required>Time</InputLabel>
              <InputField
                icon={Clock}
                type="time"
                value={form.time}
                onChange={set('time')}
                error={errors.time}
              />
            </div>
            <div>
              <InputLabel required>Duration</InputLabel>
              <InputField
                placeholder="e.g. 1.5 hrs"
                value={form.duration}
                onChange={set('duration')}
                error={errors.duration}
              />
            </div>
          </div>
        </div>

        {/* Card: Syllabus & Instructions */}
        <div
          className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
        >
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={15} strokeWidth={2} className="text-[var(--color-accent)]" />
            <span className="text-sm font-black uppercase tracking-widest text-[var(--color-text-primary)]">Content</span>
          </div>

          <div className="space-y-4">
            <div>
              <InputLabel required>Syllabus Coverage</InputLabel>
              <InputField
                icon={BookOpen}
                placeholder="e.g. Ch. 4–6, Linear Equations"
                value={form.syllabus}
                onChange={set('syllabus')}
                error={errors.syllabus}
              />
            </div>
            <div>
              <InputLabel>Instructions (optional)</InputLabel>
              <TextAreaField
                placeholder="Any special instructions for students…"
                value={form.instructions}
                onChange={set('instructions')}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-accent)] bg-[var(--color-accent)] py-4 text-sm font-black tracking-wide text-white shadow-lg transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:opacity-60"
          style={{ boxShadow: '0 4px 16px var(--color-shadow-badge)' }}
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Scheduling…
            </>
          ) : (
            <>
              <NotebookPen size={16} strokeWidth={2} />
              Schedule Exam
            </>
          )}
        </button>

        <div className="pb-6" />
      </div>
    </div>
  );
}