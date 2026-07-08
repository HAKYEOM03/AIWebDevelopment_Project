import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamInfo } from "../../data/examInfo";
import { getColorSet } from "../../utils/colorMap";
import { ExamDataContext } from "../../context/ExamDataContext";
import CountdownTimer from "../home/CountdownTimer";
import RegistrationStatus from "./RegistrationStatus";
import NoticeSection from "../exam-detail/NoticeSection";
import InfoSectionCard from "../exam-detail/InfoSectionCard";

/** 개별 탭 선택 시 상세 카드 (공지사항 포함, 입력은 관리 페이지에서) */
export default function ExamDetailCard({ exam }: { exam: ExamInfo }) {
  const navigate = useNavigate();
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { examDates } = examData;
  const c = getColorSet(exam.color);
  // 관리 페이지에서 설정한 날짜가 있으면 우선 사용
  const effectiveDate = examDates[exam.id] ? new Date(examDates[exam.id]) : exam.examDate;
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-3xl mx-auto w-full">
      {/* 헤더 */}
      <div className={`${c.header} text-white px-6 py-5`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{c.icon}</span>
          <div>
            <h3 className="text-xl font-bold">{exam.fullName}</h3>
            <p className="text-sm opacity-80">
              시험일: {effectiveDate.toLocaleDateString("ko-KR")} · {exam.examTime}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        <RegistrationStatus exam={exam} />

        {/* D-DAY */}
        <CountdownTimer
          examDate={effectiveDate}
          examName={`${exam.fullName} D-DAY`}
          color={exam.color as "blue" | "amber" | "green"}
        />

        {/* 기본 정보 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">신청 기간</div>
            <p className="text-sm text-gray-700">
              {exam.registrationStart.toLocaleDateString("ko-KR")} ~{" "}
              {exam.registrationEnd.toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">응시 장소</div>
            <p className="text-sm text-gray-700">{exam.examLocation}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">합격 기준</div>
            <p className="text-sm text-gray-700">{exam.passingScore}</p>
          </div>
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase mb-1">문의</div>
            <p className="text-sm text-gray-700">{exam.contact}</p>
          </div>
        </div>

        {/* 준비물 */}
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-2">시험 준비물</div>
          <div className="flex flex-wrap gap-2">
            {exam.requirements.map((r, i) => (
              <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${c.badge}`}>
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* 더 자세히 보기: 상세 안내 섹션 (졸업고사 상세 페이지와 동일한 내용) */}
        {showMore && (
          <div className="space-y-4">
            {exam.infoSections.map((section, si) => (
              <InfoSectionCard key={si} section={section} color={exam.color} />
            ))}
          </div>
        )}

        <button
          onClick={() => setShowMore((v) => !v)}
          className="w-full py-3 rounded-2xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {showMore ? "간단히 보기 ↑" : "더 자세히 보기 ↓"}
        </button>

        {/* 공지사항 (exam-detail 컴포넌트 재사용) */}
        <NoticeSection examId={exam.id} />

        {/* 문제 풀기 버튼 */}
        <button
          onClick={() => navigate("/quiz")}
          className={`w-full ${c.btn} ${c.btnHover} text-white font-bold py-3.5 rounded-2xl text-base transition-colors`}
        >
          문제 풀기 →
        </button>
      </div>
    </div>
  );
}
