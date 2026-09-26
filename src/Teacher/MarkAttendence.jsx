import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Users,
  ClipboardCheck,
  Search,
} from 'lucide-react';

// ─── API LAYER ────────────────────────────────────────────────────────────────
// Replace with: fetch(`/api/attendance/${classId}`)
const api = {
  async getClassStudents(classId) {
    // return await fetch(`/api/attendance/${classId}`).then(r => r.json());
    return {
      class: '10-A',
      subject: 'Algebra',
      date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      students: [
        { id: 1,  rollNo: '01', name: 'Aarav Sharma'    },
        { id: 2,  rollNo: '02', name: 'Ananya Nair'     },
        { id: 3,  rollNo: '03', name: 'Arun Menon'      },
        { id: 4,  rollNo: '04', name: 'Bhavya Reddy'    },
        { id: 5,  rollNo: '05', name: 'Diya Krishnan'   },
        { id: 6,  rollNo: '06', name: 'Farhan Khan'     },
        { id: 7,  rollNo: '07', name: 'Ishaan Gupta'    },
        { id: 8,  rollNo: '08', name: 'Kavya Pillai'    },
        { id: 9,  rollNo: '09', name: 'Meera Iyer'      },
        { id: 10, rollNo: '10', name: 'Mohammed Rizwan' },
        { id: 11, rollNo: '11', name: 'Nithya Balaji'   },
        { id: 12, rollNo: '12', name: 'Priya Suresh'    },
        { id: 13, rollNo: '13', name: 'Rahul Verma'     },
        { id: 14, rollNo: '14', name: 'Riya Nair'       },
        { id: 15, rollNo: '15', name: 'Rohan Das'       },
        { id: 16, rollNo: '16', name: 'Sara Thomas'     },
        { id: 17, rollNo: '17', name: 'Siddharth Rao'   },
        { id: 18, rollNo: '18', name: 'Sneha Patil'     },
        { id: 19, rollNo: '19', name: 'Tanvi Joshi'     },
        { id: 20, rollNo: '20', name: 'Vikram Singh'    },
      ],
    };
  },

  async submitAttendance(classId, payload) {
    // return await fetch(`/api/attendance/${classId}/submit`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // }).then(r => r.json());
    return { success: true };
  },
};
// ─────────────────────────────────────────────────────────────────────────────

