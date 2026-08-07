/**
 * 학생 로그인 세션(쿠키) 발급/검증 전용 모듈.
 * 서버(Vercel 함수)는 상태를 저장하지 않으므로,
 * "서명된 쿠키" 방식으로 로그인 상태를 유지한다.
 *
 * 쿠키 안에는 학번(studentNum)과 만료시각만 들어있고,
 * SESSION_SECRET으로 서명되어 있어 클라이언트가 값을 위조할 수 없다.
 */
import crypto from "node:crypto";

const COOKIE_NAME = "kbu_student_session";
const SESSION_TTL_MS = 60 * 60 * 1000; // 1시간

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

/** 로그인 성공 시 브라우저에 심어줄 Set-Cookie 값 생성 */
export function createSessionCookie(studentNum) {
  const payload = JSON.stringify({ studentNum, exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const signature = sign(payloadB64);
  const token = `${payloadB64}.${signature}`;

  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`;
}

/** 로그아웃 시 쿠키를 지우는 Set-Cookie 값 */
export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
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

/**
 * 요청 쿠키에서 로그인된 학번을 검증해서 꺼낸다.
 * 서명이 안 맞거나 만료됐으면 null (= 로그인 안 된 것으로 취급).
 */
export function getStudentNumFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (!payload.studentNum || !payload.exp || Date.now() > payload.exp) return null;
    return payload.studentNum;
  } catch {
    return null;
  }
}
