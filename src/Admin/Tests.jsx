import React, { useState, useEffect } from 'react';
import { BarChart2, Award, Plus, Layers, Edit, Save, BookOpen, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Tests() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // State
  const [testsList, setTestsList] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [editingMarks, setEditingMarks] = useState({}); // studentId -> score
  const [saving, setSaving] = useState(false);

  // New test modal form
  const [formData, setFormData] = useState({
    className: isClassAdmin ? loggedInUser.className : 'Class 8',
    section: isClassAdmin ? loggedInUser.section : 'A',
    subject: '',
    name: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTestsAndStudents();
  }, []);

  const fetchTestsAndStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch Tests
      const testsRes = await fetch(`${API_URL}/api/tests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const testsData = await testsRes.json();
      if (testsRes.ok && testsData.success) {
        setTestsList(testsData.tests);
      }

      // Fetch Students
      const studentRes = await fetch(`${API_URL}/api/users?role=student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      if (studentRes.ok && studentData.success) {
        setStudents(studentData.users);
      }

    } catch (error) {
      toast.error('Network error loading test analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tests/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Test series created successfully!');
        setFormData({
          className: isClassAdmin ? loggedInUser.className : 'Class 8',
          section: isClassAdmin ? loggedInUser.section : 'A',
          subject: '',
          name: ''
        });
        fetchTestsAndStudents();
      } else {
        toast.error(data.message || 'Failed to create test');
      }
    } catch (error) {
      toast.error('Network error creating test');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const startEnteringMarks = (test) => {
    setSelectedTest(test);
    const initialMarks = {};
    const classStus = students.filter(s => s.className === test.className && s.section === test.section);
    classStus.forEach(s => {
      initialMarks[s.id] = test.marks[s.id] !== undefined ? test.marks[s.id] : '';
    });
    setEditingMarks(initialMarks);
  };

  const handleMarkChange = (studentId, value) => {
    const val = value === '' ? '' : Math.min(100, Math.max(0, parseInt(value) || 0));
    setEditingMarks(prev => ({
      ...prev,
      [studentId]: val
    }));
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/tests/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testId: selectedTest.id,
          marks: editingMarks
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Marks recorded successfully!');
        setSelectedTest(null);
        fetchTestsAndStudents();
      } else {
        toast.error(data.message || 'Failed to save marks');
      }
    } catch (error) {
      toast.error('Network error saving marks');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Helper: Calculate average marks
  const getTestAverage = (test) => {
    const marksArray = Object.values(test.marks || {}).map(v => parseInt(v)).filter(v => !isNaN(v));
    if (marksArray.length === 0) return 'N/A';
    const sum = marksArray.reduce((a, b) => a + b, 0);
    return (sum / marksArray.length).toFixed(1) + '%';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-500/10">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Test Series & Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Record test grades and monitor student progress metrics.</p>
          </div>
        </div>

        {/* Global Analytics Cards for Super Admin */}
        {isSuperAdmin && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Total Tests Scheduled</span>
                <span className="text-2xl font-bold text-slate-800">{testsList.length} Series</span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md flex items-center gap-4">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">School Wide Average</span>
                <span className="text-2xl font-bold text-slate-800">
                  {(() => {
                    const averages = testsList.map(t => parseFloat(getTestAverage(t))).filter(v => !isNaN(v));
                    if (averages.length === 0) return 'N/A';
                    return (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1) + '%';
                  })()}
                </span>
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md flex items-center gap-4">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Monitored Classes</span>
                <span className="text-2xl font-bold text-slate-800">
                  {new Set(testsList.map(t => `${t.className}-${t.section}`)).size} Rooms
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Test Panel */}
          <div className="lg:col-span-5 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="font-bold text-lg flex items-center gap-1.5">
                <Plus className="w-5 h-5" /> Schedule Test Series
              </h2>
            </div>
            
            <form onSubmit={handleCreateTest} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
                  <select
                    name="className"
                    required
                    disabled={isClassAdmin}
                    value={formData.className}
                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section</label>
                  <select
                    name="section"
                    required
                    disabled={isClassAdmin}
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {['A', 'B', 'C', 'D'].map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algebra Chapter Test"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm"
              >
                {creating ? 'Creating...' : 'Create Test Series'}
              </button>
            </form>
          </div>

          {/* Test Listing */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-700 px-1">Scheduled Tests Registry</h3>
            
            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                Loading test series...
              </div>
            ) : testsList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                No active test series scheduled.
              </div>
            ) : (
              testsList.map(test => (
                <div key={test.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {test.className}-{test.section}
                        </span>
                        <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono">
                          {test.subject}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mt-2">{test.name}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Class Average</span>
                        <span className="text-base font-bold text-indigo-600">{getTestAverage(test)}</span>
                      </div>
                      
                      {/* Only Class Admin can enter/edit marks for their class students, or Super Admin globally */}
                      {(isSuperAdmin || (isClassAdmin && test.className === loggedInUser.className && test.section === loggedInUser.section)) && (
                        <button
                          onClick={() => startEnteringMarks(test)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 text-slate-700"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Record Marks
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enter Marks Modal */}
        {selectedTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white shrink-0">
                <div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                    {selectedTest.className}-{selectedTest.section} • {selectedTest.subject}
                  </span>
                  <h3 className="text-xl font-bold mt-1.5">Record Test Scores</h3>
                </div>
                <button className="text-white hover:text-gray-200 focus:outline-none font-bold text-lg" onClick={() => setSelectedTest(null)}>×</button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-4">
                <div className="bg-amber-50 border border-amber-100 text-amber-800 rounded-xl p-3.5 flex gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>Enter marks out of 100 for each student. Empty input will store no marks.</span>
                </div>

                <div className="space-y-3 pt-4">
                  {students.filter(s => s.className === selectedTest.className && s.section === selectedTest.section).map(stu => (
                    <div key={stu.id} className="flex justify-between items-center gap-4 py-1.5">
                      <div>
                        <span className="text-xs font-bold text-slate-400 font-mono block">Roll #{stu.rollNumber || '00'}</span>
                        <span className="font-semibold text-slate-800 text-sm">{stu.name}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Grade"
                          value={editingMarks[stu.id] !== undefined ? editingMarks[stu.id] : ''}
                          onChange={(e) => handleMarkChange(stu.id, e.target.value)}
                          className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-sm"
                        />
                        <span className="text-slate-400 font-semibold text-xs">/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 shrink-0">
                <button 
                  onClick={() => setSelectedTest(null)}
                  className="bg-slate-200 text-slate-700 hover:bg-slate-350 px-4.5 py-2.5 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveMarks}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Marks'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
