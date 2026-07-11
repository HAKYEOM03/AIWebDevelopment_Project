import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getColorSet } from "../utils/colorMap";
import ExamBasicInfo from "../components/exam-detail/ExamBasicInfo";
import InfoSectionCard from "../components/exam-detail/InfoSectionCard";
import NoticeSection from "../components/exam-detail/NoticeSection";
import CountdownTimer from "../components/home/CountdownTimer";
import { ExamDataContext } from "../context/ExamDataContext";
import { useEffectiveExamList } from "../hooks/useEffectiveExamList";

export default function ExamDetailPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { examDates } = examData;
  const examInfoList = useEffectiveExamList();

  const exam = examInfoList.find((e) => e.id === examId);

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">존재하지 않는 졸업고사입니다.</p>
          <button onClick={() => navigate("/")} className="text-blue-600 hover:underline text-sm">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const c = getColorSet(exam.color);
  // 관리 페이지에서 설정한 날짜가 있으면 우선 사용
  const effectiveDate = examDates[exam.id] ? new Date(examDates[exam.id]) : exam.examDate;
  const now = new Date();
  const isOpen = now >= exam.registrationStart && now <= exam.registrationEnd;
  const isExpired = now > exam.registrationEnd;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 헤더 배너 */}
      <div className={`${c.header} text-white py-10 px-4`}>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <span className="text-5xl">{c.icon}</span>
          <div>
            <div className="text-sm opacity-75 mb-1">졸업고사 상세 정보</div>
            <h1 className="text-3xl font-bold">{exam.fullName}</h1>
            <p className="text-sm opacity-80 mt-1">
              시험일: {effectiveDate.toLocaleDateString("ko-KR")} · {exam.examTime}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* D-DAY */}
        <CountdownTimer
          examDate={effectiveDate}
          examName={`${exam.fullName} D-DAY`}
          color={exam.color as "blue" | "amber" | "green"}
        />

        {/* 기본 정보 */}
        <ExamBasicInfo exam={exam} isOpen={isOpen} isExpired={isExpired} />

        {/* 상세 안내 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exam.infoSections.map((section, si) => (
            <InfoSectionCard key={si} section={section} color={exam.color} />
          ))}
        </div>

        {/* 공지사항 */}
        <NoticeSection examId={exam.id} />

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/quiz", { state: { examId: exam.id } })}
            className={`flex-1 ${c.btn} ${c.btnHover} text-white font-bold py-3.5 rounded-2xl text-base transition-colors`}
          >
            문제 풀기 →
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 rounded-2xl text-sm transition-colors"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
