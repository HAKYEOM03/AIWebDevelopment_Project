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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {exams.map((e) => (
        <button
          key={e.id}
          className={`border-2 rounded-3xl p-6 text-left transition-all ${colorBtn(
            e.color,
            selectedExam === e.id
          )}`}
          onClick={() => onSelect(e.id)}
        >
          <div className="text-4xl mb-3">{e.icon}</div>
          <div
            className={`text-lg font-bold mb-1 ${
              selectedExam === e.id ? "text-white" : "text-gray-800"
            }`}
          >
            {e.name}
          </div>
          <div
            className={`text-xs ${
              selectedExam === e.id ? "text-white/80" : "text-gray-500"
            }`}
          >
            {e.description}
          </div>
        </button>
      ))}
    </div>
  );
}
