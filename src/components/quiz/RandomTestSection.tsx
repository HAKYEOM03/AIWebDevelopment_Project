import { useNavigate } from "react-router-dom";

const PART_LABELS: Record<number, string> = {
  1: "사진묘사",
  2: "질문응답",
  3: "대화내용",
  4: "지문내용",
};

interface RandomTestSectionProps {
  examId: string;
}

/** 랜덤 Set Test 섹션 (Part별 15문제 + 종합 100문제) */
export default function RandomTestSection({ examId }: RandomTestSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        🎯 랜덤 Set Test
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        각 파트의 Set 1~3 문제를 랜덤으로 출제합니다. 시간 내에 풀어야 합니다!
      </p>

      <div className="grid grid-cols-1 gap-4">
        {/* Part 1 ~ 4 개별 테스트 */}
        {[1, 2, 3, 4].map((p) => (
          <div
            key={p}
            className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-gray-800">
                Part {p} Set Test
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {PART_LABELS[p]} · 랜덤 15문제 · 제한시간 10분
              </div>
            </div>
            <button
              onClick={() => navigate(`/quiz/${examId}/${p}/test`)}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              🎯 시작
            </button>
          </div>
        ))}

        {/* LC 종합 테스트 */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div className="text-white">
            <div className="text-lg font-bold">LC 전체 문제 Test</div>
            <div className="text-sm opacity-80 mt-1">
              Part 1~4(LC) 전체에서 랜덤 100문제 · 제한시간 60분
            </div>
          </div>
          <button
            onClick={() => navigate(`/quiz/${examId}/0/test`)}
            className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm shrink-0"
          >
            🏆 LC 종합 시작
          </button>
        </div>

        {/* RC 종합 테스트 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div className="text-white">
            <div className="text-lg font-bold">RC 전체 문제 Test</div>
            <div className="text-sm opacity-80 mt-1">
              Part 5~7(RC) 전체에서 랜덤 100문제 · 제한시간 60분
            </div>
          </div>
          <button
            onClick={() => navigate(`/quiz/${examId}/-1/test`)}
            className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm shrink-0"
          >
            🏆 RC 종합 시작
          </button>
        </div>

        {/* LCRC 통합 테스트 */}
        <div className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div className="text-white">
            <div className="text-lg font-bold">LCRC 전체 문제 Test</div>
            <div className="text-sm opacity-80 mt-1">
              Part 1~7(LC+RC) 전체에서 랜덤 200문제 · 제한시간 120분
            </div>
          </div>
          <button
            onClick={() => navigate(`/quiz/${examId}/-2/test`)}
            className="bg-white text-rose-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm shrink-0"
          >
            🏆 LCRC 종합 시작
          </button>
        </div>
      </div>
    </div>
  );
}
