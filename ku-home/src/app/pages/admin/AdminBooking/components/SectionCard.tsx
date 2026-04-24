export function SectionCard({
  icon,
  title,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div
        className={`px-6 py-4 flex items-center gap-3 border-b border-gray-100 ${
          accent || "bg-gray-50"
        }`}
      >
        <span className="text-[#006b54]">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
