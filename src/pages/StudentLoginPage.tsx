import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { loginStudent, fetchMyGradExam, logoutStudent, GradExamRecord } from "../api/space";

export default function StudentLoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [myStudentNum, setMyStudentNum] = useState("");
  const [records, setRecords] = useState<GradExamRecord[] | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loginResult = await loginStudent(studentId, password);
      if (!loginResult.ok || !loginResult.studentNum) {
        setError(loginResult.error || "학번 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      setLoggedIn(true);
      setMyStudentNum(loginResult.studentNum);

      const gradResult = await fetchMyGradExam();
      if (gradResult.ok) {
        setRecords(gradResult.data ?? []);
      } else {
        setError(gradResult.error || "졸업고사 정보를 불러오지 못했습니다.");
      }
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutStudent();
    setLoggedIn(false);
    setMyStudentNum("");
    setRecords(null);
    setStudentId("");
    setPassword("");
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
            <h1 className="text-2xl font-bold text-gray-800">졸업고사 조회</h1>
            <p className="text-sm text-gray-400 mt-1">학교 학번·비밀번호로 본인의 졸업 시험 정보를 확인하세요</p>
          </div>

          {!loggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">학번</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="학번을 입력하세요"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2 disabled:opacity-60"
              >
                {loading ? "조회 중..." : "로그인 후 조회"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 text-sm rounded-xl px-4 py-3">
                <span className="font-bold">{myStudentNum}</span>님으로 로그인되었습니다.
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {records && records.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">조회된 졸업고사 신청 내역이 없습니다.</p>
              )}

              {records && records.length > 0 && (
                <div className="space-y-3">
                  {records.map((r, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 text-sm space-y-1">
                      {r.semester && <div><span className="text-gray-400">학기</span> {r.semester}</div>}
                      {r.testItem && <div><span className="text-gray-400">시험 항목</span> {r.testItem}</div>}
                      {r.applicationDate && <div><span className="text-gray-400">신청일</span> {r.applicationDate}</div>}
                      {r.passingDate && <div><span className="text-gray-400">합격 처리일</span> {r.passingDate}</div>}
                      {r.passFail && <div><span className="text-gray-400">합격여부 코드</span> {r.passFail}</div>}
                    </div>
                  ))}
                  <p className="text-xs text-gray-400">
                    * 합격여부 코드의 정확한 의미는 학교 담당자 확인 후 표시로 대체 예정입니다.
                  </p>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}

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
