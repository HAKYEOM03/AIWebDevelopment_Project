/**
 * 학교 졸업 시험 API(gradExam)의 코드 → 실제 의미 매핑.
 * 학교 담당자에게 확인받은 내용을 여기에 계속 업데이트하면 된다.
 * (2026-08-07 최종 확인: testItem 0~3, passFail 0/1 전부 확정됨)
 */

export interface TestItemInfo {
  label: string;
  /** 면제 사유 등 비고 — 있으면 화면에 작게 같이 표시 */
  note?: string;
}

export const TEST_ITEM_LABELS: Record<string, TestItemInfo> = {
  "0": { label: "영어 졸업고사", note: "자격증" },
  "1": { label: "성경 졸업 시험" },
  "2": { label: "컴퓨터 졸업시험 1", note: "스프레드시트" },
  "3": { label: "컴퓨터 졸업시험 2", note: "수업면제 · 파워포인트" },
};

export function getTestItemInfo(code?: string): TestItemInfo {
  if (!code) return { label: "미확인" };
  return TEST_ITEM_LABELS[code] ?? { label: `코드 ${code} (미확인)` };
}

export function getTestItemLabel(code?: string): string {
  return getTestItemInfo(code).label;
}

/** 합격여부 코드 — 1: 합격, 0: 불합격 (2026-08-07 확인 완료) */
export const PASS_FAIL_LABELS: Record<string, string> = {
  "1": "합격",
  "0": "불합격",
};

export function getPassFailLabel(code?: string): string {
  if (!code) return "미확인";
  return PASS_FAIL_LABELS[code] ?? `코드 ${code} (미확인)`;
}
