/**
 * 오답 저장소 (localStorage 기반)
 *
 * 각 졸업 시험 × 파트 × 셋별로 틀린 문제 ID를 저장합니다.
 * 키 형식: wrong_{examId}_p{part}_s{set}
 *
 * 사용법:
 *   saveWrongIds("english", "1", "1", [1, 3, 7])  // 저장
 *   getWrongIds("english", "1", "1")               // [1, 3, 7]
 *   clearWrongIds("english", "1", "1")             // 삭제
 */

function getKey(examId: string, part: string, set: string): string {
  return `wrong_${examId}_p${part}_s${set}`;
}

/** 틀린 문제 ID 목록 저장 (기존 값 덮어쓰기) */
export function saveWrongIds(
  examId: string,
  part: string,
  set: string,
  ids: number[]
): void {
  const key = getKey(examId, part, set);
  localStorage.setItem(key, JSON.stringify(ids));
}

/** 저장된 틀린 문제 ID 목록 가져오기 */
export function getWrongIds(
  examId: string,
  part: string,
  set: string
): number[] {
  const key = getKey(examId, part, set);
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

/** 특정 파트/셋의 오답 데이터 삭제 */
export function clearWrongIds(
  examId: string,
  part: string,
  set: string
): void {
  const key = getKey(examId, part, set);
  localStorage.removeItem(key);
}

/** 특정 시험의 모든 오답 데이터 삭제 */
export function clearAllWrongIds(examId: string): void {
  const prefix = `wrong_${examId}_`;
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
  keys.forEach((k) => localStorage.removeItem(k));
}

/** 특정 파트/셋에 오답이 있는지 확인 */
export function hasWrongIds(
  examId: string,
  part: string,
  set: string
): boolean {
  return getWrongIds(examId, part, set).length > 0;
}
