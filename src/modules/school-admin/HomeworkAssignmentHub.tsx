import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Search,
  Eye,
  X
} from 'lucide-react';

interface HomeworkItem {
  id: number;
  title: string;
  grade: string;
  section: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  status: 'draft' | 'published' | 'closed';
  instructions: string;
  submissionType: 'file' | 'text' | 'offline';
}

interface SubmissionRecord {
  id: number;
  studentName: string;
  admissionNo: string;
  submittedAt: string;
  isLate: boolean;
  version: number;
  marksObtained: number | null;
  maxMarks: number;
  feedback: string;
  status: 'submitted' | 'reviewed' | 'resubmission_requested';
}

const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 1,
    title: 'Exercise 4.2: Quadratic Equations & Word Problems',
    grade: 'Grade 10',
    section: 'Section A',
    subject: 'Mathematics',
    assignedDate: '2026-10-23',
    dueDate: '2026-10-25',
    totalStudents: 42,
    submittedCount: 38,
    gradedCount: 30,
    status: 'published',
    instructions: 'Complete problems 1 to 15 from NCERT Chapter 4. Show all algebraic steps clearly.',
    submissionType: 'file',
  },
  {
    id: 2,
    title: 'Ohm’s Law Verification and Circuit Diagrams',
    grade: 'Grade 10',
    section: 'Section A',
    subject: 'Physics',
    assignedDate: '2026-10-22',
    dueDate: '2026-10-24',
    totalStudents: 42,
    submittedCount: 41,
    gradedCount: 41,
    status: 'closed',
    instructions: 'Submit scanned lab writeup along with V-I graph readings taken during Lab Session 2.',
    submissionType: 'file',
  },
  {
    id: 3,
    title: 'Essay: The Role of Renewable Energy in India 2030',
    grade: 'Grade 10',
    section: 'Section B',
    subject: 'English',
    assignedDate: '2026-10-24',
    dueDate: '2026-10-28',
    totalStudents: 40,
    submittedCount: 12,
    gradedCount: 0,
    status: 'published',
    instructions: 'Write a 500-word structured essay with formal introduction, body paragraphs, and conclusion.',
    submissionType: 'text',
  },
];

const INITIAL_SUBMISSIONS: SubmissionRecord[] = [
  { id: 101, studentName: 'Aarav Sharma', admissionNo: 'SCH-CHN-001/101', submittedAt: '2026-10-24 08:30 PM', isLate: false, version: 1, marksObtained: 19, maxMarks: 20, feedback: 'Accurate working and neat handwriting.', status: 'reviewed' },
  { id: 102, studentName: 'Ananya Raman', admissionNo: 'SCH-CHN-001/102', submittedAt: '2026-10-24 07:45 PM', isLate: false, version: 1, marksObtained: 20, maxMarks: 20, feedback: 'Perfect solutions for all word problems.', status: 'reviewed' },
  { id: 103, studentName: 'Dinesh Kumar', admissionNo: 'SCH-CHN-001/103', submittedAt: '2026-10-25 09:15 AM', isLate: true, version: 1, marksObtained: null, maxMarks: 20, feedback: '', status: 'submitted' },
  { id: 104, studentName: 'Harini Sundar', admissionNo: 'SCH-CHN-001/104', submittedAt: '2026-10-24 09:00 PM', isLate: false, version: 1, marksObtained: 17, maxMarks: 20, feedback: 'Check calculation in question 12.', status: 'reviewed' },
];

