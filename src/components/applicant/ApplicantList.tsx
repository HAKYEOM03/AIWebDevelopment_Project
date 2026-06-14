import { Applicant } from "../../data/applicants";

interface ApplicantListProps {
  applicants: Applicant[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/** 신청자 명단 목록 (행 선택 시 상세 조회) */
export default function ApplicantList({
  applicants,
  selectedId,
  onSelect,
}: ApplicantListProps) {
  if (applicants.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
        <div className="text-4xl mb-3">🔎</div>
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
      {applicants.map((applicant) => (
        <button
          key={applicant.id}
          onClick={() => onSelect(applicant.id)}
          className={`w-full text-left px-5 py-4 flex items-center justify-between transition-colors ${
            selectedId === applicant.id
              ? "bg-blue-50 border-l-4 border-blue-600"
              : "hover:bg-gray-50 border-l-4 border-transparent"
          }`}
        >
          <div>
            <div className="font-bold text-gray-800">{applicant.name}</div>
            <div className="text-xs text-gray-400">
              {applicant.studentId} · {applicant.department}
            </div>
          </div>
          <span className="text-gray-300">›</span>
        </button>
      ))}
    </div>
  );
}
