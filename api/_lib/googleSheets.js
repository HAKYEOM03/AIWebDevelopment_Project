/**
 * 구글 시트(Sheets API) 호출 전용 모듈 — 서비스 계정으로 로그인해서 쓴다.
 * 별도 라이브러리 없이 Node 기본 기능(crypto, fetch)만 사용한다.
 *
 * 필요한 환경변수 (서버에만 보관, 프론트에는 절대 나가지 않음)
 *   GOOGLE_SHEETS_ID                    스프레드시트 ID (주소에서 /d/ 와 /edit 사이의 값, 주소 전체를 넣어도 됨)
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL        서비스 계정 이메일 (이 이메일에 시트 "편집자" 권한을 공유해야 함)
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY  서비스 계정 키 파일(JSON)의 private_key 값
 */
import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export class GoogleApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GoogleApiError";
    this.status = status;
  }
}

function readConfig() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  const rawId = process.env.GOOGLE_SHEETS_ID?.trim();
  if (!email || !rawKey || !rawId) {
    throw new Error(
      "구글 시트 환경변수(GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)가 설정되지 않았습니다."
    );
  }

  // 키를 환경변수에 한 줄로 넣으면 줄바꿈이 \n 글자로 들어오고, 따옴표가 같이 붙기도 해서 정리해준다.
  const privateKey = rawKey.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
  // 주소 전체를 붙여넣은 경우에도 ID만 뽑아낸다.
  const spreadsheetId = rawId.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1] ?? rawId;
  return { email, privateKey, spreadsheetId };
}

const base64url = (input) => Buffer.from(input).toString("base64url");

let cachedToken = null; // { value, expiresAt }

async function getAccessToken({ email, privateKey }) {
  if (cachedToken && cachedToken.expiresAt - 60_000 > Date.now()) {
    return cachedToken.value;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: issuedAt, exp: issuedAt + 3600 })
  );
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(privateKey, "base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new GoogleApiError(
      `구글 로그인(서비스 계정) 실패: ${data.error_description || data.error || response.status}`,
      response.status
    );
  }

  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

async function sheetsRequest(path, { method = "GET", body } = {}) {
  const config = readConfig();
  const token = await getAccessToken(config);

  const response = await fetch(`${SHEETS_URL}/${config.spreadsheetId}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new GoogleApiError(data.error?.message || `구글 시트 API 오류: HTTP ${response.status}`, response.status);
  }
  return data;
}

/** 탭 이름에 숫자나 공백이 있어도 안전하게 쓰도록 따옴표로 감싼 범위 문자열을 만든다. */
const rangeOf = (tab, cells) => encodeURIComponent(`'${tab}'!${cells}`);

/** 탭이 없을 때 구글이 돌려주는 오류인지 확인 */
export function isMissingTabError(error) {
  return error instanceof GoogleApiError && error.status === 400 && /unable to parse range/i.test(error.message);
}

/** 탭 맨 아래에 행들을 한 번의 호출로 추가한다. */
export async function appendRows(tab, cells, values) {
  return sheetsRequest(
    `/values/${rangeOf(tab, cells)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", body: { values } }
  );
}

/** 탭의 값을 읽는다. 숫자는 숫자로 돌려받는다. */
export async function readRows(tab, cells) {
  const data = await sheetsRequest(`/values/${rangeOf(tab, cells)}?valueRenderOption=UNFORMATTED_VALUE`);
  return data.values ?? [];
}

/** 스프레드시트에 있는 탭 이름 목록 */
export async function listTabTitles() {
  const data = await sheetsRequest("?fields=sheets.properties.title");
  return (data.sheets ?? []).map((sheet) => sheet.properties.title);
}

/** 새 탭을 만들고 맨 윗줄에 머리글을 넣는다 (머리글 줄 고정 + 굵게). 이미 있으면 그냥 넘어간다. */
export async function createTabWithHeader(tab, header) {
  let sheetId;
  try {
    const created = await sheetsRequest(":batchUpdate", {
      method: "POST",
      body: {
        requests: [
          { addSheet: { properties: { title: tab, gridProperties: { frozenRowCount: 1 } } } },
        ],
      },
    });
    sheetId = created.replies?.[0]?.addSheet?.properties?.sheetId;
  } catch (error) {
    // 동시에 두 요청이 같은 탭을 만들려 하면 한쪽은 "이미 있다"는 오류를 받는다 — 그대로 진행하면 된다.
    if (error instanceof GoogleApiError && error.status === 400 && /already exists/i.test(error.message)) {
      return;
    }
    throw error;
  }

  await sheetsRequest(`/values/${rangeOf(tab, "A1")}?valueInputOption=RAW`, {
    method: "PUT",
    body: { values: [header] },
  });

  if (sheetId !== undefined) {
    await sheetsRequest(":batchUpdate", {
      method: "POST",
      body: {
        requests: [
          {
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.114, green: 0.306, blue: 0.847 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
        ],
      },
    });
  }
}
