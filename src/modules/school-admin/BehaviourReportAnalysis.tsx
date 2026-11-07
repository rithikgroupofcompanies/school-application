import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  HeartHandshake,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  X
} from 'lucide-react';

interface BehaviourRecord {
  id: number;
  studentName: string;
  admissionNo: string;
  grade: string;
  section: string;
  recordType: 'positive' | 'concern' | 'achievement' | 'follow_up';
  occurredAt: string;
  category: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  actionTaken: string;
  recordedBy: string;
  visibility: 'staff_only' | 'class_staff' | 'guardian_shared';
  status: 'reviewed' | 'pending' | 'resolved';
}

const INITIAL_RECORDS: BehaviourRecord[] = [
  {
    id: 1,
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-CHN-001/101',
    grade: 'Grade 10',
    section: 'Section A',
    recordType: 'achievement',
    occurredAt: '2026-10-22',
    category: 'STEM Innovation',
    severity: 'minor',
    description: 'Secured 1st Prize in State Level Science Exhibition for Automated Solar Irrigation project.',
    actionTaken: 'Commendation certificate awarded during morning assembly.',
    recordedBy: 'Dr. K. Meena (Physics)',
    visibility: 'guardian_shared',
    status: 'reviewed',
  },
  {
    id: 2,
    studentName: 'Dinesh Kumar',
    admissionNo: 'SCH-CHN-001/103',
    grade: 'Grade 10',
    section: 'Section A',
    recordType: 'concern',
    occurredAt: '2026-10-23',
    category: 'Classroom Distraction',
    severity: 'moderate',
    description: 'Repeated non-submission of homework assignments and disengagement during lectures.',
    actionTaken: 'One-on-one academic counselling scheduled; guardian notified.',
    recordedBy: 'Mr. R. Suresh (Math)',
    visibility: 'guardian_shared',
    status: 'pending',
  },
  {
    id: 3,
    studentName: 'Harini Sundar',
    admissionNo: 'SCH-CHN-001/104',
    grade: 'Grade 10',
    section: 'Section B',
    recordType: 'positive',
    occurredAt: '2026-10-24',
    category: 'Peer Collaboration',
    severity: 'minor',
    description: 'Proactively tutored struggling peers in advanced geometry during study hour.',
    actionTaken: 'Star Peer Mentor appreciation tag granted in student portfolio.',
    recordedBy: 'Mrs. S. Lakshmi',
    visibility: 'class_staff',
    status: 'reviewed',
  },
  {
    id: 4,
    studentName: 'Diya Natarajan',
    admissionNo: 'SCH-CBE-002/204',
    grade: 'Grade 8',
    section: 'Section B',
    recordType: 'achievement',
    occurredAt: '2026-10-20',
    category: 'Oratory & Debating',
    severity: 'minor',
    description: 'Represented school in South Zone Model United Nations debate competition.',
    actionTaken: 'Special mention in quarterly newsletter.',
    recordedBy: 'Mrs. Jayanthi Natarajan',
    visibility: 'guardian_shared',
    status: 'reviewed',
  },
];

