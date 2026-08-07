/** POST /api/logout — 학생 로그인 세션 쿠키를 지운다. */
import { clearSessionCookie, isHttpsRequest } from "./_lib/session.js";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", clearSessionCookie(isHttpsRequest(req)));
  res.status(200).json({ ok: true });
}
