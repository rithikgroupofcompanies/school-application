// routes/StudentRoutes.jsx

import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";// import StudentProfile from "../pages/student/StudentProfile";
import CircularEvent from "./CircularEvent";
import Attendance from "./Attendance";
import ApplyForLeave from "./ApplyForLeave";
import RankCard from "./RankCard";
import TestPage from "./TestPage";
import Homework from "./Homework";
function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="ApplyForLeave" element={<ApplyForLeave/>}/>
      <Route path="Attendance" element={<Attendance />} />
      <Route path="CircularEvent" element={<CircularEvent/>}/>
      <Route path="RankCard" element={<RankCard/>}/>
      <Route path="TestPage" element={<TestPage/>}/>
      <Route path="Homework" element={<Homework/>}/>
    </Routes>
  );
}

export default StudentRoutes;