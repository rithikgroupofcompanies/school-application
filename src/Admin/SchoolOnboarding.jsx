import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles,
  School,
  ExternalLink,
  X
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

export default function SchoolOnboarding() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // 5-Step Wizard State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    board: 'CBSE',
    email: '',
    phone: '',
    address: '',
    city: 'Bangalore',
    state: 'Karnataka',
    gradesOffered: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
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
    if (currentStep === 1 && (!formData.name.trim() || !formData.code.trim())) {
      toast.error('School Name and Code are required');
      return;
    }
    if (currentStep === 2 && !formData.email.trim()) {
      toast.error('School Official Email is required');
      return;
    }
    if (currentStep === 4 && (!formData.adminName.trim() || !formData.adminEmail.trim())) {
      toast.error('Principal or Admin Name and Email are required');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmitSchool = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/schools`, {
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
        setFormData({
          name: '',
          code: '',
          board: 'CBSE',
          email: '',
          phone: '',
          address: '',
          city: 'Bangalore',
          state: 'Karnataka',
          gradesOffered: ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
          adminName: '',
          adminEmail: '',
          adminPassword: 'password123'
        });
        fetchSchools();
      } else {
        toast.error(data.message || 'Failed to onboard school');
      }
    } catch (err) {
      toast.error('Network error onboarding school');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Building2 className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Multi-School Directory & Onboarding</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SaaS Multi-Tenancy
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Provision new institutions, configure academic boards, and seed classes with automatic database tenancy isolation.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(!showWizard)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
            showWizard 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-750' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          {showWizard ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showWizard ? 'Close Wizard' : 'Onboard New School'}</span>
        </button>
      </div>

      {/* 5-Step Wizard Card */}
      {showWizard && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-fade-in space-y-6">
          
          {/* Steps Indicator */}
          <div className="grid grid-cols-5 gap-2 border-b border-slate-800 pb-5">
            {[
              { num: 1, title: 'Identity' },
              { num: 2, title: 'Contact' },
              { num: 3, title: 'Academics' },
              { num: 4, title: 'Principal' },
              { num: 5, title: 'Confirm' }
            ].map(s => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div 
                  key={s.num}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                      : isDone 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-950/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold">{s.num}. {s.title}</div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmitSchool} className="space-y-4">
            
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-4 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 1: Institutional Identity</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Official School Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cambridge Academy of Excellence"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">School Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. CAE-01"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Board / Affiliation</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB World School</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-4 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 2: Campus & Communication Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@school.edu"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">City & State</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bangalore"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-4 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 3: Initial Academic Structure</h3>
                <p className="text-xs text-slate-400">The platform will automatically generate database tables, sections A & B, and core subjects for these grades:</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.gradesOffered.map(g => (
                    <div key={g} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-indigo-400 text-center">
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-4 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 4: School Administrator Credentials</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Principal / Admin Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    placeholder="e.g. Principal Rajesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Admin Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      placeholder="principal@school.edu"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Initial Password</label>
                    <input
                      type="text"
                      required
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div className="space-y-4 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Step 5: Review & Provision Tenant</h3>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-slate-400">School Name:</span> <span className="font-bold text-white">{formData.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">School Code:</span> <span className="font-bold font-mono text-indigo-400">{formData.code}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Board:</span> <span className="font-bold text-white">{formData.board}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Admin Email:</span> <span className="font-bold text-white">{formData.adminEmail}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Grades:</span> <span className="font-bold text-emerald-400">Classes 8-12 (Sections A & B)</span></div>
                </div>
              </div>
            )}

            {/* Wizard Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 ${
                    submitting ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Provisioning...' : 'Provision School Tenant'}</span>
                </button>
              )}
            </div>

          </form>

        </div>
      )}

      {/* Existing Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schools.map(school => (
          <div key={school.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  {school.code?.slice(0, 2) || 'SC'}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">{school.name}</h3>
                  <span className="text-[10px] text-indigo-400 font-mono">{school.code} • {school.board}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Campus</span>
                <span className="font-bold text-slate-300">{school.city || 'Bangalore'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Students</span>
                <span className="font-bold text-emerald-400">{school.student_count || 42} Enrolled</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{school.email || 'info@school.edu'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{school.phone || '+91 9876543210'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
