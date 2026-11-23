/**
 * 연습문제 풀이 기록(통계) 저장소.
 * 학생이 연습문제를 한 번 풀고 제출하면, "파트·세트별로 한 줄"(푼 문제 번호 + 틀린 문제 번호)을
 * 구글 시트 연도 탭(2026, 2027 …)에 쌓는다. 문제 하나마다 한 줄씩 쌓지 않아서 시트가 작게 유지된다.
 * 관리자 화면은 이 줄들을 읽어서 파트·세트·문제별 통계를, 학생 화면은 자기 줄만 읽어서 개인 통계를 계산한다.
 *
 * 개인정보: 학번·이름은 저장하지 않는다. "학우ID"는 학번을 서버 비밀키로 일방향 암호화(HMAC)한 값이라
 * 시트만 봐서는 누구인지 알 수 없고, 같은 학우의 기록끼리만 묶을 수 있다.
 *
 * 개발용 mock: MOCK_STATS=true이면 구글 대신 임시 폴더의 파일에 저장한다 (production에서는 무시됨).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { appendRows, readRows, listTabTitles, createTabWithHeader, isMissingTabError } from "./googleSheets.js";

/** 시트 연도 탭의 머리글 — 구글 시트 템플릿(.xlsx)의 머리글과 반드시 같아야 한다. */
export const HEADER = [
  "기록시각", "시험", "파트", "세트", "모드", "학우ID", "시도ID", "푼 문제 수", "오답 수", "푼 문제 번호", "틀린 문제 번호",
];
const COL = { time: 0, exam: 1, part: 2, set: 3, mode: 4, sid: 5, attempt: 6, asked: 7, wrong: 8, askedList: 9, wrongList: 10 };
const LAST_COLUMN = "K";

const MODES = ["SET", "TEST", "EXAM"];

/** 지금 통계를 기록할 수 있는 시험 — 성경·컴퓨터는 문제 확정 전이라 받지 않는다. */
const RECORDABLE_EXAMS = { english: { parts: [1, 2, 3, 4, 5, 6, 7], sets: [1, 2, 3] } };
const MAX_RESULTS_PER_REQUEST = 300;
const ROW_CACHE_MS = 30_000;

export function isMockStats() {
  return process.env.MOCK_STATS === "true" && process.env.VERCEL_ENV !== "production";
}

/* ---------------- 시간 (한국 시간 기준) ---------------- */

function kstTimestamp(date = new Date()) {
  // sv-SE 형식이 "2026-09-17 14:03:22" 모양으로 나온다.
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).format(date);
}

export const yearOf = (timestamp) => timestamp.slice(0, 4);
export const currentYear = () => yearOf(kstTimestamp());

/* ---------------- 학우ID (학번을 일방향 암호화) ---------------- */

/**
 * 학번 → 같은 학번이면 항상 같고, 되돌릴 수는 없는 16자리 값.
 * 비밀키(STATS_ID_SECRET, 없으면 SESSION_SECRET)가 바뀌면 이전 기록과 연결이 끊기니 함부로 바꾸지 않는다.
 */
export function studentKey(studentNum) {
  const secret = process.env.STATS_ID_SECRET || process.env.SESSION_SECRET;
  if (!secret) throw new Error("STATS_ID_SECRET 또는 SESSION_SECRET 환경변수가 필요합니다.");
  return crypto.createHmac("sha256", secret).update(`stats-student:${studentNum}`).digest("hex").slice(0, 16);
}

/* ---------------- 입력 검사 → 시트 행 ---------------- */

/**
 * 브라우저가 보낸 "문제별 결과" 목록을 검사해서, 파트·세트별로 한 줄씩 종합한 시트 행으로 바꾼다.
 * 서버는 클라이언트를 믿지 않고, 허용된 시험/파트/세트/모드와 숫자 범위만 받는다.
 * 한 번의 요청 = 한 번의 풀이(시도)이므로 같은 시도ID를 붙이고, 모드도 하나여야 한다.
 */
