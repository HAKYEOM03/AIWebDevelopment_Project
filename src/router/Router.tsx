import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import IntroPage from "../pages/IntroPage";
import QuizSelectPage from "../pages/QuizSelectPage";
import QuizPage from "../pages/QuizPage";
import ResultPage from "../pages/ResultPage";
import WrongAnswerPage from "../pages/WrongAnswerPage";
import LoginPage from "../pages/LoginPage";
import MyGradExamPage from "../pages/MyGradExamPage";
import ExamDetailPage from "../pages/ExamDetailPage";
import ApplicantPage from "../pages/ApplicantPage";
import ManagePage from "../pages/ManagePage";
import RequireAdmin from "./RequireAdmin";
import RequireStudent from "./RequireStudent";

export default function Router() {
  return (
    <HashRouter>
      <Routes>
        {/* 학생(학교 API) 로그인 없이는 아래 페이지들을 볼 수 없음 */}
        <Route
          path="/"
          element={
            <RequireStudent>
              <HomePage />
            </RequireStudent>
          }
        />
        <Route
          path="/intro"
          element={
            <RequireStudent>
              <IntroPage />
            </RequireStudent>
          }
        />
        <Route
          path="/exam/:examId"
          element={
            <RequireStudent>
              <ExamDetailPage />
            </RequireStudent>
          }
        />
        <Route
          path="/quiz"
          element={
            <RequireStudent>
              <QuizSelectPage />
            </RequireStudent>
          }
        />
        <Route
          path="/quiz/:examId/:part/:set"
          element={
            <RequireStudent>
              <QuizPage />
            </RequireStudent>
          }
        />
        <Route
          path="/result"
          element={
            <RequireStudent>
              <ResultPage />
            </RequireStudent>
          }
        />
        <Route
          path="/wrong-answers"
          element={
            <RequireStudent>
              <WrongAnswerPage />
            </RequireStudent>
          }
        />
        <Route
          path="/my-grades"
          element={
            <RequireStudent>
              <MyGradExamPage />
            </RequireStudent>
          }
        />

        {/* 관리자 전용 — 학생 로그인과 별개, 관리자 로그인으로만 보호 */}
        <Route
          path="/applicants"
          element={
            <RequireAdmin>
              <ApplicantPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/manage"
          element={
            <RequireAdmin>
              <ManagePage />
            </RequireAdmin>
          }
        />

        {/* 로그인 페이지 자체는 보호하지 않음 (그래야 들어갈 수 있음) */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
}
