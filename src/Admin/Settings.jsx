import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Shield, Database, Save, RefreshCw, Key, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

export default function Settings() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';

  // State
  const [settings, setSettings] = useState({
    whatsappApiKey: '',
    jwtSecret: '',
    schoolName: '',
    academicYear: '',
    lastBackup: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) return;
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/system/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSettings(data.settings);
      } else {
        toast.error(data.message || 'Failed to fetch settings');
      }
    } catch (error) {
      toast.error('Network error loading settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/system/settings/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message || 'Settings updated successfully!');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Network error updating settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/backup`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message);
        fetchSettings();
      } else {
        toast.error(data.message || 'Backup failed');
      }
    } catch (error) {
      toast.error('Network error during backup');
      console.error(error);
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('WARNING: This will reset all current in-memory tables (Attendance, Homework, etc.) to the stable database snapshot. Proceed?')) return;
    setRestoring(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/restore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message);
        fetchSettings();
      } else {
        toast.error(data.message || 'Restore failed');
      }
    } catch (error) {
      toast.error('Network error during restore');
      console.error(error);
    } finally {
      setRestoring(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl max-w-md text-center space-y-4">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full inline-block">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Only Super Admin accounts have permission to configure system variables, API secrets and restore snapshots.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl text-white shadow-lg shadow-slate-700/15">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Configure API credentials, backup schedules, and global database rolls.</p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
            Loading settings configurations...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* API Settings Form */}
            <div className="lg:col-span-7 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-700">
                <h2 className="font-bold text-lg flex items-center gap-1.5">
                  <Key className="w-5 h-5" /> Config Credentials
                </h2>
              </div>
              
              <form onSubmit={handleUpdateSettings} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={settings.schoolName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-800 text-sm font-semibold transition-all text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academic Year</label>
                    <input
                      type="text"
                      name="academicYear"
                      required
                      value={settings.academicYear}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-800 text-sm font-semibold transition-all text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Twilio API Token</label>
                  <input
                    type="text"
                    name="whatsappApiKey"
                    required
                    value={settings.whatsappApiKey}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-800 text-sm font-mono transition-all text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">JWT Encryption Secret Key</label>
                  <input
                    type="password"
                    name="jwtSecret"
                    required
                    value={settings.jwtSecret}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-100 focus:border-slate-800 text-sm font-mono transition-all text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-xs ml-auto"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Updating...' : 'Save Configuration'}
                </button>
              </form>
            </div>

            {/* Backups Snapshot & Maintenance */}
            <div className="lg:col-span-5 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100 p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Database className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-lg">System Backups</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Roll back schemas to stable snapshots or export current cluster states to JSON documents.
              </p>

              {settings.lastBackup && (
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-2 items-center text-xs">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-bold block text-slate-800">Snapshot Status</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Last created on {settings.lastBackup}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleBackup}
                  disabled={backingUp}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 transition flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <RefreshCw className={`w-4 h-4 text-slate-500 ${backingUp ? 'animate-spin' : ''}`} />
                  {backingUp ? 'Backing Up...' : 'Create Backup Snapshot'}
                </button>

                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-xs text-rose-600 transition flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <Shield className="w-4 h-4 text-rose-500" />
                  {restoring ? 'Restoring...' : 'Rollback to Stable'}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
