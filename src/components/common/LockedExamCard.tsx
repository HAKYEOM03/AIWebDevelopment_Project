interface LockedExamCardProps {
  icon: string;
  name: string;
  message?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

/** 잠긴(준비중) 시험의 내용 자리에 대신 보여주는 안내 카드. 관리자 화면에서는 버튼으로 해제할 수 있다. */
export default function LockedExamCard({
  icon,
  name,
  message = "준비중입니다.",
  buttonLabel,
  onButtonClick,
}: LockedExamCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8 w-full max-w-sm mx-auto text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-lg font-bold text-gray-800 mb-2">{name}</div>
      <p className="text-gray-500 text-sm">{message}</p>
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="mt-6 w-full bg-blue-700 text-white py-2.5 rounded-xl font-bold hover:bg-blue-800 transition-colors"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
