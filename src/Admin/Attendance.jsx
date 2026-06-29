import React, { useState, useEffect } from 'react';
import { Calendar, ShieldAlert, CheckCircle, Clock, AlertTriangle, Check, X, ShieldCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Attendance() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // Filters state
  const [selectedClass, setSelectedClass] = useState(isClassAdmin ? loggedInUser.className : 'Class 8');
  const [selectedSection, setSelectedSection] = useState(isClassAdmin ? loggedInUser.section : 'A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Data state
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // studentId -> 'Present' or 'Absent'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Lock state
  const [isLocked, setIsLocked] = useState(false);
  const [recordInfo, setRecordInfo] = useState(null);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedClass, selectedSection, selectedDate]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 1. Fetch Students
      const studentRes = await fetch(`http://localhost:3000/api/users?role=student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      
      let classStudents = [];
      if (studentRes.ok && studentData.success) {
        // Filter students by class & section
        classStudents = studentData.users.filter(
          s => s.className === selectedClass && s.section === selectedSection
        );
        setStudents(classStudents);
      }

      // 2. Fetch Attendance Records for this class/section
      const attRes = await fetch(`http://localhost:3000/api/attendance?className=${selectedClass}&section=${selectedSection}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const attData = await attRes.json();

      let foundRecord = null;
      if (attRes.ok && attData.success) {
        foundRecord = attData.records.find(r => r.date === selectedDate);
        setRecordInfo(foundRecord || null);
      }

      // Initialize attendance dictionary
      const initialAttendance = {};
      classStudents.forEach(student => {
        initialAttendance[student.id] = foundRecord?.status[student.id] || 'Present';
      });
      setAttendance(initialAttendance);

      // Check lock status: if a record exists and submittedAt is > 24 hours ago, or if date is older than 24h
      if (foundRecord) {
        const submittedTime = new Date(foundRecord.submittedAt).getTime();
        const timeElapsed = (Date.now() - submittedTime) / (1000 * 60 * 60);
        setIsLocked(timeElapsed > 24);
      } else {
        // No record yet, check if selectedDate is older than 24 hours from today
        const dateDiff = (new Date().getTime() - new Date(selectedDate).getTime()) / (1000 * 60 * 60);
        setIsLocked(dateDiff > 24);
      }

    } catch (error) {
      toast.error('Failed to load class registry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    if (isLocked && isClassAdmin) return;
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = (isLocked && isSuperAdmin) 
        ? 'http://localhost:3000/api/attendance/override' 
        : 'http://localhost:3000/api/attendance/submit';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          className: selectedClass,
          section: selectedSection,
          date: selectedDate,
          status: attendance
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
      toast.error('Network error. Try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/10">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance Registry</h1>
              <p className="text-sm text-slate-500 mt-0.5">Mark daily presence and track historical records.</p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
              <select
                disabled={isClassAdmin}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section</label>
              <select
                disabled={isClassAdmin}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                {['A', 'B', 'C', 'D'].map(sec => (
                  <option key={sec} value={sec}>Section {sec}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Lock warning banner */}
        {isLocked ? (
          isSuperAdmin ? (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex gap-3 text-indigo-800">
              <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Super Admin Override Lock Active</span>
                <span className="text-xs text-indigo-600">This checklist was finalized over 24 hours ago. As a Super Admin, you bypass the block and can save historic overrides.</span>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 text-rose-800">
              <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm">Attendance Edit Window Expired</span>
                <span className="text-xs text-rose-600">This record is older than 24 hours and is currently locked for Class Admins. Please contact a Super Admin to perform an override key modification.</span>
              </div>
            </div>
          )
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-emerald-800">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Edit Window Active</span>
              <span className="text-xs text-emerald-600">You are within the 24-hour edit limit. Changes can be saved directly to the database.</span>
            </div>
          </div>
        )}

        {/* Students Registry Table */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
          <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-wrap gap-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Student Registry
              <span className="text-xs font-normal text-slate-400">({students.length} enrolled)</span>
            </h3>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Present: {Object.values(attendance).filter(v => v === 'Present').length}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
                Absent: {Object.values(attendance).filter(v => v === 'Absent').length}
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-semibold">Loading registry...</div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold">No students registered for {selectedClass}-{selectedSection}.</div>
            ) : (
              students.map(student => {
                const status = attendance[student.id] || 'Present';
                const isLockedForRole = isLocked && isClassAdmin;
                return (
                  <div key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <span className="font-mono text-xs text-slate-400 font-bold block mb-0.5">#{student.rollNumber || '00'}</span>
                      <span className="font-bold text-slate-800">{student.name}</span>
                      <span className="text-xs text-slate-400 block">{student.email}</span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        disabled={isLockedForRole}
                        className={`
                          p-2.5 rounded-xl border flex items-center gap-1.5 font-bold text-xs transition-all duration-200
                          ${status === 'Present'
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
                          ${isLockedForRole ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                        `}
                      >
                        <Check className="w-4 h-4" />
                        Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        disabled={isLockedForRole}
                        className={`
                          p-2.5 rounded-xl border flex items-center gap-1.5 font-bold text-xs transition-all duration-200
                          ${status === 'Absent'
                            ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
                          ${isLockedForRole ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                        `}
                      >
                        <X className="w-4 h-4" />
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Submit bar */}
          {students.length > 0 && (!isLocked || isSuperAdmin) && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`
                  px-6 py-3.5 rounded-xl text-white font-bold transition-all shadow-lg flex items-center gap-2
                  ${isLocked && isSuperAdmin 
                    ? 'bg-indigo-600 hover:bg-indigo-750 shadow-indigo-600/10' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'}
                  ${saving ? 'opacity-85' : 'hover:-translate-y-0.5 active:scale-95'}
                `}
              >
                {isLocked && isSuperAdmin ? <ShieldCheck className="w-4.5 h-4.5" /> : <CheckCircle className="w-4.5 h-4.5" />}
                {saving ? 'Saving...' : isLocked && isSuperAdmin ? 'Save Override Snapshot' : 'Save Attendance'}
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
