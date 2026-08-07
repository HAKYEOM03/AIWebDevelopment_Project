/**
 * 학교(한국성서대) 학사 API 호출 전용 모듈.
 * API 키(BIBLE_API_KEY)를 다루는 코드는 이 파일에만 있고,
 * 다른 코드(라우트 핸들러 등)는 이 파일이 제공하는 함수만 사용한다.
 */

const BIBLE_API_URL = "https://rody.bible.ac.kr/api/Space";

async function callBibleApi(body) {
  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    throw new Error("BIBLE_API_KEY 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 등록하세요.");
  }

  const response = await fetch(BIBLE_API_URL, {
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
