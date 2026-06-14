import { InfoSection } from "../../data/examInfo";

interface InfoSectionCardProps {
  section: InfoSection;
  color: string;
}

export default function InfoSectionCard({ section, color }: InfoSectionCardProps) {
  const dotColor =
    color === "blue"
      ? "bg-blue-500"
      : color === "amber"
      ? "bg-amber-500"
      : "bg-green-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        {section.title}
      </h3>
      <ul className="space-y-2">
        {section.items.map((item, ii) => (
          <li
            key={ii}
            className={`text-sm leading-relaxed flex items-start gap-2 ${
              item.startsWith("※") ? "text-red-600 font-medium" : "text-gray-700"
            }`}
          >
            {!item.startsWith("※") && (
              <span className="text-gray-300 mt-1 flex-shrink-0">•</span>
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
