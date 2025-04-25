import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "../widgets/Header/Header";
import { HomePage } from "../pages/HomePage";
import { TaskCreation } from "../pages/TaskCreation";
import { AllRunningTasksPage } from "../pages/AllRunningTasksPage";
import { AllCompletedTasksPage } from "../pages/AllCompletedTasksPage";
import { AllTasksPage } from "../pages/AllTasksPage"
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-task" element={<TaskCreation />} />
        <Route path="/all-running-tasks" element={<AllRunningTasksPage />} />
        <Route path="/all-completed-tasks" element={<AllCompletedTasksPage />} />
        <Route path="/all-tasks" element={<AllTasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;