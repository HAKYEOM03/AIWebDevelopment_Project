import { useContext, useState } from "react";
import { ExamDataContext, ExamNotice } from "../../context/ExamDataContext";

interface NoticeSectionProps {
  examId: string;
}

export default function NoticeSection({ examId }: NoticeSectionProps) {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { notices } = examData;

  const examNotices = notices.filter((n) => n.examId === examId);
  const [selected, setSelected] = useState<ExamNotice | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <span>📢</span> 공지사항
        </h3>
      </div>

      {examNotices.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {examNotices.map((n) => (
            <li
              key={n.id}
              className="py-3.5 flex items-start gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors"
              onClick={() => setSelected(n)}
            >
              {n.important && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                  중요
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 공지사항 모달 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">📢</span>
                <span className="text-white font-bold text-lg">공지사항</span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {selected.important && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    중요
                  </span>
                )}
                <span className="text-xs text-gray-400 ml-auto">{selected.date}</span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">{selected.title}</h3>

              {selected.content ? (
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selected.content}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">
                  추가 내용이 없습니다.
                </p>
              )}
            </div>

            <div className="px-6 pb-5">
              <button
                onClick={() => setSelected(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
