import { useLocation, useNavigate } from "react-router-dom";
import { Question } from "../data/english/types";
import ScoreCard from "../components/result/ScoreCard";
import ResultActionButtons from "../components/result/ResultActionButtons";
import QuestionResults from "../components/result/QuestionResults";

interface ResultState {
  examId: string;
  part: string;
  set: string;
  questions: Question[];
  answers: (string | null)[];
  wrongQuestions: Question[];
}

export default function ResultPage() {
  const { state } = useLocation() as { state: ResultState };
  const navigate = useNavigate();

  if (!state) {
    navigate("/quiz");
    return null;
  }

  const { examId, part, set, questions, answers, wrongQuestions } = state;

  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const total = questions.length;
  const score = Math.round((correct / total) * 100);

  const partNum = Number(part);
  const isTestMode = set === "test";
  const partLabel =
    partNum === 0 ? "종합 Set Test" :
    partNum === 1 ? "사진 묘사 (Photographs)" :
    partNum === 2 ? "질의 응답 (Question-Response)" :
    partNum === 3 ? "짧은 대화 (Short Conversations)" :
    partNum === 4 ? "짧은 담화 (Short Talks)" : `Part ${part}`;
  const setLabel = isTestMode
    ? (partNum === 0 ? "종합 랜덤 100문제" : `랜덤 15문제`)
    : set === "all" ? "전체 문제" : `Set ${set}`;
  const examLabel =
    examId === "english" ? "영어 졸업고사" :
    examId === "bible" ? "성경 졸업고사" : "컴퓨터 졸업고사";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 상단 뱃지 */}
        <div className="flex justify-center gap-2 mb-5">
          <span className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-full">
            {examLabel}
          </span>
          {isTestMode && (
            <span className="bg-purple-600 text-white text-sm font-bold px-5 py-2 rounded-full">
              🎯 Set Test
            </span>
          )}
        </div>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isTestMode
              ? (partNum === 0 ? "Part 종합 Set Test" : `Part ${part} Set Test`)
              : `Part ${part}: ${partLabel}`}
          </h1>
          <p className="text-sm text-gray-400 mt-1">{setLabel}</p>
        </div>

        {/* 점수 카드 */}
        <div className="mb-6">
          <ScoreCard score={score} correct={correct} total={total} />
        </div>

        {/* 액션 버튼 */}
        <div className="mb-6">
          <ResultActionButtons
            part={part}
            wrongQuestionsCount={wrongQuestions.length}
            onRetry={() => navigate(`/quiz/${examId}/${part}/${set}`)}
            onRetryWrongOnly={() =>
              navigate(`/quiz/${examId}/${part}/${set}`, {
                state: { retryWrongOnly: true, wrongQuestionIds: wrongQuestions.map((q) => q.id) },
              })
            }
            onWrongAnswers={() =>
              navigate("/wrong-answers", {
                state: { examId, part, set, questions, answers, wrongQuestions },
              })
            }
            onNextPart={() => {
              const nextPart = partNum < 4 ? partNum + 1 : null;
              if (nextPart) {
                navigate(`/quiz/${examId}/${nextPart}/1`);
              } else {
                navigate("/quiz");
              }
            }}
          />
        </div>

        {/* 문항별 결과 */}
        <div>
          <QuestionResults questions={questions} answers={answers} />
        </div>
      </div>
    </div>
  );
}
