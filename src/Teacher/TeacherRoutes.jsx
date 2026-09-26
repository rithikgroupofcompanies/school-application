import Dashboard from "../Teacher/Dashboard";
import MarkAttendence from "../Teacher/MarkAttendence";

import { Routes, Route } from "react-router-dom";
import ExamAssign from "./ExamAssign";
import AllExams from "./AllExams";
import HomeworkAssign from "./HomeWorkAssign";
import Homework from "../Teacher/HomeWork";
function TeacherRoutes() {
  return(
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="MarkAttendance" element={<MarkAttendence />} />
    <Route path="ExamAssign" element={<ExamAssign/>}/>
    <Route path="AllExams" element={<AllExams/>} />
    <Route path="HomeWorkAssign" element={<HomeworkAssign/>} />
    <Route path="HomeWork" element={<Homework/>}/>
  </Routes>)
}
export default TeacherRoutes;
