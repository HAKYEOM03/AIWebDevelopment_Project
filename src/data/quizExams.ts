export interface ExamPart {
  part: number;
  label: string;
  sets: number[];
}

export interface QuizExam {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  parts: ExamPart[];
  /** true면 문제가 아직 확정 전이라 선택 못 하게 막고 "준비중" 안내 창을 띄운다 */
  comingSoon?: boolean;
  /** true면 연습 대상에서 제외한 시험이라 버튼을 회색으로 비활성화하고 아예 클릭되지 않게 한다 (안내 창도 없음) */
  disabled?: boolean;
}

export const quizExams: QuizExam[] = [
  {
    id: "english",
    name: "영어 졸업 시험",
    icon: "📘",
    color: "blue",
    description: "토익 유형의 영어 연습문제 (LC Part1~4, RC Part5~7)",
    parts: [
      { part: 1, label: "Part 1 - 사진묘사", sets: [1, 2, 3] },
      { part: 2, label: "Part 2 - 질문응답", sets: [1, 2, 3] },
      { part: 3, label: "Part 3 - 대화내용", sets: [1, 2, 3] },
      { part: 4, label: "Part 4 - 지문내용", sets: [1, 2, 3] },
      { part: 5, label: "Part 5 - 단문빈칸채우기", sets: [1, 2, 3] },
      { part: 6, label: "Part 6 - 장문빈칸채우기", sets: [1, 2, 3] },
      { part: 7, label: "Part 7 - 독해", sets: [1, 2, 3] },
    ],
  },
  {
    id: "bible",
    name: "성경 졸업 시험",
    icon: "✝️",
    color: "amber",
    description: "구약·신약 성경 전반의 연습문제",
    comingSoon: true,
    parts: [
      { part: 1, label: "Part 1 - 구약", sets: [1] },
      { part: 2, label: "Part 2 - 신약", sets: [1] },
    ],
  },
  {
    id: "computer",
    name: "컴퓨터 졸업 시험",
    icon: "💻",
    color: "green",
    description: "ITQ 수준 컴퓨터 활용 능력 연습문제",
    disabled: true,
    parts: [{ part: 1, label: "Part 1 - 한글·엑셀", sets: [1] }],
  },
];

export type ExamAvailability = "open" | "comingSoon" | "disabled";

/** 시험 id로 문제 풀기 가능 여부를 알려준다 — 여러 화면의 "문제 풀기" 버튼이 같은 기준을 쓰도록 한 곳에서 판단. */
export function getExamAvailability(examId: string): ExamAvailability {
  const exam = quizExams.find((e) => e.id === examId);
  if (exam?.disabled) return "disabled";
  if (exam?.comingSoon) return "comingSoon";
  return "open";
}
