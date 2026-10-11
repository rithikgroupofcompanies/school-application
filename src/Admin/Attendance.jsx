import React, { useState, useEffect } from 'react';
import { Calendar, ShieldAlert, CheckCircle, Clock, AlertTriangle, Check, X, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

export default function Attendance() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'school_admin';

  // Filters state
  const [selectedClass, setSelectedClass] = useState(isClassAdmin ? (loggedInUser.className || 'Class 10') : 'Class 10');
  const [selectedSection, setSelectedSection] = useState(isClassAdmin ? (loggedInUser.section || 'A') : 'A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Data state
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Lock state
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedClass, selectedSection, selectedDate]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Students
      const studentRes = await fetch(`${API_URL}/api/users?role=student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      
      let classStudents = [];
      if (studentRes.ok && studentData.success) {
        classStudents = (studentData.users || []).filter(
          s => (s.className || s.class_name) === selectedClass && (s.section || s.section_name) === selectedSection
        );
        setStudents(classStudents);
      }

      // 2. Fetch Attendance Records
      const attRes = await fetch(`${API_URL}/api/attendance?className=${selectedClass}&section=${selectedSection}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const attData = await attRes.json();

      let foundRecord = null;
      if (attRes.ok && attData.success) {
        foundRecord = (attData.records || []).find(r => r.date === selectedDate);
      }

      // Check lock window (24 hours)
      const recordDate = new Date(selectedDate);
      const now = new Date();
      const diffHours = (now - recordDate) / (1000 * 60 * 60);
      setIsLocked(diffHours > 24);

      // Populate attendance map
      const initialMap = {};
      classStudents.forEach(stu => {
        if (foundRecord && foundRecord.records) {
          const rec = foundRecord.records.find(r => r.student_id === stu.id);
          initialMap[stu.id] = rec ? rec.status : 'Present';
        } else {
          initialMap[stu.id] = 'Present';
        }
      });
      setAttendance(initialMap);

    } catch (err) {
      toast.error('Failed to load students and attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    if (isLocked && !isSuperAdmin) {
      toast.warn('Attendance is locked after 24 hours. Super Admin override required.');
      return;
    }
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/attendance/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          className: selectedClass,
          section: selectedSection,
          date: selectedDate,
          attendance
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Attendance saved successfully!');
        fetchStudentsAndAttendance();
      } else {
        toast.error(data.message || 'Failed to submit attendance');
      }
    } catch (error) {
      toast.error('Network error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'Absent').length;

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Daily Attendance Registry</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Real-time Logging
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Submit daily attendance. Records automatically sync to the connected Google Sheet.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClass}
            disabled={isClassAdmin}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          >
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <select
            value={selectedSection}
            disabled={isClassAdmin}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 disabled:opacity-60"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* Lock Warning Banner */}
      {isLocked && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs">
          <Clock className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold">Attendance Edit Window Exceeded (24h+):</span>{' '}
            {isSuperAdmin ? 'As Super Admin, you are permitted to save historic override snapshots.' : 'This date is locked. Super Admin override required to modify.'}
          </div>
        </div>
      )}

      {/* Student List & Attendance Toggles */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table Header / Summary */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <span>Enrolled Students</span>
            <span className="text-slate-400 font-normal">({students.length} in {selectedClass}-{selectedSection})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Present: {presentCount}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Absent: {absentCount}
            </span>
          </div>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-slate-800/60">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">No students enrolled in {selectedClass}-{selectedSection}.</div>
          ) : (
            students.map(student => {
              const status = attendance[student.id] || 'Present';
              const isLockedForRole = isLocked && !isSuperAdmin;

              return (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-850/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center">
                      {(student.name || student.full_name || 'S').charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{student.name || student.full_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Roll: {student.rollNumber || student.roll_number || '—'} • {student.email || student.username}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isLockedForRole}
                      onClick={() => handleStatusChange(student.id, 'Present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        status === 'Present'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      } ${isLockedForRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLockedForRole}
                      onClick={() => handleStatusChange(student.id, 'Absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        status === 'Absent'
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                      } ${isLockedForRole ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit Footer */}
        {students.length > 0 && (!isLocked || isSuperAdmin) && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 ${
                saving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Recording Attendance...' : 'Save & Publish Attendance'}</span>
            </button>
          </div>
        )}

      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
