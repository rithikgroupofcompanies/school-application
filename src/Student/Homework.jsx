import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpenCheck,
  Activity,
  CalendarDays,
  CheckCircle2,
  BookMarked,
  Landmark,
  Loader2,
  AlertCircle,
  PartyPopper,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Send,
  CheckCheck,
  Paperclip,
  Trash2,
  Eye,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE_URL = '/api';
const STUDENT_ID   = 'me';

// Detect touch capability once at module level (zero re-render cost)
const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// ─────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────
async function fetchHomework(studentId) {
  await new Promise((r) => setTimeout(r, 700));
  return {
    tasks: [
      { id: 1, subject: 'Mathematics', title: 'Math Worksheet',      dueDate: '2026-02-19', priority: 'high',   totalMarks: 50,  status: 'pending' },
      { id: 2, subject: 'Physics',     title: 'Numerical Problems',  dueDate: '2026-02-20', priority: 'high',   totalMarks: 40,  status: 'pending' },
      { id: 3, subject: 'English',     title: 'Essay Writing',       dueDate: '2026-02-21', priority: 'normal', totalMarks: 30,  status: 'pending' },
      { id: 4, subject: 'Chemistry',   title: 'Lab Report',          dueDate: '2026-02-22', priority: 'high',   totalMarks: 50,  status: 'pending' },
      { id: 5, subject: 'Biology',     title: 'Project Work',        dueDate: '2026-02-25', priority: 'normal', totalMarks: 100, status: 'pending' },
      { id: 6, subject: 'History',     title: 'Research Assignment', dueDate: '2026-02-24', priority: 'normal', totalMarks: 35,  status: 'pending' },
    ],
  };
}

