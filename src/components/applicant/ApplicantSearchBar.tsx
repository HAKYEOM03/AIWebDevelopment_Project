interface ApplicantSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
}

/** 신청자 검색 입력창 (학번 또는 이름) */
export default function ApplicantSearchBar({
  query,
  onQueryChange,
  resultCount,
}: ApplicantSearchBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        신청자 검색 (학번 · 이름 · 학과)
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="학번 · 이름 · 학과를 입력하세요 (예: 20210101 / 김도윤 / 간호학과)"
          className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">
        검색 결과 <span className="font-bold text-blue-600">{resultCount}</span>명
      </p>
    </div>
  );
}
