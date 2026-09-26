import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AddStudent from "./AddStudent";
import AddStaff from "./AddStaff";
import ViewUsers from "./ViewUsers";
import Attendance from "./Attendance";
import Homework from "./Homework";
import Tests from "./Tests";
import Behaviour from "./Behaviour";
import ReportCards from "./ReportCards";
import WhatsApp from "./WhatsApp";
import Settings from "./Settings";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<ViewUsers />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/homework" element={<Homework />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/behaviour" element={<Behaviour />} />
        <Route path="/reports" element={<ReportCards />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
