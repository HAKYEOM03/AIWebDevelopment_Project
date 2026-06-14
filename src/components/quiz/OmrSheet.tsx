interface OmrSheetProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, string>;
  onJump: (index: number) => void;
}

/** EXAM/TEST 모드 전용 OMR 답안지 사이드바 */
export default function OmrSheet({
  totalQuestions,
  currentIndex,
  answers,
  onJump,
}: OmrSheetProps) {
  return (
    <div className="w-72 bg-white rounded-3xl shadow-sm p-6 overflow-y-auto max-h-[calc(100vh-100px)] hidden md:block">
      <h3 className="font-bold text-gray-800 mb-4">OMR 답안지</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, idx) => (
          <button
            key={idx}
            onClick={() => onJump(idx)}
            className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center border-2
              ${
                currentIndex === idx
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200"
              }
              ${
                answers[idx]
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600"
              }
            `}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
