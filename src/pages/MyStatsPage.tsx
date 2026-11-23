import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { quizExams } from "../data/quizExams";
import { questionBank } from "../data/english";
import { fetchMyStats, MyStatsData, MyQuestionStat } from "../api/stats";

const WEAK_SET_COUNT = 3;
const WEAK_QUESTION_COUNT = 10;

const percent = (rate: number) => `${(rate * 100).toFixed(0)}%`;

const barColor = (rate: number) =>
  rate >= 0.5 ? "bg-red-400" : rate >= 0.3 ? "bg-amber-400" : "bg-blue-400";

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="text-xs font-bold text-gray-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}

function RateBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor(rate)}`} style={{ width: `${Math.min(rate, 1) * 100}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-10 text-right">{percent(rate)}</span>
    </div>
  );
}

/** 나의 연습문제 현황 — 내가 푼 기록으로 어느 파트·세트, 몇 번 문제가 가장 약한지 알려준다 (학생 본인 것만). */
export default function MyStatsPage() {
  const navigate = useNavigate();
  const [year, setYear] = useState<string | undefined>(undefined);
  const [data, setData] = useState<MyStatsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchMyStats(year).then((result) => {
      if (cancelled) return;
      if (result.status === "unauthorized") {
        // 세션이 만료됐으면 다시 로그인하게 한다.
        navigate("/login", { replace: true });
        return;
      }
      if (result.status === "error") {
        setError(result.message);
        setData(null);
      } else {
        setData(result.data);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [year, navigate]);

  const english = quizExams.find((e) => e.id === "english");
  const partLabel = (part: number) =>
    english?.parts.find((p) => p.part === part)?.label.replace(/^Part \d+ - /, "") ?? "";
  const questionText = (part: number, set: number, qid: number) =>
    questionBank[part]?.[set]?.find((item) => item.id === qid)?.question ?? "";
  /** 세트 안에서의 문제 번호 (전체 id가 아니라 "그 세트의 n번째") */
  const numberInSet = (part: number, set: number, qid: number) => {
    const index = questionBank[part]?.[set]?.findIndex((item) => item.id === qid) ?? -1;
    return index >= 0 ? index + 1 : qid;
  };

  const weakSets = useMemo(() => {
    if (!data) return [];
    return data.bySet
      .filter((s) => s.wrong > 0)
      .sort((a, b) => b.rate - a.rate || b.answers - a.answers)
      .slice(0, WEAK_SET_COUNT);
  }, [data]);

  const weakQuestions = useMemo(() => {
    if (!data) return [];
    const byWeakness = (a: MyQuestionStat, b: MyQuestionStat) =>
      b.rate - a.rate || b.wrong - a.wrong || b.answers - a.answers;
    return data.questions.filter((q) => q.wrong > 0).sort(byWeakness).slice(0, WEAK_QUESTION_COUNT);
  }, [data]);

  const goPractice = (part: number, set: number) => navigate(`/quiz/english/${part}/${set}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">나의 연습문제 현황</h1>
            <p className="text-gray-500">내가 푼 기록으로 어느 파트·세트, 몇 번 문제가 가장 약한지 알려드려요.</p>
          </div>

          {data && data.years.length > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <label htmlFor="my-stats-year">연도</label>
              <select
                id="my-stats-year"
                value={year ?? data.year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
              >
                {data.years.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {data?.mock && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-2xl px-5 py-4">
            <span className="font-bold">개발용 예시 데이터입니다.</span> 실제 풀이 기록이 아니에요.
          </div>
        )}

        {loading && <p className="text-center text-gray-400 py-20">불러오는 중...</p>}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4">{error}</div>
        )}

        {!loading && data && data.totalAnswers === 0 && (
          <div className="bg-white rounded-3xl shadow-sm text-center py-20 px-4">
            <p className="text-gray-500 mb-1">{data.year}년에는 아직 푼 기록이 없어요.</p>
            <p className="text-sm text-gray-400 mb-6">연습문제를 풀고 제출하면 여기에 내 약점이 정리됩니다.</p>
            <button
              onClick={() => navigate("/quiz")}
              className="bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              연습문제 풀러 가기
            </button>
          </div>
        )}

        {!loading && data && data.totalAnswers > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="푼 횟수" value={`${data.totalAttempts.toLocaleString()}회`} />
              <SummaryCard label="푼 문항 수" value={data.totalAnswers.toLocaleString()} />
              <SummaryCard label="틀린 문항 수" value={data.totalWrong.toLocaleString()} />
              <SummaryCard label="내 오답률" value={percent(data.totalRate)} />
            </div>

            {/* 가장 약한 세트 */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4">가장 약한 파트·세트</h2>
              {weakSets.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm text-center text-gray-400 py-10">
                  틀린 문제가 없어요. 대단해요! 🎉
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {weakSets.map((s, i) => (
                    <div key={`${s.part}-${s.set}`} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col">
                      <div className="text-xs font-bold text-red-400 mb-1">약점 {i + 1}위</div>
                      <div className="font-bold text-gray-800">Part {s.part} · Set {s.set}</div>
                      <div className="text-xs text-gray-400 mb-3">{partLabel(s.part)}</div>
                      <RateBar rate={s.rate} />
                      <div className="text-xs text-gray-500 mt-2 mb-4">
                        {s.answers}문항 중 {s.wrong}문항 틀림
                      </div>
                      <button
                        onClick={() => goPractice(s.part, s.set)}
                        className="mt-auto bg-blue-50 text-blue-700 rounded-full py-2 text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        이 세트 다시 풀기
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 가장 약한 문제 */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-1">내가 자주 틀리는 문제 TOP {WEAK_QUESTION_COUNT}</h2>
              <p className="text-xs text-gray-400 mb-4">여러 번 풀었는데 계속 틀린 문제일수록 위에 나와요.</p>
              <div className="bg-white rounded-2xl shadow-sm divide-y">
                {weakQuestions.length === 0 && (
                  <div className="text-center text-gray-400 py-10">틀린 문제가 없어요. 대단해요! 🎉</div>
                )}
                {weakQuestions.map((q, i) => (
                  <div key={`${q.part}-${q.set}-${q.qid}`} className="p-5 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="font-bold text-gray-400 w-6 shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm">
                        Part {q.part} · Set {q.set} · {numberInSet(q.part, q.set, q.qid)}번
                        <span className="ml-2 text-xs font-normal text-gray-400">{partLabel(q.part)}</span>
                      </div>
                      <div
                        className="text-sm text-gray-500 mt-1 overflow-hidden"
                        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                      >
                        {questionText(q.part, q.set, q.qid) || "—"}
                      </div>
                    </div>
                    <div className="md:w-44 shrink-0">
                      <RateBar rate={q.rate} />
                      <div className="text-xs text-gray-400 mt-1">
                        {q.answers}번 풀어서 {q.wrong}번 틀림
                      </div>
                    </div>
                    <button
                      onClick={() => goPractice(q.part, q.set)}
                      className="shrink-0 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      이 세트 풀기
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* 세트별 전체 */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-4">파트·세트별 내 기록</h2>
              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="px-5 py-3 font-bold">파트</th>
                      <th className="px-3 py-3 font-bold">세트</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">푼 횟수</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">틀린 문항</th>
                      <th className="px-5 py-3 font-bold">오답률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bySet.map((s) => (
                      <tr key={`${s.part}-${s.set}`} className="border-b last:border-0">
                        <td className="px-5 py-3 text-gray-700">
                          Part {s.part}
                          <span className="ml-2 text-xs text-gray-400">{partLabel(s.part)}</span>
                        </td>
                        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">Set {s.set}</td>
                        <td className="px-3 py-3 text-right text-gray-700">{s.attempts}회</td>
                        <td className="px-3 py-3 text-right text-gray-700">{s.wrong}개</td>
                        <td className="px-5 py-3"><RateBar rate={s.rate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="text-xs text-gray-400">
              * 연습문제를 풀고 제출한 기록만 반영됩니다. 이 화면은 로그인한 본인에게만 보이며 다른 학우의 기록은 볼 수 없어요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
