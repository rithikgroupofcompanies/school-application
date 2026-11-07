import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';

interface Teacher {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subjectSpecialization: string;
  department: string;
  schoolId: number;
  schoolName: string;
  assignedSections: string[];
  periodsPerWeek: number;
}

interface TimetableSlot {
  id: number;
  day: string;
  period: string;
  time: string;
  subject: string;
  teacherId: number;
  teacherName: string;
  section: string;
  room: string;
}

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    employeeId: 'EMP-CHN-011',
    name: 'Mr. R. Suresh, M.Sc., B.Ed.',
    email: 'suresh.math@school.com',
    phone: '+91 98401 23456',
    subjectSpecialization: 'Mathematics',
    department: 'Science & Math',
    schoolId: 1,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    assignedSections: ['Grade 10 - Section A', 'Grade 9 - Section B'],
    periodsPerWeek: 18,
  },
  {
    id: 2,
    employeeId: 'EMP-CHN-012',
    name: 'Dr. K. Meena, Ph.D.',
    email: 'meena.phy@school.com',
    phone: '+91 98402 34567',
    subjectSpecialization: 'Physics',
    department: 'Science & Math',
    schoolId: 1,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    assignedSections: ['Grade 10 - Section A', 'Grade 11 - Science A'],
    periodsPerWeek: 16,
  },
  {
    id: 3,
    employeeId: 'EMP-CHN-013',
    name: 'Mrs. S. Lakshmi, M.Sc.',
    email: 'lakshmi.chem@school.com',
    phone: '+91 98403 45678',
    subjectSpecialization: 'Chemistry',
    department: 'Science & Math',
    schoolId: 1,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    assignedSections: ['Grade 10 - Section A', 'Grade 12 - Science B'],
    periodsPerWeek: 15,
  },
  {
    id: 4,
    employeeId: 'EMP-CHN-014',
    name: 'Mr. M. Anand, M.A.',
    email: 'anand.eng@school.com',
    phone: '+91 98404 56789',
    subjectSpecialization: 'English Language',
    department: 'Humanities & Languages',
    schoolId: 1,
    schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
    assignedSections: ['Grade 10 - Section A', 'Grade 8 - Section A'],
    periodsPerWeek: 20,
  },
];

const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 1, day: 'Monday', period: 'Period 1', time: '09:00 - 09:45', subject: 'Mathematics', teacherId: 1, teacherName: 'Mr. R. Suresh', section: 'Grade 10 - Section A', room: 'Room 101' },
  { id: 2, day: 'Monday', period: 'Period 2', time: '09:45 - 10:30', subject: 'Physics', teacherId: 2, teacherName: 'Dr. K. Meena', section: 'Grade 10 - Section A', room: 'Physics Lab 2' },
  { id: 3, day: 'Monday', period: 'Period 3', time: '10:45 - 11:30', subject: 'Chemistry', teacherId: 3, teacherName: 'Mrs. S. Lakshmi', section: 'Grade 10 - Section A', room: 'Room 101' },
  { id: 4, day: 'Monday', period: 'Period 4', time: '11:30 - 12:15', subject: 'English', teacherId: 4, teacherName: 'Mr. M. Anand', section: 'Grade 10 - Section A', room: 'Room 101' },

  { id: 5, day: 'Tuesday', period: 'Period 1', time: '09:00 - 09:45', subject: 'Physics', teacherId: 2, teacherName: 'Dr. K. Meena', section: 'Grade 10 - Section A', room: 'Physics Lab 2' },
  { id: 6, day: 'Tuesday', period: 'Period 2', time: '09:45 - 10:30', subject: 'Mathematics', teacherId: 1, teacherName: 'Mr. R. Suresh', section: 'Grade 10 - Section A', room: 'Room 101' },
  { id: 7, day: 'Tuesday', period: 'Period 3', time: '10:45 - 11:30', subject: 'English', teacherId: 4, teacherName: 'Mr. M. Anand', section: 'Grade 10 - Section A', room: 'Room 101' },
  { id: 8, day: 'Tuesday', period: 'Period 4', time: '11:30 - 12:15', subject: 'Chemistry', teacherId: 3, teacherName: 'Mrs. S. Lakshmi', section: 'Grade 10 - Section A', room: 'Chemistry Lab 1' },
];

