import React, { useState } from 'react';
import { UserPlus, Hash, BookOpen, Layers, Mail, Lock, CheckCircle2, AlertCircle, Phone, User, MapPin, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

export default function AddStudent() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClassAdmin = user.role === 'admin';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Multi-step form state
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    email: '',
    password: 'password123',
    dob: '',
    gender: 'Male',
    // Step 2: Academic
    admissionNumber: '',
    rollNumber: '',
    className: isClassAdmin ? (user.className || 'Class 10') : 'Class 10',
    section: isClassAdmin ? (user.section || 'A') : 'A',
    // Step 3: Guardian
    guardianName: '',
    guardianRelation: 'Father',
    guardianPhone: '',
    guardianEmail: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name) {
      toast.error('Student Name is required');
      return;
    }
    if (currentStep === 2 && !formData.className) {
      toast.error('Class is required');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/students/admit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Student admitted successfully!');
        setFormData({
          name: '',
          email: '',
          password: 'password123',
          dob: '',
          gender: 'Male',
          admissionNumber: '',
          rollNumber: '',
          className: isClassAdmin ? (user.className || 'Class 10') : 'Class 10',
          section: isClassAdmin ? (user.section || 'A') : 'A',
          guardianName: '',
          guardianRelation: 'Father',
          guardianPhone: '',
          guardianEmail: '',
          address: ''
        });
        setCurrentStep(1);
      } else {
        toast.error(data.message || 'Failed to admit student');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-blue-100 rounded-full mb-3 text-blue-600">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Student Admission Wizard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive student enrollment with identity, placement, and guardian verification.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/60">
          
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 1 ? 'bg-white text-blue-700' : 'bg-white/20'
              }`}>1</span>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 2 ? 'bg-white text-blue-700' : 'bg-white/20'
              }`}>2</span>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                currentStep >= 3 ? 'bg-white text-blue-700' : 'bg-white/20'
              }`}>3</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Step {currentStep} of 3: {currentStep === 1 ? 'Identity' : currentStep === 2 ? 'Academic Placement' : 'Guardian Details'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            
            {/* Step 1: Personal Identity */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Student Login Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex.morgan@school.edu"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Initial Password</label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Academic Placement */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Class *</label>
                    <select
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    >
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Section *</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Admission Number</label>
                    <input
                      type="text"
                      name="admissionNumber"
                      value={formData.admissionNumber}
                      onChange={handleChange}
                      placeholder="e.g. ADM-2026-001"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. 10A01"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Guardian & Contact Details */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Primary Guardian Name</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      placeholder="e.g. John Morgan"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Relationship</label>
                    <select
                      name="guardianRelation"
                      value={formData.guardianRelation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Legal Guardian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Guardian Phone / WhatsApp</label>
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      name="guardianEmail"
                      value={formData.guardianEmail}
                      onChange={handleChange}
                      placeholder="parent@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Residential Address</label>
                  <textarea
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter permanent address..."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {loading ? 'Admitting Student...' : 'Complete Admission'}
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
