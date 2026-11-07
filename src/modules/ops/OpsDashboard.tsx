import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Eye,
  X,
  Check,
  AlertTriangle,
  Building2
} from 'lucide-react';

interface SchoolDocument {
  id: number;
  schoolId: number;
  title: string;
  category: 'affiliation' | 'noc' | 'safety' | 'land_deed' | 'sanitation';
  submittedDate: string;
  submittedBy: string;
  fileSize: string;
  docNumber: string;
  validUntil: string;
  issuingAuthority: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

interface AssignedSchool {
  id: number;
  code: string;
  name: string;
  pendingDocs: number;
  status: 'active' | 'pending';
}

const INITIAL_DOCUMENTS: SchoolDocument[] = [
  {
    id: 1,
    schoolId: 1,
    title: 'State Government No-Objection Certificate (NOC)',
    category: 'noc',
    submittedDate: '2026-10-18',
    submittedBy: 'Dr. K. Sundararajan (Principal)',
    fileSize: '2.4 MB (PDF)',
    docNumber: 'NOC-TN-EDU-2025-9981',
    validUntil: '2029-05-31',
    issuingAuthority: 'Department of School Education, Govt. of Tamil Nadu',
    status: 'pending',
  },
  {
    id: 2,
    schoolId: 1,
    title: 'Matriculation Board Affiliation Approval Certificate',
    category: 'affiliation',
    submittedDate: '2026-10-18',
    submittedBy: 'Dr. K. Sundararajan (Principal)',
    fileSize: '3.1 MB (PDF)',
    docNumber: 'DSE-MAT-AFF-4412',
    validUntil: '2028-03-31',
    issuingAuthority: 'Directorate of Matriculation Schools, Chennai',
    status: 'pending',
  },
  {
    id: 3,
    schoolId: 1,
    title: 'Fire & Life Safety Clearance Compliance Certificate',
    category: 'safety',
    submittedDate: '2026-10-19',
    submittedBy: 'Estate Operations Office',
    fileSize: '1.8 MB (PDF)',
    docNumber: 'FRS-CHN-SOUTH-882',
    validUntil: '2027-04-30',
    issuingAuthority: 'Tamil Nadu Fire and Rescue Services Department',
    status: 'pending',
  },
  {
    id: 4,
    schoolId: 1,
    title: 'Building Structural Stability & Public Health Certificate',
    category: 'safety',
    submittedDate: '2026-10-19',
    submittedBy: 'Estate Operations Office',
    fileSize: '4.2 MB (PDF)',
    docNumber: 'PWD-EE-BLDG-1092',
    validUntil: '2029-08-15',
    issuingAuthority: 'Executive Engineer, PWD Buildings Division, Chennai',
    status: 'pending',
  },
  {
    id: 5,
    schoolId: 3,
    title: 'State School Recognition & Affiliation Renewal',
    category: 'affiliation',
    submittedDate: '2026-10-21',
    submittedBy: 'Mrs. S. Gandhimathi (Principal)',
    fileSize: '2.9 MB (PDF)',
    docNumber: 'MDU-REC-2026-004',
    validUntil: '2027-12-31',
    issuingAuthority: 'Chief Educational Officer, Madurai District',
    status: 'pending',
  },
  {
    id: 6,
    schoolId: 3,
    title: 'Campus Potable Water & Sanitary Fitness Certificate',
    category: 'sanitation',
    submittedDate: '2026-10-22',
    submittedBy: 'Health & Welfare Officer',
    fileSize: '1.1 MB (PDF)',
    docNumber: 'DPH-SAN-2026-781',
    validUntil: '2027-06-30',
    issuingAuthority: 'Deputy Director of Health Services, Madurai',
    status: 'pending',
  },
];

export const OpsDashboard: React.FC = () => {
  const { user } = useAuth();

  const [assignedSchools, setAssignedSchools] = useState<AssignedSchool[]>([
    { id: 1, code: 'SCH-CHN-001', name: 'Rithik Matriculation Higher Secondary School, Chennai', pendingDocs: 4, status: 'active' },
    { id: 2, code: 'SCH-CBE-002', name: 'Rithik International Academy, Coimbatore', pendingDocs: 0, status: 'active' },
    { id: 3, code: 'SCH-MDU-003', name: 'Rithik Global Public School, Madurai', pendingDocs: 2, status: 'active' },
  ]);

  const [documents, setDocuments] = useState<SchoolDocument[]>(INITIAL_DOCUMENTS);
  const [activeSchool, setActiveSchool] = useState<AssignedSchool | null>(null);
  const [previewDoc, setPreviewDoc] = useState<SchoolDocument | null>(null);
  const [rejectionModalDoc, setRejectionModalDoc] = useState<SchoolDocument | null>(null);
  const [rejectionInput, setRejectionInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter documents for the active opened school
  const activeSchoolDocs = activeSchool ? documents.filter((d) => d.schoolId === activeSchool.id) : [];

  const handleApproveDocument = (doc: SchoolDocument) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === doc.id
          ? {
              ...d,
              status: 'verified',
              verifiedAt: new Date().toLocaleString(),
              verifiedBy: user?.name || 'Operations Officer',
            }
          : d
      )
    );

    // Update school pending count
    setAssignedSchools((prev) =>
      prev.map((s) =>
        s.id === doc.schoolId
          ? { ...s, pendingDocs: Math.max(0, s.pendingDocs - 1) }
          : s
      )
    );

