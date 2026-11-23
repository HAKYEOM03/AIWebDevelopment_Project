/**
 * 로그인 세션(쿠키) 발급/검증 전용 모듈 — 학생 세션과 관리자 세션 두 종류.
 * 서버(Vercel 함수)는 상태를 저장하지 않으므로, "서명된 쿠키" 방식으로 로그인 상태를 유지한다.
 *
 * 쿠키 안에는 누구인지(학번 또는 관리자 표시)와 만료시각만 들어있고,
 * SESSION_SECRET으로 서명되어 있어 클라이언트가 값을 위조할 수 없다.
 * 학생 쿠키와 관리자 쿠키는 이름도 다르고 내용(purpose)도 달라서, 서로 바꿔 끼워도 통하지 않는다.
 */
import crypto from "node:crypto";

const STUDENT_COOKIE = "kbu_student_session";
const ADMIN_COOKIE = "kbu_admin_session";
const STUDENT_TTL_MS = 60 * 60 * 1000; // 1시간
const ADMIN_TTL_MS = 4 * 60 * 60 * 1000; // 4시간

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 등록하세요.");
  }
  return secret;
}

function sign(payloadB64) {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

function buildCookie(name, value, maxAgeSeconds, secure) {
  const parts = [`${name}=${value}`, "HttpOnly"];
  // Secure 쿠키는 https에서만 브라우저가 저장한다.
  // 로컬 vercel dev(http)에서는 Secure를 붙이면 쿠키 자체가 저장 안 돼서 로그인이 매번 풀린다.
  if (secure) parts.push("Secure");
  parts.push("SameSite=Strict", "Path=/", `Max-Age=${maxAgeSeconds}`);
  return parts.join("; ");
}

/**
 * 요청이 https로 온 건지 판단한다. Vercel은 프록시를 거치므로 req.protocol이 아니라
 * x-forwarded-proto 헤더로 알아야 한다. 로컬 vercel dev는 http라 여기서 false가 나온다.
 */
export function isHttpsRequest(req) {
  return req.headers["x-forwarded-proto"] === "https";
}

function createToken(payload, ttlMs) {
  const body = JSON.stringify({ ...payload, exp: Date.now() + ttlMs });
  const payloadB64 = Buffer.from(body).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

function parseCookies(cookieHeader) {
  const out = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  }
  return out;
}

/** 서명과 만료를 검증하고 내용(payload)을 돌려준다. 하나라도 어긋나면 null. */
function readToken(req, cookieName) {
  const token = parseCookies(req.headers.cookie)[cookieName];
  if (!token) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(sign(payloadB64));
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/* ---------------- 학생 ---------------- */

/** 로그인 성공 시 브라우저에 심어줄 Set-Cookie 값 생성 */
export function createSessionCookie(studentNum, secure = true) {
  const token = createToken({ purpose: "student", studentNum }, STUDENT_TTL_MS);
  return buildCookie(STUDENT_COOKIE, token, STUDENT_TTL_MS / 1000, secure);
}

/** 로그아웃 시 쿠키를 지우는 Set-Cookie 값 */
export function clearSessionCookie(secure = true) {
  return buildCookie(STUDENT_COOKIE, "", 0, secure);
}

/**
 * 요청 쿠키에서 로그인된 학번을 검증해서 꺼낸다.
 * 서명이 안 맞거나 만료됐으면 null (= 로그인 안 된 것으로 취급).
 */
export function getStudentNumFromRequest(req) {
  const payload = readToken(req, STUDENT_COOKIE);
  if (!payload || payload.purpose !== "student" || !payload.studentNum) return null;
  return payload.studentNum;
}

/* ---------------- 관리자 ---------------- */

export function createAdminCookie(secure = true) {
  const token = createToken({ purpose: "admin" }, ADMIN_TTL_MS);
  return buildCookie(ADMIN_COOKIE, token, ADMIN_TTL_MS / 1000, secure);
}

export function clearAdminCookie(secure = true) {
  return buildCookie(ADMIN_COOKIE, "", 0, secure);
}

/** 이 요청이 서버가 인정한 관리자 세션을 갖고 있는지 */
export function isAdminRequest(req) {
  const payload = readToken(req, ADMIN_COOKIE);
  return Boolean(payload && payload.purpose === "admin");
}
