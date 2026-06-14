import { useState, useEffect, useCallback } from "react";
import { Question } from "../data/english/types";

export type ExamMode = "PRACTICE" | "EXAM" | "TEST";

interface UseExamSessionOptions {
  timerSeconds?: number; // 커스텀 타이머 (초). 미지정 시 EXAM=7200, TEST=600
}

export function useExamSession(
  initialQuestions: Question[],
  mode: ExamMode,
  options?: UseExamSessionOptions
) {
  const [questions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  // 타이머 초기값 계산
  const getInitialTime = () => {
    if (options?.timerSeconds) return options.timerSeconds;
    if (mode === "EXAM") return 7200; // 120분
    if (mode === "TEST") return 600;  // 10분 (기본)
    return 0;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime);

  // 타이머 로직
  useEffect(() => {
    if (mode === "PRACTICE" || timeLeft <= 0) {
      if (timeLeft <= 0 && (mode === "EXAM" || mode === "TEST") && getInitialTime() > 0) {
        setTimeUp(true);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, timeLeft]);

  // 답안 선택
  const selectAnswer = useCallback(
    (answer: string) => {
      if (timeUp) return;
      if (mode === "PRACTICE" && showAnswer) return;
      setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
    },
    [currentIndex, mode, showAnswer, timeUp]
  );

  // 문항 이동
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  }, [currentIndex, questions.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  }, [currentIndex]);

  const jumpToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
    setShowAnswer(false);
  }, []);

  // 결과 채점
  const calculateResult = useCallback(() => {
    const wrongQuestions = questions.filter((q, i) => answers[i] !== q.answer);
    return {
      total: questions.length,
      correct: questions.length - wrongQuestions.length,
      wrongQuestions,
      answersArray: questions.map((_, i) => answers[i] || null),
    };
  }, [questions, answers]);

  return {
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    answers,
    showAnswer,
    setShowAnswer,
    timeLeft,
    timeUp,
    selectAnswer,
    goToNext,
    goToPrev,
    jumpToQuestion,
    calculateResult,
  };
}
