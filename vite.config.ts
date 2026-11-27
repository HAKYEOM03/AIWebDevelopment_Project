import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // .env.local의 API_PROXY_TARGET (예: http://localhost:5080)을 읽는다.
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.API_PROXY_TARGET;

  return {
    plugins: [react()],
    // GitHub Pages는 "/AIWebDevelopment_Project/" 하위 경로에서 서비스되지만,
    // Vercel은 루트 경로("/")에서 서비스된다. Vercel이 자동으로 심어주는
    // VERCEL 환경변수로 두 배포 대상을 구분해서 base를 다르게 적용한다.
    // (학교 서버용 빌드는 npm run build:server가 --base=/ 로 덮어쓴다)
    base: process.env.VERCEL ? "/" : "/AIWebDevelopment_Project/",
    server: {
      // ASP.NET 서버 폴더(빌드 결과, DB 파일)는 화면 코드가 아니라서 감시하지 않는다.
      // 감시하면 서버를 빌드하거나 실행하는 동안 파일이 잠겨 npm run dev가 꺼질 수 있다.
      watch: { ignored: ["**/server/**"] },
      // API_PROXY_TARGET이 있으면 npm run dev 화면의 /api 요청을 ASP.NET 서버(server/ExamServer)로 넘긴다.
      proxy: apiTarget ? { "/api": { target: apiTarget, changeOrigin: true } } : undefined,
    },
  };
});
