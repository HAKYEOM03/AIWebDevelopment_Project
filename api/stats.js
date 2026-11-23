/**
 * GET /api/stats?year=2026
 * 관리자 전용 — 연습문제 풀이 기록을 읽어 파트·세트·문제별 오답률로 집계해서 돌려준다.
 * 서버가 발급한 관리자 쿠키가 없으면 데이터는 한 줄도 나가지 않는다.
 */
import { isAdminRequest } from "./_lib/session.js";
import { readYearRows, listYears, aggregate, currentYear, isMockStats } from "./_lib/statsStore.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "GET 요청만 지원합니다." });
    return;
  }

  if (!isAdminRequest(req)) {
    res.status(401).json({ ok: false, error: "관리자 로그인이 필요합니다." });
    return;
  }

  try {
    const requestedYear = String(req.query?.year ?? "");
    const year = /^\d{4}$/.test(requestedYear) ? requestedYear : currentYear();

    const [years, rows] = await Promise.all([listYears(), readYearRows(year)]);
    // mock: 개발용 임시 저장소를 쓰는 중이라는 표시 — 화면이 "실제 기록이 아님"을 알려주는 데 쓴다.
    res.status(200).json({ ok: true, year, years, mock: isMockStats(), ...aggregate(rows) });
  } catch (err) {
    console.error("[api/stats]", err);
    const debug = process.env.VERCEL_ENV !== "production" ? err.message : undefined;
    res.status(502).json({ ok: false, error: "통계를 불러오는 중 오류가 발생했습니다.", debug });
  }
}
