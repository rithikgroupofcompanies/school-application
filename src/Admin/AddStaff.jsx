import React, { useState } from 'react';
import { UserPlus, Mail, Lock, BookOpen, Briefcase, ShieldCheck, Building2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddStaff() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = user.role === 'super_admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    subjectHandled: '',
    designation: '',
    className: '',
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
      const response = await fetch('http://localhost:3000/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Staff added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'teacher',
          subjectHandled: '',
          designation: '',
          className: '',
          section: 'A'
        });
      } else {
        toast.error(data.message || 'Failed to add staff');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-purple-50 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Add New Staff</h1>
          <p className="mt-3 text-lg text-gray-500">
            Enter the staff member's details down below to register them in the system.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up transition-all duration-300">
          
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Staff Information</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {isSuperAdmin ? 'Super Admin' : 'Admin'} Access
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            
            {/* Role Selection - Only Super Admin can choose */}
            {isSuperAdmin && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Staff Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      formData.role === 'teacher'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <BookOpen className={`w-6 h-6 ${formData.role === 'teacher' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <span className={`block text-sm font-bold ${formData.role === 'teacher' ? 'text-purple-700' : 'text-gray-700'}`}>
                        Teacher
                      </span>
                      <span className="text-xs text-gray-500">Subject teacher or staff</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      formData.role === 'admin'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <ShieldCheck className={`w-6 h-6 ${formData.role === 'admin' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <span className={`block text-sm font-bold ${formData.role === 'admin' ? 'text-indigo-700' : 'text-gray-700'}`}>
                        Class Admin
                      </span>
                      <span className="text-xs text-gray-500">Manages a specific class</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-purple-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="e.g. Emily Clark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-purple-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="staff@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-purple-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="Password123"
                  />
                </div>
              </div>

              {/* Class Admin specific fields */}
              {formData.role === 'admin' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Class</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <select
                        name="className"
                        required
                        value={formData.className}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm appearance-none"
                      >
                        <option value="" disabled>Select Class</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="1">Class 1</option>
                        <option value="2">Class 2</option>
                        <option value="3">Class 3</option>
                        <option value="4">Class 4</option>
                        <option value="5">Class 5</option>
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Section</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <select
                        name="section"
                        required
                        value={formData.section}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-indigo-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm appearance-none"
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Teacher specific fields */}
              {formData.role === 'teacher' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Handled</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="subjectHandled"
                        required
                        value={formData.subjectHandled}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-purple-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                        placeholder="e.g. Mathematics"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                      </div>
                      <select
                        name="designation"
                        required
                        value={formData.designation}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-purple-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm appearance-none"
                      >
                        <option value="" disabled>Select Designation</option>
                        <option value="Senior Teacher">Senior Teacher</option>
                        <option value="Assistant Teacher">Assistant Teacher</option>
                        <option value="Head of Department">Head of Department</option>
                        <option value="Lab Assistant">Lab Assistant</option>
                        <option value="Librarian">Librarian</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Info banner for admin role */}
            {formData.role === 'admin' && (
              <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-indigo-800">Class Admin Permissions</p>
                    <p className="text-xs text-indigo-600 mt-1">
                      This user will be able to manage students, attendance, homework, tests, and behaviour for the assigned class only. 
                      They will log in by selecting "Admin" on the login page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : formData.role === 'admin' ? 'Register Class Admin' : 'Register Staff'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