export const TeacherTimetableManager: React.FC = () => {
  const { role } = useAuth();

  // Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | 'all'>('all');

  // Timetable State
  const [timetable, setTimetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);
  const [activeSection, setActiveSection] = useState('Grade 10 - Section A');
  const [activeView, setActiveView] = useState<'teachers' | 'section_timetable' | 'staff_timetable'>('section_timetable');

  // Modals
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    subjectSpecialization: 'Mathematics',
    department: 'Science & Math',
    section: 'Grade 10 - Section A',
  });

  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Wednesday',
    period: 'Period 1',
    time: '09:00 - 09:45',
    subject: 'Mathematics',
    teacherId: 1,
    section: 'Grade 10 - Section A',
    room: 'Room 101',
  });

  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Add Teacher Handler
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Teacher = {
      id: teachers.length + 1,
      employeeId: `EMP-CHN-0${teachers.length + 10}`,
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      subjectSpecialization: newTeacher.subjectSpecialization,
      department: newTeacher.department,
      schoolId: 1,
      schoolName: 'Rithik Matriculation Higher Secondary School, Chennai',
      assignedSections: [newTeacher.section],
      periodsPerWeek: 16,
    };

    setTeachers([...teachers, created]);
    setIsAddTeacherOpen(false);
    setNewTeacher({ name: '', email: '', phone: '', subjectSpecialization: 'Mathematics', department: 'Science & Math', section: 'Grade 10 - Section A' });
  };

  // Add or Edit Timetable Slot with Conflict Detection
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const teacher = teachers.find((t) => t.id === Number(newSlot.teacherId));

    // Conflict Check: Double-booking teacher on the same day and period
    const doubleBooked = timetable.find(
      (slot) =>
        slot.day === newSlot.day &&
        slot.period === newSlot.period &&
        slot.teacherId === Number(newSlot.teacherId)
    );

    if (doubleBooked) {
      setConflictWarning(
        `CONFLICT DETECTED: ${teacher?.name} is already teaching ${doubleBooked.subject} in ${doubleBooked.section} during ${doubleBooked.period} on ${doubleBooked.day}!`
      );
      return;
    }

    const createdSlot: TimetableSlot = {
      id: timetable.length + 1,
      day: newSlot.day,
      period: newSlot.period,
      time: newSlot.time,
      subject: newSlot.subject,
      teacherId: Number(newSlot.teacherId),
      teacherName: teacher?.name || 'Assigned Teacher',
      section: newSlot.section,
      room: newSlot.room,
    };

    setTimetable([...timetable, createdSlot]);
    setIsAddSlotOpen(false);
  };

  const filteredTimetable =
    selectedTeacherId === 'all'
      ? timetable.filter((s) => s.section === activeSection)
      : timetable.filter((s) => s.teacherId === Number(selectedTeacherId));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Authorized Authority: {role || 'School Admin / Ops Staff'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
            Faculty Directory & Timetable Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Onboard teachers, allocate curriculum subjects, and configure conflict-free timetables for classes and individual staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddTeacherOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add New Teacher
          </button>
          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-indigo-600" />
            Schedule Period Slot
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => {
            setActiveView('section_timetable');
            setSelectedTeacherId('all');
          }}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
            activeView === 'section_timetable'
              ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Class Section Timetable
        </button>

        <button
          onClick={() => {
            setActiveView('staff_timetable');
            setSelectedTeacherId(teachers[0]?.id || 'all');
          }}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
            activeView === 'staff_timetable'
              ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Individual Staff Schedules
        </button>

        <button
          onClick={() => setActiveView('teachers')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
            activeView === 'teachers'
              ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Faculty Directory ({teachers.length} Staff)
        </button>
      </div>

      {/* VIEW 1: SECTION TIMETABLE */}
      {activeView === 'section_timetable' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase text-slate-500">Select Class Section:</label>
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="rounded-xl border border-slate-300 py-1.5 px-3 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none"
              >
                <option>Grade 10 - Section A</option>
                <option>Grade 10 - Section B</option>
                <option>Grade 9 - Section A</option>
                <option>Grade 11 - Science A</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Conflict Engine: Teacher & Room Validated
            </div>
          </div>

          {/* Grid Layout */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4 text-left">Day / Period</th>
                  <th className="py-3 px-4">Period 1 (09:00 - 09:45)</th>
                  <th className="py-3 px-4">Period 2 (09:45 - 10:30)</th>
                  <th className="py-3 px-4 bg-amber-50 text-amber-800">Break (10:30 - 10:45)</th>
                  <th className="py-3 px-4">Period 3 (10:45 - 11:30)</th>
                  <th className="py-3 px-4">Period 4 (11:30 - 12:15)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const daySlots = timetable.filter((s) => s.section === activeSection && s.day === day);
                  const p1 = daySlots.find((s) => s.period === 'Period 1');
                  const p2 = daySlots.find((s) => s.period === 'Period 2');
                  const p3 = daySlots.find((s) => s.period === 'Period 3');
                  const p4 = daySlots.find((s) => s.period === 'Period 4');

                  return (
                    <tr key={day} className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 font-bold text-slate-900 text-left bg-slate-50/60">{day}</td>

                      {/* Period 1 */}
                      <td className="p-2">
                        {p1 ? (
                          <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                            <p className="font-bold">{p1.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{p1.teacherName}</p>
                            <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-indigo-200 mt-1 inline-block">
                              {p1.room}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">— Free —</span>
                        )}
                      </td>

                      {/* Period 2 */}
                      <td className="p-2">
                        {p2 ? (
                          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-emerald-950">
                            <p className="font-bold">{p2.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{p2.teacherName}</p>
                            <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                              {p2.room}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">— Free —</span>
                        )}
                      </td>

                      {/* Recess Break */}
                      <td className="p-2 bg-amber-50/40 text-amber-800 text-[11px] font-semibold">
                        Recess
                      </td>

                      {/* Period 3 */}
                      <td className="p-2">
                        {p3 ? (
                          <div className="p-3 rounded-2xl bg-violet-50/60 border border-violet-100 text-violet-950">
                            <p className="font-bold">{p3.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{p3.teacherName}</p>
                            <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-violet-200 mt-1 inline-block">
                              {p3.room}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">— Free —</span>
                        )}
                      </td>

                      {/* Period 4 */}
                      <td className="p-2">
                        {p4 ? (
                          <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-sky-950">
                            <p className="font-bold">{p4.subject}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{p4.teacherName}</p>
                            <span className="font-mono text-[9px] bg-white px-1.5 py-0.5 rounded border border-sky-200 mt-1 inline-block">
                              {p4.room}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">— Free —</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: INDIVIDUAL STAFF TIMETABLE */}
      {activeView === 'staff_timetable' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase text-slate-500">Select Faculty Member:</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                className="rounded-xl border border-slate-300 py-1.5 px-3 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subjectSpecialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-bold text-slate-600">
              Weekly Teaching Load: {timetable.filter((s) => s.teacherId === selectedTeacherId).length} Allocated Periods
            </div>
          </div>

          {/* Teacher Specific Schedule List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Individual Schedule for {teachers.find((t) => t.id === selectedTeacherId)?.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTimetable.map((slot) => (
                <div key={slot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {slot.day} • {slot.period}
                    </span>
                    <span className="font-mono text-slate-400">{slot.time}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{slot.subject}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-slate-500">
                    <span>{slot.section}</span>
                    <span className="font-mono font-semibold text-slate-700">{slot.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FACULTY ROSTER */}
      {activeView === 'teachers' && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Emp ID</th>
                <th className="py-4 px-6">Teacher Name & Specialization</th>
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Assigned Sections</th>
                <th className="py-4 px-6">Contact Email & Phone</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">{t.employeeId}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{t.subjectSpecialization}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{t.department}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {t.assignedSections.map((sec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    <p>{t.email}</p>
                    <p className="text-[10px]">{t.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => {
                        setSelectedTeacherId(t.id);
                        setActiveView('staff_timetable');
                      }}
                      className="px-3 py-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg"
                    >
                      View Timetable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add New Teacher */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Faculty Member</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a certified teacher to this institution.</p>
              </div>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Full Name</label>
                <input
                  type="text"
                  required
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="e.g. Dr. R. Ramanathan, M.Sc., B.Ed."
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="teacher@school.com"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="+91 98400 12345"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Specialization</label>
                  <select
                    value={newTeacher.subjectSpecialization}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subjectSpecialization: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>English Language</option>
                    <option>Tamil Language</option>
                    <option>Computer Science</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Section Allocation</label>
                  <select
                    value={newTeacher.section}
                    onChange={(e) => setNewTeacher({ ...newTeacher, section: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Grade 10 - Section A</option>
                    <option>Grade 10 - Section B</option>
                    <option>Grade 11 - Science A</option>
                    <option>Grade 12 - Commerce</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Add Teacher to School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Timetable Slot with Conflict Detection */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Schedule Timetable Period Slot</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automated conflict checking for teachers and rooms.</p>
              </div>
              <button onClick={() => setIsAddSlotOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {conflictWarning && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekday</label>
                  <select
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Period</label>
                  <select
                    value={newSlot.period}
                    onChange={(e) => {
                      const times: Record<string, string> = {
                        'Period 1': '09:00 - 09:45',
                        'Period 2': '09:45 - 10:30',
                        'Period 3': '10:45 - 11:30',
                        'Period 4': '11:30 - 12:15',
                      };
                      setNewSlot({ ...newSlot, period: e.target.value, time: times[e.target.value] || '09:00 - 09:45' });
                    }}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Period 1</option>
                    <option>Period 2</option>
                    <option>Period 3</option>
                    <option>Period 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher</label>
                <select
                  value={newSlot.teacherId}
                  onChange={(e) => setNewSlot({ ...newSlot, teacherId: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subjectSpecialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newSlot.subject}
                    onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room / Lab</label>
                  <input
                    type="text"
                    required
                    value={newSlot.room}
                    onChange={(e) => setNewSlot({ ...newSlot, room: e.target.value })}
                    placeholder="Room 101 / Lab 2"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Save & Validate Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
