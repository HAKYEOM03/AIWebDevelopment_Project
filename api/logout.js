/** POST /api/logout — 학생·관리자 로그인 세션 쿠키를 모두 지운다. */
import { clearSessionCookie, clearAdminCookie, isHttpsRequest } from "./_lib/session.js";

export default function handler(req, res) {
  const secure = isHttpsRequest(req);
  res.setHeader("Set-Cookie", [clearSessionCookie(secure), clearAdminCookie(secure)]);
  res.status(200).json({ ok: true });
}
