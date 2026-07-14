export interface Slide {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  bg: string;
  tag: string;
  emoji: string;
  examId?: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "졸업 시험 종합 안내",
    subtitle: "2026년 1학기 최종 합격 가이드",
    desc: "영어 · 성경 · 컴퓨터 과목의 출제 유형 분석 및 모의 연습 플랫폼",
    bg: "from-slate-700 to-slate-900",
    tag: "General Guide",
    emoji: "🏛️",
  },
  {
    id: 2,
    title: "영어 졸업 시험",
    subtitle: "Part 1 ~ Part 7 토익 완벽 대비",
    desc: "실제 고사 유형 반영, 듣기 평가 오디오 스트리밍 및 오답노트 최적화",
    bg: "from-blue-600 to-indigo-800",
    tag: "English Exam",
    emoji: "📘",
    examId: "english",
  },
  {
    id: 3,
    title: "성경 졸업 시험",
    subtitle: "구약 · 신약 핵심 구절 핵심 정리",
    desc: "한국성서대학교 필수 교육 과정 기반의 전 범위 성경 기출 문제집",
    bg: "from-amber-600 to-orange-700",
    tag: "Bible Exam",
    emoji: "✝️",
    examId: "bible",
  },
  {
    id: 4,
    title: "컴퓨터 졸업 시험",
    subtitle: "ITQ 수준 실무 중심 가이드",
    desc: "한글, 엑셀, 파워포인트 등 실기 및 필수 기초 IT 이론 마스터",
    bg: "from-emerald-600 to-teal-800",
    tag: "Computer Exam",
    emoji: "💻",
    examId: "computer",
  },
];
