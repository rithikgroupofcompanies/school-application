import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, AlertCircle, CheckCircle2, ShieldAlert, BookOpen, User, Building, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
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
    } catch (err) {}
  };

  const handleOpenAddModal = (day, period) => {
    setFormData({
      dayOfWeek: day,
      periodNumber: period,
      subjectName: 'Mathematics',
      teacherId: teachers[0]?.id?.toString() || '',
      startTime: `${8 + period}:00:00`.padStart(8, '0'),
      endTime: `${8 + period}:45:00`.padStart(8, '0'),
      room: `Room 10${period}`
    });
    setIsModalOpen(true);
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/timetables/entry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          className: selectedClass,
          section: selectedSection
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Period scheduled successfully!');
        setIsModalOpen(false);
        fetchTimetable();
      } else {
        toast.error(data.message || 'Failed to schedule period');
      }
    } catch (err) {
      toast.error('Network error saving period');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Remove this period from schedule?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/timetables/entry/${id}`, {
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

  // Find period entry for a given day and period
  const getEntry = (day, period) => {
    return entries.find(e => e.day_of_week === day && e.period_number === period);
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4" /> Timetable Engine
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Interactive Weekly Timetable</h1>
            <p className="text-sm text-gray-500 mt-1">
              Visual timetable builder with real-time teacher and room conflict detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
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
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50 transition-all"
            >
              <Printer className="w-4 h-4 text-blue-600" /> Print
            </button>
          </div>
        </div>

        {/* Timetable Calendar Grid */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left font-bold text-xs uppercase tracking-wider text-gray-400 bg-gray-50/50 rounded-tl-2xl">
                  Day / Period
                </th>
                {PERIODS.map(p => (
                  <th key={p} className="p-3 text-center font-bold text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                    Period {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DAYS.map(day => (
                <tr key={day} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 font-bold text-sm text-gray-800 bg-gray-50/40 whitespace-nowrap">
                    {day}
                  </td>
                  {PERIODS.map(period => {
                    const entry = getEntry(day, period);
                    return (
                      <td key={period} className="p-2 min-w-[130px] text-center align-top">
                        {entry ? (
                          <div className="group relative bg-white border border-blue-100 hover:border-blue-400 p-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
                            <span className="block font-bold text-xs text-blue-900 truncate">
                              {entry.subject_name || 'Subject'}
                            </span>
                            <span className="block text-[11px] text-gray-500 truncate mt-0.5">
                              {entry.teacher_name || 'Staff'}
                            </span>
                            <span className="inline-block mt-1 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                              {entry.room || 'R-101'}
                            </span>

                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                              title="Delete period"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAddModal(day, period)}
                            className="w-full h-16 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 flex flex-col items-center justify-center text-gray-300 hover:text-blue-600 transition-all text-xs font-semibold"
                          >
                            <Plus className="w-4 h-4 mb-0.5" />
                            Assign
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

        {/* Modal for adding/editing period */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Schedule Period</h2>
              <p className="text-xs text-gray-500 mb-6">
                Assign subject and teacher for {formData.dayOfWeek}, Period {formData.periodNumber}.
              </p>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Assigned Teacher</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.designation || 'Teacher'})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Start Time</label>
                    <input
                      type="text"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">End Time</label>
                    <input
                      type="text"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Classroom / Hall</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g. Room 102 / Physics Lab"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow"
                  >
                    {saving ? 'Checking Conflicts...' : 'Save Period'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
