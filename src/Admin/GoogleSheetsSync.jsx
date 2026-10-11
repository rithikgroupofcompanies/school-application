import React, { useState, useEffect } from 'react';
import { Table, RefreshCw, ExternalLink, Download, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

export default function GoogleSheetsSync() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [sheetsData, setSheetsData] = useState(null);
  const [importRows, setImportRows] = useState('');
  const [importing, setImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSyncStatus();
    fetchExportData();
  }, []);

  const fetchSyncStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sheets/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncStatus(data.sync);
        setSpreadsheetUrl(data.sync.spreadsheet_url || '');
      }
    } catch (err) {
      toast.error('Failed to load Google Sheets sync status');
    } finally {
      setLoading(false);
    }
  };

  const fetchExportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sheets/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSheetsData(data.data);
      }
    } catch (err) {
      console.warn('Export fetch warning:', err);
    }
  };

  const handleTriggerSync = async () => {
    setSyncing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sheets/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Google Sheets synchronized successfully!');
        fetchSyncStatus();
        fetchExportData();
      } else {
        toast.error(data.message || 'Sync failed');
      }
    } catch (err) {
      toast.error('Network error during Google Sheets sync');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectSheet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sheets/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ spreadsheetUrl })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Spreadsheet URL updated!');
        fetchSyncStatus();
      } else {
        toast.error(data.message || 'Failed to update spreadsheet');
      }
    } catch (err) {
      toast.error('Network error connecting spreadsheet');
    }
  };

  const handleBulkImport = async () => {
    if (!importRows.trim()) {
      toast.error('Please paste spreadsheet data to import');
      return;
    }

    setImporting(true);
    try {
      // Parse tab-delimited or comma-delimited lines
      const lines = importRows.trim().split('\n');
      const parsedRows = lines.map((line, idx) => {
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        return {
          name: parts[0]?.trim(),
          email: parts[1]?.trim(),
          className: parts[2]?.trim() || 'Class 10',
          section: parts[3]?.trim() || 'A',
          rollNumber: parts[4]?.trim() || `${idx + 1}`
        };
      }).filter(r => r.name);

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/sheets/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rows: parsedRows })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setImportRows('');
        fetchExportData();
      } else {
        toast.error(data.message || 'Import failed');
      }
    } catch (err) {
      toast.error('Error importing rows');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-full py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4" /> Non-Technical Admin Portal
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Google Sheets 2-Way Sync</h1>
            <p className="text-sm text-gray-500 mt-1">
              Access and manage all school records directly through familiar Google Spreadsheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold shadow-md transition-all ${
                syncing ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-95'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronizing...' : 'Sync to Google Sheets'}
            </button>

            {spreadsheetUrl && (
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 hover:shadow transition-all"
              >
                <ExternalLink className="w-4 h-4 text-emerald-600" />
                Open Google Sheets
              </a>
            )}
          </div>
        </div>

        {/* Sync Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sync Status</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xl font-bold text-gray-900 capitalize">{syncStatus?.status || 'Active'}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Last synced: {syncStatus?.last_synced_at ? new Date(syncStatus.last_synced_at).toLocaleTimeString() : 'Just now'}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Students Tab</span>
            <div className="text-2xl font-black text-gray-900 mt-2">
              {sheetsData?.tabs?.Students_Directory?.rows?.length || 0} Records
            </div>
            <p className="text-xs text-gray-500 mt-2">Tab: Students_Directory</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance Tab</span>
            <div className="text-2xl font-black text-gray-900 mt-2">
              {sheetsData?.tabs?.Daily_Attendance?.rows?.length || 0} Logs
            </div>
            <p className="text-xs text-gray-500 mt-2">Tab: Daily_Attendance</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Marksheets Tab</span>
            <div className="text-2xl font-black text-gray-900 mt-2">
              {sheetsData?.tabs?.Exams_Marksheets?.rows?.length || 0} Scores
            </div>
            <p className="text-xs text-gray-500 mt-2">Tab: Exams_Marksheets</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Spreadsheet Tabs Overview
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all ${
              activeTab === 'import' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Bulk Import from Sheets
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all ${
              activeTab === 'settings' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Connect Spreadsheet URL
          </button>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-lg">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Live Preview: Students_Directory Tab (First 5 Rows)
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-emerald-50/70 text-emerald-900 font-semibold">
                    <tr>
                      {sheetsData?.tabs?.Students_Directory?.headers?.map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {sheetsData?.tabs?.Students_Directory?.rows?.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-gray-700 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                    {(!sheetsData?.tabs?.Students_Directory?.rows || sheetsData.tabs.Students_Directory.rows.length === 0) && (
                      <tr>
                        <td colSpan="9" className="px-4 py-8 text-center text-gray-400">
                          No students in registry yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Import Tab Content */}
        {activeTab === 'import' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-lg space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Import from Google Sheets</h2>
              <p className="text-sm text-gray-500 mt-1">
                Copy rows from your Google Spreadsheet and paste them below. Expected columns:
                <code className="ml-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Full Name, Email, Class, Section, Roll No</code>
              </p>
            </div>

            <textarea
              rows="6"
              value={importRows}
              onChange={(e) => setImportRows(e.target.value)}
              placeholder="Aarav Sharma	aarav@school.edu	Class 10	A	10A01
Diya Patel	diya@school.edu	Class 10	A	10A02"
              className="w-full p-4 rounded-2xl border-2 border-gray-200 font-mono text-sm focus:border-emerald-500 outline-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleBulkImport}
                disabled={importing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition-all"
              >
                <Upload className="w-4 h-4" />
                {importing ? 'Validating & Importing...' : 'Import Rows into Database'}
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-lg space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Google Spreadsheet Connection</h2>
            <form onSubmit={handleConnectSheet} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Google Spreadsheet URL</label>
                <input
                  type="url"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/your-spreadsheet-id/edit"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share this spreadsheet with edit access so non-technical school admins can modify records.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition-all"
              >
                Save Spreadsheet Connection
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
