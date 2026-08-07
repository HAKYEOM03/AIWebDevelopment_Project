import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { loginAdmin } from "../utils/auth";
import { loginStudent, fetchMyGradExam, GradExamRecord } from "../api/space";
import { getTestItemInfo, getPassFailLabel } from "../data/gradExamCodes";

/**
 * 통합 로그인 페이지.
 * 같은 아이디/비밀번호 입력창 하나로:
 * 1) 먼저 관리자 계정인지 확인 (로컬 비교, 즉시)
 * 2) 아니면 학교 API로 학번 로그인 시도
 * 둘 다 실패하면 에러 표시.
 */
export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentLoggedIn, setStudentLoggedIn] = useState(false);
  const [myStudentNum, setMyStudentNum] = useState("");
  const [records, setRecords] = useState<GradExamRecord[] | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1) 관리자 계정인지 먼저 확인 (즉시 판정, 네트워크 필요 없음)
    if (loginAdmin(id, pw)) {
      navigate("/manage");
      return;
    }

    // 2) 아니면 학교 API로 학번 로그인 시도
    setLoading(true);
    try {
      const loginResult = await loginStudent(id, pw);
      if (!loginResult.ok || !loginResult.studentNum) {
        const base = loginResult.error || "아이디/학번 또는 비밀번호가 올바르지 않습니다.";
        setError(loginResult.debug ? `${base} (원인: ${loginResult.debug})` : base);
        return;
      }

      setStudentLoggedIn(true);
      setMyStudentNum(loginResult.studentNum);

      const gradResult = await fetchMyGradExam();
      if (gradResult.ok) {
        setRecords(gradResult.data ?? []);
      } else {
        const base = gradResult.error || "졸업 시험 정보를 불러오지 못했습니다.";
        setError(gradResult.debug ? `${base} (원인: ${gradResult.debug})` : base);
      }
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
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
            <p className="text-sm text-gray-400 mt-1">한국성서대학교 졸업 시험 연습</p>
          </div>

          {!studentLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">아이디 / 학번</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="아이디 또는 학번을 입력하세요"
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2 disabled:opacity-60"
              >
                {loading ? "확인 중..." : "로그인"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 text-sm rounded-xl px-4 py-3">
                <span className="font-bold">{myStudentNum}</span>님으로 로그인되었습니다.
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {records && records.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">조회된 졸업 시험 신청 내역이 없습니다.</p>
              )}

              {records && records.length > 0 && (
                <div className="space-y-3">
                  {records.map((r, i) => {
                    const testItem = getTestItemInfo(r.testItem);
                    const passFailLabel = getPassFailLabel(r.passFail);
                    const isPass = r.passFail === "1";
                    return (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 text-sm space-y-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-800">{testItem.label}</span>
                          {r.passFail && (
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                isPass ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                              }`}
                            >
                              {passFailLabel}
                            </span>
                          )}
                        </div>
                        {testItem.note && (
                          <div className="text-xs text-gray-400">비고: {testItem.note}</div>
                        )}
                        {r.semester && <div><span className="text-gray-400">학기</span> {r.semester}</div>}
                        {r.applicationDate && <div><span className="text-gray-400">신청일</span> {r.applicationDate}</div>}
                        {r.passingDate && <div><span className="text-gray-400">합격 처리일</span> {r.passingDate}</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={() => navigate("/")}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors"
              >
                사이트 이용 시작하기 →
              </button>
            </div>
          )}

          {!studentLoggedIn && (
            <button
              className="mt-4 w-full text-center text-sm text-gray-400 hover:text-gray-600"
              onClick={() => navigate("/")}
            >
              홈으로 돌아가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
