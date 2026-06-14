import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ExamDateEditor from "../components/manage/ExamDateEditor";
import NoticeManager from "../components/manage/NoticeManager";
import StatsManager from "../components/manage/StatsManager";

export default function ManagePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">졸업고사 관리</h1>
        <p className="text-gray-500 mb-8">
          시험 날짜와 공지사항을 직접 설정하세요. 입력한 내용은 브라우저에
          저장되어 홈 화면에 즉시 반영됩니다.
        </p>

        <div className="space-y-6">
          {/* 상단: 시험 날짜 설정 + 공지사항 작성 (양쪽 배치) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <ExamDateEditor />
            <NoticeManager />
          </div>

          {/* 하단: 합격률(통계) 입력 — 가로 전체 폭 */}
          <StatsManager />
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
