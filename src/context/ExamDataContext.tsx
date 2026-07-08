import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { examInfoList } from "../data/examInfo";

export interface ExamNotice {
  id: number;
  examId: string; // "english" | "bible" | "computer"
  title: string;
  content: string;
  date: string;
  important: boolean;
}

interface ExamDataContextType {
  notices: ExamNotice[];
  examDates: Record<string, string>; // examId → ISO 문자열 (날짜+시간)
  addNotice: (notice: Omit<ExamNotice, "id">) => void;
  deleteNotice: (id: number) => void;
  updateExamDate: (examId: string, isoDate: string) => void;
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

  useEffect(() => {
    localStorage.setItem("exam_notices", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem("exam_dates", JSON.stringify(examDates));
  }, [examDates]);

  const addNotice = (notice: Omit<ExamNotice, "id">) => {
    setNotices((prev) => [{ ...notice, id: Date.now() }, ...prev]);
  };

  const deleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const updateExamDate = (examId: string, isoDate: string) => {
    setExamDates((prev) => ({ ...prev, [examId]: isoDate }));
  };

  return (
    <ExamDataContext.Provider
      value={{
        notices,
        examDates,
        addNotice,
        deleteNotice,
        updateExamDate,
      }}
    >
      {children}
    </ExamDataContext.Provider>
  );
}
