/**
 * 관리자 설정(시험 잠금, D-DAY 잠금, 시험 날짜, 소개 내용)을 서버(ASP.NET, /api/settings)와 주고받는다.
 * 서버에 이 API가 없는 환경(Vercel, GitHub Pages, 서버 없이 npm run dev)에서는
 * fetchServerSettings가 null을 돌려주고, 화면은 예전처럼 이 브라우저(localStorage)에만 저장한다.
 */

export type SettingKey = "examLocks" | "ddayLocks" | "examDates" | "introContent";

export type ServerSettings = Partial<Record<SettingKey, Record<string, unknown>>>;

/** 서버 설정을 읽는다. 서버가 없거나 응답이 이상하면 null. */
export async function fetchServerSettings(): Promise<ServerSettings | null> {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return null;
    const body = await res.json();
    return body?.ok && body.settings && typeof body.settings === "object" ? body.settings : null;
  } catch {
    return null;
  }
}

/** 설정 하나를 통째로 저장한다 (관리자만). 실패하면 화면에 보여줄 문장을 돌려준다. */
export async function saveServerSetting(key: SettingKey, value: unknown): Promise<string | null> {
  try {
    const res = await fetch(`/api/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (res.ok) return null;
    if (res.status === 401) return "관리자 로그인이 만료되어 저장하지 못했습니다. 다시 로그인한 뒤 바꿔 주세요.";
    const body = await res.json().catch(() => null);
    return body?.error ? `저장하지 못했습니다: ${body.error}` : "서버에 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";
  } catch {
    return "서버와 연결되지 않아 저장하지 못했습니다.";
  }
}
