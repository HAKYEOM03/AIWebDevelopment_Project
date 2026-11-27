import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ExamSelector from "../components/quiz/ExamSelector";
import PartSelector from "../components/quiz/PartSelector";
import { quizExams } from "../data/quizExams";
import { useExamData } from "../context/ExamDataContext";

interface QuizSelectLocationState {
  examId?: string;
}

export default function QuizSelectPage() {
  const location = useLocation();
  const { isExamLocked } = useExamData();
  const requestedExamId = (location.state as QuizSelectLocationState | null)?.examId ?? null;
  // 잠긴(준비중) 시험은 다른 화면에서 state로 넘어와도 선택된 상태로 열리지 않게 한다.
  const preselectedExamId =
    requestedExamId && !isExamLocked(requestedExamId) ? requestedExamId : null;
  const [selectedExam, setSelectedExam] = useState<string | null>(preselectedExamId);

  // 서버 설정을 늦게 받아와 고른 시험이 잠겨 있으면 열지 않는다.
  const exam = quizExams.find((e) => e.id === selectedExam && !isExamLocked(e.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">문제 풀기</h1>
        <p className="text-gray-500 mb-8">
          시험 과목을 선택한 후 풀고 싶은 파트를 고르세요.
        </p>

        {/* 시험 선택 */}
        <ExamSelector
          exams={quizExams}
          selectedExam={selectedExam}
          onSelect={setSelectedExam}
        />

        {/* 파트 선택 */}
        {exam && <PartSelector exam={exam} />}

        {!selectedExam && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-5xl mb-4">👆</div>
            <p>위에서 시험 과목을 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
