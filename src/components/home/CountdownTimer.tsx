import { useState, useEffect } from "react";

interface CountdownTimerProps {
  examDate: Date;
  examName: string;
  color: "blue" | "amber" | "green";
}

export default function CountdownTimer({
  examDate,
  examName,
  color,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = examDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [examDate]);

  const bgColor =
    color === "blue"
      ? "bg-blue-700"
      : color === "amber"
      ? "bg-amber-600"
      : "bg-green-700";

  return (
    <div className={`${bgColor} text-white rounded-2xl p-4 flex flex-col gap-2 shadow-sm`}>
      <div className="text-sm font-medium opacity-90">{examName}</div>
      <div className="flex gap-2 justify-center">
        {[
          { label: "일", value: timeLeft.days },
          { label: "시", value: timeLeft.hours },
          { label: "분", value: timeLeft.minutes },
          { label: "초", value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="bg-white/20 rounded-lg px-2 py-1 text-xl font-bold min-w-[2.5rem]">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs mt-1 opacity-80">{label}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-center opacity-75">
        시험일:{" "}
        {examDate.toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}
