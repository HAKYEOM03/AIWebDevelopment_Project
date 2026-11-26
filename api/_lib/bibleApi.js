/**
 * 학교(한국성서대) 학사 API 호출 전용 모듈.
 * API 키(BIBLE_API_KEY)를 다루는 코드는 이 파일에만 있고,
 * 다른 코드(라우트 핸들러 등)는 이 파일이 제공하는 함수만 사용한다.
 *
 * 학교 API 주소는 지금 "테스트 서버"이고, 심사 통과 후 "실제 서버" 주소로 바뀔 예정이다.
 * 그때 이 파일을 고칠 필요 없이 Vercel 환경변수 BIBLE_API_URL 값만 바꾸면 되도록
 * 주소를 코드에 직접 적지 않고 환경변수로 뺀다.
 */

// 학교 전산팀이 안내한 주소를 기본값으로 두되, 환경변수가 있으면 그 값을 우선 사용한다.
const DEFAULT_BIBLE_API_URL = "https://joshua.bible.ac.kr/api/Space";

/**
 * 개발용 가짜(mock) 학교 API.
 * 학교 서버가 닫혀 있을 때 .env.local에 MOCK_BIBLE_API=true를 넣으면 실제 호출 대신 이 응답을 쓴다.
 * 실서비스(VERCEL_ENV=production)에서는 값이 true여도 절대 켜지지 않는다.
 *
 * 테스트 계정
 *   202200001 / test1234 : 졸업시험 신청 이력 4건 (합격/불합격/비고 표시 확인용)
 *   202300002 / test1234 : 신청 이력 없음 (빈 화면 확인용)
 *   user123   / user123  : 신청 이력 4건 (202200001과 동일)
 * 그 외 학번/비밀번호는 실제 API처럼 HTTP 200 + userNum "000000000"(로그인 실패)으로 응답한다.
 *
 * 주의: score/examDate/attendance/remark 필드명은 실제 API 필드명을 아직 몰라서 임의로 넣은 값이다.
 * mock으로는 "화면이 이 필드들을 잘 그리는지"만 확인할 수 있고, 실제 필드명은 서버 연동 후 다시 확인해야 한다.
 */
const MOCK_PASSWORD = "test1234";
const MOCK_HISTORY = [
  { semester: "20261", testItem: "0", applicationDate: "2026-03-31 오전 9:08:37", passingDate: "2026-04-11 오전 12:00:00", passFail: "1", score: "68", examDate: "2026-04-11", attendance: "응시", remark: "" },
  { semester: "20252", testItem: "1", applicationDate: "2025-10-30 오전 12:20:09", passingDate: "2025-11-15 오전 12:00:00", passFail: "1", score: "63", examDate: "2025-11-15", attendance: "응시", remark: "" },
  { semester: "20251", testItem: "1", applicationDate: "2025-05-07 오후 10:24:04", passingDate: "2025-05-31 오전 12:00:00", passFail: "0", score: "42", examDate: "2025-05-31", attendance: "응시", remark: "" },
  { semester: "20231", testItem: "2", applicationDate: "2023-03-17 오전 12:00:00", passingDate: "2023-03-14 오전 12:00:00", passFail: "1", score: "0", examDate: "2023-03-14", attendance: "응시", remark: "LPIC" },
];
const MOCK_STUDENTS = {
  "202200001": MOCK_HISTORY,
  "202300002": [],
  user123: MOCK_HISTORY,
};
// 비밀번호가 test1234가 아닌 계정만 따로 적는다.
const MOCK_PASSWORDS = { user123: "user123" };

function isMockEnabled() {
  return process.env.MOCK_BIBLE_API === "true" && process.env.VERCEL_ENV !== "production";
}

function mockBibleApi(body) {
  if (body.subject === "user") {
    const expectedPassword = MOCK_PASSWORDS[body.keyA] ?? MOCK_PASSWORD;
    const ok = Object.hasOwn(MOCK_STUDENTS, body.keyA) && body.keyB === expectedPassword;
    return {
      description: "requestUserInfo",
      display: "1",
      data: [ok ? { userNum: body.keyA, userStatus: "10" } : { userNum: "000000000", userStatus: "00" }],
    };
  }

  if (body.subject === "gradExam") {
    const records = MOCK_STUDENTS[body.studentnum] ?? [];
    return { description: "graduationExamInfo", display: String(records.length), data: records };
  }

  return { data: [] };
}

async function callBibleApi(body) {
  if (isMockEnabled()) {
    return mockBibleApi(body);
  }

  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    throw new Error("BIBLE_API_KEY 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 등록하세요.");
  }

  const apiUrl = process.env.BIBLE_API_URL || DEFAULT_BIBLE_API_URL;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BIBLE-APIGW-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`학교 API 응답 오류: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * 학번/비밀번호로 로그인 검증.
 * 주의: 학교 API는 로그인 실패에도 HTTP 200을 반환한다.
 * 실패 시 userNum이 "000000000"으로 오므로 그 값으로 직접 판정해야 한다.
 */
export async function verifyStudentLogin(studentId, password) {
  const result = await callBibleApi({
    keyA: studentId,
    keyB: password,
    subject: "user",
  });

  const record = result?.data?.[0];
  const userNum = record?.userNum;
  const userStatus = record?.userStatus;
  const success = Boolean(userNum) && userNum !== "000000000";

  return { success, userNum, userStatus };
}

/**
 * 졸업고사 정보 조회.
 * studentNum은 반드시 "로그인 세션에서 검증된 값"만 넘겨야 한다.
 * (프론트엔드가 보낸 학번을 그대로 여기 넘기면 남의 정보를 조회할 수 있게 되므로 절대 금지)
 */
export async function fetchGradExamInfo(studentNum) {
  const result = await callBibleApi({
    studentnum: studentNum,
    subject: "gradExam",
  });
  return result?.data ?? [];
}
