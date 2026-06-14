import { questionBank, Question } from "../data/english";

/** 배열 셔플 (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 성경 / 컴퓨터 샘플 문제 생성 */
function generateSampleQuestions(examId: string, part: number): Question[] {
  const bibleQs: Question[] = [
    { id: 1, part, set: 1, question: "아담의 아들로 가인에게 죽임을 당한 사람은?", options: ["노아", "아벨", "셈"], answer: "B" },
    { id: 2, part, set: 1, question: "모세가 받은 십계명의 수는?", options: ["5개", "10개", "12개"], answer: "B" },
    { id: 3, part, set: 1, question: "이스라엘 백성이 광야에서 먹은 음식은?", options: ["메추라기", "만나", "떡"], answer: "B" },
    { id: 4, part, set: 1, question: "예수님이 태어난 곳은?", options: ["나사렛", "예루살렘", "베들레헴"], answer: "C" },
    { id: 5, part, set: 1, question: "예수님의 첫 번째 제자는?", options: ["바울", "베드로", "요한"], answer: "B" },
    { id: 6, part, set: 1, question: "성경 구약의 첫 번째 책은?", options: ["출애굽기", "창세기", "민수기"], answer: "B" },
    { id: 7, part, set: 1, question: "시편을 주로 기록한 사람은?", options: ["모세", "다윗", "솔로몬"], answer: "B" },
    { id: 8, part, set: 1, question: "요나가 들어간 곳은?", options: ["사자굴", "큰 물고기 뱃속", "불 가마"], answer: "B" },
    { id: 9, part, set: 1, question: "다니엘이 던져진 곳은?", options: ["홍해", "사자굴", "불 가마"], answer: "B" },
    { id: 10, part, set: 1, question: "예수님의 어머니는?", options: ["마르다", "막달라 마리아", "마리아"], answer: "C" },
  ];

  const computerQs: Question[] = [
    { id: 1, part, set: 1, question: "한글에서 표를 삽입하는 단축키는?", options: ["Ctrl+T", "Ctrl+N", "Ctrl+Alt+T"], answer: "A" },
    { id: 2, part, set: 1, question: "엑셀에서 합계 함수는?", options: ["=AVG()", "=SUM()", "=COUNT()"], answer: "B" },
    { id: 3, part, set: 1, question: "파워포인트에서 슬라이드 쇼 시작 단축키는?", options: ["F4", "F5", "F7"], answer: "B" },
    { id: 4, part, set: 1, question: "CPU는 무엇의 약자인가?", options: ["Central Processing Unit", "Computer Power Unit", "Central Power Unit"], answer: "A" },
    { id: 5, part, set: 1, question: "엑셀에서 절대참조를 나타내는 기호는?", options: ["@", "$", "#"], answer: "B" },
    { id: 6, part, set: 1, question: "1GB는 몇 MB인가?", options: ["512MB", "1024MB", "2048MB"], answer: "B" },
    { id: 7, part, set: 1, question: "인터넷 주소를 나타내는 것은?", options: ["URL", "USB", "UPS"], answer: "A" },
    { id: 8, part, set: 1, question: "운영체제(OS)가 아닌 것은?", options: ["Windows", "Android", "Excel"], answer: "C" },
    { id: 9, part, set: 1, question: "파일 확장자 .xlsx는 어떤 프로그램 파일인가?", options: ["한글", "엑셀", "파워포인트"], answer: "B" },
    { id: 10, part, set: 1, question: "한글 문서의 기본 저장 확장자는?", options: [".doc", ".hwp", ".txt"], answer: "B" },
  ];

  return examId === "bible" ? bibleQs : computerQs;
}

/** 시험/파트/셋에 맞는 문제 배열 반환 */
export function getQuestions(examId: string, part: string, set: string): Question[] {
  if (examId !== "english") {
    return generateSampleQuestions(examId, Number(part));
  }

  const p = parseInt(part, 10);
  const s = set === "all" ? "all" : set === "test" ? "test" : parseInt(set, 10);

  // 랜덤 테스트 모드
  if (s === "test") {
    return getRandomTestQuestions(p);
  }

  // 전체 랜덤 (기존)
  if (s === "all") {
    const targetPart = questionBank[p];
    return targetPart
      ? shuffle(Object.values(targetPart).flat())
      : [];
  }

  return questionBank[p]?.[s as number] ?? [];
}

/**
 * 랜덤 테스트 문제 추출
 * - part 1~4: 해당 파트의 Set 1~3 전체에서 랜덤 15문제
 * - part 0: 전체 Part 1~4 × Set 1~3에서 랜덤 100문제
 */
function getRandomTestQuestions(part: number): Question[] {
  if (part === 0) {
    // 종합 테스트: 모든 파트에서 100문제
    const allQuestions: Question[] = [];
    for (let p = 1; p <= 4; p++) {
      const partData = questionBank[p];
      if (partData) {
        allQuestions.push(...Object.values(partData).flat());
      }
    }
    const shuffled = shuffle(allQuestions);
    return shuffled.slice(0, Math.min(100, shuffled.length));
  }

  // 개별 파트 테스트: 해당 파트의 모든 Set에서 15문제
  const partData = questionBank[part];
  if (!partData) return [];
  const allInPart = Object.values(partData).flat();
  const shuffled = shuffle(allInPart);
  return shuffled.slice(0, Math.min(15, shuffled.length));
}

/**
 * 테스트 모드의 제한 시간 (초)
 * - 개별 파트: 10분 = 600초
 * - 종합 테스트: 60분 = 3600초
 */
export function getTestTimerSeconds(part: string): number {
  return part === "0" ? 3600 : 600;
}
