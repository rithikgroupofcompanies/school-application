import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  BookOpen, 
  User, 
  Building, 
  Printer,
  Sparkles,
  X
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function Timetable() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [entries, setEntries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    periodNumber: 1,
    subjectName: 'Mathematics',
    teacherId: '',
    startTime: '09:00:00',
    endTime: '09:45:00',
    room: 'Room 101'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTimetable();
    fetchTeachers();
  }, [selectedClass, selectedSection]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/timetables?className=${selectedClass}&section=${selectedSection}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEntries(data.entries || []);
      }
    } catch (err) {
      toast.error('Failed to load timetable schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/staff`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeachers(data.staff || []);
      }
    } catch (err) {
      console.warn('Teacher fetch warning:', err);
    }
  };

  const handleOpenAssignModal = (day, period) => {
    const existing = entries.find(e => e.day_of_week === day && e.period_number === period);
    setFormData({
      dayOfWeek: day,
      periodNumber: period,
      subjectName: existing ? existing.subject_name : 'Mathematics',
      teacherId: existing ? (existing.teacher_id || '') : (teachers[0]?.id || ''),
      startTime: existing ? existing.start_time : `${8 + period}:00:00`,
      endTime: existing ? existing.end_time : `${8 + period}:45:00`,
      room: existing ? existing.room : `Room 10${period}`
    });
    setIsModalOpen(true);
  };

  const handleSavePeriod = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        className: selectedClass,
        section: selectedSection,
        ...formData
      };

      const res = await fetch(`${API_URL}/api/timetables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'Timetable period scheduled successfully!');
        setIsModalOpen(false);
        fetchTimetable();
      } else {
        toast.error(data.message || 'Schedule conflict detected!');
      }
    } catch (err) {
      toast.error('Network error saving timetable period');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePeriod = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Remove this scheduled period?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/timetables/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Period removed');
        fetchTimetable();
      }
    } catch (err) {
      toast.error('Failed to remove period');
    }
  };

  const getEntry = (day, period) => {
    return entries.find(e => e.day_of_week === day && e.period_number === period);
  };

  const subjectColorMap = {
    'Mathematics': 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    'Physics': 'border-violet-500/50 bg-violet-500/10 text-violet-300',
    'Chemistry': 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    'English': 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    'Biology': 'border-teal-500/50 bg-teal-500/10 text-teal-300',
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Clock className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Interactive Timetable Engine</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Conflict Detection Active
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Click any cell on the grid to assign subject, educator, and room number. Automated teacher clash prevention enabled.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Grid</span>
          </button>
        </div>
      </div>

      {/* Timetable Grid Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-6">
        
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Loading weekly schedule...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800 w-28">
                    Day / Period
                  </th>
                  {PERIODS.map(p => (
                    <th key={p} className="p-3 text-center text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800 min-w-[130px]">
                      <div>Period {p}</div>
                      <div className="text-[9px] text-slate-500 font-normal">{8 + p}:00 - {8 + p}:45</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {DAYS.map(day => (
                  <tr key={day} className="hover:bg-slate-850/30 transition-colors">
                    
                    {/* Day Column */}
                    <td className="p-3 font-bold text-xs text-white bg-slate-950/40 border-r border-slate-800">
                      {day}
                    </td>

                    {/* Period Cells */}
                    {PERIODS.map(p => {
                      const entry = getEntry(day, p);
                      const colorClass = entry 
                        ? (subjectColorMap[entry.subject_name] || 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300')
                        : '';

                      return (
                        <td key={p} className="p-2 border border-slate-800/60">
                          {entry ? (
                            <div 
                              onClick={() => handleOpenAssignModal(day, p)}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer hover:scale-[1.02] transition-all relative group shadow-sm ${colorClass}`}
                            >
                              <button
                                onClick={(e) => handleDeletePeriod(entry.id, e)}
                                className="absolute top-1.5 right-1.5 p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Period"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>

                              <div className="font-extrabold text-xs truncate pr-4">{entry.subject_name}</div>
                              <div className="text-[10px] opacity-80 truncate mt-0.5">{entry.teacher_name || 'Staff Assigned'}</div>
                              <div className="text-[9px] font-mono opacity-60 mt-1">{entry.room || 'Room 101'}</div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAssignModal(day, p)}
                              className="w-full h-16 rounded-xl border border-dashed border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-1 group text-slate-600 hover:text-indigo-400"
                            >
                              <Plus className="w-3.5 h-3.5 group-hover:scale-120 transition-transform" />
                              <span className="text-[10px] font-medium">Assign</span>
                            </button>
                          )}
                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal: Assign Subject Period */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 max-w-md w-full relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Schedule Period Slot</h3>
                  <p className="text-[11px] text-slate-400">{formData.dayOfWeek} • Period {formData.periodNumber} ({selectedClass}-{selectedSection})</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject Name
                </label>
                <select
                  value={formData.subjectName}
                  onChange={(e) => setFormData(f => ({ ...f, subjectName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned Teacher / Faculty
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData(f => ({ ...f, teacherId: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Educator...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.full_name} ({t.designation || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Classroom / Lab
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData(f => ({ ...f, room: e.target.value }))}
                    placeholder="Room 101"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime.slice(0, 5)}
                    onChange={(e) => setFormData(f => ({ ...f, startTime: `${e.target.value}:00` }))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 ${
                    saving ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{saving ? 'Checking Conflicts...' : 'Save & Schedule Period'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
