import { ExamInfo } from "../../data/examInfo";

/** 신청 상태 배지 (신청 전 / 신청 중 / 마감) */
export default function RegistrationStatus({ exam }: { exam: ExamInfo }) {
  const now = new Date();
  const isOpen = now >= exam.registrationStart && now <= exam.registrationEnd;
  const isExpired = now > exam.registrationEnd;
  const daysLeft = Math.ceil(
    (exam.registrationEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
        <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
        <span className="text-red-600 font-bold text-sm">마감</span>
        <span className="text-red-400 text-xs">신청 기간이 종료되었습니다</span>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3">
        <span className="w-3 h-3 rounded-full bg-gray-400 shrink-0" />
        <span className="text-gray-600 font-bold text-sm">신청 전</span>
        <span className="text-gray-400 text-xs">
          {exam.registrationStart.toLocaleDateString("ko-KR")}부터 신청 가능
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
      <span className="text-green-700 font-bold text-sm">신청 중</span>
      <span className="text-green-500 text-xs">마감까지 {daysLeft}일 남음</span>
    </div>
  );
}
