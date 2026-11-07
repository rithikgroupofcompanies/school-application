import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Clock, BookOpen } from 'lucide-react';

export const StudentParentPortal: React.FC<{ isParent?: boolean }> = ({ isParent }) => {
  const { user, activeSchool } = useAuth();

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            {isParent ? 'Parent / Guardian Portal' : 'Student Academic Portal'}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            {isParent ? `Guardian View: Monitoring Aarav Sharma` : `Welcome back, ${user?.name}`}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeSchool?.name || 'Rithik Matriculation Higher Secondary School, Chennai'} • Grade 10 - Section A
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">Term 1 Attendance</p>
          <p className="text-2xl font-bold text-emerald-600">96.4%</p>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest Published Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600" />
              Latest Exam Results
            </h2>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Published</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between"><span>Mathematics</span><strong className="font-mono text-emerald-600">88/100 (A2)</strong></div>
            <div className="py-2 flex justify-between"><span>Physics</span><strong className="font-mono text-emerald-600">92/100 (A1)</strong></div>
            <div className="py-2 flex justify-between"><span>Chemistry</span><strong className="font-mono text-emerald-600">84/100 (A2)</strong></div>
            <div className="py-2 flex justify-between"><span>English</span><strong className="font-mono text-emerald-600">89/100 (A2)</strong></div>
          </div>

          <a href="/school/academics" className="block text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2 border-t border-slate-100">
            View Verified Report Card →
          </a>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            Today's Timetable
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <div><strong className="text-slate-800">Period 1: Math</strong><p className="text-[10px] text-slate-400">09:00 - 09:45</p></div>
              <span className="text-indigo-600 font-semibold">Room 101</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <div><strong className="text-slate-800">Period 2: Physics</strong><p className="text-[10px] text-slate-400">09:45 - 10:30</p></div>
              <span className="text-emerald-600 font-semibold">Lab 2</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <div><strong className="text-slate-800">Period 3: Chemistry</strong><p className="text-[10px] text-slate-400">10:45 - 11:30</p></div>
              <span className="text-violet-600 font-semibold">Room 101</span>
            </div>
          </div>
        </div>

        {/* Homework & Notices */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            Active Homework
          </h2>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-amber-50/40">
              <p className="font-bold text-slate-800">Math: Quadratic Equations</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Due: Tomorrow at 09:00 AM</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <p className="font-bold text-slate-800">English: Essay Submission</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Due: Friday at 04:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
