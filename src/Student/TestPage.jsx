import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ClipboardList,
  Clock,
  Timer,
  Activity,
  CalendarDays,
  BookOpen,
  FlaskConical,
  Microscope,
  Calculator,
  Atom,
  BookMarked,
} from 'lucide-react';

const SUBJECT_ICONS = {
  Chemistry:   <FlaskConical size={20} />,
  Biology:     <Microscope size={20} />,
  Mathematics: <Calculator size={20} />,
  Physics:     <Atom size={20} />,
  English:     <BookMarked size={20} />,
};

function TestPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingTests = [
    {
      id: 1,
      subject: 'Chemistry',
      title: 'Periodic Table Test',
      date: '2026-02-18',
      time: '10:00 AM',
      duration: '1 hour',
      totalMarks: 100,
      priority: 'high',
      syllabus: 'Chemistry Module 1-3',
      status: 'upcoming',
    },
    {
      id: 2,
      subject: 'Biology',
      title: 'Unit Test',
      date: '2026-02-22',
      time: '2:00 PM',
      duration: '1.5 hours',
      totalMarks: 100,
      priority: 'high',
      syllabus: 'Biology Module 2-4',
      status: 'upcoming',
    },
    {
      id: 3,
      subject: 'Mathematics',
      title: 'Algebra Test',
      date: '2026-02-25',
      time: '11:00 AM',
      duration: '1 hour',
      totalMarks: 80,
      priority: 'normal',
      syllabus: 'Math Module 5-7',
      status: 'upcoming',
    },
    {
      id: 4,
      subject: 'Physics',
      title: 'Mid-term Exam',
      date: '2026-02-20',
      time: '9:00 AM',
      duration: '2 hours',
      totalMarks: 150,
      priority: 'high',
      syllabus: 'Physics Module 1-5',
      status: 'upcoming',
    },
    {
      id: 5,
      subject: 'English',
      title: 'Literature Test',
      date: '2026-03-01',
      time: '1:00 PM',
      duration: '1.5 hours',
      totalMarks: 100,
      priority: 'normal',
      syllabus: 'English Module 3-6',
      status: 'upcoming',
    },
  ];

  const filteredTests = upcomingTests.filter((test) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high') return test.priority === 'high';
    if (selectedFilter === 'normal') return test.priority === 'normal';
    return true;
  });

  const sortedTests = [...filteredTests].sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const daysUntil = (dateString) =>
    Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-page-1), var(--color-bg-page-2))' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center gap-3 border-b px-5 py-4 shadow-lg"
        style={{
          background: 'linear-gradient(90deg, var(--color-primary-darker), var(--color-primary-dark))',
          borderColor: 'var(--color-accent)',
          borderBottomWidth: '3px',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-text-primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
          >
            <ClipboardList size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
              Upcoming Tests
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              {sortedTests.length} tests scheduled
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-6 md:px-6 md:py-6 sm:px-4 sm:py-4">
        {/* Filter Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            All Tests
          </h2>
          <div className="flex gap-2">
            {['all', 'high', 'normal'].map((filter) => {
              const isActive = selectedFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-300"
                  style={
                    isActive
                      ? {
                          background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
                          color: 'var(--color-accent)',
                          border: '1.5px solid var(--color-accent)',
                          boxShadow: '0 2px 8px var(--color-shadow-accent-md)',
                        }
                      : {
                          background: 'var(--color-bg-card)',
                          color: 'var(--color-text-muted)',
                          border: '1.5px solid var(--color-border)',
                        }
                  }
                >
                  {filter === 'all' ? 'All' : filter === 'high' ? 'High Priority' : 'Normal'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tests List */}
        <div className="space-y-3">
          {sortedTests.map((test) => (
            <div
              key={test.id}
              className="group rounded-xl px-5 py-4 transition-all duration-300 cursor-pointer"
              style={{
                background: 'var(--color-bg-card)',
                border: `1.5px solid ${test.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderLeft: test.priority === 'high' ? '4px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                boxShadow: '0 2px 10px var(--color-shadow-card-sm)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 6px 20px var(--color-shadow-accent-sm)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-card-sm)';
                e.currentTarget.style.borderColor = test.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)';
              }}
            >
              {/* Top Row */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}
                  >
                    {SUBJECT_ICONS[test.subject]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {test.title}
                    </div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                      {test.subject}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {test.priority === 'high' && (
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: 'rgba(232, 180, 79, 0.1)',
                        color: 'var(--color-accent)',
                        border: '1px solid rgba(232, 180, 79, 0.3)',
                      }}
                    >
                      URGENT
                    </span>
                  )}
                  <div
                    className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
                    style={{
                      background: 'var(--color-accent)',
                      color: 'var(--color-primary-darker)',
                      boxShadow: '0 2px 6px var(--color-shadow-accent-sm)',
                    }}
                  >
                    {formatDate(test.date)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: 'Time',      value: test.time,                      Icon: Clock,        accent: false },
                  { label: 'Duration',  value: test.duration,                  Icon: Timer,        accent: false },
                  { label: 'Marks',     value: test.totalMarks,                Icon: Activity,     accent: false },
                  { label: 'Days Left', value: `${daysUntil(test.date)} days`, Icon: CalendarDays, accent: true  },
                ].map(({ label, value, Icon, accent }) => (
                  <div
                    key={label}
                    className="rounded-lg px-3 py-2"
                    style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      <Icon size={10} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                    </div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Syllabus Row */}
              <div
                className="mt-3 rounded-lg px-3 py-2"
                style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}
              >
                <div className="flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  <BookOpen size={10} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Syllabus</span>
                </div>
                <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {test.syllabus}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedTests.length === 0 && (
          <div
            className="flex flex-col items-center rounded-2xl px-6 py-12 text-center"
            style={{
              background: 'var(--color-bg-card)',
              border: '2px solid var(--color-border)',
              boxShadow: '0 4px 16px var(--color-shadow-card)',
            }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: 'var(--color-bg-icon)', color: 'var(--color-text-muted)' }}
            >
              <ClipboardList size={24} />
            </div>
            <div className="mb-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              No tests found
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Try adjusting your filter
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TestPage;