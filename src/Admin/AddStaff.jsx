import React, { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  BookOpen, 
  Briefcase, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

export default function AddStaff() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'teacher',
    subjectHandled: 'Mathematics',
    designation: 'Senior Teacher',
    department: 'Academics',
    className: 'Class 10',
    section: 'A'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.role === 'admin' && !formData.className) {
      toast.error('Please assign a class for the Class Admin.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Submit to /api/staff with fallback to /api/users/add
      let response = await fetch(`${API_URL}/api/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok && response.status === 404) {
        response = await fetch(`${API_URL}/api/users/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Staff member registered successfully!');
        setFormData({
          name: '',
          email: '',
          password: 'password123',
          role: 'teacher',
          subjectHandled: 'Mathematics',
          designation: 'Senior Teacher',
          department: 'Academics',
          className: 'Class 10',
          section: 'A'
        });
      } else {
        toast.error(data.message || 'Failed to register staff member');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
          <UserCheck className="w-4 h-4" />
          <span>Faculty & Staff Management</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Register Faculty & Staff</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Add educators and class administrators to the school directory with role permissions.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Toggle Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Staff Designation & Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  formData.role === 'teacher'
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-600/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${formData.role === 'teacher' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Subject Teacher</div>
                  <div className="text-[10px] text-slate-400">Teaches classes & assigns homework</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                  formData.role === 'admin'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${formData.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs">Class Administrator</div>
                  <div className="text-[10px] text-slate-400">Full control over assigned class</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Emily Clark"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email (Login ID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="emily.clark@school.edu"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Temporary Password
              </label>
              <input
                type="text"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>

            {formData.role === 'teacher' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject Handled <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subjectHandled"
                    required
                    value={formData.subjectHandled}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics, Physics"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Academic Designation
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Assistant Teacher">Assistant Teacher</option>
                    <option value="Head of Department">Head of Department</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Librarian">Librarian</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Assigned Class <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Assigned Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </>
            )}

          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
                formData.role === 'teacher'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/25'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/25'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Registering Staff...' : formData.role === 'teacher' ? 'Register Subject Teacher' : 'Register Class Administrator'}</span>
            </button>
          </div>

        </form>

      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
