import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id && pw) {
      alert("로그인 기능은 준비 중입니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              KBU
            </div>
            <h1 className="text-2xl font-bold text-gray-800">로그인</h1>
            <p className="text-sm text-gray-400 mt-1">한국성서대학교 졸업고사 연습</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">학번</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="학번을 입력하세요"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2"
            >
              로그인
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            로그인 문제가 있으신가요?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">학사팀 문의</span>
          </div>

          <button
            className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
            onClick={() => navigate("/")}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
