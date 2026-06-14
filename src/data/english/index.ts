/**
 * 영어 졸업고사 문제 데이터 인덱스
 *
 * 각 파일은 Part(1~4) × Set(1~3) = 총 12개로 분리되어 있습니다.
 * 새 문제를 추가하려면 해당 파트/셋 파일을 수정하세요.
 */
export type { Question } from "./types";

import part1Set1 from "./part1_set1";
import part1Set2 from "./part1_set2";
import part1Set3 from "./part1_set3";
import part2Set1 from "./part2_set1";
import part2Set2 from "./part2_set2";
import part2Set3 from "./part2_set3";
import part3Set1 from "./part3_set1";
import part3Set2 from "./part3_set2";
import part3Set3 from "./part3_set3";
import part4Set1 from "./part4_set1";
import part4Set2 from "./part4_set2";
import part4Set3 from "./part4_set3";

import { Question } from "./types";

export const questionBank: Record<number, Record<number, Question[]>> = {
  1: { 1: part1Set1, 2: part1Set2, 3: part1Set3 },
  2: { 1: part2Set1, 2: part2Set2, 3: part2Set3 },
  3: { 1: part3Set1, 2: part3Set2, 3: part3Set3 },
  4: { 1: part4Set1, 2: part4Set2, 3: part4Set3 },
};
