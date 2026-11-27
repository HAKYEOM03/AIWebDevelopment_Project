import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import LockedExamCard from "../components/common/LockedExamCard";
import LockBar from "../components/manage/LockBar";
import SettingsStatus from "../components/manage/SettingsStatus";
import { useExamData } from "../context/ExamDataContext";
import { quizExams } from "../data/quizExams";
import { questionBank } from "../data/english";
import { logoutAdmin } from "../utils/auth";
import { fetchStats, StatsData, QuestionStat } from "../api/stats";

type SortKey = "rate" | "wrong";

const TOP_COUNT = 20;
const MIN_STUDENT_OPTIONS = [1, 5, 10];

const percent = (rate: number) => `${(rate * 100).toFixed(1)}%`;

/** 오답률에 따라 막대 색을 다르게 — 눈에 띄게 어려운 문제를 바로 알아보게 */
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
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor(rate)}`} style={{ width: `${Math.min(rate, 1) * 100}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-14 text-right">{percent(rate)}</span>
    </div>
  );
}

/** 졸업고사 연습문제 현황 — 학생들이 푼 기록을 모아 파트·세트·문제별 통계를 보여준다 (관리자 전용). */
export default function StatsPage() {
  const navigate = useNavigate();
  const detailRef = useRef<HTMLElement>(null);
  const [examId, setExamId] = useState("english");
  const [year, setYear] = useState<string | undefined>(undefined);
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("rate");
  const [minStudents, setMinStudents] = useState(5);
  const [selected, setSelected] = useState<{ part: number; set: number }>({ part: 1, set: 1 });

  const { isExamLocked, setExamLocked } = useExamData();
  const currentExam = quizExams.find((e) => e.id === examId) ?? quizExams[0];
  const locked = isExamLocked(currentExam.id);
  // 풀이 기록은 지금 영어만 서버에 쌓인다. 다른 시험 탭에 영어 통계가 보이면 안 된다.
  const hasStats = currentExam.id === "english";
  const showStats = hasStats && !locked;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchStats(year).then((result) => {
      if (cancelled) return;
      if (result.status === "unauthorized") {
        // 서버가 관리자로 인정하지 않으면(세션 만료 등) 다시 로그인하게 한다.
        logoutAdmin();
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

  const setStatMap = useMemo(() => {
    const map = new Map<string, StatsData["bySet"][number]>();
    data?.bySet.forEach((s) => map.set(`${s.part}-${s.set}`, s));
    return map;
  }, [data]);

  const questionStatMap = useMemo(() => {
    const map = new Map<string, QuestionStat>();
    data?.questions.forEach((q) => map.set(`${q.part}-${q.set}-${q.qid}`, q));
    return map;
  }, [data]);

  const topQuestions = useMemo(() => {
    if (!data) return [];
    const byRate = (a: QuestionStat, b: QuestionStat) => b.studentRate - a.studentRate || b.students - a.students;
    const byWrong = (a: QuestionStat, b: QuestionStat) => b.wrongStudents - a.wrongStudents || b.studentRate - a.studentRate;
    return data.questions
      .filter((q) => q.students >= minStudents && q.wrongStudents > 0)
      .sort(sortKey === "rate" ? byRate : byWrong)
      .slice(0, TOP_COUNT);
  }, [data, sortKey, minStudents]);

  const questionText = (part: number, set: number, qid: number) =>
    questionBank[part]?.[set]?.find((item) => item.id === qid)?.question ?? "";

  /** 세트 안에서의 문제 번호 (퀴즈 화면에 보이는 번호) */
  const numberInSet = (part: number, set: number, qid: number) => {
    const index = questionBank[part]?.[set]?.findIndex((item) => item.id === qid) ?? -1;
    return index >= 0 ? index + 1 : qid;
  };

  const partLabel = (part: number) =>
    english?.parts.find((p) => p.part === part)?.label.replace(/^Part \d+ - /, "") ?? "";

  const openDetail = (part: number, set: number) => {
    setSelected({ part, set });
    // 선택한 세트의 문제 목록으로 부드럽게 이동
    requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const selectedParts = english?.parts.find((p) => p.part === selected.part);
  const selectedSetStat = setStatMap.get(`${selected.part}-${selected.set}`);
  const selectedQuestions = questionBank[selected.part]?.[selected.set] ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">졸업고사 연습문제 현황</h1>
        <p className="text-gray-500 mb-8">
          학우들이 연습문제를 푼 기록을 모아, 파트·세트별로 몇 명이 풀었고 어떤 문제를 가장 많이 틀리는지 보여줍니다.
        </p>

        {/* 시험 탭 + 연도 선택 */}
        <div className="flex gap-3 mb-8 flex-wrap items-center">
          {quizExams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setExamId(exam.id)}
              className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
                examId === exam.id
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
            >
              {isExamLocked(exam.id) && "🔒 "}
              {exam.name}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <label htmlFor="stats-year">연도</label>
            <select
              id="stats-year"
              value={year ?? data?.year ?? ""}
              onChange={(e) => setYear(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
              disabled={!data}
            >
              {(data?.years ?? []).map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>
        </div>

        <SettingsStatus />

        <LockBar
          title={currentExam.name}
          locked={locked}
          lockedHint="학생 화면의 소개·문제가 '준비중'으로 막혀 있습니다."
          openHint="학생 화면에 소개·문제가 공개되어 있습니다. 잠그면 '준비중' 안내가 나옵니다."
          onChange={(next) => setExamLocked(currentExam.id, next)}
        />

        {locked && (
          <LockedExamCard
            icon={currentExam.icon}
            name={currentExam.name}
            buttonLabel="해제"
            onButtonClick={() => setExamLocked(currentExam.id, false)}
          />
        )}

        {!locked && !hasStats && (
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-1">파트·세트별 현황</h2>
            <p className="text-xs text-gray-400 mb-4">
              이 시험은 아직 풀이 기록을 저장하지 않아 통계가 없습니다.
            </p>
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b">
                    <th className="px-5 py-3 font-bold">파트</th>
                    <th className="px-3 py-3 font-bold">세트</th>
                    <th className="px-5 py-3 font-bold">오답률</th>
                  </tr>
                </thead>
                <tbody>
                  {currentExam.parts.flatMap((p) =>
                    p.sets.map((s) => (
                      <tr key={`${p.part}-${s}`} className="border-b last:border-0">
                        <td className="px-5 py-3 text-gray-700">{p.label}</td>
                        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">Set {s}</td>
                        <td className="px-5 py-3 text-gray-300">기록 없음</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {showStats && data?.mock && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-2xl px-5 py-4">
            <span className="font-bold">개발용 예시 데이터입니다.</span> 실제 학생 기록이 아니며, 구글 시트에 연결되면
            이 표시와 함께 사라지고 실제 기록만 보입니다.
          </div>
        )}

        {showStats && loading && <p className="text-center text-gray-400 py-20">불러오는 중...</p>}

        {showStats && !loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4">
            {error}
          </div>
        )}

        {showStats && !loading && data && data.totalAnswers === 0 && (
          <div className="bg-white rounded-3xl shadow-sm text-center text-gray-400 py-20">
            {data.year}년에는 아직 기록된 풀이가 없습니다.
          </div>
        )}

        {showStats && !loading && data && data.totalAnswers > 0 && (
          <div className="space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="참여한 학우" value={`${data.participants.toLocaleString()}명`} />
              <SummaryCard label="풀이(제출) 횟수" value={`${data.totalAttempts.toLocaleString()}회`} />
              <SummaryCard label="총 풀이 문항 수" value={data.totalAnswers.toLocaleString()} />
              <SummaryCard label="전체 오답률" value={percent(data.totalRate)} />
            </div>

            {/* 파트·세트별 현황 */}
            <section>
              <h2 className="text-xl font-bold text-gray-700 mb-1">파트·세트별 현황</h2>
              <p className="text-xs text-gray-400 mb-4">
                푼 인원·인당 평균은 "세트 연습"으로 푼 기록 기준입니다. 행을 누르면 그 세트의 모든 문제를 아래에서 볼 수 있습니다.
              </p>
              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="px-5 py-3 font-bold">파트</th>
                      <th className="px-3 py-3 font-bold">세트</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">푼 인원</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">인당 평균 푼 횟수</th>
                      <th className="px-5 py-3 font-bold">오답률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {english?.parts.flatMap((p) =>
                      p.sets.map((s) => {
                        const stat = setStatMap.get(`${p.part}-${s}`);
                        return (
                          <tr
                            key={`${p.part}-${s}`}
                            onClick={() => openDetail(p.part, s)}
                            className={`border-b last:border-0 cursor-pointer hover:bg-blue-50/50 ${
                              selected.part === p.part && selected.set === s ? "bg-blue-50/60" : ""
                            }`}
                          >
                            <td className="px-5 py-3 text-gray-700">{p.label}</td>
                            <td className="px-3 py-3 text-gray-500 whitespace-nowrap">Set {s}</td>
                            <td className="px-3 py-3 text-right text-gray-700">{stat ? `${stat.students.toLocaleString()}명` : "—"}</td>
                            <td className="px-3 py-3 text-right text-gray-700">{stat && stat.students > 0 ? `${stat.avgAttempts.toFixed(1)}회` : "—"}</td>
                            <td className="px-5 py-3">{stat ? <RateBar rate={stat.rate} /> : <span className="text-gray-300">기록 없음</span>}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 선택한 파트·세트의 모든 문제 */}
            <section ref={detailRef} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-gray-700 mb-4">문제별 현황</h2>

              <div className="flex gap-2 flex-wrap mb-3">
                {english?.parts.map((p) => (
                  <button
                    key={p.part}
                    onClick={() => setSelected({ part: p.part, set: selected.set })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      selected.part === p.part ? "bg-gray-800 text-white" : "bg-white border text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Part {p.part}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap mb-5">
                {(selectedParts?.sets ?? [1, 2, 3]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelected({ part: selected.part, set: s })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      selected.set === s ? "bg-blue-700 text-white" : "bg-white border text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Set {s}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                <div className="font-bold text-gray-800 mb-2">
                  Part {selected.part} · Set {selected.set}
                  <span className="ml-2 text-sm font-normal text-gray-400">{partLabel(selected.part)}</span>
                </div>
                <div className="flex gap-x-8 gap-y-1 flex-wrap text-sm text-gray-600">
                  <span>
                    문제 푼 인원 : <b className="text-gray-800">{selectedSetStat ? `${selectedSetStat.students}명` : "0명"}</b>
                  </span>
                  <span>
                    인당 평균 푼 횟수 :{" "}
                    <b className="text-gray-800">
                      {selectedSetStat && selectedSetStat.students > 0 ? `${selectedSetStat.avgAttempts.toFixed(1)}회` : "—"}
                    </b>
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="px-5 py-3 font-bold whitespace-nowrap">번호</th>
                      <th className="px-3 py-3 font-bold">문제</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">푼 인원</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">틀린 인원</th>
                      <th className="px-5 py-3 font-bold whitespace-nowrap">틀린 학우 비율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuestions.map((q, index) => {
                      const stat = questionStatMap.get(`${selected.part}-${selected.set}-${q.id}`);
                      return (
                        <tr key={q.id} className="border-b last:border-0">
                          <td className="px-5 py-3 font-bold text-gray-500 whitespace-nowrap">{index + 1}번</td>
                          <td className="px-3 py-3 text-gray-600 max-w-md truncate" title={q.question}>
                            {q.question || "—"}
                          </td>
                          <td className="px-3 py-3 text-right text-gray-700">{stat ? `${stat.students}명` : "—"}</td>
                          <td className="px-3 py-3 text-right text-gray-700">{stat ? `${stat.wrongStudents}명` : "—"}</td>
                          <td className="px-5 py-3">
                            {stat ? <RateBar rate={stat.studentRate} /> : <span className="text-gray-300">기록 없음</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * "틀린 학우 비율" = 이 문제를 푼 학우 중 한 번이라도 틀린 학우의 비율입니다. (랜덤 테스트로 푼 기록도 문제 단위로 포함)
              </p>
            </section>

            {/* 가장 많이 틀린 문제 */}
            <section>
              <div className="flex items-end justify-between flex-wrap gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-700">가장 많이 틀린 문제 TOP {TOP_COUNT}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                  <div className="flex gap-1">
                    {(["rate", "wrong"] as SortKey[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSortKey(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          sortKey === key ? "bg-gray-800 text-white" : "bg-white border text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {key === "rate" ? "틀린 비율순" : "틀린 인원순"}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2">
                    최소 푼 인원
                    <select
                      value={minStudents}
                      onChange={(e) => setMinStudents(Number(e.target.value))}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700"
                    >
                      {MIN_STUDENT_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}명 이상
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b">
                      <th className="px-5 py-3 font-bold w-12 whitespace-nowrap">순위</th>
                      <th className="px-3 py-3 font-bold">위치</th>
                      <th className="px-3 py-3 font-bold">문제</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">푼 인원</th>
                      <th className="px-3 py-3 font-bold text-right whitespace-nowrap">틀린 인원</th>
                      <th className="px-5 py-3 font-bold whitespace-nowrap">틀린 학우 비율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topQuestions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                          조건에 맞는 문제가 없습니다. (최소 푼 인원을 낮춰보세요)
                        </td>
                      </tr>
                    )}
                    {topQuestions.map((q, i) => (
                      <tr key={`${q.part}-${q.set}-${q.qid}`} className="border-b last:border-0">
                        <td className="px-5 py-3 font-bold text-gray-500 whitespace-nowrap">{i + 1}</td>
                        <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                          Part {q.part} · Set {q.set} · {numberInSet(q.part, q.set, q.qid)}번
                          <div className="text-xs text-gray-400">{partLabel(q.part)}</div>
                        </td>
                        <td className="px-3 py-3 text-gray-600 max-w-xs truncate" title={questionText(q.part, q.set, q.qid)}>
                          {questionText(q.part, q.set, q.qid) || "—"}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-700">{q.students.toLocaleString()}명</td>
                        <td className="px-3 py-3 text-right text-gray-700">{q.wrongStudents.toLocaleString()}명</td>
                        <td className="px-5 py-3"><RateBar rate={q.studentRate} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="text-xs text-gray-400">
              * 학번·이름은 기록되지 않습니다. 같은 학우의 기록을 묶기 위한 "학우ID"(학번을 복원할 수 없게 암호화한 값)만 구글 시트(연도별 탭)에 저장됩니다.
              한 번 풀고 제출한 기록만 집계됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
