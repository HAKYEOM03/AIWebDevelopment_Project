/**
 * POST /api/space
 * 프론트엔드가 직접 학교 API를 호출하지 않고 이 함수를 거치도록 하는 프록시.
 * - API 키는 이 서버(Vercel 함수) 안에서만 사용되고 프론트엔드에는 절대 노출되지 않는다.
 * - subject는 화이트리스트로만 허용한다.
 * - 프론트가 보낸 값을 그대로 학교 API에 전달하지 않고, 필드를 하나씩 직접 조립한다.
 */
import { verifyStudentLogin, fetchGradExamInfo } from "./_lib/bibleApi.js";
import { createSessionCookie, getStudentNumFromRequest } from "./_lib/session.js";

const ALLOWED_SUBJECTS = ["user", "gradExam"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST 요청만 지원합니다." });
    return;
  }

  const body = req.body || {};
  const { subject } = body;

  if (!ALLOWED_SUBJECTS.includes(subject)) {
    res.status(400).json({ ok: false, error: "지원하지 않는 요청입니다." });
    return;
  }

  try {
    if (subject === "user") {
      const { studentId, password } = body;
      if (!studentId || !password) {
        res.status(400).json({ ok: false, error: "학번과 비밀번호를 입력하세요." });
        return;
      }

      const { success, userNum, userStatus } = await verifyStudentLogin(studentId, password);
      if (!success) {
        res.status(401).json({ ok: false, error: "학번 또는 비밀번호가 올바르지 않습니다." });
        return;
      }

      res.setHeader("Set-Cookie", createSessionCookie(userNum));
      res.status(200).json({ ok: true, studentNum: userNum, userStatus });
      return;
    }

    // subject === "gradExam"
    // 학번은 절대 body에서 받지 않는다 — 로그인 세션(쿠키)에서 검증된 값만 사용한다.
    const studentNum = getStudentNumFromRequest(req);
    if (!studentNum) {
      res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
      return;
    }

    const data = await fetchGradExamInfo(studentNum);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("[api/space]", err);
    res.status(502).json({ ok: false, error: "학교 API 호출 중 오류가 발생했습니다." });
  }
}
