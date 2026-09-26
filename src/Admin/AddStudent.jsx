import React, { useState } from 'react';
import { UserPlus, Hash, BookOpen, Layers, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

export default function AddStudent() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClassAdmin = user.role === 'admin';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNumber: '',
    className: isClassAdmin ? (user.className || '') : '',
    section: isClassAdmin ? (user.section || '') : ''
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isClassAdmin) {
      setFormData(prev => ({
        ...prev,
        className: user.className || '',
        section: user.section || ''
      }));
    }
  }, [isClassAdmin, user.className, user.section]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Student added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'student',
          rollNumber: '',
          className: '',
          section: ''
        });
      } else {
        toast.error(data.message || 'Failed to add student');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Add New Student</h1>
          <p className="mt-3 text-lg text-gray-500">
            Enter the student's details down below to register them in the system.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in-up transition-all duration-300">
          
          {/* Header Strip */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Student Information</h2>
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Admin Access
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Full Name */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserPlus className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">School Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="student@school.edu"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="Password123"
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm"
                    placeholder="e.g. 101"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Class Name */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select
                      name="className"
                      required
                      disabled={isClassAdmin}
                      value={formData.className}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Select Class</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i+1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                {/* Section */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Layers className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <select
                      name="section"
                      required
                      disabled={isClassAdmin}
                      value={formData.section}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-blue-500 bg-gray-50/50 focus:bg-white transition-all text-gray-900 shadow-sm appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Select Sec</option>
                      {['A', 'B', 'C', 'D'].map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
