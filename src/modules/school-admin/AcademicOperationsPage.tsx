import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  FileText,
  Award,
  Mail,
  Send,
  AlertCircle,
  Eye,
  X,
  Edit2
} from 'lucide-react';

interface ParentDispatchRecord {
  id: number;
  roll: number;
  studentName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  attendancePct: number;
  workingDays: number;
  presentDays: number;
  termAverage: number;
  grade: string;
  status: 'delivered' | 'pending' | 'missing_email';
  lastSent?: string;
}

export const AcademicOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'timetable' | 'report_cards' | 'parent_dispatch'>('attendance');

  // Parent Email & Report Dispatch State
  const [selectedDispatchSection, setSelectedDispatchSection] = useState('Grade 10 - Section A');
  const [selectedTerm, setSelectedTerm] = useState('Quarterly Progress Examination (Term 1)');
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewStudent, setPreviewStudent] = useState<ParentDispatchRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<ParentDispatchRecord | null>(null);
  const [editEmailInput, setEditEmailInput] = useState('');

  const [parentRecords, setParentRecords] = useState<ParentDispatchRecord[]>([
    {
      id: 1,
      roll: 101,
      studentName: 'Aarav Sharma',
      parentName: 'Mr. K. Raman',
      parentEmail: 'parent.aarav@greenwood.edu',
      parentPhone: '+91 98401 99881',
      attendancePct: 96.4,
      workingDays: 84,
      presentDays: 81,
      termAverage: 88.25,
      grade: 'Distinction (A2)',
      status: 'delivered',
      lastSent: '2026-10-24 10:15 AM'
    },
    {
      id: 2,
      roll: 102,
      studentName: 'Ananya Raman',
      parentName: 'Mrs. V. Raman',
      parentEmail: 'raman.ananya.parent@gmail.com',
      parentPhone: '+91 98401 99882',
      attendancePct: 98.8,
      workingDays: 84,
      presentDays: 83,
      termAverage: 95.0,
      grade: 'Outstanding (A1)',
      status: 'delivered',
      lastSent: '2026-10-24 10:15 AM'
    },
    {
      id: 3,
      roll: 103,
      studentName: 'Dinesh Kumar',
      parentName: 'Mr. R. Kumar',
      parentEmail: 'dinesh.kumar.father@yahoo.com',
      parentPhone: '+91 98401 99883',
      attendancePct: 84.5,
      workingDays: 84,
      presentDays: 71,
      termAverage: 78.0,
      grade: 'First Class (B1)',
      status: 'pending'
    },
    {
      id: 4,
      roll: 104,
      studentName: 'Harini Sundar',
      parentName: 'Mr. P. Sundaram',
      parentEmail: '',
      parentPhone: '+91 98401 99884',
      attendancePct: 91.2,
      workingDays: 84,
      presentDays: 77,
      termAverage: 82.5,
      grade: 'First Class (A2)',
      status: 'missing_email'
    },
    {
      id: 5,
      roll: 105,
      studentName: 'Karthik Raja',
      parentName: 'Mrs. S. Raja',
      parentEmail: 'raja.karthik.parent@outlook.com',
      parentPhone: '+91 98401 99885',
      attendancePct: 88.0,
      workingDays: 84,
      presentDays: 74,
      termAverage: 72.0,
      grade: 'Second Class (B2)',
      status: 'pending'
    }
  ]);

  // Attendance Module State
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSection, setSelectedSection] = useState('Grade 10 - Section A');
  const [studentsAttendance, setStudentsAttendance] = useState([
    { id: 1, roll: 101, name: 'Aarav Sharma', status: 'present', remarks: '' },
    { id: 2, roll: 102, name: 'Ananya Raman', status: 'present', remarks: '' },
    { id: 3, roll: 103, name: 'Dinesh Kumar', status: 'absent', remarks: 'Medical Leave' },
    { id: 4, roll: 104, name: 'Harini Sundar', status: 'late', remarks: 'Bus breakdown' },
    { id: 5, roll: 105, name: 'Karthik Raja', status: 'present', remarks: '' },
  ]);
  const [attendanceLocked, setAttendanceLocked] = useState(false);

  // Marks Entry Module State (Enforces Blueprint Rule: Absent = NULL, Never 0)
  const [marksData, setMarksData] = useState([
    { id: 1, roll: 101, name: 'Aarav Sharma', marks: 88, status: 'marked' },
    { id: 2, roll: 102, name: 'Ananya Raman', marks: 95, status: 'marked' },
    { id: 3, roll: 103, name: 'Dinesh Kumar', marks: null, status: 'absent' }, // Absent = NULL
    { id: 4, roll: 104, name: 'Harini Sundar', marks: 74, status: 'marked' },
    { id: 5, roll: 105, name: 'Karthik Raja', marks: 62, status: 'marked' },
  ]);

  const updateAttendance = (id: number, status: string) => {
    if (attendanceLocked) return;
    setStudentsAttendance((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const updateMark = (id: number, val: string) => {
    setMarksData((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          if (val === 'absent') {
            return { ...s, marks: null, status: 'absent' };
          }
          const num = parseFloat(val);
          return { ...s, marks: isNaN(num) ? null : num, status: 'marked' };
        }
        return s;
      })
    );
  };

  const handleSaveParentEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (!editEmailInput.includes('@') || !editEmailInput.includes('.')) {
      alert('Please enter a valid email address.');
      return;
    }

    setParentRecords((prev) =>
      prev.map((rec) =>
        rec.id === editingStudent.id
          ? {
              ...rec,
              parentEmail: editEmailInput,
              status: rec.status === 'missing_email' ? 'pending' : rec.status
            }
          : rec
      )
    );
    setToastMessage(`Updated parent email address for ${editingStudent.studentName} successfully.`);
    setEditingStudent(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendIndividual = (rec: ParentDispatchRecord) => {
    if (!rec.parentEmail) {
      setEditingStudent(rec);
      setEditEmailInput('');
      return;
    }

    setParentRecords((prev) =>
      prev.map((r) =>
        r.id === rec.id
          ? {
              ...r,
              status: 'delivered',
              lastSent: new Date().toLocaleString()
            }
          : r
      )
    );

    setToastMessage(`Report card & attendance summary dispatched to ${rec.parentEmail} successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBulkDispatch = () => {
    const validCount = parentRecords.filter((r) => r.parentEmail).length;
    if (validCount === 0) {
      alert('No parents with registered email addresses in this class.');
      return;
    }

    setIsBulkSending(true);
    setTimeout(() => {
      setParentRecords((prev) =>
        prev.map((r) =>
          r.parentEmail
            ? {
                ...r,
                status: 'delivered',
                lastSent: new Date().toLocaleString()
              }
            : r
        )
      );
      setIsBulkSending(false);
      setToastMessage(
        `Batch dispatch completed! Academic progress report & attendance summaries successfully sent to ${validCount} parent email(s).`
      );
      setTimeout(() => setToastMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Operations & Evaluations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Rithik Group Multi-School ERP — Attendance, Timetables, Mark Entry & Automated Report Cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Current Academic Session: 2026-2027 (Active)
          </span>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        {[
          { key: 'attendance', label: 'Daily & Period Attendance', icon: CheckCircle2 },
          { key: 'marks', label: 'Examinations & Marks Entry', icon: Award },
          { key: 'timetable', label: 'Master Timetable Scheduling', icon: Clock },
          { key: 'report_cards', label: 'Report Cards & Result Pipeline', icon: FileText },
          { key: 'parent_dispatch', label: 'Parent Email & Report Dispatch', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 px-5 text-sm font-semibold border-b-2 transition ${
                isSelected
                  ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. ATTENDANCE MODULE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Attendance Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="rounded-xl border border-slate-200 py-1.5 px-3 text-sm font-medium focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Class & Section</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="rounded-xl border border-slate-200 py-1.5 px-3 text-sm font-medium focus:border-indigo-600 focus:outline-none"
                >
                  <option>Grade 10 - Section A</option>
                  <option>Grade 10 - Section B</option>
                  <option>Grade 11 - Science A</option>
                  <option>Grade 12 - Commerce</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                attendanceLocked
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {attendanceLocked ? 'Status: Session Locked (Audit Mode)' : 'Status: Open for Marking'}
              </span>
              <button
                onClick={() => setAttendanceLocked(!attendanceLocked)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
              >
                {attendanceLocked ? 'Request Unlock / Correction' : 'Submit & Lock Session'}
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Roll No</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6 text-center">Mark Attendance</th>
                  <th className="py-4 px-6">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentsAttendance.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-mono font-medium text-slate-900">{student.roll}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{student.name}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
                        {['present', 'absent', 'late'].map((st) => (
                          <button
                            key={st}
                            disabled={attendanceLocked}
                            onClick={() => updateAttendance(student.id, st)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition ${
                              student.status === st
                                ? st === 'present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : st === 'absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {student.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. MARKS ENTRY MODULE */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Exam</label>
                <select className="rounded-xl border border-slate-200 py-1.5 px-3 text-sm font-medium focus:border-indigo-600 focus:outline-none">
                  <option>Quarterly Examination 2026</option>
                  <option>Mid-Term Examination</option>
                  <option>Unit Test 1</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                <select className="rounded-xl border border-slate-200 py-1.5 px-3 text-sm font-medium focus:border-indigo-600 focus:outline-none">
                  <option>Mathematics (Max: 100)</option>
                  <option>Science (Theory: 75, Pract: 25)</option>
                  <option>English Language (Max: 100)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-semibold">
                Blueprint Rule: Absent marks are stored as NULL (Never 0)
              </span>
              <button className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                Submit for Principal Review
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Roll No</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Marks Obtained (Max: 100)</th>
                  <th className="py-4 px-6">Entry Status</th>
                  <th className="py-4 px-6 text-right">Computed Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marksData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-mono font-medium text-slate-900">{item.roll}</td>
                    <td className="py-4 px-6 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={item.status === 'absent' ? 'ABSENT' : item.marks ?? ''}
                        disabled={item.status === 'absent'}
                        onChange={(e) => updateMark(item.id, e.target.value)}
                        className={`w-28 rounded-lg border py-1 px-3 text-sm font-mono font-bold ${
                          item.status === 'absent'
                            ? 'bg-slate-100 text-rose-600 border-rose-200'
                            : 'bg-white text-slate-900 border-slate-300 focus:border-indigo-600 focus:outline-none'
                        }`}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={item.status}
                        onChange={(e) => updateMark(item.id, e.target.value)}
                        className="rounded-lg border border-slate-200 py-1 px-2 text-xs font-medium focus:border-indigo-600 focus:outline-none"
                      >
                        <option value="marked">Marked</option>
                        <option value="absent">Absent (NULL)</option>
                        <option value="exempt">Exempt</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900 font-mono">
                      {item.status === 'absent'
                        ? '—'
                        : (item.marks || 0) >= 90
                        ? 'A1 (10.0)'
                        : (item.marks || 0) >= 80
                        ? 'A2 (9.0)'
                        : (item.marks || 0) >= 70
                        ? 'B1 (8.0)'
                        : 'B2 (7.0)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TIMETABLE MODULE */}
      {activeTab === 'timetable' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Weekly Section Schedule & Conflict Engine</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
              Double-Booking Conflict Detection: Active
            </span>
          </div>

          <div className="grid grid-cols-6 gap-3 text-center text-xs font-semibold">
            <div className="p-3 bg-slate-100 rounded-xl font-bold text-slate-700">Day / Period</div>
            <div className="p-3 bg-slate-100 rounded-xl">Period 1 (09:00 - 09:45)</div>
            <div className="p-3 bg-slate-100 rounded-xl">Period 2 (09:45 - 10:30)</div>
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">Break (10:30 - 10:45)</div>
            <div className="p-3 bg-slate-100 rounded-xl">Period 3 (10:45 - 11:30)</div>
            <div className="p-3 bg-slate-100 rounded-xl">Period 4 (11:30 - 12:15)</div>

            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <React.Fragment key={day}>
                <div className="p-4 bg-slate-50 font-bold text-slate-800 rounded-xl flex items-center justify-center">
                  {day}
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-indigo-50/40 text-indigo-900">
                  <div className="font-bold">Mathematics</div>
                  <div className="text-[10px] text-slate-500">Mr. Suresh (Room 101)</div>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-emerald-50/40 text-emerald-900">
                  <div className="font-bold">Physics</div>
                  <div className="text-[10px] text-slate-500">Dr. Meena (Lab 2)</div>
                </div>
                <div className="p-3 bg-amber-50/50 text-amber-700 rounded-xl flex items-center justify-center text-[11px]">
                  Recess
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-violet-50/40 text-violet-900">
                  <div className="font-bold">Chemistry</div>
                  <div className="text-[10px] text-slate-500">Mrs. Lakshmi</div>
                </div>
                <div className="p-3 border border-slate-200 rounded-xl bg-sky-50/40 text-sky-900">
                  <div className="font-bold">English</div>
                  <div className="text-[10px] text-slate-500">Mr. Anand</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* 5. PARENT EMAIL & REPORT DISPATCH PIPELINE */}
      {activeTab === 'parent_dispatch' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white font-semibold text-xs flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-100 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Section & Term Filters with Bulk Action */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Class & Section</label>
                <select
                  value={selectedDispatchSection}
                  onChange={(e) => setSelectedDispatchSection(e.target.value)}
                  className="rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-indigo-600 focus:outline-none bg-slate-50"
                >
                  <option>Grade 10 - Section A</option>
                  <option>Grade 10 - Section B</option>
                  <option>Grade 9 - Section A</option>
                  <option>Grade 8 - Section B</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Evaluation Term</label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold focus:border-indigo-600 focus:outline-none bg-slate-50"
                >
                  <option>Quarterly Progress Examination (Term 1)</option>
                  <option>Mid-Term Evaluation (Term 2)</option>
                  <option>Annual Final Examination (Term 3)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900">
                  {parentRecords.filter((r) => r.parentEmail).length} of {parentRecords.length} Parents Registered
                </div>
                <div className="text-[11px] text-slate-400">
                  {parentRecords.filter((r) => !r.parentEmail).length} missing email ID
                </div>
              </div>

              <button
                onClick={handleBulkDispatch}
                disabled={isBulkSending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-50"
              >
                {isBulkSending ? (
                  <>
                    <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Dispatching Emails...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Reports to All Parents
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student & Parent Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Target Section Roster & Parent Email Dispatch Registry
              </h2>
              <span className="text-xs text-slate-500">
                Automatic Email Attachment: Official Report Card + Daily Attendance Percentage
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Roll / Student</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Parent Email Address</th>
                  <th className="py-3 px-4">Attendance Summary</th>
                  <th className="py-3 px-4">Term Grade</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{record.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Roll: #{record.roll}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {record.parentName}
                      <div className="text-[10px] text-slate-400 font-mono">{record.parentPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {record.parentEmail ? (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="font-mono text-slate-700 font-medium">{record.parentEmail}</span>
                          <button
                            onClick={() => {
                              setEditingStudent(record);
                              setEditEmailInput(record.parentEmail);
                            }}
                            className="text-slate-400 hover:text-indigo-600 ml-1"
                            title="Edit Parent Email"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingStudent(record);
                            setEditEmailInput('');
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Collect Parent Email
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{record.attendancePct}%</div>
                      <div className="text-[10px] text-slate-400">
                        {record.presentDays} of {record.workingDays} working days
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-600">{record.grade}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Avg: {record.termAverage}%</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {record.status === 'delivered' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Sent to Parent
                          </span>
                          {record.lastSent && (
                            <div className="text-[9px] text-slate-400 mt-0.5">{record.lastSent}</div>
                          )}
                        </div>
                      ) : record.status === 'missing_email' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="h-3 w-3" /> Missing Email
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Dispatch
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewStudent(record)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                          title="Preview Email Content"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleSendIndividual(record)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Send className="h-3 w-3" />
                          Send Email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Email Preview Modal */}
          {previewStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
              <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Parent Email Notification Preview</h3>
                    <p className="text-xs text-slate-400">
                      To: {previewStudent.parentEmail || '(No Email Specified)'} ({previewStudent.parentName})
                    </p>
                  </div>
                  <button onClick={() => setPreviewStudent(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Email Body Rendering */}
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4 text-xs font-sans text-slate-800">
                  <div className="border-b border-slate-200 pb-3">
                    <h4 className="text-base font-extrabold text-indigo-700">Rithik Matriculation Higher Secondary School</h4>
                    <p className="text-[11px] text-slate-500">Official Academic & Attendance Communication</p>
                  </div>

                  <p>
                    Dear <strong>{previewStudent.parentName}</strong>,
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Please find below the official <strong>{selectedTerm}</strong> academic progress report and attendance digest for your ward, <strong>{previewStudent.studentName}</strong> (Roll: #{previewStudent.roll}, Class: {selectedDispatchSection}).
                  </p>

                  {/* Attendance Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Attendance Digest</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">{previewStudent.attendancePct}%</div>
                      <div className="text-[11px] text-slate-500">
                        {previewStudent.presentDays} Days Present out of {previewStudent.workingDays} Total Working Days
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Regular / Good Standing
                    </span>
                  </div>

                  {/* Report Card Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 flex justify-between">
                      <span>Term Evaluation</span>
                      <span>Grade: {previewStudent.grade}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Mathematics</span>
                        <strong className="text-slate-900">88 / 100 (A2)</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Physics</span>
                        <strong className="text-slate-900">92 / 100 (A1)</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span>Chemistry</span>
                        <strong className="text-slate-900">84 / 100 (A2)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>English Literature</span>
                        <strong className="text-slate-900">89 / 100 (A2)</strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    You can also log in to your dedicated Parent Portal at https://app.rithikgroup.com/parent/portal using your registered email to view detailed term breakdowns, download signed certificates, and pay pending fees.
                  </p>

                  <div className="pt-3 border-t border-slate-200 text-slate-400 text-[10px]">
                    This is an automated notification dispatched by Rithik Group School ERP.
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setPreviewStudent(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      handleSendIndividual(previewStudent);
                      setPreviewStudent(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send to This Parent Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Parent Email Modal */}
          {editingStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Update Parent Email ID</h3>
                    <p className="text-xs text-slate-400">
                      Student: {editingStudent.studentName} (Parent: {editingStudent.parentName})
                    </p>
                  </div>
                  <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveParentEmail} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Parent's Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="parent.name@example.com"
                        value={editEmailInput}
                        onChange={(e) => setEditEmailInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:outline-none font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Academic progress reports, attendance alerts, and circulars will be dispatched to this address.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Save & Register Email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
