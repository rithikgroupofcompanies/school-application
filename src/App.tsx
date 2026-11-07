import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './modules/auth/LoginPage';
import { SuperAdminDashboard } from './modules/super-admin/SuperAdminDashboard';
import { StudentDirectoryPage } from './modules/school-admin/StudentDirectoryPage';
import { BulkImportWizard } from './modules/school-admin/BulkImportWizard';
import { AcademicOperationsPage } from './modules/school-admin/AcademicOperationsPage';
import { OpsDashboard } from './modules/ops/OpsDashboard';
import { ClassAdminDashboard } from './modules/school-admin/ClassAdminDashboard';
import { StudentIndividualPortal } from './modules/community/StudentIndividualPortal';
import { ParentWardPortal } from './modules/community/ParentWardPortal';
import { TeacherTimetableManager } from './modules/school-admin/TeacherTimetableManager';
import { StaffManagementPage } from './modules/school-admin/StaffManagementPage';
import { BehaviourReportAnalysis } from './modules/school-admin/BehaviourReportAnalysis';
import { HomeworkAssignmentHub } from './modules/school-admin/HomeworkAssignmentHub';
import { AnnouncementsNotificationHub } from './modules/community/AnnouncementsNotificationHub';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Platform Master Dashboard */}
            <Route
              path="/platform/dashboard"
              element={
                <ProtectedRoute>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Operations Staff Verification */}
            <Route
              path="/ops/dashboard"
              element={
                <ProtectedRoute>
                  <OpsDashboard />
                </ProtectedRoute>
              }
            />

            {/* School Admin: Staff Logins & Roles Management */}
            <Route
              path="/school/staff-management"
              element={
                <ProtectedRoute>
                  <StaffManagementPage />
                </ProtectedRoute>
              }
            />

            {/* Teacher Directory & Timetable Engine */}
            <Route
              path="/school/teachers-timetables"
              element={
                <ProtectedRoute>
                  <TeacherTimetableManager />
                </ProtectedRoute>
              }
            />

            {/* School Admin: Student Directory & Class/Section Filter */}
            <Route
              path="/school/students"
              element={
                <ProtectedRoute>
                  <StudentDirectoryPage />
                </ProtectedRoute>
              }
            />

            {/* Student Welfare & Behavioural Report Analysis */}
            <Route
              path="/school/behaviour"
              element={
                <ProtectedRoute>
                  <BehaviourReportAnalysis />
                </ProtectedRoute>
              }
            />

            {/* School Admin: Bulk CSV Ingestion Wizard */}
            <Route
              path="/school/students/import"
              element={
                <ProtectedRoute>
                  <BulkImportWizard />
                </ProtectedRoute>
              }
            />

            {/* Academics: Attendance, Marks, Timetable, Report Cards */}
            <Route
              path="/school/academics"
              element={
                <ProtectedRoute>
                  <AcademicOperationsPage />
                </ProtectedRoute>
              }
            />

            {/* Academics: Homework & Assignments */}
            <Route
              path="/school/homework"
              element={
                <ProtectedRoute>
                  <HomeworkAssignmentHub />
                </ProtectedRoute>
              }
            />

            {/* School Broadcast & Announcements */}
            <Route
              path="/school/announcements"
              element={
                <ProtectedRoute>
                  <AnnouncementsNotificationHub />
                </ProtectedRoute>
              }
            />

            {/* Class Admin / Teacher Workspace */}
            <Route
              path="/class/dashboard"
              element={
                <ProtectedRoute>
                  <ClassAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Community: Individual Student Portal */}
            <Route
              path="/student/portal"
              element={
                <ProtectedRoute>
                  <StudentIndividualPortal />
                </ProtectedRoute>
              }
            />

            {/* Community: Dedicated Parent Ward Portal */}
            <Route
              path="/parent/portal"
              element={
                <ProtectedRoute>
                  <ParentWardPortal />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
