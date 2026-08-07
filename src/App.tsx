import Router from "./router/Router";
import { StudentAuthProvider } from "./context/StudentAuthContext";

export default function App() {
  return (
    <StudentAuthProvider>
      <Router />
    </StudentAuthProvider>
  );
}