export function buildRows(results, studentNum, now = new Date()) {
  if (!Array.isArray(results) || results.length === 0 || results.length > MAX_RESULTS_PER_REQUEST) {
    return { error: "기록할 결과 개수가 올바르지 않습니다." };
  }

  const groups = new Map();
  let mode;
  for (const item of results) {
    const exam = RECORDABLE_EXAMS[item?.examId];
    const part = Number(item?.part);
    const set = Number(item?.set);
    const qid = Number(item?.qid);
    const valid =
      exam &&
      exam.parts.includes(part) &&
      exam.sets.includes(set) &&
      Number.isInteger(qid) && qid >= 1 && qid <= 2000 &&
      typeof item.correct === "boolean" &&
      MODES.includes(item.mode);
    if (!valid) return { error: "올바르지 않은 결과 값이 들어있습니다." };

    mode ??= item.mode;
    if (item.mode !== mode) return { error: "한 번의 풀이에는 하나의 모드만 담을 수 있습니다." };

    const key = `${item.examId}|${part}|${set}`;
    const group = groups.get(key) ?? { examId: item.examId, part, set, asked: new Set(), wrong: new Set() };
    group.asked.add(qid);
    if (!item.correct) group.wrong.add(qid); // 같은 문제가 섞여 들어와도 한 번이라도 틀렸으면 오답
    groups.set(key, group);
  }

  const timestamp = kstTimestamp(now);
  const sid = studentKey(studentNum);
  const attemptId = crypto.randomBytes(5).toString("hex");
  const numeric = (set) => [...set].sort((a, b) => a - b);

  const rows = [...groups.values()].map((g) => {
    const asked = numeric(g.asked);
    const wrong = numeric(g.wrong);
    return [timestamp, g.examId, g.part, g.set, mode, sid, attemptId, asked.length, wrong.length, asked.join(","), wrong.join(",")];
  });
  return { rows, year: yearOf(timestamp) };
}

/* ---------------- mock 저장소 (개발용) ---------------- */

const mockFile = () => process.env.MOCK_STATS_FILE || path.join(os.tmpdir(), "kbu-mock-stats.json");

/** 같은 시드면 항상 같은 값이 나오는 간단한 난수 — 개발 화면이 매번 같은 데모 데이터를 보여주도록. */
function seededRandom(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 실제 문제 번호 범위(파트 → 세트별 [시작, 개수]) — 데모 데이터가 실제 문제 번호와 맞도록 */
const DEMO_SET_RANGES = {
  1: [[1, 10], [11, 10], [21, 10]],
  2: [[31, 30], [61, 30], [91, 30]],
  3: [[121, 30], [151, 30], [181, 30]],
  4: [[211, 30], [241, 30], [271, 30]],
  5: [[301, 40], [341, 40], [381, 40]],
  6: [[421, 12], [433, 12], [445, 12]],
  7: [[457, 48], [505, 48], [553, 48]],
};

function demoRows(year) {
  const random = seededRandom(20260917);
  const rows = [];
  const difficulty = new Map();
  let attemptNo = 0;

  for (let student = 1; student <= 60; student++) {
    const sid = crypto.createHash("sha256").update(`demo-${student}`).digest("hex").slice(0, 16);
    for (let part = 1; part <= 7; part++) {
      for (let set = 1; set <= 3; set++) {
        if (random() < 0.55) continue; // 모든 학우가 모든 세트를 푸는 건 아니다
        const [start, count] = DEMO_SET_RANGES[part][set - 1];
        const attempts = 1 + Math.floor(random() * 3);
        for (let a = 0; a < attempts; a++) {
          const asked = [];
          const wrong = [];
          for (let q = start; q < start + count; q++) {
            if (!difficulty.has(q)) difficulty.set(q, 0.05 + random() * 0.6);
            asked.push(q);
            if (random() < difficulty.get(q) * (1 - a * 0.25)) wrong.push(q);
          }
          const month = String(3 + Math.floor(random() * 6)).padStart(2, "0");
          const day = String(1 + Math.floor(random() * 28)).padStart(2, "0");
          attemptNo += 1;
          rows.push([
            `${year}-${month}-${day} 14:00:00`, "english", part, set, "SET", sid, `demo${attemptNo}`,
            asked.length, wrong.length, asked.join(","), wrong.join(","),
          ]);
        }
      }
    }
  }
  return rows;
}

function loadMock() {
  const file = mockFile();
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));

  const data = { years: {} };
  if (process.env.MOCK_STATS_DEMO !== "false") data.years[currentYear()] = demoRows(currentYear());
  fs.writeFileSync(file, JSON.stringify(data));
  return data;
}

