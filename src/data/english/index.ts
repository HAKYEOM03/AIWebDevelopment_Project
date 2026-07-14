/**
 * 영어 졸업 시험 문제 데이터 인덱스
 *
 * LC(Part 1~4)와 RC(Part 5~7) × Set(1~3) = 총 21개 파일로 분리되어 있습니다.
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
import part5Set1 from "./part5_set1";
import part5Set2 from "./part5_set2";
import part5Set3 from "./part5_set3";
import part6Set1 from "./part6_set1";
import part6Set2 from "./part6_set2";
import part6Set3 from "./part6_set3";
import part7Set1 from "./part7_set1";
import part7Set2 from "./part7_set2";
import part7Set3 from "./part7_set3";

import { Question } from "./types";

/** LC(사진묘사/질문응답/대화내용/지문내용) 파트 번호 */
export const LC_PARTS = [1, 2, 3, 4];
/** RC(문법/어휘·독해) 파트 번호 */
export const RC_PARTS = [5, 6, 7];

export const questionBank: Record<number, Record<number, Question[]>> = {
  1: { 1: part1Set1, 2: part1Set2, 3: part1Set3 },
  2: { 1: part2Set1, 2: part2Set2, 3: part2Set3 },
  3: { 1: part3Set1, 2: part3Set2, 3: part3Set3 },
  4: { 1: part4Set1, 2: part4Set2, 3: part4Set3 },
  5: { 1: part5Set1, 2: part5Set2, 3: part5Set3 },
  6: { 1: part6Set1, 2: part6Set2, 3: part6Set3 },
  7: { 1: part7Set1, 2: part7Set2, 3: part7Set3 },
};
