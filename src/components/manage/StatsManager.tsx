import { useState, useEffect, useContext } from "react";
import { ExamDataContext } from "../../context/ExamDataContext";
import { examInfoList } from "../../data/examInfo";

/** 각 졸업고사의 신청/합격 인원을 입력하면 홈·상세 페이지의 합격률에 즉시 반영하는 관리 컴포넌트 */
export default function StatsManager() {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { stats, updateStats } = examData;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>📊</span> 합격률 입력
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        신청·합격 인원을 입력하면 홈 화면과 각 졸업고사 소개의 합격률에 바로
        반영됩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examInfoList.map((exam) => (
          <ExamStatsRow
            key={exam.id}
            examId={exam.id}
            name={exam.fullName}
            current={stats[exam.id] ?? { applicants: 0, passed: 0 }}
            onSave={updateStats}
          />
        ))}
      </div>
    </div>
  );
}

interface ExamStatsRowProps {
  examId: string;
  name: string;
  current: { applicants: number; passed: number };
  onSave: (examId: string, stats: { applicants: number; passed: number }) => void;
}

function ExamStatsRow({ examId, name, current, onSave }: ExamStatsRowProps) {
  const [applicants, setApplicants] = useState(String(current.applicants));
  const [passed, setPassed] = useState(String(current.passed));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setApplicants(String(current.applicants));
    setPassed(String(current.passed));
  }, [current.applicants, current.passed]);

  const rate =
    (parseInt(applicants) || 0) > 0
      ? Math.round(((parseInt(passed) || 0) / (parseInt(applicants) || 0)) * 100)
      : 0;

  const handleSave = () => {
    const a = parseInt(applicants) || 0;
    const p = parseInt(passed) || 0;
    if (p > a) {
      setError("합격인원은 신청인원보다 많을 수 없습니다.");
      return;
    }
    setError("");
    onSave(examId, { applicants: a, passed: p });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700">{name}</span>
        <span className="text-xs text-gray-500">
          현재 합격률 <b className="text-gray-800">{rate}%</b>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block font-medium">
            신청인원
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={applicants}
            onChange={(e) => setApplicants(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block font-medium">
            합격인원
          </label>
          <input
            type="number"
            min="0"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={passed}
            onChange={(e) => setPassed(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSave}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          saved
            ? "bg-green-100 text-green-700"
            : "bg-blue-700 hover:bg-blue-800 text-white"
        }`}
      >
        {saved ? "저장됨 ✓" : "저장하기"}
      </button>
    </div>
  );
}
