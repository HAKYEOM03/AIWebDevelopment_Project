import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import ApplicantSearchBar from "../components/applicant/ApplicantSearchBar";
import ApplicantList from "../components/applicant/ApplicantList";
import ApplicantDetailCard from "../components/applicant/ApplicantDetailCard";
import { applicants, Applicant } from "../data/applicants";

export default function ApplicantPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(false);
  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return applicants;
    return applicants.filter(
      (a) =>
        a.name.toLowerCase().includes(keyword) ||
        a.studentId.toLowerCase().includes(keyword) ||
        a.department.toLowerCase().includes(keyword)
    );
  }, [query]);

  useEffect(() => {
    if (selectedId === null) {
      setDetail(null);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      const found = applicants.find((a) => a.id === selectedId) ?? null;
      setDetail(found);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">신청자 조회</h1>
        <p className="text-gray-500 mb-8">
          영어 졸업 시험 신청 명단입니다. 학번 · 이름 · 학과로 검색한 뒤 신청자를
          선택하면 상세 정보를 불러옵니다.
        </p>

        <ApplicantSearchBar
          query={query}
          onQueryChange={setQuery}
          resultCount={filtered.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* 신청자 명단 */}
          <ApplicantList
            applicants={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          {/* 선택된 신청자 상세 */}
          <ApplicantDetailCard applicant={detail} loading={loading} />
        </div>
      </div>
    </div>
  );
}
