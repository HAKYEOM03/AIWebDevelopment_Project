interface PassRateBarProps {
  applicants: number;
  passed: number;
  color: string;
}

const colorClasses: Record<string, {
  bar: string;
  statBg: string;
}> = {
  blue: { bar: "bg-blue-600", statBg: "bg-blue-50" },
  amber: { bar: "bg-amber-500", statBg: "bg-amber-50" },
  green: { bar: "bg-green-600", statBg: "bg-green-50" },
};

export default function PassRateBar({
  applicants,
  passed,
  color,
}: PassRateBarProps) {
  const rate = applicants > 0 ? Math.round((passed / applicants) * 100) : 0;
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-gray-800 mb-5 text-lg flex items-center gap-2">
        <span>📊</span> 합격률 현황
      </h3>

      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>합격률</span>
        <span className="font-bold text-gray-800">{rate}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-9 overflow-hidden">
        <div
          className={`${c.bar} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700`}
          style={{ width: rate > 0 ? `${Math.max(rate, 6)}%` : "0%" }}
        >
          {rate > 10 && (
            <span className="text-white text-sm font-bold">{rate}%</span>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-800">
            {applicants.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">신청인원</div>
        </div>
        <div className={`${c.statBg} rounded-xl p-4 text-center`}>
          <div className="text-3xl font-bold text-gray-800">
            {passed.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">합격인원</div>
        </div>
      </div>

      {applicants === 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          관리 페이지에서 신청/합격 인원을 입력하면 그래프가 표시됩니다.
        </p>
      )}
    </div>
  );
}