export const BehaviourReportAnalysis: React.FC = () => {
  const { activeSchool } = useAuth();
  const [records, setRecords] = useState<BehaviourRecord[]>(INITIAL_RECORDS);

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    studentName: 'Aarav Sharma',
    admissionNo: 'SCH-CHN-001/101',
    grade: 'Grade 10',
    section: 'Section A',
    recordType: 'positive' as BehaviourRecord['recordType'],
    category: 'Leadership & Discipline',
    severity: 'minor' as BehaviourRecord['severity'],
    description: '',
    actionTaken: '',
    visibility: 'guardian_shared' as BehaviourRecord['visibility'],
  });

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BehaviourRecord = {
      id: records.length + 1,
      studentName: newRecord.studentName,
      admissionNo: newRecord.admissionNo,
      grade: newRecord.grade,
      section: newRecord.section,
      recordType: newRecord.recordType,
      occurredAt: new Date().toISOString().split('T')[0],
      category: newRecord.category,
      severity: newRecord.severity,
      description: newRecord.description,
      actionTaken: newRecord.actionTaken || 'Factual observation recorded.',
      recordedBy: 'Staff Member',
      visibility: newRecord.visibility,
      status: 'pending',
    };

    setRecords([created, ...records]);
    setIsModalOpen(false);
    setNewRecord({
      studentName: '',
      admissionNo: '',
      grade: 'Grade 10',
      section: 'Section A',
      recordType: 'positive',
      category: 'Leadership & Discipline',
      severity: 'minor',
      description: '',
      actionTaken: '',
      visibility: 'guardian_shared',
    });
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || r.grade === selectedClass;
    const matchesSection = selectedSection === 'all' || r.section === selectedSection;
    const matchesType = typeFilter === 'all' || r.recordType === typeFilter;
    return matchesSearch && matchesClass && matchesSection && matchesType;
  });

  const positiveCount = records.filter((r) => r.recordType === 'positive' || r.recordType === 'achievement').length;
  const concernCount = records.filter((r) => r.recordType === 'concern').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Student Welfare & Behavioural Tracking
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Behavioural Analysis & Observations Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Faculty & Staff Workspace: Record factual observations, achievements, disciplinary incidents, and guardian sharing for {activeSchool?.name || 'this institution'}.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Record Observation
        </button>
      </div>

      {/* Analytics KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Incidents Logged</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{records.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <HeartHandshake className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Positive Recognitions</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{positiveCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Concerns Needing Follow-up</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{concernCount}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Guardian Shared Reports</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">
              {records.filter((r) => r.visibility === 'guardian_shared').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* FILTER BAR: Class, Section, and Observation Type */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search observation by student name, category, or note..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-slate-800 font-bold focus:outline-none"
            >
              <option value="all">All Classes</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 8">Grade 8</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-slate-800 font-bold focus:outline-none"
            >
              <option value="all">All Sections</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 uppercase">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white py-2 px-3 text-slate-800 font-bold focus:outline-none"
            >
              <option value="all">All Observation Types</option>
              <option value="positive">Positive Observation</option>
              <option value="achievement">Special Achievement</option>
              <option value="concern">Behavioral Concern</option>
            </select>
          </div>
        </div>
      </div>

      {/* Observation Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Student Details</th>
              <th className="py-4 px-6">Type & Category</th>
              <th className="py-4 px-6">Observation & Action Taken</th>
              <th className="py-4 px-6">Faculty Reporter</th>
              <th className="py-4 px-6 text-right">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No behavioural reports match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-mono text-slate-500">{item.occurredAt}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{item.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.admissionNo} • {item.grade} ({item.section})</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.recordType === 'achievement'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.recordType === 'positive'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.recordType}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-700 mt-1">{item.category}</p>
                  </td>
                  <td className="py-4 px-6 max-w-sm">
                    <p className="text-slate-800">{item.description}</p>
                    <p className="text-[11px] text-indigo-600 font-semibold mt-1">Action: {item.actionTaken}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">{item.recordedBy}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.visibility === 'guardian_shared'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.visibility === 'guardian_shared' ? 'Shared with Parent' : 'Staff Only'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Record Behaviour Observation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Record Student Observation</h3>
                <p className="text-xs text-slate-500 mt-0.5">Factual, auditable behavioural entry.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newRecord.studentName}
                    onChange={(e) => setNewRecord({ ...newRecord, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Admission Number</label>
                  <input
                    type="text"
                    required
                    value={newRecord.admissionNo}
                    onChange={(e) => setNewRecord({ ...newRecord, admissionNo: e.target.value })}
                    placeholder="SCH-CHN-001/101"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class & Section</label>
                  <select
                    value={`${newRecord.grade} - ${newRecord.section}`}
                    onChange={(e) => {
                      const [g, s] = e.target.value.split(' - ');
                      setNewRecord({ ...newRecord, grade: g, section: s });
                    }}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Grade 10 - Section A</option>
                    <option>Grade 10 - Section B</option>
                    <option>Grade 9 - Section A</option>
                    <option>Grade 8 - Section B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observation Type</label>
                  <select
                    value={newRecord.recordType}
                    onChange={(e) => setNewRecord({ ...newRecord, recordType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="positive">Positive Observation</option>
                    <option value="achievement">Achievement</option>
                    <option value="concern">Behavioral Concern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                  placeholder="e.g. Peer Collaboration / Punctuality / Focus"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Factual Description</label>
                <textarea
                  rows={3}
                  required
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  placeholder="Objective, factual description of observation..."
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Action Taken / Resolution</label>
                <input
                  type="text"
                  value={newRecord.actionTaken}
                  onChange={(e) => setNewRecord({ ...newRecord, actionTaken: e.target.value })}
                  placeholder="e.g. Counselling arranged / Certificate awarded"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parent Visibility</label>
                <select
                  value={newRecord.visibility}
                  onChange={(e) => setNewRecord({ ...newRecord, visibility: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 focus:outline-none"
                >
                  <option value="guardian_shared">Share with Parent in Portal</option>
                  <option value="class_staff">Class Staff Only (Internal)</option>
                  <option value="staff_only">Confidential Staff Only</option>
                </select>
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
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
