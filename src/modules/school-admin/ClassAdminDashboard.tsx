import React from 'react';
import { useAuth } from '../../context/AuthContext';
// Class Admin Workspace

export const ClassAdminDashboard: React.FC = () => {
  const { user, activeSchool } = useAuth();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class Teacher Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as Class Admin: <strong>{user?.name}</strong> • Assigned: <strong>Grade 10 - Section A</strong> ({activeSchool?.name})
          </p>
        </div>
        <a
          href="/school/academics"
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
        >
          Take Today's Attendance
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Class Roster</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">42 Students</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Today's Attendance</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">95.2%</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Absentees</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">2 Students</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-400">Pending Marks</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">1 Subject</p>
        </div>
      </div>
    </div>
  );
};
