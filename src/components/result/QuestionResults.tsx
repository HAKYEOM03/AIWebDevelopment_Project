import { Question } from "../../data/english/types";

const PART_PREFIX: Record<number, string> = {
  1: "사진 묘사",
  2: "질의응답",
  3: "짧은 대화",
  4: "짧은 담화",
};

function getQuestionPreview(q: Question): string {
  const prefix = PART_PREFIX[q.part] ?? `Part ${q.part}`;
  const text = /^S\d+Q\d+$/.test(q.question) ? q.options[0] : q.question;
  const trimmed = text.length > 35 ? text.slice(0, 35) + "..." : text;
  return `[${prefix}] ${trimmed}`;
}

interface QuestionResultsProps {
  questions: Question[];
  answers: (string | null)[];
}

export default function QuestionResults({
  questions,
  answers,
}: QuestionResultsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h3 className="font-bold text-gray-800 mb-4">문항별 결과</h3>
      <div className="space-y-0">
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.answer;
          return (
            <div
              key={q.id}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-gray-400 font-semibold w-8 flex-shrink-0">
                  Q{i + 1}
                </span>
                <span className="text-sm text-gray-600 truncate">
                  {getQuestionPreview(q)}
                </span>
              </div>
              <span
                className={`text-sm font-bold flex-shrink-0 ml-3 ${
                  isCorrect ? "text-green-500" : "text-red-400"
                }`}
              >
                {isCorrect ? "✓ 정답" : "✕ 오답"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