function saveMock(data) {
  fs.writeFileSync(mockFile(), JSON.stringify(data));
}

/* ---------------- 저장 / 조회 ---------------- */

const rowCache = new Map(); // 연도 → { at, rows } — 같은 서버 인스턴스에서 짧게만 재사용

/** 검사를 통과한 행들을 해당 연도 탭에 한 번에 추가한다. */
export async function appendResultRows(rows, year) {
  if (isMockStats()) {
    const data = loadMock();
    (data.years[year] ??= []).push(...rows);
    saveMock(data);
    return;
  }

  try {
    await appendRows(year, `A:${LAST_COLUMN}`, rows);
  } catch (error) {
    // 새해 첫 기록처럼 연도 탭이 아직 없으면 만들어주고 한 번만 다시 시도한다.
    if (!isMissingTabError(error)) throw error;
    await createTabWithHeader(year, HEADER);
    await appendRows(year, `A:${LAST_COLUMN}`, rows);
  }
  rowCache.delete(year);
}

/** 해당 연도 탭의 기록 행들 (머리글 제외). 탭이 없으면 빈 배열. */
export async function readYearRows(year) {
  if (isMockStats()) {
    return loadMock().years[year] ?? [];
  }

  const cached = rowCache.get(year);
  if (cached && Date.now() - cached.at < ROW_CACHE_MS) return cached.rows;

  let rows;
  try {
    rows = await readRows(year, `A2:${LAST_COLUMN}`);
  } catch (error) {
    if (!isMissingTabError(error)) throw error;
    rows = [];
  }
  rowCache.set(year, { at: Date.now(), rows });
  return rows;
}

/** 기록이 있는 연도 목록 (최신순). 올해는 아직 기록이 없어도 항상 포함한다. */
export async function listYears() {
  let years;
  if (isMockStats()) {
    years = Object.keys(loadMock().years);
  } else {
    years = (await listTabTitles()).filter((title) => /^\d{4}$/.test(title));
  }
  return [...new Set([...years, currentYear()])].sort().reverse();
}

/* ---------------- 집계 ---------------- */

const ratio = (part, whole) => (whole === 0 ? 0 : part / whole);

function parseList(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((n) => Number.isInteger(n) && n > 0);
}

/** 시트의 한 줄을 계산하기 편한 모양으로 바꾼다. 형식이 이상한 줄은 건너뛴다(null). */
function parseRow(row) {
  const part = Number(row[COL.part]);
  const set = Number(row[COL.set]);
  if (!Number.isInteger(part) || !Number.isInteger(set)) return null;

  const asked = parseList(row[COL.askedList]);
  if (asked.length === 0) return null;
  const askedSet = new Set(asked);
  return {
    exam: row[COL.exam],
    part,
    set,
    mode: row[COL.mode],
    sid: String(row[COL.sid] ?? ""),
    attempt: String(row[COL.attempt] ?? ""),
    asked,
    wrong: new Set(parseList(row[COL.wrongList]).filter((qid) => askedSet.has(qid))),
  };
}

/**
 * [관리자용] 모든 학우의 기록을 파트·세트별, 문제별로 종합한다.
 *
 * 파트·세트 단위
 *   students     그 세트를 "세트 연습"으로 푼 학우 수
 *   avgAttempts  학우 1명당 그 세트를 푼 평균 횟수
 *   rate         그 세트 문항들의 오답률 (랜덤 테스트로 푼 문항도 포함)
 * 문제 단위
 *   students / wrongStudents / studentRate   푼 학우 수 / 한 번이라도 틀린 학우 수 / 그 비율
 *   answers / wrong / rate                   푼 횟수 / 틀린 횟수 / 횟수 기준 오답률
 */
