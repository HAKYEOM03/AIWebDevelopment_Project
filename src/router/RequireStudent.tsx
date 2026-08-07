import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkStudentSession } from "../api/space";
import { isAdminAuthenticated } from "../utils/auth";

/**
 * 로그인(관리자 또는 학생) 없이는 사이트의 일반 페이지를 볼 수 없게 막는 보호 컴포넌트.
 * 관리자는 즉시 통과, 학생은 학교 API 로그인 세션(쿠키)을 확인해서 통과시킨다.
 */
export default function RequireStudent({ children }: { children: ReactNode }) {
  const isAdmin = isAdminAuthenticated();
  const [status, setStatus] = useState<"checking" | "ok" | "fail">(isAdmin ? "ok" : "checking");

  useEffect(() => {
    if (isAdmin) return;
    let cancelled = false;
    checkStudentSession().then((result) => {
      if (cancelled) return;
      setStatus(result.ok ? "ok" : "fail");
    });
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        로그인 확인 중...
      </div>
    );
  }

  if (status === "fail") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
