import React, { useState, useEffect } from 'react';
import { 
  Table, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight,
  Copy,
  Check,
  Search,
  Sparkles,
  Info,
  Calendar,
  Users,
  Clock,
  BarChart2,
  BookOpen
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../config';

const DEFAULT_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1EOaG3KmoT1K9hYoBABKVTWZLjVB_RnExt6MQ1LLpodQ/edit?usp=sharing";

export default function GoogleSheetsSync() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(DEFAULT_SPREADSHEET_URL);
  const [sheetsData, setSheetsData] = useState(null);
  const [activeTab, setActiveTab] = useState('Students_Directory');
  const [copiedTab, setCopiedTab] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [importRows, setImportRows] = useState('');
  const [importing, setImporting] = useState(false);

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
        if (data.sync.spreadsheet_url) {
          setSpreadsheetUrl(data.sync.spreadsheet_url);
        }
      }
    } catch (err) {
      console.warn('Sync status warning:', err);
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
        toast.success(data.message || 'Google Sheets sync cycle completed!');
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
        toast.success(data.message || 'Google Spreadsheet connected!');
        fetchSyncStatus();
      } else {
        toast.error(data.message || 'Failed to update spreadsheet connection');
      }
    } catch (err) {
      toast.error('Network error connecting spreadsheet');
    }
  };

  // Copy active tab table formatted as TSV for direct paste into Google Sheets
  const handleCopyForSheets = () => {
    const currentTabData = sheetsData?.tabs?.[activeTab];
    if (!currentTabData) return;

    const tsvContent = [
      currentTabData.headers.join('\t'),
      ...currentTabData.rows.map(r => r.join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedTab(true);
      toast.success(`Copied "${activeTab}" to clipboard! Paste directly into Google Sheets (CTRL+V).`);
      setTimeout(() => setCopiedTab(false), 2500);
    });
  };

  // Download active tab as CSV
  const handleDownloadCsv = () => {
    const currentTabData = sheetsData?.tabs?.[activeTab];
    if (!currentTabData) return;

    const csvContent = [
      currentTabData.headers.map(h => `"${h}"`).join(','),
      ...currentTabData.rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeTab}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importRows.trim()) {
      toast.error('Please paste data rows from Google Sheets');
      return;
    }

    setImporting(true);
    try {
      const token = localStorage.getItem('token');
      const lines = importRows.trim().split('\n');
      const rows = lines.map(line => line.split(line.includes('\t') ? '\t' : ',').map(c => c.trim().replace(/^"|"$/g, '')));

      const res = await fetch(`${API_URL}/api/sheets/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tabName: activeTab,
          headers: rows[0] || [],
          rows: rows.slice(1)
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Imported rows successfully!');
        setImportRows('');
        fetchExportData();
      } else {
        toast.error(data.message || 'Import error occurred');
      }
    } catch (err) {
      toast.error('Network error during import');
    } finally {
      setImporting(false);
    }
  };

  const currentTabInfo = sheetsData?.tabs?.[activeTab];
  const filteredRows = (currentTabInfo?.rows || []).filter(row => 
    row.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner: Master Google Sheet Connection */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileSpreadsheet className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">Google Sheets Live Synchronization</h2>
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE LINKED
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Non-technical school administrators can read and manage all student, staff, and timetable records via Google Sheets.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Connected Sheet URL:</span>
              <a 
                href={spreadsheetUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline truncate max-w-md flex items-center gap-1"
              >
                <span>{spreadsheetUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Sheets</span>
            </a>

            <button
              onClick={handleTriggerSync}
              disabled={syncing}
              className={`px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-all ${
                syncing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{syncing ? 'Synchronizing...' : 'Sync Now'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sync Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white">Active & Healthy</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>● Two-way synchronization ready</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synced Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {sheetsData?.tabs?.Students_Directory?.rows?.length || 0} Records
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Class 8 to 12 enrolled</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Staff</span>
            <ShieldCheck className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {sheetsData?.tabs?.Staff_Directory?.rows?.length || 0} Members
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Teachers & class admins</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sheet Tabs</span>
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {sheetsData?.tabs ? Object.keys(sheetsData.tabs).length : 5} Tabs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-sheet structure</div>
        </div>

      </div>

      {/* Main Tabbed Spreadsheet Preview & Management Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Navigation Tabs Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'Students_Directory', label: 'Students Directory', icon: Users, count: sheetsData?.tabs?.Students_Directory?.rows?.length },
              { id: 'Staff_Directory', label: 'Staff & Faculty', icon: ShieldCheck, count: sheetsData?.tabs?.Staff_Directory?.rows?.length },
              { id: 'Daily_Attendance', label: 'Daily Attendance', icon: Calendar, count: sheetsData?.tabs?.Daily_Attendance?.rows?.length },
              { id: 'Exams_Marksheets', label: 'Exams & Marks', icon: BarChart2, count: sheetsData?.tabs?.Exams_Marksheets?.rows?.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Copy and Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyForSheets}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Copy tab as TSV so you can paste directly into Google Sheets (CTRL+V)"
            >
              {copiedTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedTab ? 'Copied to Clipboard!' : 'Copy for Google Sheets'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Download as CSV file"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </button>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/60">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${activeTab.replace(/_/g, ' ')}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredRows.length}</span> of {currentTabInfo?.rows?.length || 0} rows
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {currentTabInfo ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  {currentTabInfo.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 font-bold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 text-slate-300 whitespace-nowrap">
                          {String(cell || '—')}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentTabInfo.headers.length} className="px-6 py-12 text-center text-slate-500">
                      No records match the current filter or data is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400 mb-2" />
              <span>Loading spreadsheet tab preview...</span>
            </div>
          )}
        </div>

      </div>

      {/* Two Column Configuration & Bulk Import Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Spreadsheet Connection Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Update Google Spreadsheet URL</h3>
              <p className="text-xs text-slate-400">Change or re-point the synchronized spreadsheet document</p>
            </div>
          </div>

          <form onSubmit={handleConnectSheet} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Google Sheets Document Link
              </label>
              <input
                type="url"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                required
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <span>Save & Connect Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Bulk Paste & Import from Google Sheets */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Paste & Bulk Import from Sheets</h3>
              <p className="text-xs text-slate-400">Copy rows directly from Google Sheet and paste below</p>
            </div>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div>
              <textarea
                rows={3}
                value={importRows}
                onChange={(e) => setImportRows(e.target.value)}
                placeholder="Paste tab-separated or comma-separated rows here directly from Google Sheets..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={importing}
              className={`px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors ${
                importing ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{importing ? 'Importing Data...' : `Import into ${activeTab.replace(/_/g, ' ')}`}</span>
            </button>
          </form>
        </div>

      </div>

      <ToastContainer position="bottom-right" theme="dark" />
    </div>
  );
}
