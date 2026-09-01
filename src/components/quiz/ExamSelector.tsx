import { useState } from "react";
import { QuizExam } from "../../data/quizExams";

interface ExamSelectorProps {
  exams: QuizExam[];
  selectedExam: string | null;
  onSelect: (id: string) => void;
}

const colorBtn = (color: string, active: boolean) => {
  if (color === "blue")
    return active
      ? "bg-blue-700 text-white border-blue-700"
      : "bg-white border-gray-200 hover:border-blue-400";
  if (color === "amber")
    return active
      ? "bg-amber-600 text-white border-amber-600"
      : "bg-white border-gray-200 hover:border-amber-400";
  return active
    ? "bg-green-700 text-white border-green-700"
    : "bg-white border-gray-200 hover:border-green-400";
};

/** 시험 과목 선택 카드 그리드 */
export default function ExamSelector({
  exams,
  selectedExam,
  onSelect,
}: ExamSelectorProps) {
  const [comingSoonExam, setComingSoonExam] = useState<QuizExam | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {exams.map((e) => (
          <button
            key={e.id}
            className={`relative border-2 rounded-3xl p-6 text-left transition-all ${
              e.comingSoon
                ? "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
                : colorBtn(e.color, selectedExam === e.id)
            }`}
            onClick={() => (e.comingSoon ? setComingSoonExam(e) : onSelect(e.id))}
          >
            {e.comingSoon && (
              <span className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                준비중
              </span>
            )}
            <div className={`text-4xl mb-3 ${e.comingSoon ? "grayscale opacity-60" : ""}`}>
              {e.icon}
            </div>
            <div
              className={`text-lg font-bold mb-1 ${
                e.comingSoon ? "text-gray-500" : selectedExam === e.id ? "text-white" : "text-gray-800"
              }`}
            >
              {e.name}
            </div>
            <div
              className={`text-xs ${
                e.comingSoon ? "text-gray-400" : selectedExam === e.id ? "text-white/80" : "text-gray-500"
              }`}
            >
              {e.description}
            </div>
          </button>
        ))}
      </div>

      {comingSoonExam && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setComingSoonExam(null)}
        >
          <div
            className="bg-white rounded-2xl px-8 py-8 w-full max-w-sm text-center shadow-xl"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="text-4xl mb-3">{comingSoonExam.icon}</div>
            <div className="text-lg font-bold text-gray-800 mb-2">{comingSoonExam.name}</div>
            <p className="text-gray-500 text-sm mb-6">현재 준비중입니다.</p>
            <button
              onClick={() => setComingSoonExam(null)}
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
