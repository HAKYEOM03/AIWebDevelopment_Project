import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { checkStudentSession } from "../api/space";

interface StudentAuthState {
  /** null = 학생 로그인 안 됨, "확인 중"이 아니라면 확정된 상태 */
  studentNum: string | null;
  /** 처음 로그인 상태를 서버에 물어보는 중인지 */
  loading: boolean;
  /** 로그인/로그아웃 직후 즉시 상태 다시 확인할 때 호출 */
  refresh: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthState | undefined>(undefined);

/**
 * 학생(학교 API) 로그인 상태를 앱 전체에서 한 번만 확인하고 기억한다.
 * App.tsx에서 Router 전체를 감싸는 용도 — 페이지를 이동해도 다시 물어보지 않아서
 * 네비게이션에 로그인 상태가 즉시, 계속 정확하게 보인다.
 */
export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [studentNum, setStudentNum] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await checkStudentSession();
    setStudentNum(result.ok ? result.studentNum ?? null : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <StudentAuthContext.Provider value={{ studentNum, loading, refresh }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth(): StudentAuthState {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) {
    throw new Error("useStudentAuth는 StudentAuthProvider 안에서만 사용할 수 있습니다.");
  }
  return ctx;
}
