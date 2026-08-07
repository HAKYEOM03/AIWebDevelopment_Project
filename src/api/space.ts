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
}

export async function loginStudent(studentId: string, password: string): Promise<StudentLoginResult> {
  const res = await fetch("/api/space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "user", studentId, password }),
  });
  return res.json();
}

export async function fetchMyGradExam(): Promise<GradExamResult> {
  const res = await fetch("/api/space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject: "gradExam" }),
  });
  return res.json();
}

export async function logoutStudent(): Promise<void> {
  await fetch("/api/logout", { method: "POST" });
}
