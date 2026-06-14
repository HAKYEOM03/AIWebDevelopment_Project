import DonutChart from "./DonutChart";
import { ExamInfo } from "../../data/examInfo";

interface PassRateSectionProps {
  exams: ExamInfo[];
  stats: Record<string, { applicants: number; passed: number }>;
}

/** 과목별 합격률 도넛차트 섹션 */
export default function PassRateSection({ exams, stats }: PassRateSectionProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span>🏆</span> 과목별 합격률
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          각 그래프를 클릭하면 졸업고사 상세 페이지로 이동합니다.
        </p>
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {exams.map((exam) => {
            const s = stats[exam.id] ?? { applicants: 0, passed: 0 };
            return (
              <DonutChart
                key={exam.id}
                examId={exam.id}
                applicants={s.applicants}
                passed={s.passed}
                name={exam.fullName}
                color={exam.color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
