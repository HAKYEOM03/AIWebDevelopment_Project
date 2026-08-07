import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages는 "/AIWebDevelopment_Project/" 하위 경로에서 서비스되지만,
  // Vercel은 루트 경로("/")에서 서비스된다. Vercel이 자동으로 심어주는
  // VERCEL 환경변수로 두 배포 대상을 구분해서 base를 다르게 적용한다.
  base: process.env.VERCEL ? "/" : "/AIWebDevelopment_Project/",
});
