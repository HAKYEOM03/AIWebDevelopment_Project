# ExamServer (ASP.NET 서버)

졸업 시험 연습 사이트의 **서버 프로그램**입니다. 학교 서버(IIS)에 올리는 것을 목표로,
기존 Vercel용 `api/` 폴더(JavaScript)의 기능을 C#으로 옮기고 DB 저장을 붙였습니다.

화면(React)이 부르는 API 주소와 응답 모양은 기존과 **똑같아서**, 화면 코드는 거의 그대로 씁니다.

## 하는 일

| API | 기능 |
|---|---|
| `POST /api/space` | 학교 API(joshua)로 학번 로그인 확인 / 내 졸업시험 기록 조회 |
| `GET /api/me`, `POST /api/logout` | 로그인 상태 확인 / 로그아웃 |
| `POST /api/admin-login` | 관리자 로그인 (아이디·비밀번호는 서버 설정에만 있음) |
| `POST /api/stats-record` | 학생이 푼 결과 저장 (로그인한 학생만, 1분 30회 제한) |
| `GET /api/stats` | [관리자] 전체 학우 통계 — 파트·세트·문제별 오답률, 푼 인원 |
| `GET /api/my-stats` | [학생] 내 통계 |
| `GET /api/settings`, `PUT /api/settings/{key}` | 시험·D-DAY 잠금, 시험 날짜, 소개 내용 (저장은 관리자만) |

- **2년 자동 삭제:** 서버가 켜질 때와 그 뒤 24시간마다, 730일 지난 풀이 기록을 지웁니다 (`Retention:Days`).
- **개인정보:** 학번은 저장하지 않고, 학번을 되돌릴 수 없게 암호화한 "학우ID"만 저장합니다.
- **로그인 보호:** 한 계정이 15분 안에 10번 틀리면 15분 동안 막습니다. 강의실처럼 IP가 같은 학생들이 함께 막히지 않도록 IP가 아니라 계정 단위로 막습니다.

## 내 컴퓨터에서 실행하기

준비물은 .NET 10 SDK(`dotnet --version`이 10으로 시작)와 Node.js입니다.

**1. 서버 켜기** (터미널 1)
```bash
cd server/ExamServer
dotnet run
```
`http://localhost:5080`에서 켜집니다. 개발 모드에서는 이렇게 동작합니다.
- **DB:** `exam-dev.db`(SQLite) 파일을 자동으로 만들어 씁니다. 설치할 것이 없습니다.
- **학교 API:** 실제 서버 대신 가짜 응답을 씁니다 (`BibleApi:Mock`).
- **테스트 계정:**
  - 학생: `202200001` / `test1234` (졸업시험 이력 있음), `202300002` / `test1234` (이력 없음)
  - 관리자: `devadmin` / `devadmin1234`

**2. 화면이 이 서버를 쓰게 하기**
프로젝트 맨 위 폴더의 `.env.local`에 한 줄을 추가합니다.
```
API_PROXY_TARGET=http://localhost:5080
```

**3. 화면 켜기** (터미널 2, 프로젝트 맨 위 폴더)
```bash
npm run dev
```

**참고**
- `.env.local`에 `VITE_DEV_TEST_ACCOUNTS=true`가 있으면 `user123`·`admin123`은 서버를 거치지 않는 화면 전용 테스트 계정입니다. 서버까지 확인하려면 위의 테스트 계정을 쓰세요.
- 개발용 DB를 처음 상태로 되돌리려면 서버를 끄고 `exam-dev.db*` 파일을 지우면 됩니다.

## 설정 값

`appsettings.json`에는 **비밀값을 적지 않습니다** (GitHub에 올라감). 학교 서버에서는 환경 변수로 넣고, 이름의 `:`는 `__`(밑줄 두 개)로 바꿉니다.

