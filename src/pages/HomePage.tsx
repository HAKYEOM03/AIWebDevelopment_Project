import { useState, useEffect, useRef, useContext } from "react";
import Navbar from "../components/layout/Navbar";
import DDayPanel from "../components/home/DDayPanel";
import Carousel from "../components/home/Carousel";
import NoticeBoard from "../components/home/NoticeBoard";
import PassRateSection from "../components/home/PassRateSection";
import { slides } from "../data/homeSlides";
import { examInfoList, notices as staticNotices } from "../data/examInfo";
import { ExamDataContext } from "../context/ExamDataContext";

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
  };

  const stopAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const goTo = (idx: number) => {
    stopAuto();
    setCurrent(idx);
    startAuto();
  };

  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { notices: dynamicNotices, stats, examDates } = examData;

  const allNotices = [
    ...staticNotices.map((n) => ({ ...n, examId: "general" as const })),
    ...dynamicNotices,
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Carousel slides={slides} current={current} goTo={goTo} />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <NoticeBoard notices={allNotices} />
        <DDayPanel exams={examInfoList} examDates={examDates} />
      </div>
      <PassRateSection exams={examInfoList} stats={stats} />
    </div>
  );
}