    setToastMessage(`Document "${doc.title}" verified and approved successfully! Audit log generated.`);
    setTimeout(() => setToastMessage(null), 4000);
    if (previewDoc?.id === doc.id) {
      setPreviewDoc((prev) => (prev ? { ...prev, status: 'verified' } : null));
    }
  };

  const handleRejectDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalDoc) return;

    if (!rejectionInput.trim()) {
      alert('Please provide a specific reason for rejection.');
      return;
    }

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === rejectionModalDoc.id
          ? {
              ...d,
              status: 'rejected',
              rejectionReason: rejectionInput,
              verifiedAt: new Date().toLocaleString(),
              verifiedBy: user?.name || 'Operations Officer',
            }
          : d
      )
    );

    // Update school pending count
    setAssignedSchools((prev) =>
      prev.map((s) =>
        s.id === rejectionModalDoc.schoolId
          ? { ...s, pendingDocs: Math.max(0, s.pendingDocs - 1) }
          : s
      )
    );

    setToastMessage(`Document rejected. Re-upload request sent to school administration.`);
    setTimeout(() => setToastMessage(null), 4000);
    setRejectionModalDoc(null);
    setRejectionInput('');
    if (previewDoc?.id === rejectionModalDoc.id) {
      setPreviewDoc((prev) => (prev ? { ...prev, status: 'rejected', rejectionReason: rejectionInput } : null));
    }
  };

  const totalPending = assignedSchools.reduce((acc, curr) => acc + curr.pendingDocs, 0);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Operations Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as Operations Staff: <strong>{user?.name}</strong>. Cross-school document verification & compliance audit.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
          Role: Operations Staff (Scoped by School Assignment)
        </span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-semibold text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-100 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Schools</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{assignedSchools.length} Institutions</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Verifications</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{totalPending} Documents</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified This Session</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {documents.filter((d) => d.status === 'verified').length} Records
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Verification Queue (List of assigned schools) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Verification Queue (Assigned Schools Only)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click "Open Audit Queue" on any school to inspect and verify compliance documents.</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Strict Tenant Assignment Enforced
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {assignedSchools.map((school) => (
            <div key={school.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{school.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-semibold text-slate-400">{school.code}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">Board Affiliated Campus</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {school.pendingDocs > 0 ? (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {school.pendingDocs} Pending Verifications
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    All Verified
                  </span>
                )}
                <button
                  onClick={() => setActiveSchool(school)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition active:scale-95"
                >
                  Open Audit Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: School Audit Queue Modal */}
      {activeSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                    {activeSchool.code}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">{activeSchool.name}</h3>
                <p className="text-xs text-slate-500">Official statutory compliance documents awaiting operations approval.</p>
              </div>
              <button
                onClick={() => setActiveSchool(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document List Table */}
            {activeSchoolDocs.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-700">No pending documents for this school.</p>
                <p className="text-xs text-slate-400">All compliance submissions have been verified and approved.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Issuing Authority</th>
                      <th className="py-3 px-4">Validity / Number</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {activeSchoolDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">{doc.title}</p>
                              <p className="text-[10px] text-slate-400">
                                {doc.fileSize} • Submitted by {doc.submittedBy}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          {doc.issuingAuthority}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-900 font-bold">{doc.docNumber}</div>
                          <div className="text-[10px] text-slate-400">Exp: {doc.validUntil}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {doc.status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="h-3 w-3" /> Verified
                            </span>
                          ) : doc.status === 'rejected' ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="h-3 w-3" /> Rejected
                              </span>
                              {doc.rejectionReason && (
                                <p className="text-[10px] text-rose-600 mt-1 max-w-[200px] truncate" title={doc.rejectionReason}>
                                  {doc.rejectionReason}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="h-3 w-3" /> Pending Review
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>

                            {doc.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproveDocument(doc)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Verify
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectionModalDoc(doc);
                                    setRejectionInput('');
                                  }}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                All approval actions write append-only records to platform audit_logs.
              </span>
              <button
                onClick={() => setActiveSchool(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Done / Back to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Document Viewer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Official Document Viewer
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-400">Reference: {previewDoc.docNumber}</p>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Realistic Document Paper Snapshot */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-200">
                <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">GOVERNMENT COMPLIANCE RECORD</div>
                <h4 className="text-base font-extrabold text-slate-800 mt-1">{previewDoc.issuingAuthority}</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Certificate Identifier: {previewDoc.docNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Issued To</span>
                  <strong className="text-slate-900 text-xs">Rithik Matriculation Higher Secondary School</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Validity Period</span>
                  <strong className="text-slate-900 text-xs">Valid until {previewDoc.validUntil}</strong>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed text-[11px]">
                <strong>Compliance Declaration:</strong> This institution has submitted proof of statutory verification. The documents have been reviewed for legal authority, expiration limits, building safety, and sanitation criteria as mandated by the Directorate of School Education.
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 text-slate-400">
                <span>File Size: {previewDoc.fileSize}</span>
                <span className="font-mono text-[10px]">SHA256: d8f1a7b...99e4</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close Viewer
              </button>
              <div className="flex items-center gap-2">
                {previewDoc.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setRejectionModalDoc(previewDoc);
                        setRejectionInput('');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100"
                    >
                      Reject Document
                    </button>
                    <button
                      onClick={() => handleApproveDocument(previewDoc)}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      Verify & Approve
                    </button>
                  </>
                )}
                {previewDoc.status === 'verified' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Rejection Reason Dialog */}
      {rejectionModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Reject Compliance Document
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{rejectionModalDoc.title}</p>
              </div>
              <button onClick={() => setRejectionModalDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRejectDocument} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Certificate validity has expired or the issuing seal is illegible. Please re-upload the latest renewed copy."
                  value={rejectionInput}
                  onChange={(e) => setRejectionInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  This note will be logged in the audit trail and displayed to the school administrator.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectionModalDoc(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
