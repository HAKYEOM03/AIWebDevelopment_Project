import { ExamMode } from "../../pages/QuizPage";

interface QuizControlsProps {
  mode: ExamMode;
  currentIndex: number;
  totalQuestions: number;
  showAnswer: boolean;
  onPrev: () => void;
  onNext: () => void;
  onShowAnswer: () => void;
  onSubmit: () => void;
}

/** 퀴즈 하단 이전/다음/정답확인/최종제출 버튼 */
export default function QuizControls({
  mode,
  currentIndex,
  totalQuestions,
  showAnswer,
  onPrev,
  onNext,
  onShowAnswer,
  onSubmit,
}: QuizControlsProps) {
  const isLast = currentIndex === totalQuestions - 1;
  const hasTimer = mode === "EXAM" || mode === "TEST";

  return (
    <div className="flex gap-4">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="px-6 py-4 rounded-2xl bg-gray-200 font-bold disabled:opacity-50"
      >
        이전
      </button>

      {mode === "PRACTICE" && (
        <button
          className="flex-1 bg-blue-700 text-white rounded-2xl font-bold"
          onClick={showAnswer ? onNext : onShowAnswer}
        >
          {showAnswer ? "다음 문제" : "정답 확인"}
        </button>
      )}

      {hasTimer && !isLast && (
        <button
          onClick={onNext}
          className="flex-1 bg-blue-700 text-white rounded-2xl font-bold"
        >
          다음
        </button>
      )}

      {((mode === "PRACTICE" && isLast && showAnswer) || hasTimer) && (
        <button
          onClick={onSubmit}
          className="px-6 py-4 bg-gray-800 text-white rounded-2xl font-bold"
        >
          최종 제출
        </button>
      )}
    </div>
  );
}
