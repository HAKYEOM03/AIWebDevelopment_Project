interface QuizTimerProps {
  timeLeft: number;
}

/** 시험/테스트 모드 타이머 표시 */
export default function QuizTimer({ timeLeft }: QuizTimerProps) {
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  const formatted = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;

  return (
    <div
      className={`text-xl font-mono font-bold px-4 py-1 rounded-full ${
        timeLeft <= 60
          ? "text-red-600 bg-red-50 animate-pulse"
          : "text-red-600 bg-red-50"
      }`}
    >
      ⏳ {formatted}
    </div>
  );
}
