import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  User,
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
  Smile,
  FileBarChart2,
  MessageSquare,
  Settings,
  Lock,
  CheckCircle,
  AlertCircle,
  Database,
  ArrowRight,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  Search,
  Eye,
  Send,
  Unlock,
  Clock,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export default function InteractiveArchitecture() {
  const [selectedRole, setSelectedRole] = useState("super_admin"); // 'super_admin' or 'admin'
  const [activeTab, setActiveTab] = useState("hierarchy"); // 'hierarchy' | 'flow' | 'matrix' | 'schemas'
  const [selectedModule, setSelectedModule] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Simulator States
  const [simStep, setSimStep] = useState("splash"); // splash -> login -> dashboard -> inner_screen
  const [simRole, setSimRole] = useState("super_admin");
  const [attendanceHours, setAttendanceHours] = useState(12); // Slider state (0 to 48 hours)
  const [selectedSimScreen, setSelectedSimScreen] = useState("dashboard"); // dashboard, attendance, whatsapp, settings
  const [logs, setLogs] = useState([
    { time: "18:54:02", type: "SYSTEM", text: "Architecture simulation environment ready." },
  ]);
  const [whatsappLogs, setWhatsappLogs] = useState([
    { id: 1, sender: "Super Admin", scope: "School Wide", text: "Annual Sports Day announced for next Friday!", recipients: 450, status: "delivered" },
    { id: 2, sender: "Admin (Grade 8)", scope: "Class 8-A", text: "Reminder: Science project submissions due tomorrow.", recipients: 35, status: "delivered" }
  ]);
  const [newBroadcastText, setNewBroadcastText] = useState("");
  const [newAlertText, setNewAlertText] = useState("");

  const addLog = (type, text) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [{ time, type, text }, ...prev.slice(0, 14)]);
  };

  // Modules list definition
  const modules = {
    authentication: {
      id: "authentication",
      title: "Authentication",
      icon: Shield,
      category: "Core",
      description: "App bootstrap, token check, role redirection, and session security.",
      submodules: [
        { name: "Splash Screen", desc: "Verifies stored JWT tokens, plays branding animation, handles redirect rules." },
        { name: "Login Screen", desc: "Handles multi-role authentication against API, issues secure token." }
      ],
      super_admin: { status: "full", text: "Global login, bypasses locks, manage security keys." },
      admin: { status: "full", text: "Login restricted to assigned administrative panel." },
      api: "POST /api/login",
      db: "users"
    },
    dashboard: {
      id: "dashboard",
      title: "Dashboard",
      icon: Layers,
      category: "Core",
      description: "Role-customized control panel showcasing analytics summaries, alerts, and quick actions.",
      submodules: [
        { name: "Overview Analytics", desc: "Visual charts for attendance summaries, average grades, and behaviour ratings." },
        { name: "Activity Stream", desc: "List of recent logs, backup status, or class submissions." }
      ],
      super_admin: { status: "full", text: "Global metrics dashboard: total admins count, system metrics, backup status." },
      admin: { status: "restricted", text: "Class Dashboard: Shows class strength (Grade/Section), today's attendance checklist, homework due today." },
      api: "GET /api/dashboard",
      db: "users, attendance, homework"
    },
    student_management: {
      id: "student_management",
      title: "Student Management",
      icon: Users,
      category: "Academic",
      description: "Student profiles, registry management, class assignments, and search functions.",
      submodules: [
        { name: "Student List", desc: "Paginated list with filter options by Grade, Section, and status." },
        { name: "Add/Edit Student Form", desc: "Register personal info, parent details, roll number, and class assignments." },
        { name: "Student Profile", desc: "Consolidated tab view showing student attendance history, homework logs, and behaviour remarks." }
      ],
      super_admin: { status: "full", text: "Full CRUD on all students across all grades. Manage transfers and register edits." },
      admin: { status: "restricted", text: "CRUD restricted only to students of their assigned class/section. Search only within class." },
      api: "GET /api/users?role=student, POST /api/users/add, DELETE /api/users/:id",
      db: "users"
    },
    attendance: {
      id: "attendance",
      title: "Attendance Tracker",
      icon: Calendar,
      category: "Academic",
      description: "Daily attendance taking, monthly statistics calendars, and automated parent warning triggers.",
      submodules: [
        { name: "Mark Attendance", desc: "Interactive student checklist grid (Present/Absent/Late buttons)." },
        { name: "Attendance History", desc: "Detailed calendars and list history of class attendance records." },
        { name: "24h Lock Controller", desc: "Binds edit permissions to a 24-hour window from submission date." }
      ],
      super_admin: { status: "full", text: "Full view of all classes. Can bypass the 24-hour lock to edit historic records." },
      admin: { status: "restricted", text: "Allowed to mark/edit attendance ONLY for their class. Access locks 24 hours after submission." },
      api: "GET /api/attendance, POST /api/attendance/submit",
      db: "attendance"
    },
    homework: {
      id: "homework",
      title: "Homework & Assignments",
      icon: BookOpen,
      category: "Academic",
      description: "Class assignments builder, document attachments support, and submission checking portal.",
      submodules: [
        { name: "Add Homework", desc: "Define task, description, subject, attachments, and due dates." },
        { name: "Homework List", desc: "Overview of current active homeworks, grading status, and submissions." }
      ],
      super_admin: { status: "full", text: "Read-only audit: view homework statistics across the school. Delete offensive items." },
      admin: { status: "restricted", text: "Full CRUD to publish assignments, set due dates, and grade student submissions in assigned class." },
      api: "GET /api/homework, POST /api/homework/create",
      db: "homework"
    },
    tests: {
      id: "tests",
      title: "Test Series & Marks",
      icon: ClipboardList,
      category: "Academic",
      description: "Exam definitions, exam schedules, class mark entry, and report card compilations.",
      submodules: [
        { name: "Add Tests", desc: "Define assessment type (Internal, Term, Test Series), date, subject, and marks." },
        { name: "Enter Marks", desc: "Excel-like spreadsheet interface to input scores rapidly for students." },
        { name: "Analytics Reports", desc: "Displays averages, highest/lowest scores, subject graphs, and grade distributions." }
      ],
      super_admin: { status: "full", text: "Configure school-wide test series standards. View overall school performance charts." },
      admin: { status: "restricted", text: "Create internal class tests, enter marks, and check class performance summaries." },
      api: "GET /api/tests, POST /api/tests/add, POST /api/tests/marks",
      db: "tests, marks"
    },
    behaviour: {
      id: "behaviour",
      title: "Behaviour Tracking",
      icon: Smile,
      category: "Academic",
      description: "Monitor student conduct, assign rating points, and log specific disciplinary/achievement remarks.",
      submodules: [
        { name: "Add Ratings", desc: "Star-based parameter ratings (1-5 stars for discipline, participation, homework completion)." },
        { name: "Behaviour History", desc: "Chronological feed of commendations and incident remarks shown on profiles." }
      ],
      super_admin: { status: "full", text: "Configure global behaviour parameters and audit school-wide incident history." },
      admin: { status: "restricted", text: "Add daily star ratings and write remark details for students in their class only." },
      api: "GET /api/behaviour, POST /api/behaviour/log",
      db: "behaviour_logs"
    },
    reports: {
      id: "reports",
      title: "Reports & Report Cards",
      icon: FileBarChart2,
      category: "Academic",
      description: "Automated compiler generating PDF transcripts, attendance percentages, and behavioral reviews.",
      submodules: [
        { name: "Attendance Reports", desc: "Exportable summary sheets showing monthly absentees and percentages." },
        { name: "Test Reports", desc: "Grade sheets, ranking logs, and performance average breakdowns." },
        { name: "Behaviour Reports", desc: "Summaries highlighting students with critical rating drops or exemplary performance." }
      ],
      super_admin: { status: "full", text: "Generate school-wide analytical reports, publish digital report cards, export school records." },
      admin: { status: "restricted", text: "Generate class-specific student reports and draft class teacher feedback on report cards." },
      api: "GET /api/reports/class/:id, GET /api/reports/school",
      db: "attendance, marks, behaviour_logs"
    },
    whatsapp_integration: {
      id: "whatsapp_integration",
      title: "WhatsApp Integration",
      icon: MessageSquare,
      category: "Utilities",
      description: "School communication engine sending templates, circular alerts, and system notifications via WhatsApp API.",
      submodules: [
        { name: "Broadcast Messages", desc: "Super Admin dashboard to dispatch emergency or school-wide bulletins instantly." },
        { name: "Class Alerts", desc: "Automated trigger templates (e.g. Absentee Alert, Homework Pending Alert) for parents." }
      ],
      super_admin: { status: "full", text: "Configure API gateways. Send school-wide broadcasts. Monitor overall delivery logs." },
      admin: { status: "restricted", text: "Trigger pre-approved template alerts to parent contacts of students in their class only." },
      api: "POST /api/whatsapp/broadcast, POST /api/whatsapp/class-alert",
      db: "whatsapp_logs"
    },
    settings: {
      id: "settings",
      title: "Settings & System Logs",
      icon: Settings,
      category: "Utilities",
      description: "Application configuration hub containing credential managers, log files, and database maintenance tools.",
      submodules: [
        { name: "WhatsApp API Config", desc: "Set API credentials, base URLs, and message templates." },
        { name: "Backup & Restore", desc: "Trigger manual database exports or restore historical snapshots." },
        { name: "Audit Action Logs", desc: "Review user logs showing logins, deletions, settings adjustments, and updates." }
      ],
      super_admin: { status: "full", text: "Full configuration control, database backups, audit log downloads." },
      admin: { status: "none", text: "No access. Page throws a 403 Forbidden error." },
      api: "GET /api/logs, POST /api/backup, POST /api/restore",
      db: "audit_logs"
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "full":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /> Full Access</span>;
      case "restricted":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertCircle className="w-3.5 h-3.5" /> Class Scope</span>;
      case "none":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20"><Lock className="w-3.5 h-3.5" /> Locked (403)</span>;
      default:
        return null;
    }
  };

  // Filter modules based on search
  const filteredModules = Object.values(modules).filter(
    (mod) =>
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-5 px-6 shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                School Management System
              </h1>
              <p className="text-xs text-slate-400">Interactive Architecture & Screen Flow Explorer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 transition"
            >
              Back to Login Screen
            </Link>
            <div className="bg-slate-950/80 rounded-xl p-1 border border-slate-800 flex items-center shadow-inner">
              <button
                onClick={() => {
                  setSelectedRole("super_admin");
                  addLog("ROLE_CHANGE", "Switched active explorer role to Super Admin.");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedRole === "super_admin"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Super Admin
              </button>
              <button
                onClick={() => {
                  setSelectedRole("admin");
                  addLog("ROLE_CHANGE", "Switched active explorer role to Admin.");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedRole === "admin"
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar & Console Logs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Main Navigation Tabs */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Tabs</h3>
            <nav className="flex flex-col gap-1.5">
              {[
                { id: "hierarchy", label: "Module Tree Explorer", icon: Layers },
                { id: "flow", label: "Screen Flow Simulator", icon: Activity },
                { id: "matrix", label: "Permissions Matrix", icon: Shield },
                { id: "schemas", label: "DB Collections & API", icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-slate-800 text-blue-400 border border-slate-700/80 shadow"
                        : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Context Card */}
          <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 rounded-2xl border border-slate-800/80 p-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Active Role Overview
            </h3>
            {selectedRole === "super_admin" ? (
              <div className="space-y-2">
                <span className="inline-flex px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-red-500/10 text-red-400 rounded-md border border-red-500/20">ROOT PRIVILEGES</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The <strong className="text-slate-200">Super Admin</strong> has complete CRUD authority over all school-wide collections, admin staff lists, API configurations, and billing/settings. Can override locking rules.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="inline-flex px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">CLASS RESTRICTED</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The <strong className="text-slate-200">Admin</strong> has access constrained strictly to their assigned class (e.g. <b>Grade 8-A</b>). They cannot view other class lists or edit records outside of specified time limits.
                </p>
              </div>
            )}
          </div>

          {/* Real-time Event Logger (Console Mock) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex-1 flex flex-col min-h-[220px]">
            <div className="border-b border-slate-800 py-2.5 px-4 flex items-center justify-between bg-slate-950/40">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Live Architecture Logs
              </span>
              <button 
                onClick={() => setLogs([{ time: new Date().toTimeString().split(" ")[0], type: "SYSTEM", text: "Logs cleared." }])}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <div className="p-3 font-mono text-[10px] text-slate-300 overflow-y-auto flex-1 max-h-[250px] space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-slate-500">[{log.time}]</span>{" "}
                  <span className={`font-semibold ${log.type === "SYSTEM" ? "text-blue-400" : log.type === "ROLE_CHANGE" ? "text-purple-400" : log.type === "SIMULATOR" ? "text-emerald-400" : "text-amber-400"}`}>
                    {log.type}
                  </span>{" "}
                  <span className="text-slate-300">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TAB 1: MODULE TREE EXPLORER */}
          {activeTab === "hierarchy" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Module Access Tree & Descriptions
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a module to view its access rules, sub-modules, and sample data mockups.
                  </p>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-full md:w-56"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Modular Navigation List */}
                <div className="md:col-span-5 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                  {filteredModules.map((mod) => {
                    const Icon = mod.icon;
                    const isSelected = selectedModule === mod.id;
                    const roleAccess = mod[selectedRole];
                    
                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setSelectedModule(mod.id);
                          addLog("INSPECT_MODULE", `Inspected module: ${mod.title}`);
                        }}
                        className={`text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                          isSelected
                            ? "bg-slate-800 border-blue-500 shadow-md shadow-blue-500/5"
                            : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          roleAccess.status === "full" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : roleAccess.status === "restricted" 
                              ? "bg-amber-500/10 text-amber-400" 
                              : "bg-rose-500/10 text-rose-400"
                        }`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-1.5">
                            <span className="text-sm font-semibold text-white truncate">{mod.title}</span>
                            {roleAccess.status === "full" && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                            {roleAccess.status === "restricted" && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                            {roleAccess.status === "none" && <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-1">{mod.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Inspection Inspector Panel */}
                <div className="md:col-span-7 bg-slate-950 rounded-2xl border border-slate-850 p-5 flex flex-col justify-between shadow-inner">
                  {modules[selectedModule] ? (
                    <div className="space-y-5">
                      {/* Module Title Header */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-extrabold tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
                            {modules[selectedModule].category} Module
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                            {modules[selectedModule].title}
                          </h3>
                        </div>
                        {getStatusBadge(modules[selectedModule][selectedRole].status)}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                        {modules[selectedModule].description}
                      </p>

                      {/* Submodules Listing */}
                      <div className="space-y-2.5">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sub-Screens & Sub-modules</h4>
                        <div className="space-y-2">
                          {modules[selectedModule].submodules.map((sub, i) => (
                            <div key={i} className="flex gap-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-900 text-xs">
                              <ChevronRight className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-200">{sub.name}</span>
                                <span className="text-slate-400 block mt-0.5">{sub.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Role Specific Details */}
                      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/20 text-xs space-y-2.5">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-slate-300" />
                          Role Access Specification
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={`p-2.5 rounded-lg border ${selectedRole === "super_admin" ? "bg-slate-850 border-blue-500/20" : "bg-slate-900/30 border-slate-850"}`}>
                            <span className="font-semibold text-slate-200 block mb-1">Super Admin Rights:</span>
                            <span className="text-[11px] text-slate-400 leading-relaxed">
                              {modules[selectedModule].super_admin.text}
                            </span>
                          </div>
                          <div className={`p-2.5 rounded-lg border ${selectedRole === "admin" ? "bg-slate-850 border-amber-500/20" : "bg-slate-900/30 border-slate-850"}`}>
                            <span className="font-semibold text-slate-200 block mb-1">Class Admin Rights:</span>
                            <span className="text-[11px] text-slate-400 leading-relaxed font-normal">
                              {modules[selectedModule].admin.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-12 text-slate-500 h-full">
                      <HelpCircle className="w-12 h-12 mb-3" />
                      <p className="text-sm">Select a module to view documentation details.</p>
                    </div>
                  )}

                  {/* API & Schema details footer */}
                  {modules[selectedModule] && (
                    <div className="border-t border-slate-900 pt-4 mt-5 flex flex-wrap gap-2 text-[10px]">
                      <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850 flex items-center gap-1.5 text-slate-300">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>API: <b className="font-mono text-blue-300">{modules[selectedModule].api}</b></span>
                      </div>
                      <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850 flex items-center gap-1.5 text-slate-300">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        <span>DB Collections: <b className="font-mono text-indigo-300">{modules[selectedModule].db}</b></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL SCREEN FLOW SIMULATOR */}
          {activeTab === "flow" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Screen Flow & Route Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Simulate the user experience from App Launch (Splash) up to inner-module triggers under different roles.
                </p>
              </div>

              {/* Simulation Steps Bar */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 border border-slate-850 rounded-2xl">
                {[
                  { id: "splash", label: "1. Splash", icon: Clock },
                  { id: "login", label: "2. Login", icon: Shield },
                  { id: "dashboard", label: "3. Dashboard", icon: Layers },
                  { id: "inner_screen", label: "4. Inner Module", icon: ArrowRight },
                ].map((step) => {
                  const Icon = step.icon;
                  const isActive = simStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        setSimStep(step.id);
                        addLog("SIMULATOR", `Jumped simulator step to: ${step.label}`);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-slate-850 text-emerald-400 border border-slate-700/80 shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Simulator Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Visual Viewport Mock (Browser/Phone Frame) */}
                <div className="md:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">
                  {/* Status Bar Mock */}
                  <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800 text-[10px] text-slate-500 font-mono">
                    <span className="text-slate-400 font-bold">EDTECH PORTAL v2.4</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Role: {simStep === "splash" ? "BOOT" : simRole.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Screen Content Wrapper */}
                  <div className="flex-1 flex flex-col bg-slate-950 p-6 relative select-none">
                    
                    {/* STEP 1: SPLASH SCREEN */}
                    {simStep === "splash" && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/10 animate-bounce">
                          <Layers className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-wide">DYZEN SCHOOL APP</h3>
                          <p className="text-xs text-slate-500 mt-1 font-mono">Verifying Active Token...</p>
                        </div>
                        <div className="w-36 bg-slate-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-2/3 animate-infinite-loading rounded-full" />
                        </div>
                        <button
                          onClick={() => {
                            setSimStep("login");
                            addLog("SIMULATOR", "Splash token verification expired, redirected to login.");
                          }}
                          className="px-4 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold rounded-lg text-slate-300 transition"
                        >
                          Manual Proceed
                        </button>
                      </div>
                    )}

                    {/* STEP 2: LOGIN SCREEN */}
                    {simStep === "login" && (
                      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-5">
                        <div className="text-center space-y-1.5">
                          <h3 className="text-base font-bold text-white">Sign In to Dashboard</h3>
                          <p className="text-xs text-slate-400">Select simulated role credentials to login.</p>
                        </div>

                        {/* Custom Role Toggles in Login Form */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => setSimRole("super_admin")}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                              simRole === "super_admin"
                                ? "bg-blue-600/15 border-blue-500 text-blue-400"
                                : "bg-slate-900 border-slate-800 hover:border-slate-750 text-slate-400"
                            }`}
                          >
                            <Shield className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Super Admin</span>
                          </button>
                          <button
                            onClick={() => setSimRole("admin")}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                              simRole === "admin"
                                ? "bg-amber-600/15 border-amber-500 text-amber-400"
                                : "bg-slate-900 border-slate-800 hover:border-slate-750 text-slate-400"
                            }`}
                          >
                            <User className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Class Admin</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Email Address</label>
                            <input
                              type="text"
                              disabled
                              value={simRole === "super_admin" ? "superadmin@school.edu" : "admin.class8@school.edu"}
                              className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Password</label>
                            <input
                              type="password"
                              disabled
                              value="••••••••••••"
                              className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSimStep("dashboard");
                            setSelectedSimScreen("dashboard");
                            addLog("SIMULATOR", `Logged in successfully as ${simRole === "super_admin" ? "Super Admin" : "Class Admin"}.`);
                          }}
                          className={`w-full py-2.5 rounded-lg text-xs font-bold text-white transition flex items-center justify-center gap-1.5 ${
                            simRole === "super_admin" ? "bg-blue-600 hover:bg-blue-500" : "bg-amber-600 hover:bg-amber-500"
                          }`}
                        >
                          Login to System
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* STEP 3: DASHBOARD SCREEN */}
                    {simStep === "dashboard" && (
                      <div className="flex-1 flex flex-col text-slate-100">
                        {/* Header of simulated dashboard */}
                        <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                          <div>
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">SCHOOL PORTAL</span>
                            <h3 className="text-xs font-bold text-white">
                              {simRole === "super_admin" ? "Central Management Console" : "Class Admin Panel - Grade 8-A"}
                            </h3>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold ${simRole === "super_admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                            {simRole === "super_admin" ? "SUPER ADMIN" : "CLASS ADMIN"}
                          </span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {simRole === "super_admin" ? (
                            <>
                              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                                <span className="text-[10px] text-slate-400">Total Classes</span>
                                <p className="text-base font-bold text-blue-400">18 Rooms</p>
                              </div>
                              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                                <span className="text-[10px] text-slate-400">Registered Admins</span>
                                <p className="text-base font-bold text-purple-400">12 Accounts</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                                <span className="text-[10px] text-slate-400">Class Students</span>
                                <p className="text-base font-bold text-amber-400">35 Enrolled</p>
                              </div>
                              <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 space-y-1">
                                <span className="text-[10px] text-slate-400">Today Attendance</span>
                                <p className="text-base font-bold text-emerald-400">97.1%</p>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Simulated Screen Sub-navigation List */}
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Available Actions</h4>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setSimStep("inner_screen");
                                setSelectedSimScreen("attendance");
                                addLog("SIMULATOR", "Opened simulated Attendance Tracker module.");
                              }}
                              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 rounded-xl text-left text-xs transition space-y-1 group"
                            >
                              <Calendar className="w-4 h-4 text-emerald-400 group-hover:scale-105 transition" />
                              <span className="font-semibold block text-slate-200">Attendance</span>
                              <span className="text-[9px] text-slate-500 block">Mark & History</span>
                            </button>

                            <button
                              onClick={() => {
                                setSimStep("inner_screen");
                                setSelectedSimScreen("whatsapp");
                                addLog("SIMULATOR", "Opened simulated WhatsApp Broadcast panel.");
                              }}
                              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 rounded-xl text-left text-xs transition space-y-1 group"
                            >
                              <MessageSquare className="w-4 h-4 text-sky-400 group-hover:scale-105 transition" />
                              <span className="font-semibold block text-slate-200">WhatsApp Engine</span>
                              <span className="text-[9px] text-slate-500 block">Send Notifications</span>
                            </button>

                            <button
                              onClick={() => {
                                setSimStep("inner_screen");
                                setSelectedSimScreen("settings");
                                addLog("SIMULATOR", "Opened simulated Settings panel.");
                              }}
                              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 rounded-xl text-left text-xs transition space-y-1 group"
                            >
                              <Settings className="w-4 h-4 text-purple-400 group-hover:scale-105 transition" />
                              <span className="font-semibold block text-slate-200">System Settings</span>
                              <span className="text-[9px] text-slate-500 block">Log & Backups</span>
                            </button>

                            <button
                              onClick={() => {
                                setSimStep("login");
                                addLog("SIMULATOR", "Logged out of simulated environment.");
                              }}
                              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 rounded-xl text-left text-xs transition space-y-1 group"
                            >
                              <Lock className="w-4 h-4 text-red-400 group-hover:scale-105 transition" />
                              <span className="font-semibold block text-slate-200">Sign Out</span>
                              <span className="text-[9px] text-slate-500 block">End Session</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: INNER SCREEN VIEW */}
                    {simStep === "inner_screen" && (
                      <div className="flex-1 flex flex-col text-slate-100">
                        {/* Inner Module Header */}
                        <div className="flex justify-between items-center border-b border-slate-900 pb-3.5 mb-4">
                          <button
                            onClick={() => {
                              setSimStep("dashboard");
                              addLog("SIMULATOR", "Returned to dashboard.");
                            }}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                          >
                            ← Back to Dashboard
                          </button>
                          <span className="text-xs font-bold text-slate-300 capitalize">{selectedSimScreen} Module</span>
                        </div>

                        {/* SCREEN A: ATTENDANCE TRACKER */}
                        {selectedSimScreen === "attendance" && (
                          <div className="space-y-4">
                            <div className="bg-slate-900 p-3 rounded-xl border border-slate-850">
                              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-blue-400" />
                                24-Hour Edit Window Lock Simulator
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                                Slide the time elapsed since the class attendance checklist was submitted:
                              </p>
                              
                              <div className="mt-3 flex items-center gap-4">
                                <input
                                  type="range"
                                  min="0"
                                  max="48"
                                  value={attendanceHours}
                                  onChange={(e) => {
                                    const hrs = parseInt(e.target.value);
                                    setAttendanceHours(hrs);
                                    addLog("SIMULATOR", `Adjusted submission age slider to ${hrs} hours.`);
                                  }}
                                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                                />
                                <span className={`text-xs font-extrabold font-mono shrink-0 px-2 py-0.5 rounded border ${
                                  attendanceHours > 24 
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                  {attendanceHours} Hours Age
                                </span>
                              </div>
                            </div>

                            {/* Simulated Grid depending on Role and Hours */}
                            <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden text-xs">
                              <div className="px-3.5 py-2.5 bg-slate-950 border-b border-slate-850 flex justify-between items-center">
                                <span className="font-semibold text-slate-300">Class 8-A Student Registry</span>
                                {attendanceHours > 24 && simRole === "admin" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400">
                                    <Lock className="w-3 h-3" /> Locked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                    <Unlock className="w-3 h-3" /> Editable
                                  </span>
                                )}
                              </div>

                              <div className="p-2 space-y-1.5">
                                {[
                                  { roll: "01", name: "Ananya Iyer", status: "Present" },
                                  { roll: "02", name: "David Miller", status: "Present" },
                                  { roll: "03", name: "Zayn Malik", status: "Absent" }
                                ].map((stu) => (
                                  <div key={stu.roll} className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 border border-slate-900">
                                    <span>#{stu.roll} - {stu.name}</span>
                                    <div className="flex gap-1.5">
                                      {["Present", "Absent"].map((act) => {
                                        const isActSelected = stu.status === act;
                                        const disabled = attendanceHours > 24 && simRole === "admin";
                                        return (
                                          <button
                                            key={act}
                                            disabled={disabled}
                                            onClick={() => addLog("SIMULATOR", `Toggled ${stu.name} to ${act}.`)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                              isActSelected 
                                                ? act === "Present" 
                                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                : "bg-slate-900 text-slate-500 border-transparent"
                                            } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105 active:scale-95"}`}
                                          >
                                            {act}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Info Box */}
                            {attendanceHours > 24 && simRole === "admin" ? (
                              <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 p-3 rounded-xl text-[10px] leading-relaxed">
                                🚨 <b>Lock Active:</b> 24-hour limit has expired. Daily attendance sheets are locked for class admins. To change this record, contact the Super Admin for a override key or backup modification.
                              </div>
                            ) : attendanceHours > 24 && simRole === "super_admin" ? (
                              <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-3 rounded-xl text-[10px] leading-relaxed">
                                🔧 <b>Super Admin Access:</b> Over 24 hours elapsed, but as a Super Admin, you bypass the lock. You retain global edit rights to override historic records.
                              </div>
                            ) : (
                              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-xl text-[10px] leading-relaxed font-normal">
                                ✅ <b>Checklist Active:</b> Age is under 24 hours. Changes can be saved to database directly.
                              </div>
                            )}
                          </div>
                        )}

                        {/* SCREEN B: WHATSAPP INTEGRATION */}
                        {selectedSimScreen === "whatsapp" && (
                          <div className="space-y-4">
                            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 space-y-3">
                              {simRole === "super_admin" ? (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">Twilio API Status</span>
                                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-md border border-emerald-500/30 text-[9px] font-bold">CONNECTED</span>
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block mb-1">Trigger School Broadcast (Emergency circulars, alerts)</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="Type broadcast announcement..."
                                        value={newBroadcastText}
                                        onChange={(e) => setNewBroadcastText(e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                                      />
                                      <button 
                                        onClick={() => {
                                          if (!newBroadcastText) return;
                                          const logItem = { id: whatsappLogs.length + 1, sender: "Super Admin", scope: "School Wide", text: newBroadcastText, recipients: 450, status: "sent" };
                                          setWhatsappLogs([logItem, ...whatsappLogs]);
                                          addLog("SIMULATOR", `Dispatched school-wide broadcast alert: "${newBroadcastText}" to 450 contacts.`);
                                          setNewBroadcastText("");
                                        }}
                                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold transition flex items-center gap-1 text-white"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="text-[10px] font-bold text-amber-400 block uppercase">Class Alert Generator</span>
                                  <div>
                                    <label className="text-[10px] text-slate-400 block mb-1">Template: Class Notification (Parents of Grade 8-A)</label>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="E.g., Today's homework has been posted..."
                                        value={newAlertText}
                                        onChange={(e) => setNewAlertText(e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                                      />
                                      <button 
                                        onClick={() => {
                                          if (!newAlertText) return;
                                          const logItem = { id: whatsappLogs.length + 1, sender: "Admin (Grade 8)", scope: "Class 8-A", text: newAlertText, recipients: 35, status: "sent" };
                                          setWhatsappLogs([logItem, ...whatsappLogs]);
                                          addLog("SIMULATOR", `Dispatched class-wide notification: "${newAlertText}" to 35 parent contacts.`);
                                          setNewAlertText("");
                                        }}
                                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-bold transition flex items-center gap-1 text-white"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* WhatsApp Log */}
                            <div className="bg-slate-900 border border-slate-850 rounded-xl overflow-hidden text-[10px]">
                              <span className="block px-3 py-2 bg-slate-950 border-b border-slate-850 font-bold text-slate-400">Broadcast API Queue logs</span>
                              <div className="divide-y divide-slate-850 max-h-[140px] overflow-y-auto">
                                {whatsappLogs.map((log) => (
                                  <div key={log.id} className="p-2.5 flex justify-between gap-4">
                                    <div className="space-y-0.5">
                                      <div className="flex gap-2 items-center">
                                        <span className="font-bold text-slate-200">{log.sender}</span>
                                        <span className="text-[9px] bg-slate-850 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">{log.scope}</span>
                                      </div>
                                      <p className="text-slate-400 text-[10px] leading-relaxed italic">"{log.text}"</p>
                                    </div>
                                    <div className="text-right flex flex-col justify-center items-end shrink-0">
                                      <span className="text-[9px] text-slate-400 font-mono">{log.recipients} users</span>
                                      <span className="text-emerald-400 font-semibold uppercase font-mono text-[9px] mt-0.5">{log.status}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* SCREEN C: SETTINGS AND LOGS */}
                        {selectedSimScreen === "settings" && (
                          <div className="space-y-4">
                            {simRole === "super_admin" ? (
                              <div className="space-y-4">
                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-3">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Database className="w-3.5 h-3.5 text-blue-400" />
                                    System Backups & Maintenance
                                  </h4>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">
                                    As Super Admin, you can backup the MongoDB schemas or restore them to dynamic state.
                                  </p>
                                  
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => addLog("SYSTEM", "Triggered manual MongoDB cluster export backup_manifest_v2.4_2026.json")}
                                      className="flex-1 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-750 text-xs font-bold text-slate-200 rounded-lg transition"
                                    >
                                      Create Backup Snapshot
                                    </button>
                                    <button
                                      onClick={() => addLog("SYSTEM", "Database rollback initiated from backup log index 04.")}
                                      className="flex-1 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-750 text-xs font-bold text-rose-400 rounded-lg transition"
                                    >
                                      Rollback DB
                                    </button>
                                  </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3.5 space-y-3">
                                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                                    API Gateways Credentials
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                                    <div>
                                      <label className="text-[9px] text-slate-500 block mb-0.5">WHATSAPP_TOKEN</label>
                                      <span className="font-mono bg-slate-950 border border-slate-850 px-2 py-1 rounded block text-slate-400 truncate">twi_live_98ab42c...</span>
                                    </div>
                                    <div>
                                      <label className="text-[9px] text-slate-500 block mb-0.5">JWT_SECRET</label>
                                      <span className="font-mono bg-slate-950 border border-slate-850 px-2 py-1 rounded block text-slate-400 truncate">dyzen_secret_token_19...</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
                                <Lock className="w-8 h-8 text-rose-400" />
                                <h4 className="text-sm font-bold text-white">403 Forbidden - Access Denied</h4>
                                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                                  Admins are restricted from editing system settings, credential logs, database backups, or API keys. Your assigned role has been logged.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Simulator Description & Instructions */}
                <div className="md:col-span-2 space-y-5">
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      Active Simulator Step Description
                    </h3>

                    {simStep === "splash" && (
                      <div className="space-y-3 text-xs leading-relaxed text-slate-400 font-normal">
                        <p>
                          The <b>Splash Screen</b> represents the initial launch layer. It checks user status without blocking the UI:
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          <li>If a cached JWT is present in local storage, requests background verification.</li>
                          <li>If valid, transitions to dashboard immediately.</li>
                          <li>If invalid or empty, directs the client to the Role Login Page.</li>
                        </ul>
                      </div>
                    )}

                    {simStep === "login" && (
                      <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                        <p>
                          The <b>Login Screen</b> forces multi-role categorization. The system identifies:
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400">
                          <li><b>Super Admin</b> credentials grant global route privileges.</li>
                          <li><b>Admin</b> logins extract structural parameters (class assignments) appended directly to the login token.</li>
                        </ul>
                        <p className="text-[11px] text-amber-500">
                          💡 Select a role and click "Login to System" inside the screen frame to test their respective dashboards!
                        </p>
                      </div>
                    )}

                    {simStep === "dashboard" && (
                      <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                        <p>
                          The <b>Dashboard</b> routes components conditionally. 
                        </p>
                        <p>
                          Under the <b>Super Admin</b> view, global statistics cards and database operations are visible.
                        </p>
                        <p>
                          Under the <b>Admin</b> view, only metrics belonging to the assigned section (e.g. <b>Grade 8-A</b>) are fetched from the API.
                        </p>
                        <p className="text-[11px] text-emerald-400">
                          💡 Click any action button (Attendance, WhatsApp, Settings) inside the screen mock to open the inner component!
                        </p>
                      </div>
                    )}

                    {simStep === "inner_screen" && (
                      <div className="space-y-3 text-xs leading-relaxed text-slate-400">
                        <span className="font-semibold text-slate-200 block">Inspection Highlights:</span>
                        
                        {selectedSimScreen === "attendance" && (
                          <div className="space-y-2">
                            <p>
                              The **Attendance Tracker** demonstrates the 24-hour business rule constraint.
                            </p>
                            <p>
                              Slide the age slider below the screen title. If the age exceeds <b>24 hours</b>:
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                              <li>An <b>Admin</b> will find checkboxes locked and input disabled.</li>
                              <li>A <b>Super Admin</b> can still click buttons, demonstrating bypass authorization.</li>
                            </ul>
                          </div>
                        )}

                        {selectedSimScreen === "whatsapp" && (
                          <div className="space-y-2">
                            <p>
                              The **WhatsApp Integration** simulates broadcast authorization scopes.
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                              <li><b>Super Admin</b> sends school-wide broadcasts targeting 450 contacts.</li>
                              <li><b>Admin</b> triggers alerts restricted to Grade 8-A parents (35 contacts).</li>
                            </ul>
                            <p className="text-[11px] text-sky-400">
                              💡 Type a mock message and hit send to watch the API logs queue update live.
                            </p>
                          </div>
                        )}

                        {selectedSimScreen === "settings" && (
                          <div className="space-y-2">
                            <p>
                              The **System Settings** module shows hard RBAC security locks:
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                              <li><b>Super Admin</b> views API key scopes and triggers database rollback backups.</li>
                              <li><b>Admin</b> triggers a hard <b>403 Forbidden</b> block representation, securing keys.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Guide Card */}
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-2.5">
                    <span className="font-bold text-white block">Simulator Controls Quick Switcher</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Change the simulated role credentials dynamically to preview screen rendering rules immediately:
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSimRole("super_admin");
                          addLog("SIMULATOR", "Switched simulated session credential to Super Admin.");
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 ${
                          simRole === "super_admin"
                            ? "bg-blue-600/15 border-blue-500 text-blue-400"
                            : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Sim Super Admin
                      </button>
                      <button
                        onClick={() => {
                          setSimRole("admin");
                          addLog("SIMULATOR", "Switched simulated session credential to Admin.");
                        }}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1 ${
                          simRole === "admin"
                            ? "bg-amber-600/15 border-amber-500 text-amber-400"
                            : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        Sim Class Admin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS MATRIX */}
          {activeTab === "matrix" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Detailed Access Rights Matrix (RBAC)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Granular CRUD permissions grid mapping for both administrative scopes.
                </p>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 font-semibold text-slate-300">
                      <th className="p-4">Module Name</th>
                      <th className="p-4">Super Admin Rights</th>
                      <th className="p-4">Admin (Class Mapped) Rights</th>
                      <th className="p-4">Business Locks / Validation Rules</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-400">
                    {[
                      { name: "User Management", sa: "Full CRUD (Add/Edit/Block admins)", a: "None (Blocked)", rule: "System-wide account security locks" },
                      { name: "Student Registry", sa: "Full CRUD (All Classes)", a: "Restricted CRUD (Class members only)", rule: "Bound to user.assignedClass" },
                      { name: "Attendance logs", sa: "Global View & Override edits", a: "Mark/Edit (Class members only)", rule: "Locks 24 Hours from submission timestamp" },
                      { name: "Homework logs", sa: "Global Audit & Delete", a: "Full CRUD (Assigned Class)", rule: "Write-access only for mapped class students" },
                      { name: "Test Marksheet", sa: "Full CRUD & analytics (Global exams)", a: "Full CRUD (Class tests & entries)", rule: "Grade thresholds and averaging equations" },
                      { name: "Behaviour Tracker", sa: "Configure Parameters", a: "Log ratings & remarks for assigned class", rule: "Star rating constraints (1.0 to 5.0 scale)" },
                      { name: "Academic Reports", sa: "Release report cards / PDF exports", a: "Draft class comments & preview cards", rule: "Lock release controlled by Super Admin" },
                      { name: "WhatsApp Gateway", sa: "Broadcasts (Global) & config API", a: "Trigger Template Alerts (Class contacts)", rule: "SMS templates must match approved layouts" },
                      { name: "Settings & Backups", sa: "Full settings & DB snapshot controls", a: "None (Blocked - Returns 403)", rule: "Restricted cluster connection strings access" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/20 transition">
                        <td className="p-4 font-bold text-slate-200">{row.name}</td>
                        <td className="p-4 text-emerald-400 bg-emerald-500/5">{row.sa}</td>
                        <td className={`p-4 ${row.a.includes("None") ? "text-rose-400 bg-rose-500/5" : "text-amber-400 bg-amber-500/5"}`}>{row.a}</td>
                        <td className="p-4 font-mono text-[11px] text-slate-400">{row.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Informative alert explaining Class Scope */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-3.5 items-start">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-white block">Understanding the 'Class Scope' Constraint</span>
                  <p className="text-slate-400 leading-relaxed font-normal">
                    When an **Admin** logs in, the backend includes their assigned Grade/Section identifiers (e.g. `assignedClass: {"{"} grade: "8", section: "A" {"}"}`) in their encrypted JWT. 
                    Every single API request matching the Admin's JWT is dynamically filtered by the database queries to guarantee they cannot read or write records of students enrolled in Grade 9, 10, or other sections.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE SCHEMAS & API ROUTES */}
          {activeTab === "schemas" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Database Collections & API Routes Specification
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Database schema architectures designed to hold role status configurations, attendance logs, and broadcast metadata.
                </p>
              </div>

              {/* Grid of collections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "1. Users Collection",
                    desc: "Holds credentials, roles, and assigned class mappings.",
                    schema: `{
  "_id": "ObjectId",
  "name": "Arjun Sharma",
  "email": "admin.arjun@school.edu",
  "password_hash": "string",
  "role": "admin", // super_admin, admin
  "assignedClass": { "grade": "8", "section": "A" }, // Null for super_admin
  "phoneNumber": "+919876543210",
  "status": "active"
}`
                  },
                  {
                    name: "2. Attendance Collection",
                    desc: "Maintains attendance check-in timestamps and locked overrides.",
                    schema: `{
  "_id": "ObjectId",
  "date": "ISODate", 
  "class": { "grade": "8", "section": "A" },
  "records": [
    { "studentId": "ObjectId", "status": "present" }
  ],
  "submittedAt": "ISODate", 
  "isLocked": "boolean" // Manual bypass
}`
                  },
                  {
                    name: "3. Behaviour Logs Collection",
                    desc: "Holds disciplinary records and daily rating stats.",
                    schema: `{
  "_id": "ObjectId",
  "studentId": "ObjectId",
  "class": { "grade": "8", "section": "A" },
  "rating": 4.5, // 1 to 5 stars
  "category": "Discipline", 
  "remarks": "Cleaned lab desk.",
  "loggedBy": "ObjectId",
  "date": "ISODate"
}`
                  },
                  {
                    name: "4. WhatsApp Logs Collection",
                    desc: "Keeps transaction trails of Twilio broadcast payloads.",
                    schema: `{
  "_id": "ObjectId",
  "senderId": "ObjectId", 
  "scope": "class", // school_wide, class
  "messageText": "Class homework update.",
  "recipientsCount": 35,
  "status": "delivered", 
  "timestamp": "ISODate"
}`
                  }
                ].map((col, i) => (
                  <div key={i} className="bg-slate-950 rounded-xl border border-slate-850 p-4 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-white block">{col.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{col.desc}</span>
                    </div>
                    <pre className="font-mono text-[9px] text-emerald-400 bg-slate-900 p-3 rounded-lg border border-slate-850 overflow-x-auto max-h-[160px] scrollbar-thin">
                      {col.schema}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 EdTech Solutions. System Design Architecture and Flow simulator environment.</p>
      </footer>
    </div>
  );
}
