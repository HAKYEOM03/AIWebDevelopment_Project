/**
 * 연습문제 통계(/api/stats, /api/my-stats, /api/stats-record) 호출 전용 모듈.
 * 구글 시트 접근은 서버만 하고, 프론트는 우리 서버만 호출한다.
 */
import { isDevTestAdmin } from "../utils/auth";
import { isDevTestStudent } from "./space";
import { questionBank } from "../data/english";

/* ---------------- 기록 보내기 (학생) ---------------- */

export interface QuizResultRecord {
  examId: string;
  part: number;
  set: number;
  /** 문제 번호(전체에서 유일한 id) */
  qid: number;
  correct: boolean;
  mode: "SET" | "TEST" | "EXAM";
}

/**
 * 한 번 푼 결과를 서버에 보낸다 (문제별 정답/오답, 학번은 보내지 않는다 — 서버가 로그인 세션으로 알고 있다).
 * 통계용 부가 기능이라 실패해도 학생 화면에는 아무 영향이 없도록 결과를 기다리지도, 에러를 띄우지도 않는다.
 */
export function recordQuizResults(results: QuizResultRecord[]): void {
  if (results.length === 0) return;
  try {
    fetch("/api/stats-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results }),
      keepalive: true, // 결과 화면으로 넘어가는 중에도 요청이 끊기지 않게
    }).catch(() => {});
  } catch {
    // 무시
  }
}

/* ---------------- 공통 ---------------- */

export type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "unauthorized" }
  | { status: "error"; message: string };

async function getJson<T>(url: string, fallbackError: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url);
    if (res.status === 401) return { status: "unauthorized" };

    const body = await res.json();
    if (!res.ok || !body.ok) {
      const detail = body.debug ? ` (원인: ${body.debug})` : "";
      return { status: "error", message: `${body.error || fallbackError}${detail}` };
    }
    return { status: "ok", data: body as T };
  } catch {
    return { status: "error", message: "서버와 통신하지 못했습니다. (npm run dev에서는 API가 없어 vercel dev가 필요합니다.)" };
  }
}

const withYear = (path: string, year?: string) => `${path}${year ? `?year=${encodeURIComponent(year)}` : ""}`;

/* ---------------- 전체 통계 (관리자) ---------------- */

export interface SetStat {
  part: number;
  set: number;
  /** 이 세트를 세트 연습으로 푼 학우 수 */
  students: number;
  /** 세트 연습으로 푼 총 횟수 */
  attempts: number;
  /** 학우 1명당 평균 푼 횟수 */
  avgAttempts: number;
  answers: number;
  wrong: number;
  /** 오답률 0~1 */
  rate: number;
}

export interface QuestionStat {
  part: number;
  set: number;
  qid: number;
  /** 이 문제를 푼 학우 수 */
  students: number;
  /** 그중 한 번이라도 틀린 학우 수 */
  wrongStudents: number;
  /** 틀린 학우 비율 0~1 */
  studentRate: number;
  /** 푼 횟수(학우×시도) / 틀린 횟수 / 횟수 기준 오답률 */
  answers: number;
  wrong: number;
  rate: number;
}

export interface StatsData {
  /** true면 개발용 예시/임시 데이터 — 실제 학생 기록이 아님 */
  mock?: boolean;
  year: string;
  years: string[];
  /** 기록을 남긴 학우 수 */
  participants: number;
  /** 풀이(제출) 횟수 */
  totalAttempts: number;
  totalAnswers: number;
  totalWrong: number;
  totalRate: number;
  bySet: SetStat[];
  questions: QuestionStat[];
}

/** 같은 시드면 항상 같은 값이 나오는 난수 */
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 개발용 테스트 관리자(서버 쿠키 없음)가 화면을 확인할 수 있도록 만든 데모 데이터. 배포 빌드에서는 제거된다. */
function demoStats(year: string): StatsData {
  const random = seededRandom(20260917);
  const questions: QuestionStat[] = [];
  const bySet: SetStat[] = [];
  let totalAttempts = 0;

  for (const [partKey, sets] of Object.entries(questionBank)) {
    for (const [setKey, list] of Object.entries(sets)) {
      const students = 12 + Math.floor(random() * 40);
      const avgAttempts = 1 + random() * 1.6;
      const attempts = Math.round(students * avgAttempts);
      totalAttempts += attempts;

      let answers = 0;
      let wrong = 0;
      for (const q of list) {
        const wrongStudents = Math.round(students * (0.05 + random() * 0.65));
        const qAnswers = Math.round(students * avgAttempts);
        const qWrong = Math.min(qAnswers, Math.round(wrongStudents * (1 + random() * 0.6)));
        answers += qAnswers;
        wrong += qWrong;
        questions.push({
          part: Number(partKey), set: Number(setKey), qid: q.id,
          students, wrongStudents, studentRate: wrongStudents / students,
          answers: qAnswers, wrong: qWrong, rate: qWrong / qAnswers,
        });
      }
      bySet.push({ part: Number(partKey), set: Number(setKey), students, attempts, avgAttempts: attempts / students, answers, wrong, rate: wrong / answers });
    }
  }

  const totalAnswers = bySet.reduce((sum, s) => sum + s.answers, 0);
  const totalWrong = bySet.reduce((sum, s) => sum + s.wrong, 0);
  return {
    mock: true, year, years: [year], participants: 60, totalAttempts,
    totalAnswers, totalWrong, totalRate: totalWrong / totalAnswers, bySet, questions,
  };
}

