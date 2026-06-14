import { useContext } from "react";
import { ExamInfo } from "../../data/examInfo";
import { getColorSet } from "../../utils/colorMap";
import { ExamDataContext } from "../../context/ExamDataContext";
import CountdownTimer from "../home/CountdownTimer";
import RegistrationStatus from "./RegistrationStatus";

/** 전체 보기용 시험 카드 (3열 그리드) */
export default function ExamInfoCard({ exam }: { exam: ExamInfo }) {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { examDates } = examData;
  const c = getColorSet(exam.color);
  const effectiveDate = examDates[exam.id] ? new Date(examDates[exam.id]) : exam.examDate;

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className={`${c.header} text-white px-6 py-5`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{c.icon}</span>
          <div>
            <h3 className="text-xl font-bold">{exam.fullName}</h3>
            <p className="text-sm opacity-80">
              시험일: {effectiveDate.toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <RegistrationStatus exam={exam} />

        <CountdownTimer
          examDate={effectiveDate}
          examName={`${exam.fullName} D-DAY`}
          color={exam.color as "blue" | "amber" | "green"}
        />

        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">신청 기간</div>
          <p className="text-sm text-gray-700">
            {exam.registrationStart.toLocaleDateString("ko-KR")} ~{" "}
            {exam.registrationEnd.toLocaleDateString("ko-KR")}
          </p>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">응시 장소 / 시간</div>
          <p className="text-sm text-gray-700">{exam.examLocation}</p>
          <p className="text-sm text-gray-700">{exam.examTime}</p>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">합격 기준</div>
          <p className="text-sm text-gray-700">{exam.passingScore}</p>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">시험 준비물</div>
          <div className="flex flex-wrap gap-2">
            {exam.requirements.map((r, i) => (
              <span key={i} className={`text-xs px-3 py-1 rounded-full font-medium ${c.badge}`}>
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
