import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import GradExamRecordList from "../components/gradexam/GradExamRecordList";
import { checkStudentSession, fetchMyGradExam, GradExamRecord } from "../api/space";

/** 네비게이션의 학번을 눌러서 들어오는, 본인 졸업 시험 결과 전용 페이지. */
export default function MyGradExamPage() {
  const [studentNum, setStudentNum] = useState<string | null>(null);
  const [records, setRecords] = useState<GradExamRecord[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const session = await checkStudentSession();
      if (cancelled) return;

      if (!session.ok) {
        navigate("/login", { replace: true });
        return;
      }
      setStudentNum(session.studentNum ?? null);

      const gradResult = await fetchMyGradExam();
      if (cancelled) return;

      if (gradResult.ok) {
        setRecords(gradResult.data ?? []);
      } else {
        const base = gradResult.error || "졸업 시험 정보를 불러오지 못했습니다.";
        setError(gradResult.debug ? `${base} (원인: ${gradResult.debug})` : base);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex justify-center py-12 px-4">
        <div className="bg-white rounded-3xl shadow-sm p-8 w-full max-w-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              KBU
            </div>
            <h1 className="text-2xl font-bold text-gray-800">졸업 시험 결과</h1>
            {studentNum && (
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-bold text-blue-700">{studentNum}</span>님
              </p>
            )}
          </div>

          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
          )}

          {!loading && error && <p className="text-sm text-red-500 text-center py-4">{error}</p>}

          {!loading && !error && records && <GradExamRecordList records={records} />}

          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
