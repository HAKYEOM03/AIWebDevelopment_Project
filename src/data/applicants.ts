export type ApplicantStatus = "신청완료" | "면제대상" | "응시료미납";

export interface Applicant {
  id: number;
  studentId: string; // 학번
  name: string;
  department: string; // 학과
  grade: number; // 학년
  subject: string; // 신청 과목
  phone: string;
  email: string;
  appliedDate: string; // 신청일 (YYYY-MM-DD)
  attempts: number; // 응시 횟수
  status: ApplicantStatus;
}

/**
 * 영어 졸업고사 신청자 명단 (데모용 가상 데이터)
 *
 * 학번 또는 이름으로 검색하면 해당 신청자의 상세 정보를 동적으로 불러옵니다.
 */
export const applicants: Applicant[] = [
  {
    id: 1,
    studentId: "20210101",
    name: "김도윤",
    department: "컴퓨터소프트웨어학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-1234-5678",
    email: "doyun.kim@bible.ac.kr",
    appliedDate: "2026-04-01",
    attempts: 1,
    status: "신청완료",
  },
  {
    id: 2,
    studentId: "20210215",
    name: "이서연",
    department: "간호학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-2345-6789",
    email: "seoyeon.lee@bible.ac.kr",
    appliedDate: "2026-04-02",
    attempts: 0,
    status: "응시료미납",
  },
  {
    id: 3,
    studentId: "20200318",
    name: "박지호",
    department: "사회복지학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-3456-7890",
    email: "jiho.park@bible.ac.kr",
    appliedDate: "2026-04-02",
    attempts: 2,
    status: "신청완료",
  },
  {
    id: 4,
    studentId: "20220442",
    name: "최유진",
    department: "영유아보육학과",
    grade: 3,
    subject: "영어 졸업고사",
    phone: "010-4567-8901",
    email: "yujin.choi@bible.ac.kr",
    appliedDate: "2026-04-03",
    attempts: 0,
    status: "면제대상",
  },
  {
    id: 5,
    studentId: "20210527",
    name: "정민준",
    department: "컴퓨터소프트웨어학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-5678-9012",
    email: "minjun.jung@bible.ac.kr",
    appliedDate: "2026-04-04",
    attempts: 1,
    status: "신청완료",
  },
  {
    id: 6,
    studentId: "20200634",
    name: "강하은",
    department: "성서학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-6789-0123",
    email: "haeun.kang@bible.ac.kr",
    appliedDate: "2026-04-05",
    attempts: 2,
    status: "응시료미납",
  },
  {
    id: 7,
    studentId: "20220719",
    name: "윤서준",
    department: "간호학과",
    grade: 3,
    subject: "영어 졸업고사",
    phone: "010-7890-1234",
    email: "seojun.yoon@bible.ac.kr",
    appliedDate: "2026-04-05",
    attempts: 0,
    status: "신청완료",
  },
  {
    id: 8,
    studentId: "20210823",
    name: "임채원",
    department: "사회복지학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-8901-2345",
    email: "chaewon.lim@bible.ac.kr",
    appliedDate: "2026-04-06",
    attempts: 1,
    status: "면제대상",
  },
  {
    id: 9,
    studentId: "20200915",
    name: "한지우",
    department: "컴퓨터소프트웨어학과",
    grade: 4,
    subject: "영어 졸업고사",
    phone: "010-9012-3456",
    email: "jiwoo.han@bible.ac.kr",
    appliedDate: "2026-04-07",
    attempts: 2,
    status: "신청완료",
  },
  {
    id: 10,
    studentId: "20221036",
    name: "오나윤",
    department: "영유아보육학과",
    grade: 3,
    subject: "영어 졸업고사",
    phone: "010-0123-4567",
    email: "nayoon.oh@bible.ac.kr",
    appliedDate: "2026-04-08",
    attempts: 0,
    status: "신청완료",
  },
];
