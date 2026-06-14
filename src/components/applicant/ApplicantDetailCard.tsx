import { Applicant, ApplicantStatus } from "../../data/applicants";

interface ApplicantDetailCardProps {
  applicant: Applicant | null;
  loading: boolean;
}

const statusStyle: Record<ApplicantStatus, string> = {
  신청완료: "bg-green-100 text-green-700",
  면제대상: "bg-blue-100 text-blue-700",
  응시료미납: "bg-red-100 text-red-700",
};

/** 선택된 신청자의 상세 정보 카드 (로딩 상태 포함) */
export default function ApplicantDetailCard({
  applicant,
  loading,
}: ApplicantDetailCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p>신청자 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
        <div className="text-4xl mb-3">👈</div>
        <p>왼쪽 명단에서 신청자를 선택하면</p>
        <p>상세 정보가 표시됩니다.</p>
      </div>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: "학번", value: applicant.studentId },
    { label: "학과", value: applicant.department },
    { label: "학년", value: `${applicant.grade}학년` },
    { label: "신청 과목", value: applicant.subject },
    { label: "연락처", value: applicant.phone },
    { label: "이메일", value: applicant.email },
    { label: "신청일", value: applicant.appliedDate },
    { label: "응시 횟수", value: `${applicant.attempts}회` },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {applicant.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{applicant.name}</h2>
            <p className="text-sm text-gray-400">{applicant.department}</p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle[applicant.status]}`}
        >
          {applicant.status}
        </span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {rows.map((row) => (
          <div key={row.label} className="border-b border-gray-100 pb-2">
            <dt className="text-xs text-gray-400 mb-0.5">{row.label}</dt>
            <dd className="text-sm font-medium text-gray-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
