import { useLocation, useNavigate } from "react-router-dom";
import { Question } from "../data/english/types";
import WrongAnswerHeader from "../components/wrong-answer/WrongAnswerHeader";
import WrongAnswerCard from "../components/wrong-answer/WrongAnswerCard";

interface WrongState {
  examId: string;
  part: string;
  set: string;
  questions: Question[];
  answers: (string | null)[];
  wrongQuestions: Question[];
}

export default function WrongAnswerPage() {
  const { state } = useLocation() as { state: WrongState };
  const navigate = useNavigate();

  if (!state) {
    navigate("/quiz");
    return null;
  }

  const { examId, part, set, questions, answers, wrongQuestions } = state;

  // question id → 유저 선택 답 매핑
  const answerMap = new Map<number, string | null>();
  questions.forEach((q, i) => answerMap.set(q.id, answers[i]));

  const setLabel = set === "all" ? "전체 문제" : `Set ${set}`;
  const examLabel =
    examId === "english" ? "영어 졸업 시험" :
    examId === "bible" ? "성경 졸업 시험" : "컴퓨터 졸업 시험";

  /** 틀린 문제만 다시 풀기 */
  const handleRetryWrongOnly = () => {
    navigate(`/quiz/${examId}/${part}/${set}`, {
      state: { retryWrongOnly: true, wrongQuestionIds: wrongQuestions.map((q) => q.id) },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <WrongAnswerHeader
        examLabel={examLabel}
        onBackClick={() => navigate("/quiz")}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {wrongQuestions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🎉</div>
            <p>모두 맞혔습니다!</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              오답 목록 ({wrongQuestions.length}개)
            </h2>

            <div className="space-y-4 mb-8">
              {wrongQuestions.map((q) => {
                const userAnswer = answerMap.get(q.id) ?? null;

                return (
                  <WrongAnswerCard
                    key={q.id}
                    question={q}
                    userAnswer={userAnswer}
                    setLabel={setLabel}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition"
            onClick={() => navigate(`/quiz/${examId}/${part}/${set}`)}
          >
            다시 풀기
          </button>

          {wrongQuestions.length > 0 && (
            <button
              className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition"
              onClick={handleRetryWrongOnly}
            >
              ❌ 틀린 문제만 다시 풀기
            </button>
          )}

          <button
            className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
            onClick={() => navigate("/quiz")}
          >
            파트 목록
          </button>
        </div>
      </div>
    </div>
  );
}
