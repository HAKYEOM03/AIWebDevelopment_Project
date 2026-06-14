import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Notice {
  id: number;
  title: string;
  date: string;
  content?: string;
  important?: boolean;
  examId: string;
}

interface NoticeBoardProps {
  notices: Notice[];
}

const examLabelMap: Record<string, string> = {
  general: "전체",
  english: "영어",
  bible: "성경",
  computer: "컴퓨터",
};

export default function NoticeBoard({ notices }: NoticeBoardProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Notice | null>(null);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">📢</span> 공지사항
        </h2>
        <ul className="divide-y divide-gray-100">
          {notices.map((n) => (
            <li
              key={`${n.examId}-${n.id}`}
              className="py-3 flex items-start gap-3 px-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelected(n)}
            >
              {n.important && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                  중요
                </span>
              )}
              {n.examId !== "general" && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                  {examLabelMap[n.examId]}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {n.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-50">
        <button
          className="text-sm text-blue-600 hover:underline font-medium"
          onClick={() => navigate("/intro")}
        >
          소개 페이지에서 자세히 보기 →
        </button>
      </div>

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
            {/* 모달 헤더 */}
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

            {/* 모달 본문 */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {selected.important && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    중요
                  </span>
                )}
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {examLabelMap[selected.examId] ?? selected.examId}
                </span>
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

            {/* 모달 하단 */}
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
