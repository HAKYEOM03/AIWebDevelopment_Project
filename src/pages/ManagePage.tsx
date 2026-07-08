import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ExamDateEditor from "../components/manage/ExamDateEditor";
import NoticeManager from "../components/manage/NoticeManager";
import IntroContentManager from "../components/manage/IntroContentManager";

type Section = "date" | "notice" | "intro";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "date", label: "시험 날짜 관리", icon: "📅" },
  { id: "notice", label: "공지사항 관리", icon: "📢" },
  { id: "intro", label: "소개 내용 관리", icon: "📝" },
];

export default function ManagePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Section>("date");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">졸업고사 관리</h1>
        <p className="text-gray-500 mb-8">
          아래에서 관리할 항목을 선택한 뒤 내용을 수정하고 저장하세요. 저장한
          내용은 홈 화면과 소개 페이지에 즉시 반영됩니다.
        </p>

        {/* 관리 항목 선택 */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                active === s.id
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* 선택된 항목만 표시 */}
        <div>
          {active === "date" && <ExamDateEditor />}
          {active === "notice" && <NoticeManager />}
          {active === "intro" && <IntroContentManager />}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            홈에서 변경된 D-DAY · 공지 확인하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
