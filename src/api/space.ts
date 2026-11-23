/**
 * 학교 API(/api/space, /api/logout) 호출 전용 모듈.
 * 학교 API 키나 학교 API의 실제 필드명(keyA/keyB 등)은 여기서 다루지 않는다
 * — 그건 서버(api/_lib/bibleApi.js)에만 있고, 프론트는 우리 자체 백엔드만 호출한다.
 */

export interface StudentLoginResult {
  ok: boolean;
  studentNum?: string;
  userStatus?: string;
  error?: string;
  /** 로컬 개발(vercel dev)에서만 서버가 같이 내려주는 실제 에러 원인. 배포된 서비스에선 항상 비어있음. */
  debug?: string;
}

export interface GradExamRecord {
  semester?: string;
  testItem?: string;
  applicationDate?: string;
  passingDate?: string;
  passFail?: string;
  [key: string]: unknown;
}

export interface GradExamResult {
  ok: boolean;
  data?: GradExamRecord[];
  error?: string;
  debug?: string;
}

/**
 * 로컬 개발 전용 테스트 학생 계정 (user123 / user123).
 * npm run dev처럼 api/ 서버가 없는 환경에서도 로그인 → 결과 조회 흐름을 확인하기 위한 것.
 * .env.local에 VITE_DEV_TEST_ACCOUNTS=true가 있고 개발 서버(import.meta.env.DEV)일 때만 동작하며,
 * 실제 배포 빌드에서는 DEV가 false라 이 코드가 통째로 제거된다.
 */
const DEV_TEST = import.meta.env.DEV && import.meta.env.VITE_DEV_TEST_ACCOUNTS === "true";
const DEV_SESSION_KEY = "kbu_dev_student";

function devStudentNum(): string | null {
  return DEV_TEST ? sessionStorage.getItem(DEV_SESSION_KEY) : null;
}

/** 개발용 테스트 학생(user123)으로 로그인한 상태인지 — 서버 쿠키가 없어 개인 통계 화면을 데모로 보여줄 때 쓴다. */
export function isDevTestStudent(): boolean {
  return devStudentNum() !== null;
}

function devGradExamRecords(): GradExamRecord[] {
  return [
    { semester: "20261", testItem: "0", applicationDate: "2026-03-31 오전 9:08:37", passingDate: "2026-04-11 오전 12:00:00", passFail: "1", score: "68", examDate: "2026-04-11", attendance: "응시" },
    { semester: "20252", testItem: "1", applicationDate: "2025-10-30 오전 12:20:09", passingDate: "2025-11-15 오전 12:00:00", passFail: "1", score: "63", examDate: "2025-11-15", attendance: "응시" },
    { semester: "20251", testItem: "1", applicationDate: "2025-05-07 오후 10:24:04", passingDate: "2025-05-31 오전 12:00:00", passFail: "0", score: "42", examDate: "2025-05-31", attendance: "응시" },
    { semester: "20231", testItem: "2", applicationDate: "2023-03-17 오전 12:00:00", passingDate: "2023-03-14 오전 12:00:00", passFail: "1", score: "0", examDate: "2023-03-14", attendance: "응시", remark: "LPIC" },
  ];
}

export async function loginStudent(studentId: string, password: string): Promise<StudentLoginResult> {
  if (DEV_TEST && studentId === "user123" && password === "user123") {
    sessionStorage.setItem(DEV_SESSION_KEY, studentId);
    return { ok: true, studentNum: studentId, userStatus: "10" };
  }

  const res = await fetch("/api/space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "user", studentId, password }),
  });
  return res.json();
}

export async function fetchMyGradExam(): Promise<GradExamResult> {
  if (devStudentNum()) {
    return { ok: true, data: devGradExamRecords() };
  }

  const res = await fetch("/api/space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "gradExam" }),
  });
  return res.json();
}

export async function logoutStudent(): Promise<void> {
  if (DEV_TEST) sessionStorage.removeItem(DEV_SESSION_KEY);

  try {
    await fetch("/api/logout", { method: "POST" });
  } catch {
    // api/ 서버가 없는 환경(npm run dev)에서는 무시
  }
}

export interface SessionCheckResult {
  ok: boolean;
  studentNum?: string;
}

/** 사이트 전체 접근을 막기 위해 라우터가 호출하는 함수 — 지금 로그인 상태인지만 확인한다. */
export async function checkStudentSession(): Promise<SessionCheckResult> {
  const devNum = devStudentNum();
  if (devNum) return { ok: true, studentNum: devNum };

  // api/ 서버가 없거나 JSON이 아닌 응답이 와도 "로그인 안 됨"으로 처리해야 화면이 로딩에서 멈추지 않는다.
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}
