import React, { useState } from 'react';
import { 
  UserPlus, 
  Hash, 
  BookOpen, 
  Layers, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

export default function AddStudent() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isClassAdmin = user.role === 'admin' || user.role === 'school_admin';

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
    admissionNumber: `ADM-${Date.now().toString().slice(-4)}`,
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
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Student Name is required');
        return;
      }
      if (!formData.email.trim()) {
        toast.error('Student Email or UID is required');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.className) {
        toast.error('Class assignment is required');
        return;
      }
      if (!formData.rollNumber.trim()) {
        toast.error('Roll Number is required');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.guardianName.trim() || !formData.guardianPhone.trim()) {
      toast.error('Guardian Name and Phone number are required.');
      return;
    }

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
        toast.success(data.message || 'Student enrolled successfully!');
        setFormData({
          name: '',
          email: '',
          password: 'password123',
          dob: '',
          gender: 'Male',
          admissionNumber: `ADM-${Date.now().toString().slice(-4)}`,
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in font-sans">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>New Academic Enrollment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Admission Wizard</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Enroll student with automated admission number, class section mapping, and parent guardian intelligence.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, title: 'Identity & Bio', desc: 'Name, DOB, gender' },
            { num: 2, title: 'Academic Placement', desc: 'Class, section, roll' },
            { num: 3, title: 'Guardian & Contact', desc: 'Parent phone, address' },
          ].map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div 
                key={s.num} 
                className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isCurrent 
                    ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                    : isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent 
                    ? 'bg-indigo-600 text-white' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="hidden sm:block truncate">
                  <div className="text-xs font-bold truncate leading-tight">{s.title}</div>
                  <div className="text-[10px] opacity-75 truncate">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Container Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Student Identity */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <User className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 1: Student Identity & Credentials</h2>
              </div>

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
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Student Login Email / UID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex.morgan@school.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Default Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Placement */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 2: Class & Section Placement</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Admission Number
                  </label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Roll Number / UID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 10A05"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Assigned Class <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    disabled={isClassAdmin}
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
                    Section
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    disabled={isClassAdmin}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Guardian Details */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Step 3: Guardian & Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guardian Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="guardianName"
                    required
                    value={formData.guardianName}
                    onChange={handleChange}
                    placeholder="e.g. John Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Relationship
                  </label>
                  <select
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Legal Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guardian Phone (WhatsApp enabled) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    required
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    placeholder="parent@school.edu"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, City, Pin code"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Enrollment Summary Review Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Enrollment Summary:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Student:</span>
                    <span className="font-bold text-white">{formData.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Class:</span>
                    <span className="font-bold text-white">{formData.className} - {formData.section}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Roll No:</span>
                    <span className="font-bold text-white">{formData.rollNumber || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Guardian:</span>
                    <span className="font-bold text-white">{formData.guardianName || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
              >
                <span>Continue Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Submitting Enrollment...' : 'Complete Admission'}</span>
              </button>
            )}
          </div>

        </form>

      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
