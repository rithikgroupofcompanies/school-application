import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Mail,
  Search,
  X,
  AlertTriangle
} from 'lucide-react';

interface ClassStudent {
  id: number;
  roll: number;
  admission_no: string;
  name: string;
  attendanceToday: 'present' | 'absent' | 'late';
  overallAttendancePct: number;
  termGrade: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
}

const INITIAL_ROSTER: ClassStudent[] = [
  {
    id: 101,
    roll: 1,
    admission_no: 'SCH-CHN-001/101',
    name: 'Aarav Sharma',
    attendanceToday: 'present',
    overallAttendancePct: 96.4,
    termGrade: 'A+ (92%)',
    guardianName: 'Mr. K. Raman',
    guardianPhone: '+919840199881',
    guardianEmail: 'parent.aarav@greenwood.edu',
  },
  {
    id: 102,
    roll: 2,
    admission_no: 'SCH-CHN-001/102',
    name: 'Ananya Raman',
    attendanceToday: 'present',
    overallAttendancePct: 98.8,
    termGrade: 'O (98%)',
    guardianName: 'Mrs. V. Raman',
    guardianPhone: '+919840199882',
    guardianEmail: 'raman.ananya.parent@gmail.com',
  },
  {
    id: 103,
    roll: 3,
    admission_no: 'SCH-CHN-001/103',
    name: 'Dinesh Kumar',
    attendanceToday: 'absent',
    overallAttendancePct: 84.5,
    termGrade: 'B+ (78%)',
    guardianName: 'Mr. R. Kumar',
    guardianPhone: '+919840199883',
    guardianEmail: 'dinesh.kumar.father@yahoo.com',
  },
  {
    id: 104,
    roll: 4,
    admission_no: 'SCH-CHN-001/104',
    name: 'Harini Sundar',
    attendanceToday: 'present',
    overallAttendancePct: 91.2,
    termGrade: 'A (86%)',
    guardianName: 'Mr. P. Sundaram',
    guardianPhone: '+919840199884',
    guardianEmail: 'sundar.harini.parent@gmail.com',
  },
  {
    id: 105,
    roll: 5,
    admission_no: 'SCH-CHN-001/105',
    name: 'Karthik Raja',
    attendanceToday: 'present',
    overallAttendancePct: 89.0,
    termGrade: 'A (84%)',
    guardianName: 'Mrs. K. Raja',
    guardianPhone: '+919840199885',
    guardianEmail: 'raja.karthik.parent@outlook.com',
  },
  {
    id: 106,
    roll: 6,
    admission_no: 'SCH-CHN-001/106',
    name: 'Meera Vijay',
    attendanceToday: 'late',
    overallAttendancePct: 94.0,
    termGrade: 'A+ (90%)',
    guardianName: 'Mr. M. Vijay',
    guardianPhone: '+919840199886',
    guardianEmail: 'vijay.meera.parent@gmail.com',
  },
];