| 환경 변수 | 뜻 | 필수 |
|---|---|---|
| `BibleApi__Key` | 학교 API 키 (`X-BIBLE-APIGW-API-KEY`) | ✅ |
| `BibleApi__Url` | 학교 API 주소 (기본 `https://joshua.bible.ac.kr/api/Space`) | |
| `Session__Secret` | 로그인 쿠키 서명 키, 32자 이상 무작위 문자열 | ✅ |
| `Admin__Id`, `Admin__Password` | 관리자 계정 (비우면 관리자 로그인 불가) | |
| `Stats__IdSecret` | 학우ID 암호화 키 (비우면 `Session__Secret` 사용). **한 번 정하면 바꾸지 말 것** — 바뀌면 기존 기록과 학우의 연결이 끊김 | |
| `Database__Provider` | `Sqlite` / `SqlServer` / `PostgreSQL` | |
| `ConnectionStrings__Default` | DB 접속 문자열 | |
| `Retention__Days` | 풀이 기록 보관 일수 (기본 730) | |

운영 모드에서 필수 값이 없으면 서버가 켜지지 않고, 무엇이 빠졌는지 로그에 알려줍니다.

**DB 접속 문자열 예시**
- **SQL Server:** `Server=DB서버주소;Database=ExamDb;User Id=아이디;Password=비밀번호;TrustServerCertificate=True`
- **PostgreSQL:** `Host=DB서버주소;Database=exam;Username=아이디;Password=비밀번호`

서버가 처음 켜질 때 표(`practice_records`, `site_settings`)를 자동으로 만듭니다. 그래서 DB 계정에는 표를 만들 권한이 필요합니다.

## 학교 서버(IIS)에 올리기

전산팀과 함께 진행합니다.

1. **학교 서버에 설치:** **ASP.NET Core Hosting Bundle** (.NET 10)
2. **배포 파일 만들기** (프로젝트 맨 위 폴더에서)
   ```bash
   npm run build:server
   dotnet publish server/ExamServer -c Release -o server/publish
   ```
   `server/publish` 폴더에 화면과 서버가 함께 들어갑니다. 화면 빌드는 `wwwroot`에 들어가서 한 주소로 같이 서비스됩니다.
3. **IIS 설정**
   - 사이트를 만들고 실제 경로를 `publish` 폴더를 복사한 곳으로 지정합니다.
   - 응용 프로그램 풀의 .NET CLR 버전은 **관리 코드 없음**으로 둡니다.
4. **환경 변수:** 위 표의 필수 값을 서버 환경 변수 또는 `web.config`의 `<environmentVariables>`에 넣습니다.
5. **HTTPS 필수:** 로그인 쿠키는 https에서만 Secure로 보호됩니다. 학교 인증서로 https 주소를 연결하세요.

## 기존 Vercel 사이트와의 관계

- **Vercel:** 지금처럼 `api/` 폴더(JavaScript, 구글 시트 저장)로 동작합니다. 이 서버와 상관없이 그대로입니다.
- **잠금 설정 저장 위치:** 화면은 `/api/settings`가 있으면 서버에, 없으면(Vercel, GitHub Pages) 예전처럼 브라우저에 저장합니다. 관리 화면 상단에 어디에 저장되는지 표시됩니다.

## 아직 남은 일 (2단계)

- **문제 숨기기와 서버 채점:** 문제·정답이 아직 화면 코드 안에 있습니다. 문제를 DB로 옮기고 서버에서 채점해야 합니다.
- **DB 구조 관리:** 표 구조를 바꾸게 되면 지금의 자동 생성(`EnsureCreated`) 대신 EF Core 마이그레이션으로 바꿔야 합니다.
- **기존 기록 옮기기:** 구글 시트의 기록은 자동으로 옮겨지지 않습니다. 행 모양이 같아서 그대로 옮길 수는 있습니다.
- **공지사항:** 아직 관리자 브라우저에만 저장됩니다.
- **학생 상태 확인:** 학교 API의 `userStatus`(재학·휴학·졸업)는 아직 확인하지 않습니다.
- **개인정보 동의:** 첫 로그인 때 동의 받는 화면이 아직 없습니다.

## 참고: 실행이 막히는 경우

Windows **스마트 앱 컨트롤**이 새로 빌드된 서명 없는 `.exe`를 막을 수 있습니다. 그래서 이 프로젝트는 `.exe`를 만들지 않고(`UseAppHost=false`) 서명된 `dotnet` 프로그램으로 실행합니다.
