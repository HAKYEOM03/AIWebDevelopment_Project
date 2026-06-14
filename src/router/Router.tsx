import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import IntroPage from "../pages/IntroPage";
import QuizSelectPage from "../pages/QuizSelectPage";
import QuizPage from "../pages/QuizPage";
import ResultPage from "../pages/ResultPage";
import WrongAnswerPage from "../pages/WrongAnswerPage";
import LoginPage from "../pages/LoginPage";
import ExamDetailPage from "../pages/ExamDetailPage";
import ApplicantPage from "../pages/ApplicantPage";
import ManagePage from "../pages/ManagePage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/exam/:examId" element={<ExamDetailPage />} />
        <Route path="/quiz" element={<QuizSelectPage />} />
        <Route path="/applicants" element={<ApplicantPage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/quiz/:examId/:part/:set" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/wrong-answers" element={<WrongAnswerPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
