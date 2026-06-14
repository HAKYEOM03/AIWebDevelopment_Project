interface WrongAnswerHeaderProps {
  examLabel: string;
  onBackClick: () => void;
}

export default function WrongAnswerHeader({
  examLabel,
  onBackClick,
}: WrongAnswerHeaderProps) {
  return (
    <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">오답노트</h1>
        <p className="text-sm text-gray-400">{examLabel}</p>
      </div>
      <button
        onClick={onBackClick}
        className="text-sm text-gray-400 hover:text-gray-700 transition"
      >
        ← 파트 목록
      </button>
    </div>
  );
}
