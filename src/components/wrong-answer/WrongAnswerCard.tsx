import { Question } from "../../data/english/types";

const PART_LABELS: Record<number, string> = {
  1: "사진 묘사 (Photographs)",
  2: "질의 응답 (Question-Response)",
  3: "짧은 대화 (Short Conversations)",
  4: "짧은 담화 (Short Talks)",
};

const OPTION_LABEL = ["A", "B", "C", "D"];

interface WrongAnswerCardProps {
  question: Question;
  userAnswer: string | null;
  setLabel: string;
}

export default function WrongAnswerCard({
  question: q,
  userAnswer,
  setLabel,
}: WrongAnswerCardProps) {
  const correctIdx = OPTION_LABEL.indexOf(q.answer);
  const correctText = q.options[correctIdx] ?? "";

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-5">
        {/* 파트 레이블 */}
        <p className="text-xs text-gray-400 mb-3">
          Part {q.part}: {PART_LABELS[q.part] ?? ""} · {setLabel}
        </p>

        {/* 파트1 이미지 */}
        {q.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
            <img
              src={q.imageUrl}
              alt="문제 이미지"
              className="max-w-full max-h-56 object-contain"
            />
          </div>
        )}

        {/* 대화 지문 (Part 3/4) */}
        {q.conversation && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 max-h-48 overflow-y-auto">
            <span className="inline-block bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full font-bold mb-2">
              SCRIPT
            </span>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {q.conversation}
            </p>
          </div>
        )}

        {/* 문제 */}
        <p className="font-bold text-gray-900 mb-4 leading-relaxed">
          {q.question}
        </p>

        {/* 보기 A/B/C/D */}
        <div className="space-y-2 mb-4">
          {q.options.map((opt, i) => {
            const label = OPTION_LABEL[i];
            const isCorrect = label === q.answer;
            const isSelected = label === userAnswer;

            let cls = "bg-gray-50 border-gray-200 text-gray-500";
            if (isCorrect) cls = "bg-green-50 border-green-400 text-green-800";
            else if (isSelected) cls = "bg-red-50 border-red-400 text-red-700";

            return (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl text-sm font-medium border-2 flex items-center justify-between ${cls}`}
              >
                <span>
                  <span className="font-bold mr-2">{label}.</span>
                  {opt}
                </span>
                {isCorrect && (
                  <span className="text-green-600 text-xs font-bold ml-2 flex-shrink-0">
                    ✓ 정답
                  </span>
                )}
                {!isCorrect && isSelected && (
                  <span className="text-red-500 text-xs font-bold ml-2 flex-shrink-0">
                    ✕ 내 선택
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 해설 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <span className="font-bold">해설: </span>
          {q.imageUrl
            ? `이 사진의 올바른 묘사는 "${correctText}"입니다.`
            : `정답은 ${q.answer}번 "${correctText}"입니다.`}
        </div>
      </div>
    </div>
  );
}
