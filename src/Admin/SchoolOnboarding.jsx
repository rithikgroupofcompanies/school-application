import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, GraduationCap, MapPin, Mail, Phone, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import API_URL from '../config';

export default function SchoolOnboarding() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // 5-Step Wizard State
  const [formData, setFormData] = useState({
    // Step 1: Identity
    name: '',
    code: '',
    board: 'CBSE',
    // Step 2: Contact
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    // Step 3: Academics
    gradesOffered: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    // Step 4: Leadership
    adminName: '',
    adminEmail: '',
    adminPassword: 'password123'
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/schools`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSchools(data.schools || []);
      }
    } catch (err) {
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.code)) {
      toast.error('School Name and Code are required');
      return;
    }
    if (currentStep === 2 && !formData.email) {
      toast.error('Official Email is required');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitOnboarding = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/schools/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'School onboarded successfully!');
        setShowWizard(false);
        setCurrentStep(1);
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to onboard school');
      }
    } catch (err) {
      toast.error('Network error during onboarding');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Multi-Tenant Platform
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">School Directory & Tenants</h1>
            <p className="text-sm text-gray-500 mt-1">
              Onboard and manage multiple educational institutions under unified governance.
            </p>
          </div>

          <button
            onClick={() => { setShowWizard(!showWizard); setCurrentStep(1); }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            {showWizard ? 'Close Wizard' : 'Onboard New School'}
          </button>
        </div>

        {/* 5-Step Onboarding Wizard Modal / Panel */}
        {showWizard && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-2xl animate-fade-in space-y-6">
            
            {/* Steps Progress Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 overflow-x-auto gap-4">
              {[
                { step: 1, title: 'Identity' },
                { step: 2, title: 'Contact' },
                { step: 3, title: 'Academics' },
                { step: 4, title: 'Leadership' },
                { step: 5, title: 'Review' }
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === s.step ? 'bg-indigo-600 text-white shadow-md' : 
                    currentStep > s.step ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                  </div>
                  <span className={`text-xs font-semibold ${currentStep === s.step ? 'text-indigo-900' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                  {s.step < 5 && <ChevronRight className="w-4 h-4 text-gray-300 ml-2" />}
                </div>
              ))}
            </div>

            {/* Step 1: School Identity */}
            {currentStep === 1 && (
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-gray-900">Step 1: School Identity</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Official School Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Green Valley Public School"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Unique School Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. GVPS-01"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-bold font-mono text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Affiliation / Board</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm outline-none focus:border-indigo-500"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">International Baccalaureate (IB)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Address */}
            {currentStep === 2 && (
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-gray-900">Step 2: Contact Information</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@school.edu"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Bangalore"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. Karnataka"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Academic Setup */}
            {currentStep === 3 && (
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-gray-900">Step 3: Academic Setup</h3>
                <p className="text-xs text-gray-500">Default grades to automatically generate for this institution:</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(grade => (
                    <label key={grade} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gradesOffered.includes(grade)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, gradesOffered: [...formData.gradesOffered, grade] });
                          } else {
                            setFormData({ ...formData, gradesOffered: formData.gradesOffered.filter(g => g !== grade) });
                          }
                        }}
                        className="rounded text-indigo-600"
                      />
                      {grade}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Leadership & School Admin Account */}
            {currentStep === 4 && (
              <div className="space-y-4 max-w-xl">
                <h3 className="text-lg font-bold text-gray-900">Step 4: School Leadership & Admin Account</h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Principal / Head Administrator Name</label>
                  <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">School Admin Login Email</label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    placeholder="admin@school.edu"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Initial Password</label>
                  <input
                    type="text"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review & Activation */}
            {currentStep === 5 && (
              <div className="space-y-4 max-w-xl bg-indigo-50/60 p-6 rounded-2xl border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" /> Review & Confirm School Onboarding
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>School Name:</strong> {formData.name}</p>
                  <p><strong>School Code:</strong> <span className="font-mono font-bold bg-white px-2 py-0.5 rounded text-indigo-700">{formData.code}</span></p>
                  <p><strong>Board:</strong> {formData.board}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Grades:</strong> {formData.gradesOffered.join(', ')}</p>
                  <p><strong>Initial Admin:</strong> {formData.adminEmail || 'Not configured'}</p>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitOnboarding}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {submitting ? 'Onboarding School...' : 'Activate School'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Existing Schools Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map(school => (
            <div key={school.id} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full uppercase">
                    {school.code}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{school.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                  {school.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {school.email}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {school.city ? `${school.city}, ${school.state}` : 'India'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100 text-center">
                <div className="p-2.5 bg-gray-50 rounded-2xl">
                  <span className="block text-lg font-black text-gray-900">{school.student_count || 0}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Students</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-2xl">
                  <span className="block text-lg font-black text-gray-900">{school.teacher_count || 0}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Teachers</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
