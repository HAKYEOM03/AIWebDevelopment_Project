/**
 * POST /api/stats-record  { results: [{ examId, part, set, qid, correct, mode }, ...] }
 * 학생이 연습문제를 한 번 풀고 제출했을 때, 그 결과를 파트·세트별로 한 줄씩 종합해서 구글 시트에 기록한다.
 *
 * - 로그인한 학생만 보낼 수 있다 (학생 세션 쿠키 확인).
 * - 학번은 기록하지 않는다. 같은 학우의 기록끼리만 묶을 수 있는 "학우ID"(학번의 일방향 암호값)만 남는다.
 * - 한 번의 시트 호출로 묶어서 쓴다 (구글 시트 분당 쓰기 한도 때문).
 */
import { getStudentNumFromRequest } from "./_lib/session.js";
import { buildRows, appendResultRows } from "./_lib/statsStore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST 요청만 지원합니다." });
    return;
  }

  const studentNum = getStudentNumFromRequest(req);
  if (!studentNum) {
    res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
    return;
  }

  try {
    const built = buildRows(req.body?.results, studentNum);
    if (built.error) {
      res.status(400).json({ ok: false, error: built.error });
      return;
    }

    await appendResultRows(built.rows, built.year);
    res.status(200).json({ ok: true, count: built.rows.length });
  } catch (err) {
    console.error("[api/stats-record]", err);
    const debug = process.env.VERCEL_ENV !== "production" ? err.message : undefined;
    res.status(502).json({ ok: false, error: "통계 기록 중 오류가 발생했습니다.", debug });
  }
}