export const ClassAdminDashboard: React.FC = () => {
  const { user, activeSchool } = useAuth();
  const [students, setStudents] = useState<ClassStudent[]>(INITIAL_ROSTER);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    admission_no: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    gender: 'male'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleAttendance = (id: number, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendanceToday: status } : s))
    );
    showToast(`Updated attendance status for Roll #${id}`);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    const id = students.length + 101;
    const added: ClassStudent = {
      id,
      roll: students.length + 1,
      admission_no: newStudent.admission_no || `SCH-CHN-001/${id}`,
      name: newStudent.name,
      attendanceToday: 'present',
      overallAttendancePct: 100,
      termGrade: 'Enrolled',
      guardianName: newStudent.guardianName || 'Guardian',
      guardianPhone: newStudent.guardianPhone || '+91 90000 00000',
      guardianEmail: newStudent.guardianEmail || '',
    };

    setStudents([added, ...students]);
    setIsAddModalOpen(false);
    setNewStudent({
      name: '',
      admission_no: '',
      guardianName: '',
      guardianPhone: '',
      guardianEmail: '',
      gender: 'male'
    });
    showToast(`Student ${added.name} added to Grade 10 - Section A successfully!`);
  };

  const openWhatsApp = (student: ClassStudent) => {
    const cleanPhone = student.guardianPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🏫 *Rithik Group of Companies - School ERP*\n` +
      `*Daily Attendance & Academic Update*\n\n` +
      `Dear ${student.guardianName},\n` +
      `Update regarding your ward *${student.name}* (Roll: #${student.roll}, Grade 10 - Section A):\n` +
      `• *Today's Status:* ${student.attendanceToday.toUpperCase()}\n` +
      `• *Overall Attendance:* ${student.overallAttendancePct}%\n` +
      `• *Academic Performance:* ${student.termGrade}\n\n` +
      `_From: ${user?.name || 'Class Teacher'}, ${activeSchool?.name || 'Rithik Matriculation Higher Secondary School'}._`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    showToast(`WhatsApp message opened for ${student.guardianName}`);
  };

  const sendEmailAlert = (student: ClassStudent) => {
    if (!student.guardianEmail) {
      alert(`No email registered for ${student.guardianName}. Please update phone or contact details.`);
      return;
    }
    showToast(`Academic digest & attendance alert email sent to ${student.guardianEmail}!`);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_no.toLowerCase().includes(search.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = students.filter((s) => s.attendanceToday === 'present').length;
  const absentCount = students.filter((s) => s.attendanceToday === 'absent').length;
  const lateCount = students.filter((s) => s.attendanceToday === 'late').length;
  const attendanceRate = ((presentCount / students.length) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700">
              Grade 10 • Section A
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {activeSchool?.name || 'Rithik Matriculation Higher Secondary School, Chennai'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Class Teacher Workspace</h1>
          <p className="text-xs text-slate-500">
            Class Admin: <strong>{user?.name || 'Campus Principal'}</strong> • Manage daily attendance, student admissions, and direct parent communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Add Student to Section
          </button>
          <a
            href="/school/academics"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <CalendarCheck className="h-4 w-4 text-indigo-600" />
            Full Marksheet & Timetable
          </a>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-400">Section Roster</p>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{students.length} Students</p>
          <span className="text-[11px] text-slate-500 font-medium">All active enrollees</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-400">Today's Attendance</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{attendanceRate}%</p>
          <span className="text-[11px] text-slate-500 font-medium">{presentCount} present today</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-400">Today's Absentees</p>
            <XCircle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{absentCount} Absent</p>
          <span className="text-[11px] text-slate-500 font-medium">Alerts ready for parents</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-400">Late Arrivals</p>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{lateCount} Students</p>
          <span className="text-[11px] text-slate-500 font-medium">Permitted with slip</span>
        </div>
      </div>

      {/* Roster & Quick Action Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Class Section Roster & Daily Action Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mark attendance and dispatch instant WhatsApp & Email alerts to parents with 1-click.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student, roll or guardian..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Roll #</th>
                <th className="py-3 px-4">Student Details</th>
                <th className="py-3 px-4">Today's Attendance</th>
                <th className="py-3 px-4">Overall %</th>
                <th className="py-3 px-4">Term GPA</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-right">Parent Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">#{st.roll}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{st.admission_no}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleAttendance(st.id, 'present')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          st.attendanceToday === 'present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleToggleAttendance(st.id, 'absent')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          st.attendanceToday === 'absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleToggleAttendance(st.id, 'late')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          st.attendanceToday === 'late'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md ${
                        st.overallAttendancePct >= 90
                          ? 'bg-emerald-50 text-emerald-700'
                          : st.overallAttendancePct >= 75
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {st.overallAttendancePct}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                      {st.termGrade}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-900">{st.guardianName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{st.guardianPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openWhatsApp(st)}
                        title="Send Real-time WhatsApp Notification"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => sendEmailAlert(st)}
                        title="Send Email Alert"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5 text-indigo-600" />
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student to Section Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Student to Grade 10 - Section A</h3>
                <p className="text-xs text-slate-500 mt-0.5">Direct enrollment by Class Teacher / Class Admin</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Vigneshwaran"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    placeholder="Auto or SCH-CHN-001/..."
                    value={newStudent.admission_no}
                    onChange={(e) => setNewStudent({ ...newStudent, admission_no: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="font-bold text-indigo-700 mb-2">Parent / Guardian Contact</p>
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. K. Selvam"
                      value={newStudent.guardianName}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp / Mobile *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98400 12345"
                        value={newStudent.guardianPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Parent Email</label>
                      <input
                        type="email"
                        placeholder="parent@gmail.com"
                        value={newStudent.guardianEmail}
                        onChange={(e) => setNewStudent({ ...newStudent, guardianEmail: e.target.value })}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save & Admit to Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