export const HomeworkAssignmentHub: React.FC = () => {
  const { activeSchool } = useAuth();
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(INITIAL_HOMEWORK);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(INITIAL_SUBMISSIONS);

  // Filters
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Active Selected Assignment for Review
  const [activeReviewHw, setActiveReviewHw] = useState<HomeworkItem | null>(null);

  // Create Assignment Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newHw, setNewHw] = useState({
    title: '',
    grade: 'Grade 10',
    section: 'Section A',
    subject: 'Mathematics',
    dueDate: '',
    instructions: '',
    submissionType: 'file' as HomeworkItem['submissionType'],
  });

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    const created: HomeworkItem = {
      id: homeworkList.length + 1,
      title: newHw.title,
      grade: newHw.grade,
      section: newHw.section,
      subject: newHw.subject,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newHw.dueDate || new Date().toISOString().split('T')[0],
      totalStudents: 42,
      submittedCount: 0,
      gradedCount: 0,
      status: 'published',
      instructions: newHw.instructions,
      submissionType: newHw.submissionType,
    };

    setHomeworkList([created, ...homeworkList]);
    setIsCreateOpen(false);
  };

  const handleGradeSubmission = (id: number, marks: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, marksObtained: marks, feedback, status: 'reviewed' } : s))
    );
  };

  const filtered = homeworkList.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase()) || h.subject.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'all' || h.grade === selectedClass;
    const matchesSection = selectedSection === 'all' || h.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Curriculum & Academic Tasks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Homework & Digital Assignment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Publish coursework, review student submissions with audit timestamps, provide feedback, and track completion for {activeSchool?.name || 'this school'}.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Assign New Homework
        </button>
      </div>

      {/* Class & Section Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search homework by title, subject..."
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
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hw) => {
          const submissionPct = Math.round((hw.submittedCount / hw.totalStudents) * 100);
          return (
            <div
              key={hw.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {hw.grade} - {hw.section}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    hw.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {hw.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{hw.title}</h3>
                <p className="text-xs font-semibold text-slate-500">{hw.subject}</p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{hw.instructions}</p>
              </div>

              {/* Completion Progress */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500">Submissions</span>
                  <span className="text-slate-800">
                    {hw.submittedCount} / {hw.totalStudents} ({submissionPct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${submissionPct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Due: {hw.dueDate}</span>
                  <button
                    onClick={() => setActiveReviewHw(hw)}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review & Grade ({hw.submittedCount})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review & Grading Slide-Over Modal */}
      {activeReviewHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {activeReviewHw.grade} - {activeReviewHw.section} • {activeReviewHw.subject}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeReviewHw.title}</h3>
              </div>
              <button onClick={() => setActiveReviewHw(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl">
                <span>Roster Student Submissions ({submissions.length})</span>
                <span className="text-emerald-700">Audit Status: Version Controlled</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {submissions.map((sub) => (
                  <div key={sub.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">({sub.admissionNo})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.isLate && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Late Submission
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'reviewed' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {sub.status === 'reviewed' ? 'Graded ✓' : 'Submitted'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                      <div className="text-[11px] text-slate-500 font-mono">
                        Submitted: {sub.submittedAt} (v{sub.version})
                      </div>

                      <div>
                        <input
                          type="number"
                          placeholder={`Score / ${sub.maxMarks}`}
                          defaultValue={sub.marksObtained ?? ''}
                          onBlur={(e) => handleGradeSubmission(sub.id, parseFloat(e.target.value) || 0, sub.feedback)}
                          className="w-full rounded-lg border border-slate-200 py-1.5 px-2 font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Teacher feedback..."
                          defaultValue={sub.feedback}
                          onBlur={(e) => handleGradeSubmission(sub.id, sub.marksObtained || 0, e.target.value)}
                          className="w-full rounded-lg border border-slate-200 py-1.5 px-2 text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveReviewHw(null)}
                className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
              >
                Done Grading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Assign New Homework */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish Homework Assignment</h3>
                <p className="text-xs text-slate-500 mt-0.5">Push curriculum tasks to student and parent portals.</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  placeholder="e.g. Chapter 6: Chemical Reactions Problem Set"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Section</label>
                  <select
                    value={`${newHw.grade} - ${newHw.section}`}
                    onChange={(e) => {
                      const [g, s] = e.target.value.split(' - ');
                      setNewHw({ ...newHw, grade: g, section: s });
                    }}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  >
                    <option>Grade 10 - Section A</option>
                    <option>Grade 10 - Section B</option>
                    <option>Grade 9 - Section A</option>
                    <option>Grade 8 - Section B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newHw.subject}
                    onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newHw.dueDate}
                    onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Format</label>
                  <select
                    value={newHw.submissionType}
                    onChange={(e) => setNewHw({ ...newHw, submissionType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="file">File Upload (PDF / Image)</option>
                    <option value="text">Rich Text Submission</option>
                    <option value="offline">Offline Notebook Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={newHw.instructions}
                  onChange={(e) => setNewHw({ ...newHw, instructions: e.target.value })}
                  placeholder="Specific tasks, problem numbers, or reference pages..."
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Publish to Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
