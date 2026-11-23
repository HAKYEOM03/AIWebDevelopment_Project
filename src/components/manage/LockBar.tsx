interface LockBarProps {
  /** 무엇을 잠그는지 (예: "성경 졸업 시험 D-DAY") */
  title: string;
  locked: boolean;
  lockedHint: string;
  openHint: string;
  onChange: (locked: boolean) => void;
}

/** 관리자용 잠금 상태 표시 + 잠그기/해제 버튼 */
export default function LockBar({ title, locked, lockedHint, openHint, onChange }: LockBarProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 flex-wrap rounded-xl border px-4 py-3 mb-5 ${
        locked ? "bg-gray-100 border-gray-200" : "bg-green-50 border-green-200"
      }`}
    >
      <div>
        <div className="text-sm font-bold text-gray-800">
          {locked ? "🔒" : "🔓"} {title} — {locked ? "잠김" : "공개 중"}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{locked ? lockedHint : openHint}</p>
      </div>
      <button
        onClick={() => onChange(!locked)}
        className={`px-5 py-2 rounded-full text-sm font-bold text-white transition-colors ${
          locked ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-500 hover:bg-gray-600"
        }`}
      >
        {locked ? "해제" : "잠그기"}
      </button>
    </div>
  );
}
