import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import StudentRoutes from "./Student/StudentRoutes";
import TeacherRoutes from "./Teacher/TeacherRoutes";
import AdminRoutes from "./Admin/AdminRoutes";
import InteractiveArchitecture from "./Developer/InteractiveArchitecture";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dev-docs" element={<InteractiveArchitecture />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/teacher/*" element={<TeacherRoutes />} />
        <Route path="/student/*" element={<StudentRoutes/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;