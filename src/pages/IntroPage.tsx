import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import ExamDetailCard from "../components/intro/ExamDetailCard";
import { useEffectiveExamList } from "../hooks/useEffectiveExamList";
import { ComingSoonModal } from "../components/quiz/ExamSelector";
import LockedExamCard from "../components/common/LockedExamCard";
import { useExamData } from "../context/ExamDataContext";
import { getColorSet } from "../utils/colorMap";

export default function IntroPage() {
  // 잠긴(준비중) 시험 탭을 눌렀을 때 띄우는 안내 창 정보
  const [blockedExam, setBlockedExam] = useState<{ icon: string; name: string } | null>(null);
  const examInfoList = useEffectiveExamList();
  const { isExamLocked } = useExamData();
  // 처음 들어오면 잠기지 않은 첫 번째 시험을 바로 보여준다.
  const [selected, setSelected] = useState<string | null>(
    () => examInfoList.find((e) => !isExamLocked(e.id))?.id ?? null
  );
  const selectedExam = examInfoList.find((e) => e.id === selected) ?? null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">졸업 시험 소개</h1>
        <p className="text-gray-500 mb-8">
          시험별 신청 기간, 응시 장소, 시험 조건 및 준비물을 확인하세요.
        </p>

        {/* 탭 선택 */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {examInfoList.map((exam) => (
            <button
              key={exam.id}
              className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
                selected === exam.id
                  ? exam.color === "blue"
                    ? "bg-blue-700 text-white"
                    : exam.color === "amber"
                    ? "bg-amber-600 text-white"
                    : "bg-green-700 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
              onClick={() =>
                isExamLocked(exam.id)
                  ? setBlockedExam({ icon: getColorSet(exam.color).icon, name: exam.fullName })
                  : setSelected(exam.id)
              }
            >
              {exam.name}
            </button>
          ))}
        </div>

        {blockedExam && (
          <ComingSoonModal
            icon={blockedExam.icon}
            name={blockedExam.name}
            onClose={() => setBlockedExam(null)}
          />
        )}

        {/* 콘텐츠 */}
        {selectedExam ? (
          <ExamDetailCard key={selectedExam.id} exam={selectedExam} />
        ) : (
          <LockedExamCard icon="🔒" name="졸업 시험 소개" />
        )}

        {/* 공통 유의사항 */}
        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <span>⚠️</span> 공통 유의사항
          </h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• 신청은 학교 포털시스템에서 기간 내에 완료해야 합니다.</li>
            <li>• 시험 당일 학생증 미지참 시 응시 불가합니다.</li>
            <li>• 졸업 예정 학기에 반드시 응시해야 합니다.</li>
            <li>• 면제 요건 해당자는 별도 신청이 필요합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