export function aggregate(rows, examId = "english") {
  const everyone = new Set();
  const attempts = new Set();
  const sets = new Map();
  const questions = new Map();
  let totalAnswers = 0;
  let totalWrong = 0;

  for (const raw of rows) {
    const row = parseRow(raw);
    if (!row || row.exam !== examId) continue;

    everyone.add(row.sid);
    attempts.add(row.attempt);
    totalAnswers += row.asked.length;
    totalWrong += row.wrong.size;

    const setKey = `${row.part}-${row.set}`;
    const setStat = sets.get(setKey) ?? { part: row.part, set: row.set, students: new Set(), attempts: 0, answers: 0, wrong: 0 };
    setStat.answers += row.asked.length;
    setStat.wrong += row.wrong.size;
    if (row.mode === "SET") {
      setStat.students.add(row.sid);
      setStat.attempts += 1;
    }
    sets.set(setKey, setStat);

    for (const qid of row.asked) {
      const key = `${row.part}-${row.set}-${qid}`;
      const q = questions.get(key) ?? { part: row.part, set: row.set, qid, students: new Set(), wrongStudents: new Set(), answers: 0, wrong: 0 };
      q.students.add(row.sid);
      q.answers += 1;
      if (row.wrong.has(qid)) {
        q.wrong += 1;
        q.wrongStudents.add(row.sid);
      }
      questions.set(key, q);
    }
  }

  return {
    participants: everyone.size,
    totalAttempts: attempts.size,
    totalAnswers,
    totalWrong,
    totalRate: ratio(totalWrong, totalAnswers),
    bySet: [...sets.values()]
      .map((s) => ({
        part: s.part, set: s.set,
        students: s.students.size,
        attempts: s.attempts,
        avgAttempts: ratio(s.attempts, s.students.size),
        answers: s.answers, wrong: s.wrong, rate: ratio(s.wrong, s.answers),
      }))
      .sort((a, b) => a.part - b.part || a.set - b.set),
    questions: [...questions.values()]
      .map((q) => ({
        part: q.part, set: q.set, qid: q.qid,
        students: q.students.size,
        wrongStudents: q.wrongStudents.size,
        studentRate: ratio(q.wrongStudents.size, q.students.size),
        answers: q.answers, wrong: q.wrong, rate: ratio(q.wrong, q.answers),
      }))
      .sort((a, b) => a.part - b.part || a.set - b.set || a.qid - b.qid),
  };
}

/**
 * [학생용] 한 학우(studentNum)의 기록만 골라서 개인 통계를 만든다.
 * 다른 학우의 기록은 이 계산에 들어가지 않고, 결과에도 나가지 않는다.
 */
export function aggregateForStudent(rows, studentNum, examId = "english") {
  const sid = studentKey(studentNum);
  const attempts = new Set();
  const sets = new Map();
  const questions = new Map();
  let totalAnswers = 0;
  let totalWrong = 0;

  for (const raw of rows) {
    const row = parseRow(raw);
    if (!row || row.exam !== examId || row.sid !== sid) continue;

    attempts.add(row.attempt);
    totalAnswers += row.asked.length;
    totalWrong += row.wrong.size;

    const setKey = `${row.part}-${row.set}`;
    const setStat = sets.get(setKey) ?? { part: row.part, set: row.set, attempts: 0, answers: 0, wrong: 0 };
    setStat.answers += row.asked.length;
    setStat.wrong += row.wrong.size;
    if (row.mode === "SET") setStat.attempts += 1;
    sets.set(setKey, setStat);

    for (const qid of row.asked) {
      const key = `${row.part}-${row.set}-${qid}`;
      const q = questions.get(key) ?? { part: row.part, set: row.set, qid, answers: 0, wrong: 0 };
      q.answers += 1;
      if (row.wrong.has(qid)) q.wrong += 1;
      questions.set(key, q);
    }
  }

  return {
    totalAttempts: attempts.size,
    totalAnswers,
    totalWrong,
    totalRate: ratio(totalWrong, totalAnswers),
    bySet: [...sets.values()]
      .map((s) => ({ ...s, rate: ratio(s.wrong, s.answers) }))
      .sort((a, b) => a.part - b.part || a.set - b.set),
    questions: [...questions.values()]
      .map((q) => ({ ...q, rate: ratio(q.wrong, q.answers) }))
      .sort((a, b) => a.part - b.part || a.set - b.set || a.qid - b.qid),
  };
}
