/**
 * GET /api/my-stats?year=2026
 * 로그인한 학생 "본인"의 연습문제 통계 — 어느 파트·세트, 몇 번 문제가 가장 약한지 보여주기 위한 데이터.
 * 누구의 기록을 볼지는 요청이 아니라 로그인 세션(쿠키)에서만 정한다 (다른 학우 것은 조회할 수 없다).
 */
import { getStudentNumFromRequest } from "./_lib/session.js";
import { readYearRows, listYears, aggregateForStudent, currentYear, isMockStats } from "./_lib/statsStore.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "GET 요청만 지원합니다." });
    return;
  }

  const studentNum = getStudentNumFromRequest(req);
  if (!studentNum) {
    res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
    return;
  }

  try {
    const requestedYear = String(req.query?.year ?? "");
    const year = /^\d{4}$/.test(requestedYear) ? requestedYear : currentYear();

    const [years, rows] = await Promise.all([listYears(), readYearRows(year)]);
    res.status(200).json({ ok: true, year, years, mock: isMockStats(), ...aggregateForStudent(rows, studentNum) });
  } catch (err) {
    console.error("[api/my-stats]", err);
    const debug = process.env.VERCEL_ENV !== "production" ? err.message : undefined;
    res.status(502).json({ ok: false, error: "내 통계를 불러오는 중 오류가 발생했습니다.", debug });
  }
}
