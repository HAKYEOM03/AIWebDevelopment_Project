interface TimeUpScreenProps {
  testLabel: string;
  onRetry: () => void;
  onBackToList: () => void;
}

/** 시간 초과 시 표시되는 전체 화면 */
export default function TimeUpScreen({
  testLabel,
  onRetry,
  onBackToList,
}: TimeUpScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">⏰</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">시간 초과!</h2>
        <p className="text-gray-500 mb-2">
          {testLabel} 제한 시간이 종료되었습니다.
        </p>
        <p className="text-red-500 font-semibold mb-8">재시도 하세요</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-700 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition"
          >
            처음부터 다시 풀기
          </button>
          <button
            onClick={onBackToList}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
          >
            파트 목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
