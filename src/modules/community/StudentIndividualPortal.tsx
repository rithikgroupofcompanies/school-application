import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Clock,
  BookOpen
} from 'lucide-react';

interface StudentProfile {
  id: number;
  name: string;
  email: string;
  admissionNo: string;
  grade: string;
  section: string;
  rollNo: number;
  schoolName: string;
  attendancePct: number;
  totalPresent: number;
  totalDays: number;
  todaySchedule: Array<{
    period: string;
    time: string;
    subject: string;
    teacher: string;
    room: string;
  }>;
  examMarks: Array<{
    subject: string;
    maxMarks: number;
    obtainedMarks: number | null;
    grade: string;
  }>;
  homeworkList: Array<{
    subject: string;
    title: string;
    dueDate: string;
    status: 'submitted' | 'pending';
  }>;
}

const STUDENTS_DATABASE: Record<string, StudentProfile> = {
  // Student 1: Aarav Sharma (Grade 10 - Section A)
  'student.aarav@school.com': {
    id: 101,
    name: 'Aarav Sharma',
    email: 'student.aarav@school.com',
    admissionNo: 'SCH-CHN-001/101',
    grade: 'Grade 10',
    section: 'A',
    rollNo: 101,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    attendancePct: 96.4,
    totalPresent: 81,
    totalDays: 84,
    todaySchedule: [
      { period: 'Period 1', time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Mr. Suresh', room: 'Room 101' },
      { period: 'Period 2', time: '09:45 - 10:30', subject: 'Physics', teacher: 'Dr. Meena', room: 'Physics Lab 2' },
      { period: 'Period 3', time: '10:45 - 11:30', subject: 'Chemistry', teacher: 'Mrs. Lakshmi', room: 'Room 101' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'English', teacher: 'Mr. Anand', room: 'Room 101' },
    ],
    examMarks: [
      { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 88, grade: 'A2' },
      { subject: 'Physics', maxMarks: 100, obtainedMarks: 92, grade: 'A1' },
      { subject: 'Chemistry', maxMarks: 100, obtainedMarks: 84, grade: 'A2' },
      { subject: 'English', maxMarks: 100, obtainedMarks: 89, grade: 'A2' },
    ],
    homeworkList: [
      { subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', dueDate: 'Tomorrow, 09:00 AM', status: 'pending' },
      { subject: 'Physics', title: 'Ohm’s Law Verification Writeup', dueDate: 'Friday, 04:00 PM', status: 'submitted' },
    ],
  },

  // Student 2: Ananya Raman (Grade 10 - Section A)
  'student.ananya@school.com': {
    id: 102,
    name: 'Ananya Raman',
    email: 'student.ananya@school.com',
    admissionNo: 'SCH-CHN-001/102',
    grade: 'Grade 10',
    section: 'A',
    rollNo: 102,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    attendancePct: 98.2,
    totalPresent: 83,
    totalDays: 84,
    todaySchedule: [
      { period: 'Period 1', time: '09:00 - 09:45', subject: 'Mathematics', teacher: 'Mr. Suresh', room: 'Room 101' },
      { period: 'Period 2', time: '09:45 - 10:30', subject: 'Physics', teacher: 'Dr. Meena', room: 'Physics Lab 2' },
      { period: 'Period 3', time: '10:45 - 11:30', subject: 'Chemistry', teacher: 'Mrs. Lakshmi', room: 'Room 101' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'English', teacher: 'Mr. Anand', room: 'Room 101' },
    ],
    examMarks: [
      { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 95, grade: 'A1' },
      { subject: 'Physics', maxMarks: 100, obtainedMarks: 96, grade: 'A1' },
      { subject: 'Chemistry', maxMarks: 100, obtainedMarks: 91, grade: 'A1' },
      { subject: 'English', maxMarks: 100, obtainedMarks: 94, grade: 'A1' },
    ],
    homeworkList: [
      { subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', dueDate: 'Tomorrow, 09:00 AM', status: 'submitted' },
    ],
  },

  // Student 3: Diya Natarajan (Grade 8 - Section B)
  'student.diya@school.com': {
    id: 204,
    name: 'Diya Natarajan',
    email: 'student.diya@school.com',
    admissionNo: 'SCH-CBE-002/204',
    grade: 'Grade 8',
    section: 'B',
    rollNo: 204,
    schoolName: 'Rithik International Academy, Coimbatore',
    attendancePct: 98.8,
    totalPresent: 83,
    totalDays: 84,
    todaySchedule: [
      { period: 'Period 1', time: '09:00 - 09:45', subject: 'English Literature', teacher: 'Mrs. Jayanthi', room: 'Room 204' },
      { period: 'Period 2', time: '09:45 - 10:30', subject: 'Mathematics', teacher: 'Mr. Vignesh', room: 'Room 204' },
      { period: 'Period 3', time: '10:45 - 11:30', subject: 'Science', teacher: 'Dr. Kavitha', room: 'Lab 1' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'Computer Science', teacher: 'Mr. Karthik', room: 'Computer Lab' },
    ],
    examMarks: [
      { subject: 'Mathematics', maxMarks: 100, obtainedMarks: 96, grade: 'A1' },
      { subject: 'Science', maxMarks: 100, obtainedMarks: 94, grade: 'A1' },
      { subject: 'English Literature', maxMarks: 100, obtainedMarks: 95, grade: 'A1' },
    ],
    homeworkList: [
      { subject: 'English', title: 'Poetry Essay & Literary Devices', dueDate: 'Tomorrow, 08:30 AM', status: 'pending' },
    ],
  },
};

export const StudentIndividualPortal: React.FC = () => {
  const { user } = useAuth();
  const studentEmail = user?.email || 'student.aarav@school.com';
  const student = STUDENTS_DATABASE[studentEmail] || STUDENTS_DATABASE['student.aarav@school.com'];

  const totalMax = student.examMarks.reduce((a, b) => a + b.maxMarks, 0);
  const totalObt = student.examMarks.reduce((a, b) => a + (b.obtainedMarks || 0), 0);
  const pct = ((totalObt / totalMax) * 100).toFixed(1);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Identity Banner */}
      <div className="bg-indigo-900 text-white p-7 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
            {student.name.charAt(0)}
          </div>
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-800 text-indigo-300">
              Personalized Student Workspace
            </span>
            <h1 className="text-2xl font-bold mt-1">{student.name}</h1>
            <p className="text-xs text-indigo-200 mt-0.5">
              {student.grade} - Section {student.section} • Roll #{student.rollNo} • {student.schoolName}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-indigo-300">My Attendance</p>
          <p className="text-2xl font-extrabold text-emerald-400">{student.attendancePct}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exam Results */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-600" />
            My Published Marks
          </h2>
          <div className="divide-y divide-slate-100 text-xs">
            {student.examMarks.map((m, i) => (
              <div key={i} className="py-2.5 flex justify-between">
                <span className="font-semibold text-slate-700">{m.subject}</span>
                <span className="font-mono font-bold text-emerald-600">
                  {m.obtainedMarks}/{m.maxMarks} ({m.grade})
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs font-bold">
            <span>Overall Score</span>
            <span className="text-indigo-600 font-mono">{pct}% Distinction</span>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            Today's Schedule
          </h2>
          <div className="space-y-2 text-xs">
            {student.todaySchedule.map((s, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
                <div>
                  <p className="font-bold text-slate-800">{s.subject}</p>
                  <p className="text-[10px] text-slate-400">{s.time} • {s.teacher}</p>
                </div>
                <span className="font-mono text-[10px] font-bold text-indigo-700">{s.room}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Homework */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            Assigned Homework
          </h2>
          <div className="space-y-2.5 text-xs">
            {student.homeworkList.map((h, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{h.subject}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    h.status === 'submitted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {h.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{h.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Due: {h.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
