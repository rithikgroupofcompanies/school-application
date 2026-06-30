import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Trash2, Plus, Info, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Homework() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // State
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    className: isClassAdmin ? loggedInUser.className : 'Class 8',
    section: isClassAdmin ? loggedInUser.section : 'A',
    subject: '',
    title: '',
    description: '',
    dueDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/homework', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setHomeworkList(data.homework);
      } else {
        toast.error(data.message || 'Failed to fetch homework');
      }
    } catch (error) {
      toast.error('Network error loading homework');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/homework/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Homework posted successfully');
        setFormData({
          className: isClassAdmin ? loggedInUser.className : 'Class 8',
          section: isClassAdmin ? loggedInUser.section : 'A',
          subject: '',
          title: '',
          description: '',
          dueDate: ''
        });
        fetchHomework();
      } else {
        toast.error(data.message || 'Failed to post homework');
      }
    } catch (error) {
      toast.error('Network error posting homework');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework assignment?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(` /api/homework/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Homework assignment removed');
        setHomeworkList(prev => prev.filter(h => h.id !== id));
      } else {
        toast.error(data.message || 'Failed to delete assignment');
      }
    } catch (error) {
      toast.error('Network error deleting homework');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-indigo-500/10">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Homework Manager</h1>
            <p className="text-sm text-slate-500 mt-0.5">Assign coursework tasks and monitor submissions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Homework Form */}
          <div className="lg:col-span-5 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <h2 className="font-bold text-lg flex items-center gap-1.5">
                <Plus className="w-5 h-5" /> Add Assignment
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
                  <select
                    name="className"
                    required
                    disabled={isClassAdmin}
                    value={formData.className}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                  name="subject"
                  required
                  placeholder="e.g. Mathematics"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Chapter 4 Equations"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Instructions / Details</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Provide instructions, reading materials or worksheets information..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm"
              >
                {submitting ? 'Posting...' : 'Post Assignment'}
              </button>
            </form>
          </div>

          {/* Homework Logs */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-700 px-1">Active Assignment Log</h3>
            
            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                Loading assignments...
              </div>
            ) : homeworkList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                No active homework assignments assigned.
              </div>
            ) : (
              homeworkList.map(hw => (
                <div key={hw.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {hw.className}-{hw.section}
                        </span>
                        <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {hw.subject}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mt-2">{hw.title}</h4>
                    </div>

                    <button
                      onClick={() => handleDelete(hw.id)}
                      className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl leading-relaxed whitespace-pre-wrap">
                    {hw.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mt-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Due Date:</span>
                    <span className="text-slate-600 bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-md font-bold">
                      {hw.dueDate}
                    </span>
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
