import { useExamData } from "../../context/ExamDataContext";

/** 관리자 설정이 어디에 저장되는지 + 저장 실패 안내 */
export default function SettingsStatus() {
  const { settingsSource, settingsError, clearSettingsError } = useExamData();

  return (
    <div className="mb-6 space-y-2">
      <p className={`text-xs ${settingsSource === "server" ? "text-green-700" : "text-amber-700"}`}>
        {settingsSource === "server"
          ? "✓ 잠금·날짜·소개 내용은 서버에 저장되어 모든 학생에게 똑같이 적용됩니다."
          : "⚠ 서버에 연결되지 않아 잠금·날짜·소개 내용이 이 브라우저에만 저장됩니다. 학생 화면에는 적용되지 않습니다."}
      </p>
      {settingsError && (
        <div className="flex items-start justify-between gap-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <span>{settingsError} (바꾸기 전 값으로 되돌렸습니다.)</span>
          <button onClick={clearSettingsError} className="shrink-0 text-red-400 hover:text-red-600" aria-label="닫기">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
