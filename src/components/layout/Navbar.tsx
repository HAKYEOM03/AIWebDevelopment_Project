import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, logoutAdmin } from "../../utils/auth";
import { logoutStudent } from "../../api/space";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = isAdminAuthenticated();

  // 페이지를 이동해도 다시 물어보지 않고 앱 전체에서 기억하는 로그인 상태.
  const { studentNum, refresh } = useStudentAuth();

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  const handleStudentLogout = async () => {
    await logoutStudent();
    await refresh();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
            KBU
          </div>
          <div className="leading-tight">
            <div className="text-xs text-gray-500">한국성서대학교</div>
            <div className="text-sm font-bold text-blue-800">졸업 시험 연습</div>
          </div>
        </Link>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          {isAdmin ? (
            <>
              <Link to="/stats" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                연습문제 현황
              </Link>
              <Link to="/manage" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                관리
              </Link>
              <button
                onClick={handleAdminLogout}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/intro" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                소개
              </Link>
              <Link to="/quiz" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                문제
              </Link>
              {studentNum && (
                <Link to="/my-stats" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
                  나의 현황
                </Link>
              )}
              {studentNum ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/my-grades"
                    className="text-sm text-gray-600 hover:text-blue-700 transition-colors"
                    title="졸업 시험 결과 보기"
                  >
                    <span className="font-bold text-blue-700">{studentNum}</span>님
                  </Link>
                  <button
                    onClick={handleStudentLogout}
                    className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  로그인
                </button>
              )}
            </>
          )}
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          {isAdmin ? (
            <>
              <Link to="/stats" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>연습문제 현황</Link>
              <Link to="/manage" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>관리</Link>
              <button
                className="text-left text-gray-700 font-medium py-2"
                onClick={() => {
                  setMenuOpen(false);
                  handleAdminLogout();
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/intro" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>소개</Link>
              <Link to="/quiz" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>문제</Link>
              {studentNum && (
                <Link to="/my-stats" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>나의 현황</Link>
              )}
              {studentNum ? (
                <>
                  <Link
                    to="/my-grades"
                    className="text-gray-700 font-medium py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="font-bold text-blue-700">{studentNum}</span>님의 졸업 시험 결과
                  </Link>
                  <button
                    className="text-left text-gray-700 font-medium py-2"
                    onClick={() => {
                      setMenuOpen(false);
                      handleStudentLogout();
                    }}
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700 font-medium py-2" onClick={() => setMenuOpen(false)}>로그인</Link>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
