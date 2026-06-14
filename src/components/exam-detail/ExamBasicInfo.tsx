import { ExamInfo } from "../../data/examInfo";

const colorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
};

interface ExamBasicInfoProps {
  exam: ExamInfo;
  isOpen: boolean;
  isExpired: boolean;
}

export default function ExamBasicInfo({
  exam,
  isOpen,
  isExpired,
}: ExamBasicInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
        <span>📋</span> 시험 기본 정보
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            신청 상태
          </div>
          {isExpired ? (
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-sm font-bold px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-red-500" /> 마감
            </span>
          ) : isOpen ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-bold px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
              신청 중
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm font-bold px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-gray-400" /> 신청 전
            </span>
          )}
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            신청 기간
          </div>
          <p className="text-sm text-gray-700">
            {exam.registrationStart.toLocaleDateString("ko-KR")} ~{" "}
            {exam.registrationEnd.toLocaleDateString("ko-KR")}
          </p>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            시험 일자
          </div>
          <p className="text-sm text-gray-700">
            {exam.examDate.toLocaleDateString("ko-KR")} {exam.examTime}
          </p>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            시험 장소
          </div>
          <p className="text-sm text-gray-700">{exam.examLocation}</p>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            합격 기준
          </div>
          <p className="text-sm text-gray-700">{exam.passingScore}</p>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">
            문의
          </div>
          <p className="text-sm text-gray-700">{exam.contact}</p>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-xs font-bold text-gray-400 uppercase mb-2">
          시험 준비물
        </div>
        <div className="flex flex-wrap gap-2">
          {exam.requirements.map((r, i) => (
            <span
              key={i}
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                colorClasses[exam.color]
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
