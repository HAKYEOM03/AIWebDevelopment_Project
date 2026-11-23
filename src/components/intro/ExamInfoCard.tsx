import { useContext } from "react";
import { ExamInfo } from "../../data/examInfo";
import { getColorSet } from "../../utils/colorMap";
import { ExamDataContext } from "../../context/ExamDataContext";
import CountdownTimer from "../home/CountdownTimer";
import RegistrationStatus from "./RegistrationStatus";

const PENDING_TEXT = "--준비중--";

/** 준비중/비활성 시험 카드의 본문 — 실제 날짜·장소·기준 대신 "--준비중--"만 보여준다. */
function PendingBody({ exam }: { exam: ExamInfo }) {
  const rows = ["신청 기간", "응시 장소 / 시간", "합격 기준", "시험 준비물"];

  return (
    <div
      className="px-6 py-5 space-y-4 grayscale opacity-50 select-none pointer-events-none"
      aria-disabled
    >
      <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-500">
        {PENDING_TEXT}
      </div>

      <div className="rounded-2xl bg-gray-400 text-white p-5">
        <div className="text-sm font-bold mb-3">{exam.fullName} D-DAY</div>
        <p className="text-center text-xl font-bold">{PENDING_TEXT}</p>
      </div>

      {rows.map((label) => (
        <div key={label}>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</div>
          <p className="text-sm text-gray-700">{PENDING_TEXT}</p>
        </div>
      ))}
    </div>
  );
}

/** 전체 보기용 시험 카드 (3열 그리드) */
export default function ExamInfoCard({ exam }: { exam: ExamInfo }) {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { examDates, isExamLocked } = examData;
  const c = getColorSet(exam.color);
  const effectiveDate = examDates[exam.id] ? new Date(examDates[exam.id]) : exam.examDate;

  // 잠긴(준비중) 시험은 시험 이름만 또렷하게 두고 나머지는 회색으로 흐리게, 내용은 "--준비중--"으로 보여준다.
  const muted = isExamLocked(exam.id);

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className={`${muted ? "bg-gray-400" : c.header} text-white px-6 py-5`}>
        <div className="flex items-center gap-3">
          <span className={`text-3xl ${muted ? "grayscale opacity-50" : ""}`}>{c.icon}</span>
          <div>
            <h3 className="text-xl font-bold">{exam.fullName}</h3>
            <p className={`text-sm ${muted ? "opacity-50" : "opacity-80"}`}>
              시험일: {muted ? PENDING_TEXT : effectiveDate.toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>
      </div>

      {muted ? (
        <PendingBody exam={exam} />
      ) : (
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
      )}
    </div>
  );
}
