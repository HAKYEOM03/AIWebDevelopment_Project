import { Question } from "../../data/english/types";

const OPTION_LABELS = ["A", "B", "C", "D"];

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | undefined;
  showAnswer: boolean;
  onSelectAnswer: (answer: string) => void;
}

/** 문제 표시 카드 (이미지 + 대화지문 + 문제 + 보기) */
export default function QuestionCard({
  question: q,
  selectedAnswer,
  showAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <>
      {/* 파트1 이미지 */}
      {q.imageUrl && (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-5 flex items-center justify-center p-4">
          <img
            src={q.imageUrl}
            alt="문제 이미지"
            className="max-w-full max-h-80 object-contain rounded-xl"
          />
        </div>
      )}

      {/* 대화 지문 (Part 3/4) */}
      {q.conversation && (
        <div className="bg-gray-100 border border-gray-200 rounded-3xl p-6 mb-5 max-h-96 overflow-y-auto shadow-inner">
          <span className="inline-block bg-gray-700 text-white text-xs px-2.5 py-1 rounded-full font-bold mb-3 tracking-wide">
            {q.part === 4 ? "TALK" : "CONVERSATION"}
          </span>
          <p className="text-base text-gray-800 leading-relaxed font-medium whitespace-pre-line">
            {q.conversation}
          </p>
        </div>
      )}

      {/* 문제 */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-5">
        <p className="text-lg font-semibold text-gray-800 leading-relaxed">
          {q.question}
        </p>
      </div>

      {/* 보기 */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          const label = OPTION_LABELS[idx];
          const isSelected = selectedAnswer === label;

          let btnClass = "bg-white border-gray-200 text-gray-800";
          if (showAnswer) {
            if (label === q.answer)
              btnClass = "bg-green-100 border-green-500 text-green-800";
            else if (isSelected)
              btnClass = "bg-red-100 border-red-400 text-red-700";
          } else if (isSelected) {
            btnClass = "bg-blue-600 text-white border-blue-600";
          }

          return (
            <button
              key={idx}
              className={`w-full text-left border-2 rounded-2xl px-5 py-4 font-medium transition-all ${btnClass}`}
              onClick={() => onSelectAnswer(label)}
            >
              <span className="font-bold mr-3">{label}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </>
  );
}
