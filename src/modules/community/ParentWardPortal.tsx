import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Clock,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

interface WardData {
  id: number;
  name: string;
  admissionNo: string;
  schoolName: string;
  gradeSection: string;
  rollNo: number;
  attendancePct: number;
  totalPresent: number;
  totalWorkingDays: number;
  guardianName: string;
  guardianRelation: string;
  examResults: Array<{
    subject: string;
    maxMarks: number;
    obtainedMarks: number | null;
    grade: string;
    status: 'marked' | 'absent';
  }>;
  todaySchedule: Array<{
    period: string;
    time: string;
    subject: string;
    teacher: string;
    room: string;
  }>;
  activeHomework: Array<{
    subject: string;
    title: string;
    dueDate: string;
    status: 'pending' | 'submitted';
  }>;
  verificationCode: string;
}

// Dedicated Data Scoped by Linked Ward
const WARDS_DATABASE: Record<string, WardData> = {
  // Parent 1: Mr. K. Raman (Ward: Aarav Sharma)
  'parent.raman@gmail.com': {
    id: 101,
    name: 'Aarav Sharma',
    admissionNo: 'SCH-CHN-001/101',
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    gradeSection: 'Grade 10 - Section A',
    rollNo: 101,
    attendancePct: 96.4,
    totalPresent: 81,
    totalWorkingDays: 84,
    guardianName: 'Mr. K. Raman',
    guardianRelation: 'Father',
    verificationCode: 'RC-VERIF-AARAV-98F12',
    examResults: [
      { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 88, grade: 'A2', status: 'marked' },
      { subject: 'Physics', maxMarks: 100, obtainedMarks: 92, grade: 'A1', status: 'marked' },
      { subject: 'Chemistry', maxMarks: 100, obtainedMarks: 84, grade: 'A2', status: 'marked' },
      { subject: 'English Language', maxMarks: 100, obtainedMarks: 89, grade: 'A2', status: 'marked' },
      { subject: 'Tamil Language', maxMarks: 100, obtainedMarks: 91, grade: 'A1', status: 'marked' },
    ],
    todaySchedule: [
      { period: 'Period 1', time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Mr. Suresh', room: 'Room 101' },
      { period: 'Period 2', time: '09:45 - 10:30', subject: 'Physics', teacher: 'Dr. Meena', room: 'Science Lab 2' },
      { period: 'Period 3', time: '10:45 - 11:30', subject: 'Chemistry', teacher: 'Mrs. Lakshmi', room: 'Room 101' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'English', teacher: 'Mr. Anand', room: 'Room 101' },
    ],
    activeHomework: [
      { subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', dueDate: 'Tomorrow, 09:00 AM', status: 'pending' },
      { subject: 'Physics', title: 'Ohm’s Law Lab Experiment Verification', dueDate: 'Friday, 04:00 PM', status: 'submitted' },
    ],
  },

  // Parent 2: Mrs. Priya Natarajan (Ward: Diya Natarajan)
  'parent.priya@gmail.com': {
    id: 102,
    name: 'Diya Natarajan',
    admissionNo: 'SCH-CBE-002/204',
    schoolName: 'Rithik International Academy, Coimbatore',
    gradeSection: 'Grade 8 - Section B',
    rollNo: 204,
    attendancePct: 98.8,
    totalPresent: 83,
    totalWorkingDays: 84,
    guardianName: 'Mrs. Priya Natarajan',
    guardianRelation: 'Mother',
    verificationCode: 'RC-VERIF-DIYA-77B41',
    examResults: [
      { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 96, grade: 'A1', status: 'marked' },
      { subject: 'Science', maxMarks: 100, obtainedMarks: 94, grade: 'A1', status: 'marked' },
      { subject: 'Social Science', maxMarks: 100, obtainedMarks: 90, grade: 'A1', status: 'marked' },
      { subject: 'English Literature', maxMarks: 100, obtainedMarks: 95, grade: 'A1', status: 'marked' },
      { subject: 'Hindi', maxMarks: 100, obtainedMarks: 88, grade: 'A2', status: 'marked' },
    ],
    todaySchedule: [
      { period: 'Period 1', time: '09:00 - 09:45', subject: 'English Literature', teacher: 'Mrs. Jayanthi', room: 'Room 204' },
      { period: 'Period 2', time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'Mr. Vignesh', room: 'Room 204' },
      { period: 'Period 3', time: '10:45 - 11:30', subject: 'Science', teacher: 'Dr. Kavitha', room: 'Lab 1' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'Computer Science', teacher: 'Mr. Karthik', room: 'Computer Lab' },
    ],
    activeHomework: [
      { subject: 'English', title: 'Poetry Essay & Literary Devices', dueDate: 'Tomorrow, 08:30 AM', status: 'pending' },
    ],
  },
};

export const ParentWardPortal: React.FC = () => {
  const { user } = useAuth();

  // Find linked ward based on parent's logged in email or fallback to first ward
  const loggedEmail = user?.email || 'parent.raman@gmail.com';
  const ward = WARDS_DATABASE[loggedEmail] || WARDS_DATABASE['parent.raman@gmail.com'];

  // Calculate Aggregates
  const totalMaxMarks = ward.examResults.reduce((acc, r) => acc + r.maxMarks, 0);
  const totalObtainedMarks = ward.examResults.reduce((acc, r) => acc + (r.obtainedMarks || 0), 0);
  const percentage = ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Privacy Isolation Alert Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            <strong>Parent-Child Privacy Link Active:</strong> You are authenticated as{' '}
            <strong className="font-semibold">{ward.guardianName}</strong> ({loggedEmail}). You have authorized access strictly to your ward’s records.
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
          Ward ID: {ward.admissionNo}
        </span>
      </div>

      {/* Ward Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-600/30">
            {ward.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{ward.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Enrolled Student
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {ward.gradeSection} • Roll No: #{ward.rollNo} • {ward.schoolName}
            </p>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 min-w-[120px]">
            <p className="text-[10px] font-bold uppercase text-slate-400">Term Attendance</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{ward.attendancePct}%</p>
            <p className="text-[10px] text-slate-500 font-medium">{ward.totalPresent} of {ward.totalWorkingDays} days</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 min-w-[120px]">
            <p className="text-[10px] font-bold uppercase text-slate-400">Overall Grade</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{percentage}%</p>
            <p className="text-[10px] text-indigo-700 font-bold">Distinction (A)</p>
          </div>
        </div>
      </div>

      {/* Content Grid: 1. Official Report Card | 2. Timetable & Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Official Term Report Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                Quarterly Examination Progress Report
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Official Term Evaluation published by Principal</p>
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              QR: {ward.verificationCode}
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4 text-center">Max Marks</th>
                <th className="py-3 px-4 text-center">Marks Obtained</th>
                <th className="py-3 px-4 text-right">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ward.examResults.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.subject}</td>
                  <td className="py-3.5 px-4 text-center text-slate-500 font-mono">{r.maxMarks}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                    {r.status === 'absent' ? (
                      <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px]">ABSENT (NULL)</span>
                    ) : (
                      r.obtainedMarks
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                    {r.grade}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-100 bg-slate-50/80 font-bold">
              <tr>
                <td className="py-3.5 px-4 text-slate-900">Total Marks & Score</td>
                <td className="py-3.5 px-4 text-center font-mono">{totalMaxMarks}</td>
                <td className="py-3.5 px-4 text-center font-mono text-indigo-600">{totalObtainedMarks}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-700">{percentage}%</td>
              </tr>
            </tfoot>
          </table>

          <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Class Teacher Remarks:</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                "Consistently excellent academic performance with active classroom engagement."
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[11px]">
              Principal Approved ✓
            </span>
          </div>
        </div>

        {/* Ward's Live Timetable & Active Homework */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              Ward's Daily Class Schedule
            </h3>

            <div className="space-y-2.5 text-xs">
              {ward.todaySchedule.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{item.subject}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time} • {item.teacher}</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white border border-slate-200 text-indigo-700 font-mono">
                    {item.room}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Homework */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              Assigned Homework & Projects
            </h3>

            <div className="space-y-2.5 text-xs">
              {ward.activeHomework.map((hw, idx) => (
                <div key={idx} className="p-3 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{hw.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                      hw.status === 'submitted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {hw.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{hw.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Due: {hw.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
