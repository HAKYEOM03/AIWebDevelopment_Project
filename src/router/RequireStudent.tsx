import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStudentAuth } from "../context/StudentAuthContext";
import { isAdminAuthenticated } from "../utils/auth";

/**
 * 로그인(관리자 또는 학생) 없이는 사이트의 일반 페이지를 볼 수 없게 막는 보호 컴포넌트.
 * 로그인 상태는 앱 전체에서 한 번만 확인해서 기억하는 StudentAuthContext를 그대로 사용한다
 * (페이지 이동마다 다시 물어보지 않아서 깜빡임/지연이 없다).
 */
export default function RequireStudent({ children }: { children: ReactNode }) {
  const isAdmin = isAdminAuthenticated();
  const { studentNum, loading } = useStudentAuth();

  // 로컬 개발 전용 스위치 — .env.local에 VITE_SKIP_AUTH=true를 넣으면 로그인 없이 전체 화면 접근 가능.
  // 이 값은 빌드 시 결정되고 실제 배포(Vercel)에는 이 변수를 등록하지 않으니 실서비스엔 영향 없음.
  if (import.meta.env.VITE_SKIP_AUTH === "true") {
    return <>{children}</>;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        로그인 확인 중...
      </div>
    );
  }

  if (!studentNum) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
