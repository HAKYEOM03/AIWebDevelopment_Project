/**
 * 관리자 로그인 상태.
 * 아이디/비밀번호는 서버(/api/admin-login)가 환경변수와 비교해서 확인하고,
 * 이 파일에는 정답이 없다. 서버가 인정하면 브라우저에는 "관리자 화면을 보여줘도 된다"는 표시만 남긴다.
 * (통계처럼 진짜 보호해야 하는 데이터는 이 표시가 아니라 서버가 발급한 관리자 쿠키로 막는다.)
 */
const STORAGE_KEY = "kbu_admin_auth";
const DEV_ADMIN_KEY = "kbu_dev_admin";

// 로컬 개발 전용 테스트 관리자 (admin123 / admin123).
// .env.local에 VITE_DEV_TEST_ACCOUNTS=true가 있고 개발 서버일 때만 통하고, 배포 빌드에서는 코드가 제거된다.
const DEV_TEST = import.meta.env.DEV && import.meta.env.VITE_DEV_TEST_ACCOUNTS === "true";

export async function loginAdmin(id: string, pw: string): Promise<boolean> {
  if (DEV_TEST && id === "admin123" && pw === "admin123") {
    sessionStorage.setItem(STORAGE_KEY, "true");
    sessionStorage.setItem(DEV_ADMIN_KEY, "true");
    return true;
  }

  try {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw }),
    });
    if (!res.ok) return false;
  } catch {
    // 서버(api/)가 없는 환경이거나 네트워크 오류 — 관리자가 아닌 것으로 보고 학생 로그인으로 넘어간다.
    return false;
  }

  sessionStorage.setItem(STORAGE_KEY, "true");
  return true;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(DEV_ADMIN_KEY);
  // 서버가 발급한 관리자 쿠키도 같이 지운다. 서버가 없는 환경에서는 실패해도 상관없다.
  fetch("/api/logout", { method: "POST" }).catch(() => {});
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

/** 개발용 테스트 관리자로 로그인한 상태인지 (서버 쿠키가 없으므로 통계는 데모 데이터로 보여준다) */
export function isDevTestAdmin(): boolean {
  return DEV_TEST && sessionStorage.getItem(DEV_ADMIN_KEY) === "true";
}
