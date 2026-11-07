import React, { useState } from 'react';
import { UserPlus, Upload, Search, CheckCircle2, Mail, AlertCircle } from 'lucide-react';

interface StudentRecord {
  id: number;
  admission_no: string;
  full_name: string;
  class: string;
  section: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email?: string;
  status: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  { id: 101, admission_no: 'SCH-CHN-001/101', full_name: 'Aarav Sharma', class: 'Grade 10', section: 'Section A', guardian_name: 'Mr. K. Raman', guardian_phone: '+91 98401 99881', guardian_email: 'parent.aarav@greenwood.edu', status: 'active' },
  { id: 102, admission_no: 'SCH-CHN-001/102', full_name: 'Ananya Raman', class: 'Grade 10', section: 'Section A', guardian_name: 'Mrs. V. Raman', guardian_phone: '+91 98401 99882', guardian_email: 'raman.ananya.parent@gmail.com', status: 'active' },
  { id: 103, admission_no: 'SCH-CHN-001/103', full_name: 'Dinesh Kumar', class: 'Grade 10', section: 'Section A', guardian_name: 'Mr. R. Kumar', guardian_phone: '+91 98401 99883', guardian_email: 'dinesh.kumar.father@yahoo.com', status: 'active' },
  { id: 104, admission_no: 'SCH-CHN-001/104', full_name: 'Harini Sundar', class: 'Grade 10', section: 'Section B', guardian_name: 'Mr. S. Sundar', guardian_phone: '+91 98401 99884', status: 'active' },
  { id: 105, admission_no: 'SCH-CHN-001/105', full_name: 'Karthik Raja', class: 'Grade 10', section: 'Section B', guardian_name: 'Mrs. K. Raja', guardian_phone: '+91 98401 99885', guardian_email: 'raja.karthik.parent@outlook.com', status: 'active' },
  { id: 106, admission_no: 'SCH-CHN-001/106', full_name: 'Meera Vijay', class: 'Grade 9', section: 'Section A', guardian_name: 'Mr. M. Vijay', guardian_phone: '+91 98401 99886', status: 'active' },
  { id: 107, admission_no: 'SCH-CHN-001/107', full_name: 'Naveen Prakash', class: 'Grade 9', section: 'Section B', guardian_name: 'Mr. P. Prakash', guardian_phone: '+91 98401 99887', status: 'active' },
  { id: 204, admission_no: 'SCH-CBE-002/204', full_name: 'Diya Natarajan', class: 'Grade 8', section: 'Section B', guardian_name: 'Mrs. Priya Natarajan', guardian_phone: '+91 98402 77665', guardian_email: 'priya.natarajan@gmail.com', status: 'active' },
];

export const StudentDirectoryPage: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Multi-step modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    admission_no: '',
    full_name: '',
    date_of_birth: '',
    gender: 'male',
    class: 'Grade 10',
    section: 'Section A',
    guardian_name: '',
    guardian_relationship: 'father',
    guardian_mobile: '',
    guardian_email: '',
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: StudentRecord = {
      id: students.length + 101,
      admission_no: formData.admission_no || `SCH-CHN-001/${students.length + 101}`,
      full_name: formData.full_name,
      class: formData.class,
      section: formData.section,
      guardian_name: formData.guardian_name,
      guardian_phone: formData.guardian_mobile,
      guardian_email: formData.guardian_email,
      status: 'active',
    };

    setStudents([created, ...students]);
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_no.toLowerCase().includes(search.toLowerCase()) ||
      s.guardian_name.toLowerCase().includes(search.toLowerCase());

    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSection = selectedSection === 'all' || s.section === selectedSection;

    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Directory & Admissions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic Filtering: View and filter student rosters strictly by Class and Section.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/school/students/import"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Bulk Import (CSV)
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            New Admission
          </button>
        </div>
      </div>

      {/* CLASS & SECTION DYNAMIC FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, admission no, or guardian..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Dynamic Class Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-slate-800 font-bold focus:border-indigo-600 focus:outline-none shadow-xs"
            >
              <option value="all">All Classes</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          {/* Dynamic Section Selector */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-slate-800 font-bold focus:border-indigo-600 focus:outline-none shadow-xs"
            >
              <option value="all">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Data Table */}
      <div className="rounded-3xl bg-white shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Filtered Roster: {filteredStudents.length} Students {selectedClass !== 'all' ? `in ${selectedClass}` : ''} {selectedSection !== 'all' ? `(${selectedSection})` : ''}
          </span>
          <span className="text-[11px] font-semibold text-indigo-600">Row-Level Tenancy Scoped</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-4 px-6">Admission No</th>
              <th className="py-4 px-6">Student Name</th>
              <th className="py-4 px-6">Grade & Section</th>
              <th className="py-4 px-6">Guardian / Registered Email</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Student Portal Account</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No students found in {selectedClass} - {selectedSection}.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-mono font-bold text-indigo-600">{s.admission_no}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{s.full_name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                      {s.class} - {s.section}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <p className="font-semibold text-slate-800">{s.guardian_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-slate-400 text-[10px]">{s.guardian_phone}</span>
                      {s.guardian_email ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-medium">
                          <Mail className="h-2.5 w-2.5" />
                          {s.guardian_email}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                          <AlertCircle className="h-2.5 w-2.5" />
                          No Email
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-[11px] text-slate-500">
                    student.{s.full_name.toLowerCase().split(' ')[0]}@school.com
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Admission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Student Admission Entry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Admit new student with class placement and guardian details.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Student name"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Grade 10</option>
                    <option>Grade 9</option>
                    <option>Grade 8</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Section A</option>
                    <option>Section B</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="Father / Mother Name"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guardian Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.guardian_mobile}
                    onChange={(e) => setFormData({ ...formData, guardian_mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Guardian Primary Email ID (For Reports & Attendance)</label>
                <input
                  type="email"
                  value={formData.guardian_email}
                  onChange={(e) => setFormData({ ...formData, guardian_email: e.target.value })}
                  placeholder="parent.guardian@example.com"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Automated term report cards and attendance percentage digests will be dispatched to this address.
                </p>
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
                  Admit Student & Create Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
