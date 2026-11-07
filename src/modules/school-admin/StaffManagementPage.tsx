import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  CheckCircle2,
  Search,
  Filter,
  X
} from 'lucide-react';

interface StaffAccount {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  role: 'Teacher' | 'Class Admin' | 'Exam Coordinator' | 'Accounts Staff';
  department: string;
  assignedClass: string;
  assignedSubject: string;
  status: 'active' | 'invited' | 'suspended';
  lastLogin: string;
}

const INITIAL_STAFF: StaffAccount[] = [
  { id: 1, employeeId: 'EMP-CHN-011', name: 'Mr. R. Suresh, M.Sc., B.Ed.', email: 'suresh.math@school.com', role: 'Teacher', department: 'Mathematics & Science', assignedClass: 'Grade 10 - Section A', assignedSubject: 'Mathematics', status: 'active', lastLogin: 'Today, 08:45 AM' },
  { id: 2, employeeId: 'EMP-CHN-012', name: 'Dr. K. Meena, Ph.D.', email: 'meena.phy@school.com', role: 'Class Admin', department: 'Mathematics & Science', assignedClass: 'Grade 10 - Section A', assignedSubject: 'Physics', status: 'active', lastLogin: 'Today, 09:12 AM' },
  { id: 3, employeeId: 'EMP-CHN-013', name: 'Mrs. S. Lakshmi, M.Sc.', email: 'lakshmi.chem@school.com', role: 'Teacher', department: 'Mathematics & Science', assignedClass: 'Grade 10 - Section B', assignedSubject: 'Chemistry', status: 'active', lastLogin: 'Yesterday' },
  { id: 4, employeeId: 'EMP-CHN-014', name: 'Mr. M. Anand, M.A.', email: 'anand.eng@school.com', role: 'Teacher', department: 'Languages', assignedClass: 'Grade 10 - Section A', assignedSubject: 'English', status: 'active', lastLogin: 'Today, 08:30 AM' },
  { id: 5, employeeId: 'EMP-CHN-015', name: 'Mr. V. Karthikeyan', email: 'karthik.admin@school.com', role: 'Exam Coordinator', department: 'Examination Cell', assignedClass: 'All Grades', assignedSubject: 'Exams & Reports', status: 'active', lastLogin: '3 days ago' },
];

export const StaffManagementPage: React.FC = () => {
  const { activeSchool } = useAuth();
  const [staffList, setStaffList] = useState<StaffAccount[]>(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdCredential, setCreatedCredential] = useState<{ email: string; pass: string } | null>(null);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Teacher' as StaffAccount['role'],
    department: 'Mathematics & Science',
    assignedClass: 'Grade 10 - Section A',
    assignedSubject: 'Mathematics',
    password: '',
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const tempPassword = newStaff.password || 'Staff@' + Math.floor(1000 + Math.random() * 9000);

    const created: StaffAccount = {
      id: staffList.length + 1,
      employeeId: `EMP-CHN-0${staffList.length + 11}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      department: newStaff.department,
      assignedClass: newStaff.assignedClass,
      assignedSubject: newStaff.assignedSubject,
      status: 'active',
      lastLogin: 'Never',
    };

    setStaffList([created, ...staffList]);
    setCreatedCredential({ email: newStaff.email, pass: tempPassword });
    setIsModalOpen(false);
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || s.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            School Staff & Login Accounts Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            School Admin Control: Create logins, assign class & subject roles, and generate secure credentials for {activeSchool?.name || 'this campus'}.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedCredential(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Create New Staff Account
        </button>
      </div>

      {/* Temporary Credential Success Banner */}
      {createdCredential && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Staff Login Account Provisioned Successfully!</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Login Email: <span className="font-mono font-bold">{createdCredential.email}</span> | Temporary Password:{' '}
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">{createdCredential.pass}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatedCredential(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty by name, employee ID, or email..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="Teacher">Subject Teachers</option>
            <option value="Class Admin">Class Admins</option>
            <option value="Exam Coordinator">Exam Coordinators</option>
          </select>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-4 px-6">Emp ID</th>
              <th className="py-4 px-6">Faculty Name & Credentials</th>
              <th className="py-4 px-6">Assigned Role</th>
              <th className="py-4 px-6">Class & Subject Scope</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/50">
                <td className="py-4 px-6 font-mono font-bold text-indigo-600">{staff.employeeId}</td>
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-900">{staff.name}</p>
                  <p className="text-slate-400 text-[11px] font-mono mt-0.5">{staff.email}</p>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    staff.role === 'Class Admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : staff.role === 'Teacher'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800">{staff.assignedClass}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{staff.assignedSubject}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {staff.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="px-3 py-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg">
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Staff & Credentials */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Staff Login & Profile</h3>
                <p className="text-xs text-slate-500 mt-0.5">Generate credentials for teaching or administrative staff.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name & Degree</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Mrs. Priya Sundaram, M.Sc., M.Phil."
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Login Email</label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="priya.math@school.com"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Teacher">Subject Teacher</option>
                    <option value="Class Admin">Class Admin (Class Teacher)</option>
                    <option value="Exam Coordinator">Exam Coordinator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class & Section Allocation</label>
                  <select
                    value={newStaff.assignedClass}
                    onChange={(e) => setNewStaff({ ...newStaff, assignedClass: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Grade 10 - Section A</option>
                    <option>Grade 10 - Section B</option>
                    <option>Grade 9 - Section A</option>
                    <option>Grade 11 - Science A</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newStaff.assignedSubject}
                    onChange={(e) => setNewStaff({ ...newStaff, assignedSubject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password (Optional - defaults to auto-gen)</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Leave blank to auto-generate temporary password"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Create Staff & Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
