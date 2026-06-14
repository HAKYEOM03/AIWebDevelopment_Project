import { useState, useEffect, useRef, useCallback } from "react";

/** 캐러셀 자동 재생 훅 */
export function useCarousel(totalSlides: number, interval = 4000) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % totalSlides);
    }, interval);
  }, [totalSlides, interval]);

  const stopAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  /** 특정 슬라이드로 이동 (자동 재생 리셋) */
  const goTo = useCallback(
    (idx: number) => {
      stopAuto();
      setCurrent(idx);
      startAuto();
    },
    [stopAuto, startAuto]
  );

  return { current, goTo };
}
