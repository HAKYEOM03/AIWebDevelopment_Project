interface QuizModeBadgeProps {
  isTestMode: boolean;
  isRetryWrongOnly: boolean;
  testLabel: string;
  timeLimit: string;
  questionCount: number;
}

/** 퀴즈 상단에 표시되는 모드 배지 */
export default function QuizModeBadge({
  isTestMode,
  isRetryWrongOnly,
  testLabel,
  timeLimit,
  questionCount,
}: QuizModeBadgeProps) {
  if (isTestMode) {
    return (
      <div className="mb-4 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold text-center">
        🎯 {testLabel} · {questionCount}문제 · 제한시간 {timeLimit}
      </div>
    );
  }

  if (isRetryWrongOnly) {
    return (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold text-center">
        ❌ 틀린 문제만 다시 풀기 모드 ({questionCount}문제)
      </div>
    );
  }

  return null;
}