/** 데모 데이터를 끈 개발 화면용 빈 통계 */
function emptyDemoStats(year: string): StatsData {
  return { mock: true, year, years: [year], participants: 0, totalAttempts: 0, totalAnswers: 0, totalWrong: 0, totalRate: 0, bySet: [], questions: [] };
}

export async function fetchStats(year?: string): Promise<ApiResult<StatsData>> {
  // import.meta.env.DEV를 직접 적어야 배포 빌드에서 이 분기(와 데모 데이터 코드)가 통째로 제거된다.
  if (import.meta.env.DEV && isDevTestAdmin()) {
    const demoYear = year ?? String(new Date().getFullYear());
    // .env.local에 VITE_DEV_STATS_DEMO=false를 넣으면 예시 데이터 없이 "기록 없음" 화면을 볼 수 있다.
    const demoOff = import.meta.env.VITE_DEV_STATS_DEMO === "false";
    return { status: "ok", data: demoOff ? emptyDemoStats(demoYear) : demoStats(demoYear) };
  }
  return getJson<StatsData>(withYear("/api/stats", year), "통계를 불러오지 못했습니다.");
}

/* ---------------- 내 통계 (학생) ---------------- */

export interface MySetStat {
  part: number;
  set: number;
  /** 세트 연습으로 푼 횟수 */
  attempts: number;
  answers: number;
  wrong: number;
  rate: number;
}

export interface MyQuestionStat {
  part: number;
  set: number;
  qid: number;
  /** 내가 푼 횟수 / 틀린 횟수 / 오답률 */
  answers: number;
  wrong: number;
  rate: number;
}

export interface MyStatsData {
  mock?: boolean;
  year: string;
  years: string[];
  totalAttempts: number;
  totalAnswers: number;
  totalWrong: number;
  totalRate: number;
  bySet: MySetStat[];
  questions: MyQuestionStat[];
}

/** 개발용 테스트 학생(user123)이 화면을 확인할 수 있도록 만든 데모 데이터 (Part 1·2의 일부 세트만 푼 상태). 배포 빌드에서는 제거된다. */
function demoMyStats(year: string): MyStatsData {
  const random = seededRandom(1234);
  const questions: MyQuestionStat[] = [];
  const bySet: MySetStat[] = [];
  let totalAttempts = 0;

  for (const [part, set] of [[1, 1], [1, 2], [2, 1], [3, 2], [5, 1]]) {
    const list = questionBank[part]?.[set] ?? [];
    const attempts = 1 + Math.floor(random() * 3);
    totalAttempts += attempts;
    let answers = 0;
    let wrong = 0;
    for (const q of list) {
      const difficulty = random();
      const qWrong = difficulty > 0.7 ? attempts : difficulty > 0.45 ? Math.max(1, attempts - 1) : difficulty > 0.3 ? 1 : 0;
      answers += attempts;
      wrong += qWrong;
      questions.push({ part, set, qid: q.id, answers: attempts, wrong: qWrong, rate: qWrong / attempts });
    }
    bySet.push({ part, set, attempts, answers, wrong, rate: answers ? wrong / answers : 0 });
  }

  const totalAnswers = bySet.reduce((sum, s) => sum + s.answers, 0);
  const totalWrong = bySet.reduce((sum, s) => sum + s.wrong, 0);
  return {
    mock: true, year, years: [year], totalAttempts, totalAnswers, totalWrong,
    totalRate: totalAnswers ? totalWrong / totalAnswers : 0, bySet, questions,
  };
}

function emptyDemoMyStats(year: string): MyStatsData {
  return { mock: true, year, years: [year], totalAttempts: 0, totalAnswers: 0, totalWrong: 0, totalRate: 0, bySet: [], questions: [] };
}

export async function fetchMyStats(year?: string): Promise<ApiResult<MyStatsData>> {
  if (import.meta.env.DEV && isDevTestStudent()) {
    const demoYear = year ?? String(new Date().getFullYear());
    const demoOff = import.meta.env.VITE_DEV_STATS_DEMO === "false";
    return { status: "ok", data: demoOff ? emptyDemoMyStats(demoYear) : demoMyStats(demoYear) };
  }
  return getJson<MyStatsData>(withYear("/api/my-stats", year), "내 통계를 불러오지 못했습니다.");
}
