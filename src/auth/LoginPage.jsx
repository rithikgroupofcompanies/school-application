import  { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  teacherIcon,
  adminIcon,
  studentIcon,
  parentIcon,
} from "../assets/role";
import dyzen from "../assets/Logos/dyzen.avif";
export default function LoginPage() {
  const navigate=useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: "admin", label: "Admin", icon: adminIcon },
    { id: "teacher", label: "Teacher", icon: teacherIcon },
    { id: "student", label: "Student", icon: studentIcon },
    { id: "parent", label: "Parent", icon: parentIcon },
  ];

  const handleSignIn = async (e) => {
    e.preventDefault();
    if(!selectedRole) {
      toast.error("Kindly Choose one Of the Role");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // super_admin users use the admin dashboard
        const navRole = data.user.role === 'super_admin' ? 'admin' : selectedRole;
        navigate(`/${navRole}`);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-grey-600 rounded-3xl flex items-center justify-center shadow-lg">
              <img src={dyzen} alt="LOGO" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-500">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            Select your role
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                
                className={`relative p-6 rounded-2xl transition-all duration-300 ${
                  selectedRole === role.id
                    ? "bg-blue-50 border-2 border-blue-500 shadow-lg scale-105"
                    : "bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-md"
                }`}
              >
                {/* Checkmark for selected role */}
                {selectedRole === role.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl">
                    <img
                      src={role.icon}
                      alt={role.label}
                      className="w-10 h-10"
                    />
                  </div>
                  <span
                    className={`font-semibold text-sm md:text-base ${
                      selectedRole === role.id
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {role.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSignIn}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Email Address
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                placeholder="your.email@school.edu"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-3"
            >
              Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                 <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-8">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
          >
            Sign In
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Developer link to interactive docs */}
        <div className="mt-6 text-center">
          <Link
            to="/dev-docs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850 transition text-xs font-semibold shadow-md"
          >
            <span>Explore Module Hierarchy & Screen Flow Simulator</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          </Link>
        </div>

        {/* Support Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Need help?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Contact Support
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            v2.4.0 • EdTech Solutions Inc.
          </p>
        </div>
      </div>
      <ToastContainer position="top-left" />
    </div>
    
  );
}
