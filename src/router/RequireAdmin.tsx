import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/auth";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
