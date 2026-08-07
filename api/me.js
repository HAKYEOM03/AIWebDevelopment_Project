/**
 * GET /api/me
 * 지금 이 브라우저가 학생 로그인 세션(쿠키)을 갖고 있는지 확인하는 용도.
 * 프론트엔드는 이 응답만으로 "로그인 상태인지" 판단하고,
 * 실제 데이터 조회(/api/space, subject=gradExam)는 여전히 서버가 쿠키를 다시 검증한다.
 */
import { getStudentNumFromRequest } from "./_lib/session.js";

export default function handler(req, res) {
  const studentNum = getStudentNumFromRequest(req);
  if (!studentNum) {
    res.status(401).json({ ok: false });
    return;
  }
  res.status(200).json({ ok: true, studentNum });
}
