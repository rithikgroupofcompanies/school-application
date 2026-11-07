import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Search,
  Filter,
  Send,
  CheckCircle2,
  X
} from 'lucide-react';

interface NoticeItem {
  id: number;
  title: string;
  category: 'circular' | 'event' | 'holiday' | 'urgent';
  targetAudience: 'All Campuses' | 'Grade 10 Only' | 'Staff Only' | 'Parents Only';
  publishedAt: string;
  author: string;
  content: string;
  channels: Array<'in_app' | 'email' | 'sms'>;
  status: 'active' | 'scheduled' | 'archived';
}

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: 'Quarterly Parent-Teacher Conference (PTC) Schedule',
    category: 'event',
    targetAudience: 'Parents Only',
    publishedAt: '2026-10-24',
    author: 'Campus Principal',
    content: 'The first term parent-teacher meeting is scheduled for Saturday, October 31st from 09:00 AM to 01:00 PM. Individual progress cards will be reviewed.',
    channels: ['in_app', 'email'],
    status: 'active',
  },
  {
    id: 2,
    title: 'Deepavali Festival Holiday Announcement',
    category: 'holiday',
    targetAudience: 'All Campuses',
    publishedAt: '2026-10-22',
    author: 'Rithik Group Central Office',
    content: 'All institutions under Rithik Group of Companies will remain closed from November 1st to November 4th on account of Deepavali. Classes resume on November 5th.',
    channels: ['in_app', 'email', 'sms'],
    status: 'active',
  },
  {
    id: 3,
    title: 'Inter-School Science & Robotics Fair 2026',
    category: 'circular',
    targetAudience: 'Grade 10 Only',
    publishedAt: '2026-10-20',
    author: 'Science Department Head',
    content: 'Registrations are open for the Annual Inter-School Science Fair. Interested students from Grade 9 to 12 should submit project abstracts by Friday.',
    channels: ['in_app'],
    status: 'active',
  },
];

export const AnnouncementsNotificationHub: React.FC = () => {
  const { activeSchool } = useAuth();
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'circular' as NoticeItem['category'],
    targetAudience: 'All Campuses' as NoticeItem['targetAudience'],
    content: '',
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const created: NoticeItem = {
      id: notices.length + 1,
      title: newNotice.title,
      category: newNotice.category,
      targetAudience: newNotice.targetAudience,
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'School Administration',
      content: newNotice.content,
      channels: ['in_app', 'email'],
      status: 'active',
    };

    setNotices([created, ...notices]);
    setIsModalOpen(false);
  };

  const filtered = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Multi-Channel Broadcast Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Announcements & School Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Broadcast official circulars, event invites, and emergency notices to parents, students, and faculty across {activeSchool?.name || 'Rithik Group campuses'}.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          Broadcast New Circular
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search circulars by subject, keyword..."
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-medium focus:border-indigo-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 focus:outline-none font-bold"
          >
            <option value="all">All Notice Types</option>
            <option value="circular">Academic Circulars</option>
            <option value="event">Campus Events & PTC</option>
            <option value="holiday">Holiday Declarations</option>
            <option value="urgent">Urgent Alerts</option>
          </select>
        </div>
      </div>

      {/* Notices Stream */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-200 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  item.category === 'holiday'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : item.category === 'event'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {item.category}
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  Target: {item.targetAudience}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Published: {item.publishedAt} by {item.author}
              </span>
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span>Delivered via:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">In-App Notification</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Email Notification</span>
              </div>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Broadcast Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Broadcast Circular */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Campus Circular</h3>
                <p className="text-xs text-slate-500 mt-0.5">Broadcast targeted announcements to users.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Annual Sports Meet 2026 Announcement"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="circular">Academic Circular</option>
                    <option value="event">Campus Event</option>
                    <option value="holiday">Holiday Notice</option>
                    <option value="urgent">Urgent Notice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                  >
                    <option>All Campuses</option>
                    <option>Grade 10 Only</option>
                    <option>Staff Only</option>
                    <option>Parents Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  placeholder="Official announcement text..."
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 focus:border-indigo-600 focus:outline-none"
                />
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
                  className="px-5 py-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
