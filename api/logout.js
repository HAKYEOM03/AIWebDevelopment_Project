/** POST /api/logout — 학생 로그인 세션 쿠키를 지운다. */
import { clearSessionCookie } from "./_lib/session.js";

export default function handler(req, res) {
  res.setHeader("Set-Cookie", clearSessionCookie());
  res.status(200).json({ ok: true });
}
