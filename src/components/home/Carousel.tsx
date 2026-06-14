import { useNavigate } from "react-router-dom";
import { Slide } from "../../data/homeSlides";

interface CarouselProps {
  slides: Slide[];
  current: number;
  goTo: (idx: number) => void;
}

export default function Carousel({ slides, current, goTo }: CarouselProps) {
  const navigate = useNavigate();
  const slide = slides[current];

  return (
    <div className="relative bg-slate-200 py-16 px-4 flex items-center justify-center min-h-[500px]">
      {/* 왼쪽 화살표 */}
      <button
        className="absolute left-4 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-3 shadow-md hover:scale-110 transition z-10"
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* 슬라이드 카드 */}
      <div className="w-full max-w-[320px] md:max-w-[340px] px-2 z-0">
        <div
          key={slide.id}
          onClick={() =>
            slide.examId ? navigate(`/exam/${slide.examId}`) : navigate("/intro")
          }
          className={`cursor-pointer rounded-r-2xl shadow-2xl overflow-hidden bg-gradient-to-br ${slide.bg} aspect-[3/4] p-7 flex flex-col justify-between text-white relative border-l-[14px] border-black/20 transform transition-all duration-500 hover:scale-105 hover:-rotate-1 active:scale-98`}
        >
          <div className="absolute top-0 left-0 w-[2px] h-full bg-white/20" />
          <div className="absolute top-0 left-[2px] w-[1px] h-full bg-black/10" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-md">
              {slide.tag}
            </span>
            <span className="text-xs font-serif italic tracking-wider opacity-60">
              KBU PRESS
            </span>
          </div>
          <div className="my-auto text-center px-2">
            <div className="text-5xl mb-4 filter drop-shadow-md">{slide.emoji}</div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight leading-snug drop-shadow-sm">
              {slide.title}
            </h1>
            <div className="w-10 h-[3px] bg-amber-400 mx-auto my-3.5 rounded-full" />
            <p className="text-xs md:text-sm text-white/90 font-medium leading-relaxed">
              {slide.subtitle}
            </p>
          </div>
          <div className="text-[11px] text-white/80 bg-black/25 backdrop-blur-xs p-3 rounded-xl text-center leading-normal border border-white/10">
            {slide.desc}
          </div>
        </div>
      </div>

      {/* 오른쪽 화살표 */}
      <button
        className="absolute right-4 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full p-3 shadow-md hover:scale-110 transition z-10"
        onClick={() => goTo((current + 1) % slides.length)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* 도트 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-slate-800 w-6" : "bg-slate-400 w-2"
            }`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
