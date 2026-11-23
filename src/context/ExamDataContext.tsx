import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { examInfoList, InfoSection } from "../data/examInfo";
import { quizExams } from "../data/quizExams";

export interface ExamNotice {
  id: number;
  examId: string; // "english" | "bible" | "computer"
  title: string;
  content: string;
  date: string;
  important: boolean;
}

export interface ExamIntroContent {
  registrationStart: string; // "YYYY-MM-DD"
  registrationEnd: string; // "YYYY-MM-DD"
  examLocation: string;
  examTime: string;
  requirements: string[];
  passingScore: string;
  contact: string;
  infoSections: InfoSection[];
}

interface ExamDataContextType {
  notices: ExamNotice[];
  examDates: Record<string, string>; // examId → ISO 문자열 (날짜+시간)
  introContent: Record<string, ExamIntroContent>;
  addNotice: (notice: Omit<ExamNotice, "id">) => void;
  deleteNotice: (id: number) => void;
  updateExamDate: (examId: string, isoDate: string) => void;
  updateIntroContent: (examId: string, content: ExamIntroContent) => void;
  /** 시험 잠금 — 소개·문제·현황을 "준비중"으로 막는다 */
  isExamLocked: (examId: string) => boolean;
  setExamLocked: (examId: string, locked: boolean) => void;
  /** D-DAY 잠금 — 날짜와 카운트다운을 회색 "--"로 가린다 (시험 잠금과 별개) */
  isDdayLocked: (examId: string) => boolean;
  setDdayLocked: (examId: string, locked: boolean) => void;
}

export const ExamDataContext = createContext<ExamDataContextType | null>(null);

export function useExamData() {
  const context = useContext(ExamDataContext);
  if (!context) {
    throw new Error("useExamData must be used within ExamDataProvider");
  }
  return context;
}

// examInfo.ts의 기본 시험 날짜를 examId → ISO 문자열로 변환
const defaultExamDates: Record<string, string> = Object.fromEntries(
  examInfoList.map((exam) => [exam.id, exam.examDate.toISOString()])
);

// examInfo.ts의 기본 소개 내용을 examId → ExamIntroContent로 변환
const defaultIntroContent: Record<string, ExamIntroContent> = Object.fromEntries(
  examInfoList.map((exam) => [
    exam.id,
    {
      registrationStart: exam.registrationStart.toISOString().split("T")[0],
      registrationEnd: exam.registrationEnd.toISOString().split("T")[0],
      examLocation: exam.examLocation,
      examTime: exam.examTime,
      requirements: exam.requirements,
      passingScore: exam.passingScore,
      contact: exam.contact,
      infoSections: exam.infoSections,
    },
  ])
);

// 관리자가 한 번도 바꾸지 않았을 때의 잠금 상태 (quizExams.ts의 lockedByDefault)
const defaultLocks: Record<string, boolean> = Object.fromEntries(
  quizExams.map((exam) => [exam.id, !!exam.lockedByDefault])
);

function loadLocks(key: string): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(key);
    return stored ? { ...defaultLocks, ...JSON.parse(stored) } : defaultLocks;
  } catch {
    return defaultLocks;
  }
}

export function ExamDataProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<ExamNotice[]>(() => {
    try {
      const stored = localStorage.getItem("exam_notices");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [examDates, setExamDates] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem("exam_dates");
      return stored ? { ...defaultExamDates, ...JSON.parse(stored) } : defaultExamDates;
    } catch {
      return defaultExamDates;
    }
  });

  const [introContent, setIntroContent] = useState<Record<string, ExamIntroContent>>(() => {
    try {
      const stored = localStorage.getItem("exam_intro_content");
      return stored
        ? { ...defaultIntroContent, ...JSON.parse(stored) }
        : defaultIntroContent;
    } catch {
      return defaultIntroContent;
    }
  });

  const [examLocks, setExamLocks] = useState(() => loadLocks("exam_locks"));
  const [ddayLocks, setDdayLocks] = useState(() => loadLocks("exam_dday_locks"));

  useEffect(() => {
    localStorage.setItem("exam_locks", JSON.stringify(examLocks));
  }, [examLocks]);

  useEffect(() => {
    localStorage.setItem("exam_dday_locks", JSON.stringify(ddayLocks));
  }, [ddayLocks]);

  useEffect(() => {
    localStorage.setItem("exam_notices", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem("exam_dates", JSON.stringify(examDates));
  }, [examDates]);

  useEffect(() => {
    localStorage.setItem("exam_intro_content", JSON.stringify(introContent));
  }, [introContent]);

  const addNotice = (notice: Omit<ExamNotice, "id">) => {
    setNotices((prev) => [{ ...notice, id: Date.now() }, ...prev]);
  };

  const deleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const updateExamDate = (examId: string, isoDate: string) => {
    setExamDates((prev) => ({ ...prev, [examId]: isoDate }));
  };

  const updateIntroContent = (examId: string, content: ExamIntroContent) => {
    setIntroContent((prev) => ({ ...prev, [examId]: content }));
  };

  const isExamLocked = (examId: string) => !!examLocks[examId];
  const setExamLocked = (examId: string, locked: boolean) => {
    setExamLocks((prev) => ({ ...prev, [examId]: locked }));
  };

  const isDdayLocked = (examId: string) => !!ddayLocks[examId];
  const setDdayLocked = (examId: string, locked: boolean) => {
    setDdayLocks((prev) => ({ ...prev, [examId]: locked }));
  };

  return (
    <ExamDataContext.Provider
      value={{
        notices,
        examDates,
        introContent,
        addNotice,
        deleteNotice,
        updateExamDate,
        updateIntroContent,
        isExamLocked,
        setExamLocked,
        isDdayLocked,
        setDdayLocked,
      }}
    >
      {children}
    </ExamDataContext.Provider>
  );
}
