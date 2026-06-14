import { useState, useContext } from "react";
import { ExamDataContext } from "../../context/ExamDataContext";
import { examInfoList } from "../../data/examInfo";

const examOptions = [
  { id: "general", name: "전체 공지" },
  ...examInfoList.map((e) => ({ id: e.id, name: e.name })),
];

const examLabelMap: Record<string, string> = {
  general: "전체",
  ...Object.fromEntries(examInfoList.map((e) => [e.id, e.name])),
};

/** 공지사항을 작성/삭제하면 홈 공지 목록에 즉시 반영되는 관리 컴포넌트 */
export default function NoticeManager() {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { notices, addNotice, deleteNotice } = examData;

  const [form, setForm] = useState({
    examId: "general",
    title: "",
    content: "",
    important: false,
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    addNotice({
      examId: form.examId,
      title: form.title.trim(),
      content: form.content.trim(),
      date: new Date().toISOString().split("T")[0],
      important: form.important,
    });
    setForm({ examId: form.examId, title: "", content: "", important: false });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>📢</span> 공지사항 작성
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        공지를 등록하면 홈 화면의 공지사항 목록에 바로 표시됩니다.
      </p>

      {/* 작성 폼 */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {examOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setForm((p) => ({ ...p, examId: opt.id }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                form.examId === opt.id
                  ? "bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="공지 제목을 입력하세요"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
        <textarea
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="공지 내용을 입력하세요"
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded"
            checked={form.important}
            onChange={(e) => setForm((p) => ({ ...p, important: e.target.checked }))}
          />
          <span className="text-sm text-gray-600">중요 공지로 표시</span>
        </label>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
        >
          공지 등록
        </button>
      </div>

      {/* 등록된 공지 목록 */}
      <h3 className="text-sm font-bold text-gray-700 mb-3">
        등록된 공지 ({notices.length}개)
      </h3>
      {notices.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          아직 등록된 공지가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notices.map((n) => (
            <li key={n.id} className="py-3 flex items-start gap-2">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                {examLabelMap[n.examId] ?? n.examId}
              </span>
              {n.important && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                  중요
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                {n.content && (
                  <p className="text-xs text-gray-500 mt-0.5">{n.content}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
              <button
                onClick={() => deleteNotice(n.id)}
                className="text-gray-300 hover:text-red-400 text-xs shrink-0 transition-colors"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
