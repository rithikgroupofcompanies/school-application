import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, FileSpreadsheet, ExternalLink, CheckCircle2, User, Key, Lock, School, GraduationCap, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API_URL from "../config";

import {
  teacherIcon,
  adminIcon,
  studentIcon,
  parentIcon,
} from "../assets/role";
import dyzen from "../assets/Logos/dyzen.avif";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1EOaG3KmoT1K9hYoBABKVTWZLjVB_RnExt6MQ1LLpodQ/edit?usp=sharing";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("superadmin@school.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "admin", label: "Administrator", desc: "Super & School Admin", icon: adminIcon },
    { id: "teacher", label: "Faculty", desc: "Teachers & Mentors", icon: teacherIcon },
    { id: "student", label: "Student", desc: "Classes 1-12", icon: studentIcon },
    { id: "parent", label: "Parent", desc: "Guardian Portal", icon: parentIcon },
  ];

  const demoAccounts = [
    { label: "Super Admin", role: "admin", email: "superadmin@school.edu", pass: "password123", badge: "Platform Control" },
    { label: "Class Admin (10-A)", role: "admin", email: "admin10a@school.edu", pass: "password123", badge: "Class 10" },
    { label: "Teacher (Math)", role: "teacher", email: "teacher.math@school.edu", pass: "password123", badge: "Priya Sharma" },
    { label: "Student", role: "student", email: "alex.morgan@school.edu", pass: "password123", badge: "Class 10-A" },
  ];

  const fillDemo = (demo) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.pass);
    toast.info(`Loaded demo credentials for ${demo.label}`, { autoClose: 2000 });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error("Please select a user role to proceed.");
      return;
    }

    setLoading(true);

    try {
      // Try /api/login and fallback to /api/auth/login
      let response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      if (!response.ok && response.status === 404) {
        response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: selectedRole }),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Authentication successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const navRole = data.user.role === 'super_admin' ? 'admin' : selectedRole;
        setTimeout(() => {
          navigate(`/${navRole}`);
        }, 500);
      } else {
        toast.error(data.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (error) {
      toast.error("Unable to connect to API server. Please check your network or local server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '36px 36px' }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
              <img src={dyzen} alt="Dyzen Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">EduNexus</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                V2.4 SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400">Dyzen International School</p>
          </div>
        </div>

        {/* Live Google Sheets Status Chip */}
        <a 
          href={GOOGLE_SHEET_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all text-xs font-medium backdrop-blur-md group shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Google Sheets Live Sync</span>
          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
        </a>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-12 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Platform Showcase */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Generation Multi-Tenant School ERP</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Smart School Operations, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-400">
                  Zero Technical Barriers.
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Manage students, faculty, timetables, and academic records with seamless two-way Google Sheets automation and multi-branch tenancy.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Google Sheets Hub</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Non-technical administrators view and edit all school data in real-time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Interactive Timetable</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Automated teacher and room conflict detection with weekly grid builder.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-2.5">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Admission Wizard</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Multi-step enrollment with automated guardian linking & roll assignments.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Hostinger VPS Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Architected with MySQL dual-mode failover and hardened JWT security.
                </p>
              </div>
            </div>

            {/* Google Sheet Live Embed Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900/70 border border-emerald-500/30 flex items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Connected Google Sheet</div>
                  <div className="text-xs text-slate-300 font-mono truncate max-w-[280px]">1EOaG3KmoT1K9hYoBABKVTWZLjVB_RnExt6MQ1LLpodQ</div>
                </div>
              </div>
              <a 
                href={GOOGLE_SHEET_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
              >
                <span>Open Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: High-Tech Glass Auth Card */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-7 md:p-9 shadow-2xl shadow-black/80 backdrop-blur-xl relative overflow-hidden">
              
              {/* Card Header */}
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">Portal Authentication</h2>
                <p className="text-xs text-slate-400 mt-1">Select your access role and enter credentials</p>
              </div>

              {/* One-Click Demo Login Chips */}
              <div className="mb-6 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Quick 1-Click Demo Fill:</span>
                  <span className="text-indigo-400 text-[10px]">Instant Fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((demo) => (
                    <button
                      key={demo.label}
                      type="button"
                      onClick={() => fillDemo(demo)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                        email === demo.email 
                          ? "bg-indigo-600/30 border-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                      }`}
                    >
                      <div className="font-bold truncate text-[11px]">{demo.label}</div>
                      <div className="text-[9px] text-slate-400 truncate">{demo.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Select System Role
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-center border ${
                        selectedRole === r.id
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-102"
                          : "bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      <img src={r.icon} alt={r.label} className="w-6 h-6 object-contain" />
                      <span className="text-[11px] font-bold leading-tight">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Username / School Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@school.edu"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In to {roles.find(r => r.id === selectedRole)?.label || "Portal"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom links */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-2.5">
                <Link
                  to="/dev-docs"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium"
                >
                  <span>Interactive Architecture & Schema Map</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <div className="text-[11px] text-slate-500">
                  EduNexus V2.4 • Enterprise School Management Architecture
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>© 2026 EduNexus Platform. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
            <span>Google Spreadsheet View</span>
          </a>
          <span>•</span>
          <span>Dual-Mode MySQL Engine</span>
          <span>•</span>
          <span>Hostinger VPS Ready</span>
        </div>
      </footer>

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
