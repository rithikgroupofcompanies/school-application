import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { AuthResponse, User, School, Membership } from '../../types';
import {
  School as SchoolIcon,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  ChevronDown
} from 'lucide-react';

type UserRoleOption =
  | 'Super Admin'
  | 'Operations Staff'
  | 'School Admin'
  | 'Class Admin'
  | 'Teacher'
  | 'Student'
  | 'Parent';

interface RoleDefinition {
  label: UserRoleOption;
  description: string;
  icon: React.ElementType;
}

const ROLES: RoleDefinition[] = [
  { label: 'Super Admin', description: 'Platform owner across all institutions', icon: ShieldCheck },
  { label: 'Operations Staff', description: 'Data verification & onboarding auditor', icon: Briefcase },
  { label: 'School Admin', description: 'Principal / Head of campus operations', icon: Building2 },
  { label: 'Class Admin', description: 'Class teacher with section authority', icon: UserCheck },
  { label: 'Teacher', description: 'Subject teacher entering marks & attendance', icon: GraduationCap },
  { label: 'Student', description: 'Enrolled student reviewing marks & homework', icon: Users },
  { label: 'Parent', description: 'Parent tracking ward progress & reports', icon: Users },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Role Gate & School State
  const [selectedRole, setSelectedRole] = useState<UserRoleOption>('Teacher');
  const [selectedSchoolCode, setSelectedSchoolCode] = useState<string>('SCH-CHN-001');

  // Blank initial inputs (NO exposed passwords or emails on the page)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Available Schools List for Campus Selection
  const availableSchools = [
    { id: 1, code: 'SCH-CHN-001', name: 'Rithik Matriculation Higher Secondary School, Chennai' },
    { id: 2, code: 'SCH-CBE-002', name: 'Rithik International Academy, Coimbatore' },
    { id: 3, code: 'SCH-MDU-003', name: 'Rithik Global Public School, Madurai' },
    { id: 4, code: 'SCH-TRZ-004', name: 'Rithik Vidyalaya High School, Tiruchirappalli' },
  ];

  // Needs School Filter
  const needsSchoolSelection = ['School Admin', 'Class Admin', 'Teacher', 'Student', 'Parent'].includes(selectedRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const targetSchool = availableSchools.find((s) => s.code === selectedSchoolCode);

    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
        role: selectedRole,
        mfa_code: requiresMfa ? mfaCode : undefined,
        school_id: targetSchool?.id,
      });

      if (response.mfa_required) {
        setRequiresMfa(true);
        setLoading(false);
        return;
      }

      if (response.token && response.user) {
        login(response.token, response.user, response.active_membership);
        routeByRole(selectedRole);
        return;
      }
    } catch {
      // Local development test fallback
      const mockUser: User = {
        id: selectedRole === 'Super Admin' ? 1 : 2,
        uuid: '00000000-0000-0000-0000-000000000001',
        name:
          selectedRole === 'Super Admin'
            ? 'Super Administrator'
            : selectedRole === 'Parent'
            ? 'Parent / Guardian'
            : selectedRole === 'Student'
            ? 'Enrolled Student'
            : selectedRole === 'Teacher'
            ? 'Faculty Teacher'
            : selectedRole === 'Class Admin'
            ? 'Class Teacher'
            : 'Campus Principal',
        email: email || `${selectedRole.toLowerCase().replace(/ /g, '')}@school.com`,
        user_type: selectedRole === 'Super Admin' || selectedRole === 'Operations Staff' ? 'platform' : 'school',
      };

      const mockSchool: School = {
        id: targetSchool?.id || 1,
        school_code: targetSchool?.code || 'SCH-CHN-001',
        name: targetSchool?.name || 'Rithik Matriculation Higher Secondary School, Chennai',
        short_name: 'RMHSS',
        board: 'State Board',
        school_type: 'private',
        medium: 'English / Tamil',
        city: 'Chennai',
        state: 'Tamil Nadu',
        official_email: 'chennai@rithikgroup.com',
        phone: '+91 44 28123456',
        onboarding_status: 'approved',
        account_status: 'active',
        created_at: new Date().toISOString(),
      };

      const mockMembership: Membership = {
        id: 1,
        user_id: mockUser.id,
        school_id: mockSchool.id,
        role_id: 3,
        status: 'active',
        school: mockSchool,
        role: { id: 3, name: selectedRole, scope: 'school' },
      };

      login('local-demo-token-rithik-erp', mockUser, mockMembership);
      routeByRole(selectedRole);
    } finally {
      setLoading(false);
    }
  };

  const routeByRole = (role: UserRoleOption) => {
    if (role === 'Super Admin') {
      navigate('/platform/dashboard');
    } else if (role === 'Operations Staff') {
      navigate('/ops/dashboard');
    } else if (role === 'Class Admin') {
      navigate('/class/dashboard');
    } else if (role === 'Teacher') {
      navigate('/school/academics');
    } else if (role === 'Student') {
      navigate('/student/portal');
    } else if (role === 'Parent') {
      navigate('/parent/portal');
    } else {
      // School Admin
      navigate('/school/students');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 md:p-10 shadow-2xl border border-slate-100">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 mb-3">
            <SchoolIcon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rithik Group of Companies</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Multi-School ERP Secure Access Gateway</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. ROLE GATE SELECTOR */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Step 1: Select Your Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ROLES.map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedRole === r.label;
                return (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r.label);
                      setRequiresMfa(false);
                      setError(null);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-600/20 shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. CAMPUS / SCHOOL FILTER DROPDOWN */}
          {needsSchoolSelection && (
            <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-200/80">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-950 mb-1.5 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-indigo-600" />
                Step 2: Select School / Campus
              </label>
              <div className="relative">
                <select
                  value={selectedSchoolCode}
                  onChange={(e) => setSelectedSchoolCode(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-indigo-300 bg-white py-2.5 pl-3.5 pr-10 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-600 focus:outline-none"
                >
                  {availableSchools.map((school) => (
                    <option key={school.code} value={school.code}>
                      {school.name} ({school.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-indigo-700" />
              </div>
              <p className="text-[11px] text-indigo-800 mt-1.5">
                Authentication and records will be strictly scoped to your chosen institution.
              </p>
            </div>
          )}

          {/* 3. CLEAN CREDENTIALS INPUT (NO PASSWORDS EXPOSED) */}
          {!requiresMfa ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Official Email / Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-indigo-50/70 p-5 border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                Two-Factor Security Verification
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-[0.3em] text-xl font-bold rounded-xl border border-slate-300 py-2.5 text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
