import { useNavigate } from "react-router-dom";
import { QuizExam } from "../../data/quizExams";
import RandomTestSection from "./RandomTestSection";

interface PartSelectorProps {
  exam: QuizExam;
}

const setColor = (color: string) => {
  if (color === "blue") return "bg-blue-700";
  if (color === "amber") return "bg-amber-600";
  return "bg-green-700";
};

/** 선택된 시험의 파트/세트 선택 UI */
export default function PartSelector({ exam }: PartSelectorProps) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        파트 선택 — {exam.name}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {exam.parts.map((p) => (
          <div key={p.part}>
            {exam.id === "english" && p.part === 1 && (
              <div className="text-sm font-bold text-blue-600 mb-2 ml-1">
                🎧 LC 문제
              </div>
            )}
            {exam.id === "english" && p.part === 5 && (
              <div className="text-sm font-bold text-emerald-600 mb-2 ml-1 mt-2">
                📖 RC 문제
              </div>
            )}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="font-semibold text-gray-800 mb-3">{p.label}</div>
              <div className="flex flex-wrap gap-3">
                {p.sets.map((s) => (
                  <button
                    key={s}
                    className={`${setColor(
                      exam.color
                    )} text-white px-6 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm`}
                    onClick={() => navigate(`/quiz/${exam.id}/${p.part}/${s}`)}
                  >
                    Set {s} 풀기
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 랜덤 Set Test (영어만) */}
      {exam.id === "english" && <RandomTestSection examId={exam.id} />}
    </div>
  );
}
