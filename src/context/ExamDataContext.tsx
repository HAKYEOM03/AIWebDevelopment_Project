import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { examInfoList, InfoSection } from "../data/examInfo";

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
      }}
    >
      {children}
    </ExamDataContext.Provider>
  );
}
