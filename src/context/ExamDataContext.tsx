import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { examInfoList, InfoSection } from "../data/examInfo";
import { quizExams } from "../data/quizExams";
import { fetchServerSettings, saveServerSetting, SettingKey } from "../api/settings";

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
  /** 관리자 설정이 저장되는 곳 — "server"면 모든 학생에게 적용, "local"이면 이 브라우저에만 */
  settingsSource: "server" | "local";
  /** 서버 저장 실패 안내 (실패하면 화면 값도 저장 전으로 되돌린다) */
  settingsError: string | null;
  clearSettingsError: () => void;
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

  /* ---------------- 서버 저장 (ASP.NET /api/settings가 있을 때) ---------------- */

  const [settingsSource, setSettingsSource] = useState<"server" | "local">("local");
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // 렌더 사이에도 항상 최신 값을 알기 위한 참조 (빠르게 연달아 바꿔도 마지막 값이 저장되게)
  const latest = useRef({ examLocks, ddayLocks, examDates, introContent });
  latest.current = { examLocks, ddayLocks, examDates, introContent };
  // 서버가 마지막으로 받아들인 값 — 저장이 실패하면 이 값으로 되돌린다
  const confirmed = useRef<Partial<typeof latest.current>>({});
  const saveTimers = useRef<Partial<Record<SettingKey, ReturnType<typeof setTimeout>>>>({});
  const sourceRef = useRef<"server" | "local">("local");

  const setters = {
    examLocks: setExamLocks,
    ddayLocks: setDdayLocks,
    examDates: setExamDates,
    introContent: setIntroContent,
  } as const;

  // 처음 한 번 서버 설정을 읽는다. 서버가 있으면 서버 값이 기준이 된다 (이 브라우저에 남은 옛 값은 무시).
  useEffect(() => {
    let cancelled = false;
    fetchServerSettings().then((server) => {
      if (cancelled || !server) return;
      const next = {
        examLocks: { ...defaultLocks, ...(server.examLocks as Record<string, boolean> | undefined) },
        ddayLocks: { ...defaultLocks, ...(server.ddayLocks as Record<string, boolean> | undefined) },
        examDates: { ...defaultExamDates, ...(server.examDates as Record<string, string> | undefined) },
        introContent: {
          ...defaultIntroContent,
          ...(server.introContent as Record<string, ExamIntroContent> | undefined),
        },
      };
      confirmed.current = next;
      sourceRef.current = "server";
      setSettingsSource("server");
      setExamLocks(next.examLocks);
      setDdayLocks(next.ddayLocks);
      setExamDates(next.examDates);
      setIntroContent(next.introContent);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** 값을 바로 화면에 반영하고, 서버 모드면 잠시 뒤(연속 입력을 모아서) 서버에 저장한다. */
  function applySetting<K extends SettingKey>(key: K, value: (typeof latest.current)[K]) {
    latest.current = { ...latest.current, [key]: value };
    (setters[key] as (v: (typeof latest.current)[K]) => void)(value);
    if (sourceRef.current !== "server") return;

    clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(async () => {
      const toSave = latest.current[key];
      const error = await saveServerSetting(key, toSave);
      if (!error) {
        confirmed.current = { ...confirmed.current, [key]: toSave };
        return;
      }
      const previous = confirmed.current[key];
      if (previous) (setters[key] as (v: (typeof latest.current)[K]) => void)(previous as (typeof latest.current)[K]);
      setSettingsError(error);
    }, 400);
  }

  const updateExamDate = (examId: string, isoDate: string) => {
    applySetting("examDates", { ...latest.current.examDates, [examId]: isoDate });
  };

  const updateIntroContent = (examId: string, content: ExamIntroContent) => {
    applySetting("introContent", { ...latest.current.introContent, [examId]: content });
  };

  const isExamLocked = (examId: string) => !!examLocks[examId];
  const setExamLocked = (examId: string, locked: boolean) => {
    applySetting("examLocks", { ...latest.current.examLocks, [examId]: locked });
  };

  const isDdayLocked = (examId: string) => !!ddayLocks[examId];
  const setDdayLocked = (examId: string, locked: boolean) => {
    applySetting("ddayLocks", { ...latest.current.ddayLocks, [examId]: locked });
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
        settingsSource,
        settingsError,
        clearSettingsError: () => setSettingsError(null),
      }}
    >
      {children}
    </ExamDataContext.Provider>
  );
}
