import { useState, useEffect } from "react";
import { useExamData } from "../../context/ExamDataContext";

const colorClasses: Record<string, { btn: string; btnHover: string }> = {
  blue: { btn: "bg-blue-700", btnHover: "hover:bg-blue-800" },
  amber: { btn: "bg-amber-600", btnHover: "hover:bg-amber-700" },
  green: { btn: "bg-green-700", btnHover: "hover:bg-green-800" },
};

interface StatsInputProps {
  examId: string;
  color: string;
}

export default function StatsInput({ examId, color }: StatsInputProps) {
  const { stats, updateStats } = useExamData();
  const current = stats[examId] ?? { applicants: 0, passed: 0 };
  const [applicants, setApplicants] = useState(String(current.applicants));
  const [passed, setPassed] = useState(String(current.passed));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const c = colorClasses[color] || colorClasses.blue;

  useEffect(() => {
    setApplicants(String(current.applicants));
    setPassed(String(current.passed));
  }, [current.applicants, current.passed]);

  const handleSave = () => {
    const a = parseInt(applicants) || 0;
    const p = parseInt(passed) || 0;
    if (p > a) {
      setError("합격인원은 신청인원보다 많을 수 없습니다.");
      return;
    }
    setError("");
    updateStats(examId, { applicants: a, passed: p });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-gray-800 mb-5 text-lg flex items-center gap-2">
        <span>✏️</span> 통계 입력
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">
            신청인원
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={applicants}
            onChange={(e) => setApplicants(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">
            합격인원
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={passed}
            onChange={(e) => setPassed(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      <button
        onClick={handleSave}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
          saved
            ? "bg-green-100 text-green-700"
            : `${c.btn} ${c.btnHover} text-white`
        }`}
      >
        {saved ? "저장됨 ✓" : "저장하기"}
      </button>
    </div>
  );
}
