/**
 * POST /api/admin-login  { id, password }
 * 관리자 아이디/비밀번호를 서버에서 검증하고, 맞으면 서명된 관리자 쿠키를 발급한다.
 * 정답은 환경변수(ADMIN_ID, ADMIN_PASSWORD)에만 있어서 브라우저 코드에는 어디에도 없다.
 *
 * 통합 로그인 화면은 학생도 같은 입력칸을 쓰기 때문에, 관리자가 아니면 401만 돌려주고
 * 프론트가 그다음 학생 로그인으로 넘어간다.
 */
import crypto from "node:crypto";
import { createAdminCookie, isHttpsRequest } from "./_lib/session.js";

/** 문자열 길이가 달라도 걸리는 시간이 같도록 해시로 바꿔서 비교한다. */
function safeEqual(a, b) {
  const hash = (v) => crypto.createHash("sha256").update(String(v)).digest();
  return crypto.timingSafeEqual(hash(a), hash(b));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "POST 요청만 지원합니다." });
    return;
  }

  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminId || !adminPassword) {
    // 설정이 없으면 아무도 관리자가 될 수 없게 막는다 (기본 비밀번호 같은 건 두지 않는다).
    res.status(503).json({ ok: false, error: "관리자 계정이 서버에 설정되지 않았습니다." });
    return;
  }

  const { id, password } = req.body || {};
  const matched = typeof id === "string" && typeof password === "string" &&
    // 두 값을 항상 둘 다 비교해서, 아이디만 맞았을 때와 둘 다 틀렸을 때의 시간 차이를 없앤다.
    [safeEqual(id, adminId), safeEqual(password, adminPassword)].every(Boolean);

  if (!matched) {
    await sleep(300); // 무차별 대입 속도를 늦춘다 (학생 로그인도 이 확인을 먼저 거치므로 짧게)
    res.status(401).json({ ok: false });
    return;
  }

  res.setHeader("Set-Cookie", createAdminCookie(isHttpsRequest(req)));
  res.status(200).json({ ok: true });
}
