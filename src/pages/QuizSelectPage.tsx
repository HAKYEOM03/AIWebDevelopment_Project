import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import ExamSelector from "../components/quiz/ExamSelector";
import PartSelector from "../components/quiz/PartSelector";
import { quizExams } from "../data/quizExams";

export default function QuizSelectPage() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const exam = quizExams.find((e) => e.id === selectedExam);

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
