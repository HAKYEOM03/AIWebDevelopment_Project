import { useNavigate } from "react-router-dom";

interface DonutChartProps {
  examId: string;
  applicants: number;
  passed: number;
  name: string;
  color: string;
}

export default function DonutChart({
  examId,
  applicants,
  passed,
  name,
  color,
}: DonutChartProps) {
  const navigate = useNavigate();
  const rate = applicants > 0 ? Math.round((passed / applicants) * 100) : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (rate / 100) * circumference;

  const strokeColor =
    color === "blue" ? "#1d4ed8" : color === "amber" ? "#d97706" : "#15803d";
  const bgClass =
    color === "blue" ? "hover:bg-blue-50" : color === "amber" ? "hover:bg-amber-50" : "hover:bg-green-50";
  const textColor =
    color === "blue" ? "text-blue-700" : color === "amber" ? "text-amber-600" : "text-green-700";

  return (
    <div
      className={`flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-colors ${bgClass}`}
      onClick={() => navigate(`/exam/${examId}`)}
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="14" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{rate}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className={`text-sm font-bold ${textColor}`}>{name}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {applicants > 0 ? `합격 ${passed} / 신청 ${applicants}명` : "데이터 없음"}
        </div>
      </div>
    </div>
  );
}
