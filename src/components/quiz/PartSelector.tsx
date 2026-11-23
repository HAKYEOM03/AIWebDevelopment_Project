import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizExam } from "../../data/quizExams";
import RandomTestSection, { ImageCaution } from "./RandomTestSection";

interface PartSelectorProps {
  exam: QuizExam;
}

const setColor = (color: string) => {
  if (color === "blue") return "bg-blue-700";
  if (color === "amber") return "bg-amber-600";
  return "bg-green-700";
};

type EnglishTab = "all" | "lc" | "rc" | "random";

// 영어 시험은 내용이 길어서 LC / RC / 랜덤 Set Test를 탭으로 나눠 하나씩 보여준다.
const ENGLISH_TABS: { id: EnglishTab; label: string; activeClass: string }[] = [
  { id: "all", label: "전체 보기", activeClass: "bg-gray-800 text-white" },
  { id: "lc", label: "🎧 LC 문제", activeClass: "bg-blue-700 text-white" },
  { id: "rc", label: "📖 RC 문제", activeClass: "bg-emerald-600 text-white" },
  { id: "random", label: "🎯 랜덤 Set Test", activeClass: "bg-purple-600 text-white" },
];

/** 선택된 시험의 파트/세트 선택 UI */
export default function PartSelector({ exam }: PartSelectorProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<EnglishTab>("lc");
  const isEnglish = exam.id === "english";

  const showParts = !isEnglish || tab !== "random";
  const showRandom = isEnglish && (tab === "all" || tab === "random");
  // 탭 이름이 이미 LC/RC를 알려주므로, 소제목은 전체 보기에서만 필요하다.
  const showGroupLabels = isEnglish && tab === "all";

  const visibleParts = exam.parts.filter((p) => {
    if (!isEnglish || tab === "all") return true;
    if (tab === "lc") return p.part <= 4;
    if (tab === "rc") return p.part >= 5;
    return false;
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        파트 선택 — {exam.name}
      </h2>

      {isEnglish && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {ENGLISH_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
                tab === t.id
                  ? t.activeClass
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {isEnglish && tab === "lc" && <ImageCaution className="mb-4" />}

      {showParts && (
        <div className="grid grid-cols-1 gap-4">
          {visibleParts.map((p) => (
            <div key={p.part}>
              {showGroupLabels && p.part === 1 && (
                <div className="text-sm font-bold text-blue-600 mb-2 ml-1">
                  🎧 LC 문제
                </div>
              )}
              {showGroupLabels && p.part === 1 && <ImageCaution className="mb-3 ml-1" />}
              {showGroupLabels && p.part === 5 && (
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
      )}

      {/* 랜덤 Set Test (영어만) */}
      {showRandom && <RandomTestSection examId={exam.id} standalone={tab === "random"} />}
    </div>
  );
}
