interface ScoreCardProps {
  score: number;
  correct: number;
  total: number;
}

export default function ScoreCard({ score, correct, total }: ScoreCardProps) {
  const emoji = score >= 80 ? "🎉" : score >= 60 ? "📝" : "💪";
  const msg =
    score >= 80 ? "훌륭합니다!" :
    score >= 60 ? "잘 하고 있어요!" : "다시 한번 도전해보세요!";
  const scoreColor =
    score >= 80 ? "text-green-600" :
    score >= 60 ? "text-amber-500" : "text-red-500";

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 text-center">
      <div className="text-5xl mb-3">{emoji}</div>
      <p className="text-gray-400 text-sm mb-5">{msg}</p>

      <div className={`text-6xl font-black mb-8 ${scoreColor}`}>{score}점</div>

      <div className="flex justify-center divide-x divide-gray-200 mb-8">
        <div className="flex-1 px-4">
          <div className="text-3xl font-bold text-blue-500">{correct}</div>
          <div className="text-xs text-gray-400 mt-1">맞춤</div>
        </div>
        <div className="flex-1 px-4">
          <div className="text-3xl font-bold text-red-500">{total - correct}</div>
          <div className="text-xs text-gray-400 mt-1">틀림</div>
        </div>
        <div className="flex-1 px-4">
          <div className="text-3xl font-bold text-indigo-500">{total}</div>
          <div className="text-xs text-gray-400 mt-1">전체</div>
        </div>
      </div>
    </div>
  );
}