export default function MarkAttendance() {
  const navigate = useNavigate();
  const { classId } = useParams();

  const [classData, setClassData] = useState(null);
  const [attendance, setAttendance] = useState({});   // { studentId: 'present' | 'absent' }
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getClassStudents(classId).then((data) => {
      setClassData(data);
      // Default all students to present
      const initial = {};
      data.students.forEach((s) => { initial[s.id] = 'present'; });
      setAttendance(initial);
    });
  }, [classId]);

  if (!classData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">
        <div className="text-sm font-semibold text-[var(--color-text-muted)]">Loading…</div>
      </div>
    );
  }

  const toggle = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const markAll = (status) => {
    const updated = {};
    classData.students.forEach((s) => { updated[s.id] = status; });
    setAttendance(updated);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount  = Object.values(attendance).filter(v => v === 'absent').length;
  const total        = classData.students.length;

  const filteredStudents = classData.students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.includes(search)
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      classId,
      date: new Date().toISOString(),
      records: classData.students.map((s) => ({
        studentId: s.id,
        status: attendance[s.id],
      })),
    };
    await api.submitAttendance(classId, payload);
    setSubmitting(false);
    setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)] px-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)]"
          style={{ boxShadow: '0 0 32px var(--color-shadow-accent-md)' }}
        >
          <ClipboardCheck size={36} strokeWidth={2} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-[var(--color-text-primary)]">Attendance Submitted!</h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {classData.class} · {presentCount} present, {absentCount} absent
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-[var(--color-accent)] px-8 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-page-1)] to-[var(--color-bg-page-2)]">

      {/* ── Header ── */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b-4 border-[var(--color-accent)] bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary-darker)] px-5 py-4 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-bold tracking-wide text-white">Mark Attendance</h3>
          <p className="text-xs text-[var(--color-text-header-sub)] truncate">
            Class {classData.class} · {classData.subject} · {classData.date}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5">

        {/* ── Summary bar ── */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Total',   value: total,         icon: <Users        size={16} strokeWidth={2} />, accent: false },
            { label: 'Present', value: presentCount,  icon: <CheckCircle2 size={16} strokeWidth={2} />, accent: true  },
            { label: 'Absent',  value: absentCount,   icon: <XCircle      size={16} strokeWidth={2} />, accent: false },
          ].map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center rounded-2xl border-2 px-3 py-4 text-center ${
                stat.accent
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
              }`}
              style={{ boxShadow: '0 4px 16px var(--color-shadow-card)' }}
            >
              <div className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${stat.accent ? 'bg-white/20 text-white' : 'bg-[var(--color-bg-icon)] text-[var(--color-text-primary)]'}`}>
                {stat.icon}
              </div>
              <div className={`text-2xl font-black leading-none ${stat.accent ? 'text-white' : 'text-[var(--color-accent)]'}`}>
                {stat.value}
              </div>
              <div className={`mt-1 text-xs font-semibold ${stat.accent ? 'text-white/80' : 'text-[var(--color-text-muted)]'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + bulk actions ── */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or roll no…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] py-2.5 pl-9 pr-4 text-sm font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] transition-all duration-200 focus:border-[var(--color-accent)]"
            />
          </div>
          {/* Bulk buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => markAll('present')}
              className="flex items-center gap-1.5 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-accent-light)] px-3 py-2.5 text-xs font-bold text-[var(--color-accent)] transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-white active:scale-95"
            >
              <CheckCircle2 size={14} strokeWidth={2.5} />
              All Present
            </button>
            <button
              onClick={() => markAll('absent')}
              className="flex items-center gap-1.5 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white active:scale-95"
            >
              <XCircle size={14} strokeWidth={2.5} />
              All Absent
            </button>
          </div>
        </div>

        {/* ── Student list ── */}
        <div className="mb-6 flex flex-col gap-2">
          {filteredStudents.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--color-text-muted)]">No students found.</div>
          )}

          {filteredStudents.map((student) => {
            const isPresent = attendance[student.id] === 'present';
            return (
              <div
                key={student.id}
                className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-200 ${
                  isPresent
                    ? 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
                    : 'border-red-300/60 bg-red-50/50'
                }`}
                style={{ boxShadow: '0 2px 8px var(--color-shadow-card-sm)' }}
              >
                {/* Roll number */}
                <div className="w-8 shrink-0 text-center text-xs font-black text-[var(--color-text-muted)]">
                  {student.rollNo}
                </div>

                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white transition-colors duration-200 ${
                    isPresent ? 'bg-[var(--color-accent)]' : 'bg-red-400'
                  }`}
                >
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-bold truncate transition-colors duration-200 ${isPresent ? 'text-[var(--color-text-primary)]' : 'text-red-500'}`}>
                    {student.name}
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggle(student.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isPresent
                      ? 'bg-green-100 text-green-600 hover:bg-red-100 hover:text-red-500'
                      : 'bg-red-100 text-red-500 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  {isPresent
                    ? <><CheckCircle2 size={14} strokeWidth={2.5} /> Present</>
                    : <><XCircle      size={14} strokeWidth={2.5} /> Absent</>
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Submit button ── */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-2xl bg-[var(--color-accent)] py-4 text-base font-black text-white shadow-lg transition-all duration-200 hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ boxShadow: '0 4px 20px var(--color-shadow-accent-md)' }}
        >
          {submitting
            ? 'Submitting…'
            : `Submit Attendance · ${presentCount} Present, ${absentCount} Absent`
          }
        </button>

      </div>
    </div>
  );
}