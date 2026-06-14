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
}

export const quizExams: QuizExam[] = [
  {
    id: "english",
    name: "영어 졸업고사",
    icon: "📘",
    color: "blue",
    description: "토익 유형의 영어 연습문제 (Part1~Part4)",
    parts: [
      { part: 1, label: "Part 1 - 사진묘사", sets: [1, 2, 3] },
      { part: 2, label: "Part 2 - 질문응답", sets: [1, 2, 3] },
      { part: 3, label: "Part 3 - 대화내용", sets: [1, 2, 3] },
      { part: 4, label: "Part 4 - 지문내용", sets: [1, 2, 3] },
    ],
  },
  {
    id: "bible",
    name: "성경 졸업고사",
    icon: "✝️",
    color: "amber",
    description: "구약·신약 성경 전반의 연습문제",
    parts: [
      { part: 1, label: "Part 1 - 구약", sets: [1] },
      { part: 2, label: "Part 2 - 신약", sets: [1] },
    ],
  },
  {
    id: "computer",
    name: "컴퓨터 졸업고사",
    icon: "💻",
    color: "green",
    description: "ITQ 수준 컴퓨터 활용 능력 연습문제",
    parts: [{ part: 1, label: "Part 1 - 한글·엑셀", sets: [1] }],
  },
];
