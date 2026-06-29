import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Globe, Users, Clock, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WhatsApp() {
  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = loggedInUser.role === 'super_admin';
  const isClassAdmin = loggedInUser.role === 'admin';

  // State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Form states
  const [targetType, setTargetType] = useState('class'); // 'class' or 'school'
  const [selectedClass, setSelectedClass] = useState(isClassAdmin ? loggedInUser.className : 'Class 8');
  const [selectedSection, setSelectedSection] = useState(isClassAdmin ? loggedInUser.section : 'A');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/whatsapp/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      toast.error('Failed to load WhatsApp queue logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const isBroadcast = isSuperAdmin && targetType === 'school';
      const endpoint = isBroadcast 
        ? 'http://localhost:3000/api/whatsapp/broadcast' 
        : 'http://localhost:3000/api/whatsapp/class-alert';

      const payload = isBroadcast 
        ? { text: messageText } 
        : { className: selectedClass, section: selectedSection, text: messageText };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message || 'WhatsApp alert dispatched!');
        setMessageText('');
        fetchLogs();
      } else {
        toast.error(data.message || 'Failed to send alert');
      }
    } catch (error) {
      toast.error('Network error sending message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-500/10">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">WhatsApp Notification Portal</h1>
            <p className="text-sm text-slate-500 mt-0.5">Dispatch real-time announcements to parents and student contacts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispatch Box */}
          <div className="lg:col-span-5 bg-white shadow-xl rounded-3xl overflow-hidden border border-slate-100 animate-fade-in-up">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 text-white">
              <h2 className="font-bold text-lg flex items-center gap-1.5">
                <Send className="w-5 h-5" /> Dispatch Alert
              </h2>
            </div>
            
            <form onSubmit={handleSendMessage} className="p-6 space-y-5">
              
              {/* Super Admin scope select */}
              {isSuperAdmin && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scope</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTargetType('class')}
                      className={`py-2 text-center text-xs font-bold rounded-lg transition ${targetType === 'class' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500'}`}
                    >
                      Class Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('school')}
                      className={`py-2 text-center text-xs font-bold rounded-lg transition ${targetType === 'school' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500'}`}
                    >
                      School Broadcast
                    </button>
                  </div>
                </div>
              )}

              {/* Class target selectors (not visible if Super Admin chooses school broadcast) */}
              {(targetType === 'class' || isClassAdmin) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Class</label>
                    <select
                      name="className"
                      required
                      disabled={isClassAdmin}
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i+1} value={`Class ${i + 1}`}>Class {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Section</label>
                    <select
                      name="section"
                      required
                      disabled={isClassAdmin}
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm font-semibold transition-all text-slate-700 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {['A', 'B', 'C', 'D'].map(sec => (
                        <option key={sec} value={sec}>Section {sec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Alert Scope display */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-2.5 items-center text-slate-600">
                {isSuperAdmin && targetType === 'school' ? (
                  <>
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <div>
                      <span className="text-xs font-bold block text-slate-800">School-Wide Broadcast</span>
                      <span className="text-[10px] text-slate-400">Targeting approximately 450 active parent & student contacts.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold block text-slate-800">Class Alert ({selectedClass}-{selectedSection})</span>
                      <span className="text-[10px] text-slate-400">Targeting 35 contact channels of the student roster.</span>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Body</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter message body (emergency notifications, exam schedules, class warnings)..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-sm font-semibold transition-all text-slate-700"
                />
              </div>

              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Dispatching...' : 'Dispatch Message'}
              </button>
            </form>
          </div>

          {/* Queue log */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-700 px-1">Twilio API Gateway Queue Logs</h3>
            
            {loading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 font-semibold shadow-md">
                No active broadcast records.
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {logs.map(log => (
                  <div key={log.id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-md flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{log.sender}</span>
                        <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {log.scope}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50/50 border border-slate-100 p-3 rounded-2xl leading-relaxed italic whitespace-pre-wrap">
                        "{log.text}"
                      </p>
                      <span className="text-[10px] text-slate-400 font-bold font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Dispatched on {log.date || 'Today'}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold block">{log.recipients} Channels</span>
                      <span className="inline-flex items-center gap-0.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-extrabold font-mono mt-1 uppercase">
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}
