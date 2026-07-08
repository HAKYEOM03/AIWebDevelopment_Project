import { useContext } from "react";
import { examInfoList, ExamInfo } from "../data/examInfo";
import { ExamDataContext } from "../context/ExamDataContext";

/** 관리자가 저장한 소개 내용(introContent)을 기본 시험 정보에 덮어씌운 목록을 반환 */
export function useEffectiveExamList(): ExamInfo[] {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { introContent } = examData;

  return examInfoList.map((exam) => {
    const content = introContent[exam.id];
    if (!content) return exam;
    return {
      ...exam,
      registrationStart: new Date(content.registrationStart),
      registrationEnd: new Date(content.registrationEnd),
      examLocation: content.examLocation,
      examTime: content.examTime,
      requirements: content.requirements,
      passingScore: content.passingScore,
      contact: content.contact,
      infoSections: content.infoSections,
    };
  });
}
