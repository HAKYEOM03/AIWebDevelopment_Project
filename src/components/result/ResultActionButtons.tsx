interface ResultActionButtonsProps {
  part: string;
  wrongQuestionsCount: number;
  onRetry: () => void;
  onRetryWrongOnly: () => void;
  onWrongAnswers: () => void;
  onNextPart: () => void;
}

export default function ResultActionButtons({
  part,
  wrongQuestionsCount,
  onRetry,
  onRetryWrongOnly,
  onWrongAnswers,
  onNextPart,
}: ResultActionButtonsProps) {
  const partNum = Number(part);
  const nextPart = partNum < 4 ? partNum + 1 : null;
  const nextPartLabel = nextPart ? `Part ${nextPart}` : "파트 목록";

  return (
    <div className="flex flex-col gap-3">
      {/* 상단 줄: 다시풀기 + 오답노트 */}
      <div className="flex gap-3">
        <button
          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition text-sm"
          onClick={onRetry}
        >
          🔄 다시풀기
        </button>
        {wrongQuestionsCount > 0 && (
          <button
            className="flex-1 bg-amber-400 text-white py-4 rounded-2xl font-bold hover:bg-amber-500 transition text-sm"
            onClick={onWrongAnswers}
          >
            📝 오답노트
          </button>
        )}
      </div>

      {/* 하단 줄: 틀린 문제만 다시 풀기 + 다음 파트 */}
      <div className="flex gap-3">
        {wrongQuestionsCount > 0 && (
          <button
            className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition text-sm"
            onClick={onRetryWrongOnly}
          >
            ❌ 틀린 문제만 다시 풀기 ({wrongQuestionsCount}문제)
          </button>
        )}
        <button
          className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition text-sm"
          onClick={onNextPart}
        >
          {nextPartLabel} →
        </button>
      </div>
    </div>
  );
}
