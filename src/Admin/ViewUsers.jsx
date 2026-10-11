import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Users, 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  ShieldCheck, 
  BookOpen, 
  GraduationCap, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1EOaG3KmoT1K9hYoBABKVTWZLjVB_RnExt6MQ1LLpodQ/edit?usp=sharing";

export default function ViewUsers() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isClassAdmin = loggedInUser.role === 'admin' || loggedInUser.role === 'school_admin';
  const isSuperAdmin = loggedInUser.role === 'super_admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(data.users || data.staff || []);
      } else {
        toast.error(data.message || 'Failed to fetch user directory');
      }
    } catch (error) {
      toast.error('Network error loading users.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name || 'this user'}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Removed user successfully`);
        setUsers(users.filter(user => user.id !== id));
      } else {
        toast.error(data.message || 'Failed to remove user');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error(error);
    }
  };

  const studentCount = users.filter(u => u.role === 'student').length;
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const adminCount = users.filter(u => u.role === 'admin' || u.role === 'school_admin' || u.role === 'super_admin').length;

  const filteredUsers = users.filter(user => {
    const nameMatch = (user.name || user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (user.email || user.username || '').toLowerCase().includes(searchTerm.toLowerCase());
    const rollMatch = (user.rollNumber || user.roll_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || rollMatch;

    let matchesRole = true;
    if (roleFilter !== 'all') {
      if (roleFilter === 'admin') {
        matchesRole = user.role === 'admin' || user.role === 'school_admin' || user.role === 'super_admin';
      } else {
        matchesRole = user.role === roleFilter;
      }
    }

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {isClassAdmin ? 'Class Student Registry' : 'User Directory & Faculty'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {users.length} Active Records
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isClassAdmin 
              ? `Manage student records enrolled in ${loggedInUser.className || 'Class'}-${loggedInUser.section || 'A'}.`
              : 'Complete directory of registered students, teaching faculty, and administrators.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/add-student"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Student</span>
          </Link>

          {isSuperAdmin && (
            <Link
              to="/admin/add-staff"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Staff</span>
            </Link>
          )}

          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sheets View</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Accounts</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{users.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Platform user identities</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{studentCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Enrolled across classes</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Teachers</span>
            <BookOpen className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{teacherCount}</div>
          <div className="text-[11px] text-violet-400 mt-1">Subject educators</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrators</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{adminCount}</div>
          <div className="text-[11px] text-amber-400 mt-1">Super & class admins</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Users' },
              { id: 'student', label: 'Students' },
              { id: 'teacher', label: 'Teachers' },
              { id: 'admin', label: 'Admins' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  roleFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
              <span className="text-xs">Loading directory...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="px-5 py-3 font-bold">User Identity</th>
                  <th className="px-4 py-3 font-bold">Role & Permissions</th>
                  <th className="px-4 py-3 font-bold">Class / Dept</th>
                  <th className="px-4 py-3 font-bold">ID / Roll No</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const name = user.name || user.full_name || 'Unnamed';
                    const email = user.email || user.username || 'No email';
                    const role = user.role || 'user';
                    const className = user.className || user.class_name || (role === 'teacher' ? (user.designation || 'Faculty') : '—');
                    const section = user.section || user.section_name || '';
                    const rollNo = user.rollNumber || user.roll_number || user.admission_number || `UID-${user.id}`;

                    const roleBadgeConfig = {
                      super_admin: { label: 'Super Admin', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
                      admin: { label: 'Class Admin', color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
                      school_admin: { label: 'School Admin', color: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' },
                      teacher: { label: 'Teacher', color: 'bg-violet-500/20 text-violet-300 border border-violet-500/30' },
                      student: { label: 'Student', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
                    }[role] || { label: role, color: 'bg-slate-800 text-slate-300' };

                    return (
                      <tr key={user.id} className="hover:bg-slate-850/50 transition-colors">
                        
                        {/* Name and Avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-xs flex items-center justify-center border border-slate-700 shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{name}</div>
                              <div className="text-[11px] text-slate-400 font-mono truncate">{email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeConfig.color}`}>
                            {roleBadgeConfig.label}
                          </span>
                        </td>

                        {/* Class / Dept */}
                        <td className="px-4 py-3.5 text-slate-300">
                          {className !== '—' ? (
                            <span className="font-semibold">
                              {className}{section ? ` - ${section}` : ''}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* ID / Roll */}
                        <td className="px-4 py-3.5 font-mono text-slate-400">
                          {rollNo}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(user.id, name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No users match the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
