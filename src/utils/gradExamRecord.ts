import type { GradExamRecord } from "../api/space";

/**
 * 학교 API 원본 레코드에서 화면에 쓸 필드를 뽑아낸다.
 *
 * semester/testItem/applicationDate/passingDate/passFail은 필드명이 확정됨.
 * 응시일/점수/응시여부/비고 4개는 학교 포털 화면(2026-08-07 확인)엔 있는데
 * 우리 API 응답의 정확한 필드명은 아직 확인 전이라, 있을 법한 이름들을 순서대로 시도한다.
 *
 * 실제 필드명을 확인하면: 아래 각 pick(...) 배열의 맨 앞에 정확한 이름만 추가하면 끝.
 * (기존 후보들은 안전하게 그대로 둬도 무방 — 못 찾으면 다음 후보로 넘어갈 뿐)
 */
export interface DisplayRecord {
  semester?: string;
  testItem?: string;
  applicationDate?: string;
  passingDate?: string;
  passFail?: string;
  /** 응시일 */
  examDate?: string;
  /** 점수 */
  score?: string;
  /** 응시여부 */
  attendance?: string;
  /** 비고 — 시험 종류 고정 설명이 아니라, 신청 건마다 다른 값(예: "LPIC") */
  remark?: string;
}

function pick(record: GradExamRecord, candidates: string[]): string | undefined {
  for (const key of candidates) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== "") {
      return String(value);
    }
  }
  return undefined;
}

export function normalizeGradExamRecord(record: GradExamRecord): DisplayRecord {
  return {
    semester: record.semester,
    testItem: record.testItem,
    applicationDate: record.applicationDate,
    passingDate: record.passingDate,
    passFail: record.passFail,

    // ↓ 필드명 확인 전: 후보 이름 자동 탐색
    examDate: pick(record, ["examDate", "testDate", "takenDate", "attendDate", "examinationDate"]),
    score: pick(record, ["score", "testScore", "point", "points", "totalScore"]),
    attendance: pick(record, ["attendance", "attendYn", "examYn", "attendStatus", "attendanceStatus"]),
    remark: pick(record, ["remark", "remarks", "note", "notes", "etc", "bigo", "comment"]),
  };
}

/**
 * 신청 내역을 시험 항목(testItem) 코드별로 묶는다.
 * 화면에서 "영어 졸업고사" / "성경 졸업 시험" 처럼 과목별로 나눠서 보여줄 때 쓴다.
 * 코드 순서(0,1,2,3...)대로 정렬해서 반환.
 */
export function groupRecordsByTestItem(records: GradExamRecord[]): [string, GradExamRecord[]][] {
  const groups = new Map<string, GradExamRecord[]>();
  for (const record of records) {
    const key = record.testItem ?? "미확인";
    const list = groups.get(key);
    if (list) {
      list.push(record);
    } else {
      groups.set(key, [record]);
    }
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
}
