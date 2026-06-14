/**
 * 시험별 색상 매핑 (공통 유틸)
 *
 * 각 졸업고사 color 값("blue" | "amber" | "green")에 대응하는
 * Tailwind 클래스를 한 곳에서 관리합니다.
 */

export type ExamColor = "blue" | "amber" | "green";

export interface ColorSet {
  header: string;
  badge: string;
  icon: string;
  btn: string;
  btnHover: string;
}

const colorMap: Record<ExamColor, ColorSet> = {
  blue: {
    header: "bg-blue-700",
    badge: "bg-blue-100 text-blue-700",
    icon: "📘",
    btn: "bg-blue-700",
    btnHover: "hover:bg-blue-800",
  },
  amber: {
    header: "bg-amber-600",
    badge: "bg-amber-100 text-amber-700",
    icon: "✝️",
    btn: "bg-amber-600",
    btnHover: "hover:bg-amber-700",
  },
  green: {
    header: "bg-green-700",
    badge: "bg-green-100 text-green-700",
    icon: "💻",
    btn: "bg-green-700",
    btnHover: "hover:bg-green-800",
  },
};

export function getColorSet(color: string): ColorSet {
  return colorMap[color as ExamColor] ?? colorMap.blue;
}
