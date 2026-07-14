import { useState, useContext, useEffect } from "react";
import { ExamDataContext, ExamIntroContent } from "../../context/ExamDataContext";
import { examInfoList } from "../../data/examInfo";

function cloneContent(content: ExamIntroContent): ExamIntroContent {
  return {
    ...content,
    requirements: [...content.requirements],
    infoSections: content.infoSections.map((s) => ({ ...s, items: [...s.items] })),
  };
}

/** 졸업 시험별 소개 내용(신청기간·장소·준비물·상세안내 등)을 추가/수정/삭제하는 관리 컴포넌트 */
export default function IntroContentManager() {
  const examData = useContext(ExamDataContext);
  if (!examData) throw new Error("ExamDataProvider가 필요합니다.");
  const { introContent, updateIntroContent } = examData;

  const [selectedExam, setSelectedExam] = useState(examInfoList[0].id);
  const [draft, setDraft] = useState<ExamIntroContent>(() =>
    cloneContent(introContent[selectedExam])
  );
  const [newRequirement, setNewRequirement] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(cloneContent(introContent[selectedExam]));
    setSaved(false);
  }, [selectedExam]); // eslint-disable-line react-hooks/exhaustive-deps

  const exam = examInfoList.find((e) => e.id === selectedExam)!;

  const handleSave = () => {
    updateIntroContent(selectedExam, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const addRequirement = () => {
    const value = newRequirement.trim();
    if (!value) return;
    setDraft((p) => ({ ...p, requirements: [...p.requirements, value] }));
    setNewRequirement("");
  };

  const removeRequirement = (index: number) => {
    setDraft((p) => ({
      ...p,
      requirements: p.requirements.filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    setDraft((p) => ({
      ...p,
      infoSections: [...p.infoSections, { title: "새 섹션", items: [] }],
    }));
  };

  const removeSection = (sIndex: number) => {
    setDraft((p) => ({
      ...p,
      infoSections: p.infoSections.filter((_, i) => i !== sIndex),
    }));
  };

  const updateSectionTitle = (sIndex: number, title: string) => {
    setDraft((p) => ({
      ...p,
      infoSections: p.infoSections.map((s, i) => (i === sIndex ? { ...s, title } : s)),
    }));
  };

  const addSectionItem = (sIndex: number) => {
    setDraft((p) => ({
      ...p,
      infoSections: p.infoSections.map((s, i) =>
        i === sIndex ? { ...s, items: [...s.items, ""] } : s
      ),
    }));
  };

  const updateSectionItem = (sIndex: number, iIndex: number, value: string) => {
    setDraft((p) => ({
      ...p,
      infoSections: p.infoSections.map((s, i) =>
        i === sIndex
          ? { ...s, items: s.items.map((it, j) => (j === iIndex ? value : it)) }
          : s
      ),
    }));
  };

  const removeSectionItem = (sIndex: number, iIndex: number) => {
    setDraft((p) => ({
      ...p,
      infoSections: p.infoSections.map((s, i) =>
        i === sIndex ? { ...s, items: s.items.filter((_, j) => j !== iIndex) } : s
      ),
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>📝</span> 소개 내용 관리
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        졸업 시험를 선택해 소개 페이지에 표시되는 내용을 수정하고, 저장 버튼을 눌러야
        반영됩니다.
      </p>

      {/* 과목 선택 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {examInfoList.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedExam(e.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedExam === e.id
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {/* 신청 기간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">신청 시작일</label>
            <input
              type="date"
              value={draft.registrationStart}
              onChange={(e) => setDraft((p) => ({ ...p, registrationStart: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">신청 종료일</label>
            <input
              type="date"
              value={draft.registrationEnd}
              onChange={(e) => setDraft((p) => ({ ...p, registrationEnd: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* 장소 / 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시험 장소</label>
            <input
              value={draft.examLocation}
              onChange={(e) => setDraft((p) => ({ ...p, examLocation: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시험 시간</label>
            <input
              value={draft.examTime}
              onChange={(e) => setDraft((p) => ({ ...p, examTime: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* 합격 기준 / 문의 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">합격 기준</label>
          <input
            value={draft.passingScore}
            onChange={(e) => setDraft((p) => ({ ...p, passingScore: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">문의처</label>
          <input
            value={draft.contact}
            onChange={(e) => setDraft((p) => ({ ...p, contact: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* 준비물 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">시험 준비물</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {draft.requirements.map((r, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {r}
                <button
                  onClick={() => removeRequirement(i)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRequirement();
                }
              }}
              placeholder="준비물 입력 후 추가"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={addRequirement}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
            >
              추가
            </button>
          </div>
        </div>

        {/* 상세 안내 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-500">상세 안내 섹션</label>
            <button
              onClick={addSection}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              + 섹션 추가
            </button>
          </div>

          <div className="space-y-4">
            {draft.infoSections.map((section, sIndex) => (
              <div key={sIndex} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    value={section.title}
                    onChange={(e) => updateSectionTitle(sIndex, e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => removeSection(sIndex)}
                    className="text-xs text-gray-400 hover:text-red-500 shrink-0"
                  >
                    섹션 삭제
                  </button>
                </div>

                <div className="space-y-2">
                  {section.items.map((item, iIndex) => (
                    <div key={iIndex} className="flex items-center gap-2">
                      <input
                        value={item}
                        onChange={(e) => updateSectionItem(sIndex, iIndex, e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button
                        onClick={() => removeSectionItem(sIndex, iIndex)}
                        className="text-gray-300 hover:text-red-400 text-xs shrink-0"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSectionItem(sIndex)}
                  className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  + 항목 추가
                </button>
              </div>
            ))}
            {draft.infoSections.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">
                등록된 섹션이 없습니다. "섹션 추가"로 새 안내 섹션을 만들어보세요.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
            saved
              ? "bg-green-100 text-green-700"
              : "bg-blue-700 hover:bg-blue-800 text-white"
          }`}
        >
          {saved ? `저장됨 ✓ (${exam.name})` : `${exam.name} 저장하기`}
        </button>
      </div>
    </div>
  );
}
