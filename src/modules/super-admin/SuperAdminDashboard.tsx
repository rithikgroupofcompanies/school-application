import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  PlusCircle,
  TrendingUp,
  MapPin,
  X
} from 'lucide-react';

interface SchoolData {
  id: number;
  school_code: string;
  name: string;
  short_name: string;
  board: string;
  school_type: string;
  medium: string;
  city: string;
  state: string;
  official_email: string;
  phone: string;
  principal_name: string;
  student_count: number;
  staff_count: number;
  onboarding_status: 'draft' | 'submitted' | 'verifying' | 'approved' | 'rejected';
  account_status: 'pending' | 'active' | 'suspended' | 'archived';
}

const INITIAL_SCHOOLS: SchoolData[] = [
  {
    id: 1,
    school_code: 'SCH-CHN-001',
    name: 'Rithik Matriculation Higher Secondary School, Chennai',
    short_name: 'RMHSS',
    board: 'State Board',
    school_type: 'private',
    medium: 'English / Tamil',
    city: 'Chennai',
    state: 'Tamil Nadu',
    official_email: 'chennai@rithikgroup.com',
    phone: '+91 44 28123456',
    principal_name: 'Dr. S. Rangarajan, M.Sc., B.Ed.',
    student_count: 1240,
    staff_count: 68,
    onboarding_status: 'approved',
    account_status: 'active',
  },
  {
    id: 2,
    school_code: 'SCH-CBE-002',
    name: 'Rithik International Academy, Coimbatore',
    short_name: 'RIA',
    board: 'CBSE',
    school_type: 'international',
    medium: 'English',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    official_email: 'coimbatore@rithikgroup.com',
    phone: '+91 422 2567890',
    principal_name: 'Mrs. Jayanthi Natarajan, M.A., M.Ed.',
    student_count: 890,
    staff_count: 52,
    onboarding_status: 'approved',
    account_status: 'active',
  },
  {
    id: 3,
    school_code: 'SCH-MDU-003',
    name: 'Rithik Global Public School, Madurai',
    short_name: 'RGPS',
    board: 'CBSE',
    school_type: 'private',
    medium: 'English / Tamil',
    city: 'Madurai',
    state: 'Tamil Nadu',
    official_email: 'madurai@rithikgroup.com',
    phone: '+91 452 2432100',
    principal_name: 'Mr. M. Anand, M.Sc., M.Phil.',
    student_count: 650,
    staff_count: 40,
    onboarding_status: 'approved',
    account_status: 'active',
  },
  {
    id: 4,
    school_code: 'SCH-TRZ-004',
    name: 'Rithik Vidyalaya High School, Tiruchirappalli',
    short_name: 'RVHS',
    board: 'Matriculation',
    school_type: 'aided',
    medium: 'Tamil / English',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    official_email: 'trichy@rithikgroup.com',
    phone: '+91 431 2789123',
    principal_name: 'Mrs. K. Meenakshi, M.A., B.Ed.',
    student_count: 420,
    staff_count: 28,
    onboarding_status: 'submitted',
    account_status: 'pending',
  },
  {
    id: 5,
    school_code: 'SCH-SLM-005',
    name: 'Rithik Model Senior Secondary School, Salem',
    short_name: 'RMSSS',
    board: 'State Board',
    school_type: 'government',
    medium: 'Tamil',
    city: 'Salem',
    state: 'Tamil Nadu',
    official_email: 'salem@rithikgroup.com',
    phone: '+91 427 2345678',
    principal_name: 'Mr. P. Subramanian',
    student_count: 510,
    staff_count: 32,
    onboarding_status: 'verifying',
    account_status: 'pending',
  },
];

