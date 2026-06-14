import { useState, useContext } from "react";
import { ExamDataContext } from "../../context/ExamDataContext";
import { examInfoList } from "../../data/examInfo";
import CountdownTimer from "../home/CountdownTimer";

/** ISO 문자열 → datetime-local input 값(YYYY-MM-DDTHH:mm)으로 변환 */
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** 시험 날짜·시간을 설정하면 D-DAY 카운트다운이 즉시 바뀌는 편집기 */
export default function ExamDateEditor() {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { examDates, updateExamDate } = examData;

  const [selectedExam, setSelectedExam] = useState(examInfoList[0].id);
  const [saved, setSaved] = useState(false);

  const exam = examInfoList.find((e) => e.id === selectedExam)!;
  const currentIso = examDates[selectedExam] ?? exam.examDate.toISOString();

  const handleChange = (value: string) => {
    if (!value) return;
    // datetime-local 값을 ISO로 저장 → Context 갱신 → 화면 즉시 반영
    updateExamDate(selectedExam, new Date(value).toISOString());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>📅</span> 시험 날짜·시간 설정
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        날짜와 시간을 바꾸면 아래 미리보기와 홈 화면의 D-DAY가 즉시 갱신됩니다.
      </p>

      {/* 과목 선택 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {examInfoList.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExam(e.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedExam === e.id
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      {/* 날짜+시간 입력 */}
      <label className="block text-sm font-medium text-gray-600 mb-2">
        {exam.fullName} 시험 일시
      </label>
      <input
        type="datetime-local"
        value={toLocalInputValue(currentIso)}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition mb-2"
      />
      {saved && (
        <p className="text-xs text-green-600 mb-2">✓ 저장되었습니다.</p>
      )}

      {/* 실시간 미리보기 */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2">미리보기</p>
        <CountdownTimer
          examDate={new Date(currentIso)}
          examName={exam.fullName}
          color={exam.color as "blue" | "amber" | "green"}
        />
      </div>
    </div>
  );
}
