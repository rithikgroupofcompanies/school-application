import React, { useState, useEffect } from 'react';
import { Award, BookOpen, CheckCircle, Lock, Download, Settings, FileText, Globe } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReportCards() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // State
  const [students, setStudents] = useState([]);
  const [tests, setTests] = useState([]);
  const [released, setReleased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [comments, setComments] = useState({}); // studentId -> comment text
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchReportDetails();
  }, []);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch settings to check release status
      if (isSuperAdmin) {
        const setRes = await fetch('/api/system/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const setData = await setRes.json();
        if (setRes.ok && setData.success) {
          setReleased(setData.settings.reportCardsReleased);
        }
      }

      // Fetch students
      const studRes = await fetch('/api/users?role=student', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studData = await studRes.json();
      if (studRes.ok && studData.success) {
        let list = studData.users;
        if (isClassAdmin) {
          list = studData.users.filter(s => s.className === loggedInUser.className && s.section === loggedInUser.section);
        }
        setStudents(list);
      }

      // Fetch tests
      const testsRes = await fetch('/api/tests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const testsData = await testsRes.json();
      if (testsRes.ok && testsData.success) {
        setTests(testsData.tests);
      }

      // Populate mock comments dictionary
      const mockComments = {};
      mockComments[3] = "Excellent academic drive. Very active participation.";
      mockComments[6] = "Needs to limit talking during lecture hours.";
      mockComments[7] = "Consistently outstanding physics performance.";
      setComments(mockComments);

    } catch (error) {
      toast.error('Network error loading reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRelease = async () => {
    setReleasing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/system/reports/release', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ release: !released })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setReleased(!released);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Failed to update release state');
      }
    } catch (error) {
      toast.error('Network error toggling report card releases');
      console.error(error);
    } finally {
      setReleasing(false);
    }
  };

  const handleSaveComment = (studentId, value) => {
    setComments(prev => ({
      ...prev,
      [studentId]: value
    }));
    toast.success('Draft comment saved locally!');
  };

  const downloadSchoolTranscript = () => {
    const reportData = students.map(s => {
      const studentTests = tests.filter(t => t.className === s.className && t.section === s.section);
      const grades = studentTests.map(t => ({
        testName: t.name,
        subject: t.subject,
        score: t.marks[s.id] !== undefined ? t.marks[s.id] : 'N/A'
      }));

      return {
        studentName: s.name,
        email: s.email,
        class: `${s.className}-${s.section}`,
        rollNumber: s.rollNumber,
        comment: comments[s.id] || 'N/A',
        grades
      };
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `school_transcript_export_${new Date().getFullYear()}.json`);
    dlAnchorElem.click();
    toast.success('Academic transcript JSON exported successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-500/10">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Report Cards</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage draft student feedback remarks and global release locks.</p>
            </div>
          </div>

          {/* Super Admin Control Board */}
          {isSuperAdmin && (
            <div className="flex gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={downloadSchoolTranscript}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-1.5 text-slate-700"
              >
                <Download className="w-4 h-4" /> Download School Transcript
              </button>
              
              <button
                onClick={handleToggleRelease}
                disabled={releasing}
                className={`
                  px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all text-white shadow-lg
                  ${released 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10' 
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10'}
                  ${releasing ? 'opacity-85' : 'hover:-translate-y-0.5'}
                `}
              >
                {released ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                {released ? 'Lock Report Cards' : 'Release to Parents'}
              </button>
            </div>
          )}
        </div>

        {/* Info panel */}
        {released ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 text-emerald-800">
            <Globe className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Report Cards Released</span>
              <span className="text-xs text-emerald-600">Students and parents can now view final transcript grades and comments inside their portals.</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex gap-3 text-slate-700">
            <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Draft Review Mode</span>
              <span className="text-xs text-slate-500">Report cards are currently locked. Parents cannot view updates. Teachers and Class Admins are in comments draft configuration.</span>
            </div>
          </div>
        )}

        {/* Main List */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
          <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Student Registry Transcripts</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-semibold">Loading student registries...</div>
            ) : students.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-semibold">No students registered.</div>
            ) : (
              students.map(student => {
                // Find all tests of this student's class
                const classTests = tests.filter(t => t.className === student.className && t.section === student.section);
                return (
                  <div key={student.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400 font-bold">#{student.rollNumber || '00'}</span>
                        <h4 className="font-bold text-slate-800 text-lg">{student.name}</h4>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {student.className}-{student.section}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{student.email}</p>
                      
                      {/* Comments Input for Class Admin */}
                      <div className="mt-4 pt-1 max-w-xl">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Staff Progress Comments</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Draft remarks for report card..."
                            value={comments[student.id] || ''}
                            onChange={(e) => setComments(prev => ({ ...prev, [student.id]: e.target.value }))}
                            className="flex-1 bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                          />
                          <button
                            onClick={() => handleSaveComment(student.id, comments[student.id])}
                            className="px-3.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-xs font-bold rounded-xl transition"
                          >
                            Save Draft
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Test Marks Overview */}
                    <div className="w-full md:w-72 bg-slate-50 border border-slate-150 rounded-2xl p-4 shrink-0 flex flex-col justify-between">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> Exam Marks Summary
                      </span>
                      
                      <div className="space-y-1.5 flex-1 max-h-[120px] overflow-y-auto pr-1">
                        {classTests.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic block py-2">No exam grades reported.</span>
                        ) : (
                          classTests.map(test => {
                            const score = test.marks[student.id];
                            return (
                              <div key={test.id} className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-semibold">{test.name}</span>
                                <span className={`font-bold ${score !== undefined ? 'text-indigo-600' : 'text-slate-400'}`}>
                                  {score !== undefined ? `${score}/100` : 'N/A'}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
