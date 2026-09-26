import React, { useState, useEffect } from 'react';
import { Heart, Star, Send, Layers, Calendar, UserCheck } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

export default function Behaviour() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // State
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    rating: 5,
    remark: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogsAndStudents();
  }, []);

  const fetchLogsAndStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch logs
      const logsRes = await fetch(`${API_URL}/api/behaviour`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logsData = await logsRes.json();
      if (logsRes.ok && logsData.success) {
        setLogs(logsData.logs);
      }

      // Fetch students
      const studentRes = await fetch(`${API_URL}/api/users?role=student`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const studentData = await studentRes.json();
      if (studentRes.ok && studentData.success) {
        // Class Admin: only show their class students. Super Admin: show all.
        let filteredStudents = studentData.users;
        if (isClassAdmin) {
          filteredStudents = studentData.users.filter(s => s.className === loggedInUser.className && s.section === loggedInUser.section);
        }
        setStudents(filteredStudents);
        
        // Pre-select first student
        if (filteredStudents.length > 0) {
          setFormData(prev => ({
            ...prev,
            studentId: filteredStudents[0].id.toString()
          }));
        }
      }

    } catch (error) {
      toast.error('Network error loading behavioural database');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRatingSelect = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      toast.error('Select a student first');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/behaviour/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: parseInt(formData.studentId),
          rating: formData.rating,
          remark: formData.remark
        })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Behavior remark logged successfully!');
        setFormData(prev => ({
          ...prev,
          remark: '',
          rating: 5
        }));
        fetchLogsAndStudents();
      } else {
        toast.error(data.message || 'Failed to submit log');
      }
    } catch (error) {
      toast.error('Network error logging behavior');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl text-white shadow-lg shadow-rose-500/10">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Behaviour Tracking</h1>
            <p className="text-sm text-slate-500 mt-0.5">Record student character remarks and star ratings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Write Behaviour remark - Only Class Admins (or Super Admins as well, but primary for class admins) */}
          {(isClassAdmin || isSuperAdmin) && (
            <div className="lg:col-span-5 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100 animate-fade-in-up">
              <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-4 flex items-center justify-between text-white">
                <h2 className="font-bold text-lg flex items-center gap-1.5">
                  <UserCheck className="w-5 h-5" /> Log Character Remark
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student</label>
                  <select
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-sm font-semibold transition-all text-slate-700"
                  >
                    {students.length === 0 && <option value="">No Students Enrolled</option>}
                    {students.map(stu => (
                      <option key={stu.id} value={stu.id}>
                        {stu.name} (Roll: {stu.rollNumber || 'N/A'}) - {stu.className}-{stu.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => handleRatingSelect(stars)}
                        className="p-1 text-slate-300 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                      >
                        <Star className={`w-8 h-8 ${stars <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1 font-semibold">
                    {formData.rating === 5 ? 'Exceptional / Model Student' : 
                     formData.rating === 4 ? 'Good / Active Participant' :
                     formData.rating === 3 ? 'Average / Compliant' :
                     formData.rating === 2 ? 'Needs Improvement' : 'Disciplinary Concern'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remarks Description</label>
                  <textarea
                    name="remark"
                    required
                    rows={4}
                    placeholder="Enter academic conduct, discipline record, general feedback remarks..."
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-sm font-semibold transition-all text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Logging...' : 'Submit Remark'}
                </button>
              </form>
            </div>
          )}

          {/* Behaviour Timeline logs */}
          <div className={`${isClassAdmin || isSuperAdmin ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
            <h3 className="text-lg font-bold text-slate-700 px-1">Behavioural History Timeline</h3>
            
            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                Loading history...
              </div>
            ) : logs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                No behavior history logged yet.
              </div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl shrink-0">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{log.studentName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {log.className}-{log.section}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {log.rating} Stars
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {log.date}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl leading-relaxed italic">
                      "{log.remark}"
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
