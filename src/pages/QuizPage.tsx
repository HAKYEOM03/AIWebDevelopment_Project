import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getQuestions, getTestTimerSeconds } from "../utils/questionHelpers";
import TimeUpScreen from "../components/quiz/TimeUpScreen";
import QuizModeBadge from "../components/quiz/QuizModeBadge";
import QuizTimer from "../components/quiz/QuizTimer";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizControls from "../components/quiz/QuizControls";
import OmrSheet from "../components/quiz/OmrSheet";

export type ExamMode = "PRACTICE" | "EXAM" | "TEST";

interface QuizLocationState {
  retryWrongOnly?: boolean;
  wrongQuestionIds?: number[];
}

export default function QuizPage() {
  const { examId = "english", part = "2", set = "1" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locState = (location.state as QuizLocationState) || {};

  // 모드 결정
  const isTestMode = set === "test";
  const mode: ExamMode = isTestMode ? "TEST" : set === "all" ? "EXAM" : "PRACTICE";
  const timerSeconds = isTestMode ? getTestTimerSeconds(part) : undefined;
  const hasTimer = mode === "EXAM" || mode === "TEST";

  // 틀린 문제만 다시 풀기
  const isRetryWrongOnly = !!(locState.retryWrongOnly && locState.wrongQuestionIds);

  // 문제 로딩 (랜덤 선별은 최초 1회만 수행 - 리렌더 시 문제가 바뀌지 않도록 useMemo로 고정)
  const questions = useMemo(() => {
    let qs = getQuestions(examId, part, set);
    if (isRetryWrongOnly && locState.wrongQuestionIds) {
      const wrongIdSet = new Set(locState.wrongQuestionIds);
      qs = qs.filter((q) => wrongIdSet.has(q.id));
    }
    return qs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, part, set, isRetryWrongOnly]);

  // ===== 시험 세션 상태 (기본 React 훅으로 직접 구현) =====
  const getInitialTime = () => {
    if (timerSeconds) return timerSeconds;
    if (mode === "EXAM") return 7200; // 120분
    return 0;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, timeLeft]);

  // 답안 선택
  const selectAnswer = (answer: string) => {
    if (timeUp) return;
    if (mode === "PRACTICE" && showAnswer) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  // 문항 이동
  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowAnswer(false);
  };

  // 결과 채점
  const calculateResult = () => {
    const wrongQuestions = questions.filter((qItem, i) => answers[i] !== qItem.answer);
    return {
      total: questions.length,
      correct: questions.length - wrongQuestions.length,
      wrongQuestions,
      answersArray: questions.map((_, i) => answers[i] || null),
    };
  };

  const q = questions[currentIndex];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        데이터를 불러올 수 없습니다.
      </div>
    );
  }

  // 라벨
  const partNum = Number(part);
  const testLabel =
    partNum === 0
      ? "LC 전체 문제 Test"
      : partNum === -1
      ? "RC 전체 문제 Test"
      : partNum === -2
      ? "LCRC 전체 문제 Test"
      : `Part ${part} Set Test`;
  const timeLimit = partNum === -2 ? "120분" : partNum === 0 || partNum === -1 ? "60분" : "10분";

  const handleSubmit = () => {
    const result = calculateResult();
    navigate("/result", {
      state: {
        examId, part, set, questions,
        answers: result.answersArray,
        wrongQuestions: result.wrongQuestions,
      },
    });
  };

  // 시간 초과
  if (timeUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <TimeUpScreen
          testLabel={isTestMode ? testLabel : "시험"}
          onRetry={() => navigate(`/quiz/${examId}/${part}/${set}`)}
          onBackToList={() => navigate("/quiz")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-8 gap-6">
        {/* 메인 문제 영역 */}
        <div className="flex-1">
          <QuizModeBadge
            isTestMode={isTestMode}
            isRetryWrongOnly={isRetryWrongOnly}
            testLabel={testLabel}
            timeLimit={timeLimit}
            questionCount={questions.length}
          />

          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-bold text-gray-700">
              문제 {currentIndex + 1} / {questions.length}
            </div>
            {hasTimer && <QuizTimer timeLeft={timeLeft} />}
          </div>

          <QuestionCard
            question={q}
            selectedAnswer={answers[currentIndex]}
            showAnswer={showAnswer}
            onSelectAnswer={selectAnswer}
          />

          <QuizControls
            mode={mode}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            showAnswer={showAnswer}
            onPrev={goToPrev}
            onNext={goToNext}
            onShowAnswer={() => setShowAnswer(true)}
            onSubmit={handleSubmit}
          />
        </div>

        {/* OMR 답안지 */}
        {hasTimer && (
          <OmrSheet
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            onJump={jumpToQuestion}
          />
        )}
      </div>
    </div>
  );
}
