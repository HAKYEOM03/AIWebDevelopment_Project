const ADMIN_ID = "admin";
const ADMIN_PW = "kbu2026";
const STORAGE_KEY = "kbu_admin_auth";

export function loginAdmin(id: string, pw: string): boolean {
  if (id === ADMIN_ID && pw === ADMIN_PW) {
    sessionStorage.setItem(STORAGE_KEY, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}
