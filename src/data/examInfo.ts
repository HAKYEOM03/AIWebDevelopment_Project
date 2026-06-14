export interface InfoSection {
  title: string;
  items: string[];
}

export interface ExamInfo {
  id: string;
  name: string;
  fullName: string;
  registrationStart: Date;
  registrationEnd: Date;
  examDate: Date;
  examTime: string;
  examLocation: string;
  requirements: string[];
  passingScore: string;
  contact: string;
  color: string;
  infoSections: InfoSection[];
}

/**
 * 졸업고사 정보
 *
 * 날짜 수정 방법:
 * - registrationStart: 신청 시작 날짜 (형식: "YYYY-MM-DD")
 * - registrationEnd: 신청 종료 날짜 (형식: "YYYY-MM-DD")
 * - examDate: 시험 날짜 (형식: "YYYY-MM-DD")
 * - examTime: 시험 시간 (형식: "오전/오후 HH시")
 *
 * 예: new Date("2026-04-11") → 2026년 4월 11일
 */
export const examInfoList: ExamInfo[] = [
  {
    id: "english",
    name: "영어졸업고사",
    fullName: "영어 졸업고사",
    registrationStart: new Date("2026-03-31"), // 신청 시작
    registrationEnd: new Date("2026-04-08"),   // 신청 종료
    examDate: new Date("2026-06-23"),          // 시험 날짜 (D-DAY 표시됨)
    examTime: "오전 11시 (입실: 10시 40분부터)",
    examLocation: "로고스홀",
    requirements: ["컴퓨터용 싸인펜", "학생증(신분증)"],
    passingScore: "100점 만점 중 55점 이상",
    contact: "기초교양교육과 02-950-5457",
    color: "blue",
    infoSections: [
      {
        title: "시험 일정 및 장소",
        items: [
          "일시: 2026년 4월 11일(토) 오전 11시",
          "입실: 10시 40분부터 (시험 시작 후 입실 절대 불가)",
          "장소: 로고스홀",
        ],
      },
      {
        title: "신청 안내",
        items: [
          "대상: 영어졸업시험 미통과 재학생(2~4학년) 중 학번별 이수 기준 충족자",
          "기간: 3월 31일(화) ~ 4월 8일(수) 23:59까지",
          "방법: 학사인트라넷(학적관리 → 졸업시험신청)을 통해 신청",
        ],
      },
      {
        title: "시험 준비물",
        items: [
          "필수 지참: 컴퓨터용 싸인펜, 학생증(신분증)",
          "※ 현장 판매 없음 / 미지참 시 입실 및 답안 작성 불가",
        ],
      },
      {
        title: "시험 정보",
        items: [
          "출제 유형: 문법, 독해 (리스닝 포함 없음)",
          "합격 기준: 100점 만점 중 55점 이상",
          "대비 방법: LMS(영어졸업고사 대비 오디오 파일), 예상문제집(밀알관 지하 1층 복사실 판매)",
        ],
      },
      {
        title: "응시료 (4학년 대상)",
        items: [
          "납부 대상: 2017학번 이후 4학년 학생 중 2회 이하 응시 기록자",
          "0회 응시: 3만원 / 1회 응시: 2만원 / 2회 응시: 1만원",
          "※ 신청 후 미응시 시 차후 응시료 3만원 발생 (주의)",
        ],
      },
      {
        title: "면제 기준",
        items: [
          "외부 토익 600점 이상 (17학번 이전은 550점)",
          "또는 모의토익 600점 이상 시 제출/신청을 통해 면제 가능",
          "※ 졸업시험 합격과 별개로 영어 필수 과목 이수는 필수",
        ],
      },
    ],
  },
  {
    id: "bible",
    name: "성경졸업고사",
    fullName: "성경 졸업고사",
    registrationStart: new Date("2026-04-27"), // 신청 시작
    registrationEnd: new Date("2026-05-08"),   // 신청 종료
    examDate: new Date("2026-06-30"),          // 시험 날짜 (D-DAY 표시됨)
    examTime: "오전 10시",
    examLocation: "학과별 시험 장소 안내 예정",
    requirements: ["학생증 (분실 시 신분증 지참)", "컴퓨터용 수성사인펜"],
    passingScore: "성서학과 70점 이상 / 그 외 학과 60점 이상 (100점 만점)",
    contact: "일립교육과 02-950-5446",
    color: "amber",
    infoSections: [
      {
        title: "시험 일정 및 장소",
        items: [
          "일시: 2026년 5월 30일(토) 오전 10시",
          "장소: 학과별 시험 장소 안내 예정",
          "※ 시험 시작 후 입실 불가!",
        ],
      },
      {
        title: "신청 안내",
        items: [
          "신청 기간: 4월 27일(월) ~ 5월 8일(금)",
          "방법: 인트라넷(학적관리 → 졸업시험 신청 → 성경졸업시험 신청)",
          "※ 신청 후 반드시 신청 확인 필수!",
          "※ 신청 후 미응시 시 미응시료 부과 (-30,000원) — 취소는 5월 8일(금)까지",
        ],
      },
      {
        title: "시험 범위 및 문항 수",
        items: [
          "성경졸업시험 문제은행 950문항 기준",
          "구약: 객관식 40문제 + 암송 5문제",
          "신약: 객관식 40문제 + 암송 5문제",
          "※ 문제은행은 교내 복사실에서 구매 가능",
        ],
      },
      {
        title: "합격 기준",
        items: [
          "성서학과: 70점 이상 (100점 만점)",
          "간호학과, 사회복지학과, 영유아보육학과, 컴퓨터소프트웨어학과: 60점 이상 (100점 만점)",
        ],
      },
      {
        title: "주의사항",
        items: [
          "시험 시작 후 입실 불가!",
          "성경졸업시험 미신청자 당일 시험 응시 불가",
          "신청 후 반드시 응시 — 부득이한 경우 5월 8일(금)까지 인트라넷에서 취소",
        ],
      },
    ],
  },
  {
    id: "computer",
    name: "컴퓨터졸업고사",
    fullName: "컴퓨터 졸업고사",
    registrationStart: new Date("2026-04-06"), // 신청 시작
    registrationEnd: new Date("2026-04-13"),   // 신청 종료
    examDate: new Date("2026-07-23"),          // 시험 날짜 (D-DAY 표시됨)
    examTime: "2교시 10:10~10:50 / 3교시 11:20~12:00",
    examLocation: "갈멜관 PC 실습실 (AI융합실습실 및 교양정보실)",
    requirements: ["학생증"],
    passingScore: "NSLB시스템 안내 참조",
    contact: "기초교양교육과 02-950-5457",
    color: "green",
    infoSections: [
      {
        title: "시험 일정 및 장소",
        items: [
          "일자: 2026년 5월 23일(토)",
          "장소: 갈멜관 PC 실습실 (AI융합실습실 및 교양정보실)",
          "※ 신청 확정 후 개별 장소 안내 예정",
        ],
      },
      {
        title: "시험 종목",
        items: [
          "스프레드시트 (컴퓨터 졸업시험1 — 엑셀)",
          "프레젠테이션 (컴퓨터 졸업시험2)",
        ],
      },
      {
        title: "시험 스케줄",
        items: [
          "2교시 10:10~10:50 — 스프레드시트 95명 / 프레젠테이션 20명",
          "3교시 11:20~12:00 — 스프레드시트 95명 / 프레젠테이션 20명",
          "※ 시험 응시 시간은 임의로 배정됩니다",
        ],
      },
      {
        title: "신청 안내",
        items: [
          "신청 기간: 4월 6일(월) 9:00 ~ 4월 13일(월) 23:59",
          "방법: NSLB시스템을 통해 신청",
          "※ NSLB시스템에 기재된 안내 사항을 반드시 읽어주세요",
          "※ 응시료 납부방법은 NSLB시스템 안내사항 확인 필수",
        ],
      },
    ],
  },
];

export const notices = [
  {
    id: 1,
    title: "2026년 1학기 졸업고사 시행 안내",
    date: "2026-05-01",
    content: "2026년 1학기 졸업고사가 아래와 같이 시행됩니다. 해당 학생은 반드시 기간 내 신청하시기 바랍니다.",
    important: true,
  },
  {
    id: 2,
    title: "졸업고사 신청 방법 안내",
    date: "2026-05-01",
    content: "포털시스템 → 학사관리 → 졸업고사 신청 메뉴에서 신청하시기 바랍니다.",
    important: false,
  },
  {
    id: 3,
    title: "영어졸업고사 응시 자격 변경 안내",
    date: "2026-04-20",
    content: "2026년부터 영어졸업고사 응시 자격이 변경되었습니다. 자세한 내용은 학사팀으로 문의하세요.",
    important: false,
  },
];