export const SuperAdminDashboard: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>(INITIAL_SCHOOLS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);

  // New School Modal Form
  const [isNewSchoolOpen, setIsNewSchoolOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    short_name: '',
    board: 'CBSE',
    school_type: 'private',
    medium: 'English',
    city: '',
    state: 'Tamil Nadu',
    official_email: '',
    phone: '',
    principal_name: '',
  });

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SchoolData = {
      id: schools.length + 1,
      school_code: `SCH-TEN-${Math.floor(100 + Math.random() * 900)}`,
      name: newSchool.name,
      short_name: newSchool.short_name || 'RIT',
      board: newSchool.board,
      school_type: newSchool.school_type,
      medium: newSchool.medium,
      city: newSchool.city,
      state: newSchool.state,
      official_email: newSchool.official_email,
      phone: newSchool.phone,
      principal_name: newSchool.principal_name,
      student_count: 0,
      staff_count: 1,
      onboarding_status: 'submitted',
      account_status: 'pending',
    };

    setSchools([created, ...schools]);
    setIsNewSchoolOpen(false);
  };

  const handleStatusChange = (id: number, newStatus: 'active' | 'suspended') => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, account_status: newStatus } : s))
    );
    if (selectedSchool?.id === id) {
      setSelectedSchool({ ...selectedSchool, account_status: newStatus });
    }
  };

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.school_code.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.account_status === statusFilter;
    const matchesBoard = boardFilter === 'all' || s.board === boardFilter;
    return matchesSearch && matchesStatus && matchesBoard;
  });

  const totalStudents = schools.reduce((acc, s) => acc + s.student_count, 0);
  const totalStaff = schools.reduce((acc, s) => acc + s.staff_count, 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Platform Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Master Platform Multi-Tenancy Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Rithik Group of Companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Centralized operations management for all member institutions. Full tenant-level data isolation, approvals, and real-time oversight.
          </p>
        </div>

        <button
          onClick={() => setIsNewSchoolOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Onboard New Institution
        </button>
      </div>

      {/* Dynamic KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Schools</p>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{schools.length}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            {schools.filter((s) => s.account_status === 'active').length} Active Tenants
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enrolled</p>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalStudents.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">Students across campuses</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Staff Faculty</p>
            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{totalStaff}</p>
          <p className="text-xs text-slate-500 mt-1">Teaching & Admin staff</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approvals</p>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">
            {schools.filter((s) => s.onboarding_status !== 'approved').length}
          </p>
          <p className="text-xs text-amber-700 font-semibold mt-1">Awaiting verification</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school by name, code, or city..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 px-3 font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Onboarding</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <select
            value={boardFilter}
            onChange={(e) => setBoardFilter(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Boards</option>
            <option value="State Board">State Board</option>
            <option value="CBSE">CBSE</option>
            <option value="Matriculation">Matriculation</option>
          </select>
        </div>
      </div>

      {/* Dynamic All Schools Directory Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Schools & Campuses Registry</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredSchools.length} of {schools.length} institutions across Tamil Nadu
            </p>
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-4 px-6">School Code</th>
              <th className="py-4 px-6">Institution Details</th>
              <th className="py-4 px-6">Board & Medium</th>
              <th className="py-4 px-6 text-center">Strength</th>
              <th className="py-4 px-6">Onboarding</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No schools found matching your search criteria.
                </td>
              </tr>
            ) : (
              filteredSchools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">{s.school_code}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.city}, {s.state}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-slate-800">{s.board}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{s.medium}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-bold text-slate-900">{s.student_count}</span>
                    <p className="text-slate-400 text-[10px]">{s.staff_count} Staff</p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        s.onboarding_status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : s.onboarding_status === 'submitted'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}
                    >
                      {s.onboarding_status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                        s.account_status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {s.account_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedSchool(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* School Deep-Dive Slide-Over Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600">{selectedSchool.school_code}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedSchool.name}</h3>
              </div>
              <button onClick={() => setSelectedSchool(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Principal Contact</p>
                <p className="font-bold text-slate-800">{selectedSchool.principal_name}</p>
                <p className="text-slate-500">{selectedSchool.phone}</p>
                <p className="text-slate-500">{selectedSchool.official_email}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-1">
                <p className="text-slate-400 uppercase font-bold text-[10px]">Campus Demographics</p>
                <p className="font-bold text-slate-800">{selectedSchool.student_count} Enrolled Students</p>
                <p className="text-slate-500">{selectedSchool.staff_count} Certified Faculty Members</p>
                <p className="text-slate-500">Board: {selectedSchool.board} ({selectedSchool.medium})</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">Tenancy ID: #{selectedSchool.id} • Row-Level Isolated</span>
              <div className="flex items-center gap-2">
                {selectedSchool.account_status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange(selectedSchool.id, 'suspended')}
                    className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100"
                  >
                    Suspend Institution
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedSchool.id, 'active')}
                    className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100"
                  >
                    Activate Institution
                  </button>
                )}
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboard New School Modal */}
      {isNewSchoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Onboard New Institution Tenant</h3>
                <p className="text-xs text-slate-500 mt-0.5">Register a new campus into the Rithik Group ERP.</p>
              </div>
              <button onClick={() => setIsNewSchoolOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Institution Name</label>
                <input
                  type="text"
                  required
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  placeholder="e.g. Rithik Academy of Excellence"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                    placeholder="Chennai / Madurai / etc."
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Affiliation Board</label>
                  <select
                    value={newSchool.board}
                    onChange={(e) => setNewSchool({ ...newSchool, board: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>CBSE</option>
                    <option>State Board</option>
                    <option>ICSE</option>
                    <option>Matriculation</option>
                    <option>IB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={newSchool.official_email}
                    onChange={(e) => setNewSchool({ ...newSchool, official_email: e.target.value })}
                    placeholder="school@rithikgroup.com"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Principal / Head of Institution</label>
                <input
                  type="text"
                  required
                  value={newSchool.principal_name}
                  onChange={(e) => setNewSchool({ ...newSchool, principal_name: e.target.value })}
                  placeholder="Principal full name and qualifications"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewSchoolOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Provision School Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
