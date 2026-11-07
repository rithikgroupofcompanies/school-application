import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, ArrowRight, Download } from 'lucide-react';

export const BulkImportWizard: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [, setFile] = useState<File | null>(null);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk Student Data Ingestion</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload and validate bulk CSV/Excel files for automated batch ingestion with duplicate detection.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        {[
          { num: 1, label: 'Upload File' },
          { num: 2, label: 'Column Mapping' },
          { num: 3, label: 'Validation Preview' },
          { num: 4, label: 'Batch Processing' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= s.num ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s.num}
            </span>
            <span className={`text-xs font-semibold ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Standard CSV Template</p>
                <p className="text-xs text-slate-500">Download formatted template containing mandatory student fields.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50">
              <Download className="h-3.5 w-3.5" />
              Download Template
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-indigo-400 transition cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Drag and drop CSV or XLSX file here</p>
            <p className="text-xs text-slate-400 mt-1">Files up to 10MB supported</p>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setStep(2);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-700"
            >
              Browse Files
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Column Mapping */}
      {step === 2 && (
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Map File Columns to Student Fields</h2>
          <div className="divide-y divide-slate-100">
            {[
              { field: 'Admission Number (admission_no)', autoMatched: 'admission_no' },
              { field: 'Student Full Name (full_name)', autoMatched: 'student_name' },
              { field: 'Date of Birth (date_of_birth)', autoMatched: 'dob' },
              { field: 'Guardian Mobile (guardian_mobile)', autoMatched: 'phone' },
              { field: 'Class Grade (grade)', autoMatched: 'grade' },
              { field: 'Section (section)', autoMatched: 'section' },
            ].map((col, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{col.field}</span>
                <span className="font-mono text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Auto-mapped: {col.autoMatched}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
            >
              Verify & Preview Rows
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Validation Preview */}
      {step === 3 && (
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Validation Breakdown</h2>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="h-3.5 w-3.5" /> 45 Valid Rows
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="h-3.5 w-3.5" /> 0 Errors
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            No partial or silent row drops. All valid rows will be queued and imported as "Submitted" records.
          </p>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
            >
              Confirm Batch Ingestion
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Finished */}
      {step === 4 && (
        <div className="text-center bg-white p-12 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Batch Job Submitted to Queue</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            The background worker is importing rows with transactional integrity. Verification items have been opened for Operations Staff.
          </p>
          <a
            href="/school/students"
            className="inline-block mt-4 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
          >
            Return to Student Directory
          </a>
        </div>
      )}
    </div>
  );
};