async function submitHomework(studentId, taskId, { notes, photos }) {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    success: true,
    submissionId: `sub_${taskId}_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const daysRemaining = (dateString) =>
  Math.ceil((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));

const dueDateBadgeStyle = (daysLeft) => {
  if (daysLeft < 0)  return { background: '#ef4444', color: '#fff' };
  if (daysLeft <= 2) return { background: '#f97316', color: '#fff' };
  return { background: 'var(--color-accent)', color: 'var(--color-primary-darker)' };
};

const statusConfig = {
  pending:   { label: 'Pending',   color: 'var(--color-text-muted)' },
  submitted: { label: 'Submitted', color: '#4ade80' },
  graded:    { label: 'Graded',    color: 'var(--color-accent)' },
};

// ─────────────────────────────────────────────────────────────
// LOADING / ERROR / EMPTY STATES
// ─────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      <p className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>Loading homework…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
        <AlertCircle size={24} />
      </div>
      <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>Failed to load homework</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      <button onClick={onRetry} className="mt-2 rounded-lg px-4 py-2 text-xs font-bold"
        style={{ background: 'var(--color-bg-card)', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)' }}>
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl px-6 py-12 text-center"
      style={{ background: 'var(--color-bg-card)', border: '2px solid var(--color-border)', boxShadow: '0 4px 16px var(--color-shadow-card)' }}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'var(--color-bg-icon)', color: '#4ade80' }}>
        <PartyPopper size={24} />
      </div>
      <div className="mb-2 text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>No homework pending!</div>
      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Great job staying on top of assignments</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHOTO THUMBNAIL  (mobile-responsive)
// ─────────────────────────────────────────────────────────────
//
// Desktop  → action buttons appear on CSS hover  (group-hover)
// Mobile   → one tap reveals the overlay; second tap hides it
//            A small accent dot hints that actions are available
// ─────────────────────────────────────────────────────────────
function PhotoThumb({ photo, onRemove, onPreview }) {
  const [touched, setTouched] = useState(false);

  const handleTap = (e) => {
    if (!isTouchDevice) return;
    e.stopPropagation(); // don't trigger drop-zone click / file picker
    setTouched((v) => !v);
  };

  return (
    <div
      className="relative group flex-shrink-0"
      style={{ width: '100%', aspectRatio: '1 / 1' }}
      onClick={handleTap}
    >
      <img
        src={photo.preview}
        alt={photo.file.name}
        className="w-full h-full rounded-xl object-cover"
        style={{ border: '2px solid var(--color-border)' }}
       
        draggable={false}
      />

      <div
        className={[
          'absolute inset-0 rounded-xl flex items-center justify-center gap-1.5 transition-opacity',
          isTouchDevice
            ? touched ? 'opacity-100' : 'opacity-0'
            : 'opacity-0 group-hover:opacity-100',
        ].join(' ')}
        style={{
          background: 'rgba(0,0,0,0.55)',
          pointerEvents: isTouchDevice && !touched ? 'none' : 'auto',
        }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onPreview(photo); }}
          className="p-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
        >
          <Eye size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(photo.id); }}
          className="p-1.5 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.7)', color: '#fff' }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isTouchDevice && !touched && (
        <div
          className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full pointer-events-none"
          style={{ background: 'var(--color-accent)', boxShadow: '0 0 4px rgba(0,0,0,0.5)' }}
        />
      )}

      {/* File name beneath thumb */}
      <div
        className="absolute -bottom-5 left-0 right-0 text-center text-[9px] truncate pointer-events-none"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {photo.file.name}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBMIT SUCCESS BANNER
// ─────────────────────────────────────────────────────────────
function SuccessBanner({ submittedAt, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4 px-6 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid #4ade80' }}>
        <CheckCheck size={36} style={{ color: '#4ade80' }} />
        <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(74,222,128,0.2)' }} />
      </div>
      <div>
        <p className="text-base font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Homework Submitted!</p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Submitted at {new Date(submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <button onClick={onClose} className="mt-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)' }}>
        Done
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SUBMISSION MODAL
// ─────────────────────────────────────────────────────────────
function SubmitModal({ task, onClose, onSubmitted }) {
  const [photos, setPhotos]             = useState([]);
  const [notes, setNotes]               = useState('');
  const [dragging, setDragging]         = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState(null);
  const [successData, setSuccessData]   = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fileInputRef = useRef(null);
  const MAX_PHOTOS   = 10;
  const MAX_SIZE_MB  = 10;

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter((f) => {
      if (!f.type.startsWith('image/')) return false;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    const newPhotos = validFiles.map((f) => ({
      id: `${f.name}_${f.size}_${Date.now()}_${Math.random()}`,
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, MAX_PHOTOS));
  }, []);

  const removePhoto = useCallback((id) => {
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (photos.length === 0 && !notes.trim()) {
      setSubmitError('Please add at least one photo or some notes before submitting.');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await submitHomework(STUDENT_ID, task.id, { notes, photos });
      setSuccessData(result);
      onSubmitted(task.id);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(px)' }}
        onClick={!submitting ? onClose : undefined}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] flex flex-col rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
          border: '1.5px solid var(--color-accent)',
          borderBottom: 'none',
          maxHeight: '90vh',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
              <BookMarked size={18} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{task.title}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{task.subject} · Submit Homework</p>
            </div>
          </div>
          {!submitting && (
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-text-muted)' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ overscrollBehavior: 'contain' }}>
          {successData ? (
            <SuccessBanner submittedAt={successData.submittedAt} onClose={onClose} />
          ) : (
            <div className="flex flex-col gap-5">

              {/* ── PHOTO UPLOAD ZONE ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                    Photos <span style={{ color: 'var(--color-accent)' }}>({photos.length}/{MAX_PHOTOS})</span>
                  </label>
                  {photos.length < MAX_PHOTOS && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
                      style={{ background: 'rgba(232,180,79,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(232,180,79,0.3)' }}
                    >
                      <Paperclip size={11} /> Add Files
                    </button>
                  )}
                </div>

                {/*
                  Drop zone
                  — On desktop: drag & drop + click-to-browse works as before
                  — On mobile:  clicking the zone (when empty) opens file picker
                                clicking a photo toggles its action overlay
                                the drop zone itself doesn't intercept photo taps
                                because PhotoThumb calls e.stopPropagation()
                */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => photos.length < MAX_PHOTOS && photos.length === 0 && fileInputRef.current?.click()}
                  className="rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all"
                  style={{
                    border: `2px dashed ${dragging ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    background: dragging ? 'rgba(232,180,79,0.06)' : 'var(--color-bg-icon)',
                    minHeight: photos.length === 0 ? 110 : undefined,
                    cursor: photos.length === 0 ? 'pointer' : 'default',
                  }}
                >
                  {photos.length === 0 ? (
                    /* ── Empty state: big upload prompt ── */
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ background: 'var(--color-bg-card)', color: 'var(--color-accent)' }}>
                        <Upload size={20} />
                      </div>
                      <p className="text-xs font-semibold text-center" style={{ color: 'var(--color-text-muted)' }}>
                        {isTouchDevice
                          ? <>Tap to add photos</>
                          : <>Drag & drop photos here, or <span style={{ color: 'var(--color-accent)' }}>click to browse</span></>
                        }
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                        JPG, PNG, HEIC · Max {MAX_SIZE_MB}MB each · Up to {MAX_PHOTOS} photos
                      </p>
                    </>
                  ) : (
                    /* ── Filled state: responsive photo grid ── */
                    <>
                      {isTouchDevice && (
                        <p className="w-full text-[10px] mb-1" style={{ color: 'var(--color-text-muted)' }}>
                          Tap a photo to reveal edit options
                        </p>
                      )}
                      <div
                        className="pb-6 pt-1 w-full"
                        style={{
                          display: 'grid',
                          /*
                            auto-fill with a min of 72 px means:
                            ~4 cols on wide (≥320 px container)
                            ~3 cols on narrow phones
                            scales up gracefully on tablets/desktop
                          */
                          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                          gap: '10px',
                        }}
                      >
                        {photos.map((photo) => (
                          <PhotoThumb
                            key={photo.id}
                            photo={photo}
                            onRemove={removePhoto}
                            onPreview={setPreviewPhoto}
                          />
                        ))}

                        {/* "Add more" tile — same size as thumbs */}
                        {photos.length < MAX_PHOTOS && (
                          <div
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="flex items-center justify-center rounded-xl cursor-pointer transition-all"
                            style={{
                              aspectRatio: '1 / 1',
                              border: '2px dashed var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <ImageIcon size={18} />
                              <span className="text-[9px] font-bold">Add more</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {/* ── NOTES ── */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
                  Notes{' '}
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <FileText size={14} className="absolute top-3 left-3 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes, explanations, or questions for your teacher…"
                    rows={4}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: 'var(--color-bg-icon)',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      caretColor: 'var(--color-accent)',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                    onBlur={(e)  => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                  <span className="absolute bottom-2 right-3 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    {notes.length}/1000
                  </span>
                </div>
              </div>

              {/* Summary pill */}
              {(photos.length > 0 || notes.trim()) && (
                <div className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                  style={{ background: 'rgba(232,180,79,0.07)', border: '1px solid rgba(232,180,79,0.2)' }}>
                  <div style={{ color: 'var(--color-accent)' }}><CheckCircle2 size={15} /></div>
                  <p className="text-xs" style={{ color: 'var(--color-text-primary)' }}>
                    Ready to submit:{' '}
                    <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                      {[
                        photos.length > 0 && `${photos.length} photo${photos.length > 1 ? 's' : ''}`,
                        notes.trim() && 'notes',
                      ].filter(Boolean).join(' + ')}
                    </span>
                  </p>
                </div>
              )}

              {/* Error */}
              {submitError && (
                <div className="flex items-start gap-2 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <p className="text-xs">{submitError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer submit button */}
        {!successData && (
          <div className="px-5 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-bold transition-all"
              style={{
                background: submitting
                  ? 'var(--color-bg-card)'
                  : 'linear-gradient(135deg, var(--color-accent), #0042b5)',
                color:       submitting ? 'var(--color-text-muted)' : 'var(--color-primary-darker)',
                border:      submitting ? '1.5px solid var(--color-border)' : 'none',
                boxShadow:   submitting ? 'none' : '0 4px 20px rgba(232,180,79,0.35)',
                cursor:      submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Submitting…</>
              ) : (
                <><Send size={16} /> Submit Homework</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Full-screen photo preview */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setPreviewPhoto(null)}
        >
          <img
            src={previewPhoto.preview}
            alt=""
            className="max-w-full max-h-full rounded-2xl object-contain"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}
          />
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
            onClick={() => setPreviewPhoto(null)}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
function Homework() {
  const navigate = useNavigate();

  const [tasks, setTasks]                   = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [submitTask, setSubmitTask]         = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHomework(STUDENT_ID);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmitted = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, status: 'submitted' } : t)
    );
  };

  const filteredTasks = tasks
    .filter((t) => selectedFilter === 'all' || t.priority === selectedFilter)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--color-bg-page-1), var(--color-bg-page-2))' }}>
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
            <BookOpenCheck size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>Pending Homework</h3>
            <p className="text-xs" style={{ color: 'var(--color-text-header-sub)' }}>
              {loading ? '—' : `${filteredTasks.length} assignments pending`}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-5xl px-6 py-6 sm:px-4 sm:py-4">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && (
          <>
            {/* Filter */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-wide" style={{ color: 'var(--color-text-primary)' }}>My Homework</h2>
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
                          ? { background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))', color: 'var(--color-accent)', border: '1.5px solid var(--color-accent)', boxShadow: '0 2px 8px var(--color-shadow-accent-md)' }
                          : { background: 'var(--color-bg-card)', color: 'var(--color-text-muted)', border: '1.5px solid var(--color-border)' }
                      }
                    >
                      {filter === 'all' ? 'All' : filter === 'high' ? 'High Priority' : 'Normal'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task list */}
            {filteredTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => {
                  const daysLeft    = daysRemaining(task.dueDate);
                  const isUrgent    = daysLeft <= 2;
                  const isSubmitted = task.status === 'submitted' || task.status === 'graded';

                  return (
                    <div
                      key={task.id}
                      className="rounded-xl px-5 py-4 transition-all duration-300"
                      style={{
                        background:   'var(--color-bg-card)',
                        border:       `1.5px solid ${task.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderLeft:   task.priority === 'high' ? '4px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                        boxShadow:    '0 2px 10px var(--color-shadow-card-sm)',
                        opacity:      isSubmitted ? 0.75 : 1,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow   = '0 6px 20px var(--color-shadow-accent-sm)';
                        e.currentTarget.style.borderColor = 'var(--color-accent)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow   = '0 2px 10px var(--color-shadow-card-sm)';
                        e.currentTarget.style.borderColor = task.priority === 'high' ? 'var(--color-accent)' : 'var(--color-border)';
                      }}
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                            style={{ background: 'var(--color-bg-icon)', color: 'var(--color-accent)' }}>
                            <BookMarked size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{task.title}</div>
                            <div className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{task.subject}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isUrgent && !isSubmitted && (
                            <span className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                              style={{ background: 'rgba(232,180,79,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(232,180,79,0.3)' }}>
                                {task.priority==="high"?"Urgent":"Normal"}
                            </span>
                          )}
                          <div className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-bold"
                            style={{ ...dueDateBadgeStyle(daysLeft), boxShadow: '0 2px 6px var(--color-shadow-accent-sm)' }}>
                            {formatDate(task.dueDate)}
                          </div>
                        </div>
                      </div>

                      {/* Details grid */}
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {[
                          { label: 'Marks',     value: task.totalMarks,    Icon: Activity,     accent: false },
                          { label: 'Days Left', value: `${daysLeft} days`, Icon: CalendarDays, accent: true  },
                          { label: 'Status',    value: statusConfig[task.status]?.label ?? task.status, Icon: CheckCircle2, accent: false, customColor: statusConfig[task.status]?.color },
                        ].map(({ label, value, Icon, accent, customColor }) => (
                          <div key={label} className="rounded-lg px-3 py-2"
                            style={{ background: 'var(--color-bg-icon)', border: '1px solid var(--color-border)' }}>
                            <div className="flex items-center gap-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
                              <Icon size={10} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                            </div>
                            <div className="text-xs font-bold capitalize"
                              style={{ color: customColor ?? (accent ? 'var(--color-accent)' : 'var(--color-text-primary)') }}>
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Submit / Submitted */}
                      <div className="mt-3">
                        {isSubmitted ? (
                          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
                            style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)' }}>
                            <CheckCheck size={14} style={{ color: '#4ade80' }} />
                            <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>
                              {task.status === 'graded' ? 'Graded by teacher' : 'Homework submitted'}
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSubmitTask(task)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-primary-darker), var(--color-primary-dark))',
                              color:       'var(--color-accent)',
                              border:      '1.5px solid var(--color-accent)',
                              boxShadow:   '0 2px 10px var(--color-shadow-accent-sm)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px var(--color-shadow-accent-md)')}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 10px var(--color-shadow-accent-sm)')}
                          >
                            <Upload size={13} />
                            Submit Homework
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Submission modal */}
      {submitTask && (
        <SubmitModal
          task={submitTask}
          onClose={() => setSubmitTask(null)}
          onSubmitted={(id) => { handleSubmitted(id); }}
        />
      )}
    </div>
  );
}

export default Homework;