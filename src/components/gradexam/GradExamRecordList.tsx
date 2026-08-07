import { GradExamRecord } from "../../api/space";
import { getTestItemInfo, getPassFailLabel } from "../../data/gradExamCodes";
import { normalizeGradExamRecord, groupRecordsByTestItem } from "../../utils/gradExamRecord";

/** 졸업 시험 신청 내역을 시험 종목별로 묶어서 보여주는 카드 목록. */
export default function GradExamRecordList({ records }: { records: GradExamRecord[] }) {
  if (records.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">조회된 졸업 시험 신청 내역이 없습니다.</p>
    );
  }

  return (
    <div className="space-y-5">
      {groupRecordsByTestItem(records).map(([code, list]) => {
        const testItem = getTestItemInfo(code);
        return (
          <div key={code}>
            <div className="flex items-baseline gap-2 mb-2 px-1">
              <span className="font-bold text-gray-800 text-sm">{testItem.label}</span>
              {testItem.description && (
                <span className="text-xs text-gray-400">{testItem.description}</span>
              )}
            </div>

            <div className="space-y-2">
              {list.map((r, i) => {
                const d = normalizeGradExamRecord(r);
                const passFailLabel = getPassFailLabel(d.passFail);
                const isPass = d.passFail === "1";

                const details: string[] = [];
                if (d.applicationDate) details.push(`신청 ${d.applicationDate}`);
                if (d.examDate) details.push(`응시 ${d.examDate}`);
                if (d.passingDate) details.push(`처리 ${d.passingDate}`);
                if (d.score) details.push(`점수 ${d.score}`);
                if (d.attendance) details.push(d.attendance);

                return (
                  <div key={i} className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-gray-700 text-sm">{d.semester}</span>
                      {d.passFail && (
                        <span
                          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                            isPass ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                          }`}
                        >
                          {passFailLabel}
                        </span>
                      )}
                    </div>

                    {details.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {details.map((line) => (
                          <span key={line}>{line}</span>
                        ))}
                      </div>
                    )}

                    {d.remark && (
                      <div className="mt-1.5 text-xs text-gray-400">비고: {d.remark}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
