import { ExamInfo } from "../../data/examInfo";
import CountdownTimer from "./CountdownTimer";

interface DDayPanelProps {
  exams: ExamInfo[];
  examDates?: Record<string, string>; // examId → ISO 문자열 (설정값으로 덮어쓰기)
}

export default function DDayPanel({ exams, examDates }: DDayPanelProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span>📅</span> 시험 D-DAY
      </h2>
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {exams.map((exam) => {
          // 사용자가 설정한 날짜가 있으면 그 값을, 없으면 기본 날짜를 사용
          const overridden = examDates?.[exam.id];
          const examDate = overridden ? new Date(overridden) : exam.examDate;
          return (
            <CountdownTimer
              key={exam.id}
              examDate={examDate}
              examName={exam.fullName}
              color={exam.color as "blue" | "amber" | "green"}
            />
          );
        })}
      </div>
    </div>
  );
}
