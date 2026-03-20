import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft, Tag, Plus, Copy, Check, Trash2, Calendar,
  Percent, DollarSign, ToggleLeft, ToggleRight, Search, X,
} from "lucide-react";
import { toast } from "sonner";
import { DiscountCode } from "../../../models/Payment.ts";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_CODES: DiscountCode[] = [
  {
    id: "1",
    code: "KU2025",
    discountPercent: 10,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    isActive: true,
    createdBy: "admin",
    usageCount: 24,
  },
  {
    id: "2",
    code: "STAFF50",
    discountAmount: 500,
    validFrom: "2025-03-01",
    validUntil: "2025-06-30",
    isActive: true,
    createdBy: "admin",
    usageCount: 8,
  },
  {
    id: "3",
    code: "SUMMER15",
    discountPercent: 15,
    validFrom: "2025-04-01",
    validUntil: "2025-05-31",
    isActive: false,
    createdBy: "admin",
    usageCount: 3,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

function isExpired(validUntil: string) {
  return new Date(validUntil) < new Date();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Create modal ─────────────────────────────────────────────────────────────
interface CreateModalProps {
  onClose: () => void;
  onSave: (code: Omit<DiscountCode, "id" | "usageCount">) => void;
}

function CreateModal({ onClose, onSave }: CreateModalProps) {
  const [form, setForm] = useState({
    code: "",
    type: "percent" as "percent" | "amount",
    discountPercent: "",
    discountAmount: "",
    validFrom: today(),
    validUntil: "",
    isActive: true,
  });
  const [error, setError] = useState("");

  const update = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const handleSubmit = () => {
    if (!form.code.trim()) return setError("กรุณากรอกรหัสส่วนลด");
    if (!form.validUntil) return setError("กรุณาระบุวันที่หมดอายุ");
    if (form.validUntil <= form.validFrom) return setError("วันหมดอายุต้องมาหลังวันที่สร้าง");
    if (form.type === "percent" && (!form.discountPercent || +form.discountPercent <= 0 || +form.discountPercent > 100))
      return setError("กรุณากรอกเปอร์เซ็นต์ส่วนลด 1–100");
    if (form.type === "amount" && (!form.discountAmount || +form.discountAmount <= 0))
      return setError("กรุณากรอกจำนวนเงินส่วนลด");

    setError("");
    onSave({
      code: form.code.toUpperCase().trim(),
      ...(form.type === "percent"
        ? { discountPercent: +form.discountPercent }
        : { discountAmount: +form.discountAmount }),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      isActive: form.isActive,
      createdBy: "admin",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#006b54] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-white font-bold text-lg">สร้างรหัสส่วนลดใหม่</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Code */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              รหัสส่วนลด *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={e => update({ code: e.target.value.toUpperCase() })}
              placeholder="เช่น SUMMER2025"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:ring-2 focus:ring-[#006b54] outline-none tracking-widest"
            />
          </div>

          {/* Discount type */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              ประเภทส่วนลด *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => update({ type: "percent" })}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  form.type === "percent"
                    ? "border-[#006b54] bg-[#006b54]/5 text-[#006b54]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Percent className="w-4 h-4" /> ลดเป็นเปอร์เซ็นต์
              </button>
              <button
                onClick={() => update({ type: "amount" })}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  form.type === "amount"
                    ? "border-[#006b54] bg-[#006b54]/5 text-[#006b54]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <DollarSign className="w-4 h-4" /> ลดเป็นจำนวนเงิน
              </button>
            </div>
          </div>

          {/* Discount value */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              {form.type === "percent" ? "จำนวน (%)" : "จำนวนเงิน (฿)"} *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                {form.type === "percent" ? "%" : "฿"}
              </span>
              <input
                type="number"
                min={1}
                max={form.type === "percent" ? 100 : undefined}
                value={form.type === "percent" ? form.discountPercent : form.discountAmount}
                onChange={e =>
                  form.type === "percent"
                    ? update({ discountPercent: e.target.value })
                    : update({ discountAmount: e.target.value })
                }
                placeholder={form.type === "percent" ? "1 – 100" : "500"}
                className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" /> วันที่สร้าง
              </label>
              <input
                type="date"
                value={form.validFrom}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">กำหนดเป็นวันปัจจุบัน</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" /> วันหมดอายุ *
              </label>
              <input
                type="date"
                min={today()}
                value={form.validUntil}
                onChange={e => update({ validUntil: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006b54] outline-none"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">เปิดใช้งานทันที</p>
              <p className="text-xs text-gray-500">โค้ดจะสามารถใช้ได้ทันทีหลังสร้าง</p>
            </div>
            <button
              onClick={() => update({ isActive: !form.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isActive ? "bg-[#006b54]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 font-medium">
              {error}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#006b54] hover:bg-[#005a46] text-white text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> สร้างรหัสส่วนลด
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Code row ─────────────────────────────────────────────────────────────────
function CodeRow({
  code,
  onToggle,
  onDelete,
}: {
  code: DiscountCode;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const expired = isExpired(code.validUntil);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(`คัดลอก "${code.code}" แล้ว`);
  };

  const statusLabel = expired
    ? { text: "หมดอายุ", cls: "bg-gray-100 text-gray-500" }
    : code.isActive
    ? { text: "ใช้งานได้", cls: "bg-green-100 text-green-700" }
    : { text: "ปิดใช้งาน", cls: "bg-orange-100 text-orange-700" };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
      {/* Code */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-gray-900 tracking-widest text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
            {code.code}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#006b54] hover:bg-[#006b54]/5 transition-colors"
            title="คัดลอก"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>

      {/* Discount */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5">
          {code.discountPercent != null ? (
            <>
              <Percent className="w-3.5 h-3.5 text-[#006b54]" />
              <span className="font-bold text-[#006b54]">{code.discountPercent}%</span>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-[#006b54]">฿{code.discountAmount?.toLocaleString()}</span>
            </>
          )}
        </div>
      </td>

      {/* Dates */}
      <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">
        {formatDate(code.validFrom)}
      </td>
      <td className="px-5 py-4 text-sm hidden md:table-cell">
        <span className={expired ? "text-red-500 font-medium" : "text-gray-600"}>
          {formatDate(code.validUntil)}
        </span>
      </td>

      {/* Usage */}
      <td className="px-5 py-4 hidden lg:table-cell">
        <span className="text-sm text-gray-500">{code.usageCount ?? 0} ครั้ง</span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusLabel.cls}`}>
          {statusLabel.text}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-1">
          {!expired && (
            <button
              onClick={() => onToggle(code.id)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#006b54] hover:bg-[#006b54]/5 transition-colors"
              title={code.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
            >
              {code.isActive
                ? <ToggleRight className="w-5 h-5 text-[#006b54]" />
                : <ToggleLeft className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => onDelete(code.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="ลบ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function DiscountCodePage() {
  const [codes, setCodes] = useState<DiscountCode[]>(MOCK_CODES);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = codes.filter(c => {
    const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase());
    const expired = isExpired(c.validUntil);
    const matchFilter =
      filter === "all" ||
      (filter === "active" && c.isActive && !expired) ||
      (filter === "inactive" && !c.isActive && !expired) ||
      (filter === "expired" && expired);
    return matchSearch && matchFilter;
  });

  const handleSave = (newCode: Omit<DiscountCode, "id" | "usageCount">) => {
    setCodes(prev => [
      { ...newCode, id: String(Date.now()), usageCount: 0 },
      ...prev,
    ]);
    setShowModal(false);
    toast.success(`สร้างรหัส "${newCode.code}" สำเร็จ`);
  };

  const handleToggle = (id: string) => {
    setCodes(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDelete = (id: string) => {
    const code = codes.find(c => c.id === id);
    setCodes(prev => prev.filter(c => c.id !== id));
    setDeleteTarget(null);
    toast.success(`ลบรหัส "${code?.code}" แล้ว`);
  };

  const activeCount = codes.filter(c => c.isActive && !isExpired(c.validUntil)).length;
  const expiredCount = codes.filter(c => isExpired(c.validUntil)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-5">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-3 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Admin Portal
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-6 h-6 text-[#006b54]" /> รหัสส่วนลด
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">สร้างและจัดการรหัสส่วนลดสำหรับลูกค้า</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#006b54] hover:bg-[#005a46] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> สร้างรหัสใหม่
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold">ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{codes.length}</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-3 border border-green-200">
              <p className="text-xs text-green-600 uppercase font-semibold">ใช้งานได้</p>
              <p className="text-2xl font-bold text-green-700 mt-0.5">{activeCount}</p>
            </div>
            <div className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase font-semibold">หมดอายุ</p>
              <p className="text-2xl font-bold text-gray-500 mt-0.5">{expiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="ค้นหารหัสส่วนลด…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#006b54] outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "active", "inactive", "expired"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  filter === f
                    ? "bg-[#006b54] text-white border-[#006b54]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {{ all: "ทั้งหมด", active: "ใช้งานได้", inactive: "ปิดใช้งาน", expired: "หมดอายุ" }[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">รหัส</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">ส่วนลด</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">วันที่สร้าง</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">วันหมดอายุ</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">การใช้งาน</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">สถานะ</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">ไม่พบรหัสส่วนลด</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(code => (
                    <CodeRow
                      key={code.id}
                      code={code}
                      onToggle={handleToggle}
                      onDelete={id => setDeleteTarget(id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50">
            แสดง {filtered.length} จาก {codes.length} รหัส
          </div>
        </div>
      </div>

      {/* Create modal */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">ลบรหัสส่วนลด</h3>
            <p className="text-sm text-gray-500 mb-6">
              คุณแน่ใจหรือไม่? รหัส{" "}
              <strong className="font-mono">
                {codes.find(c => c.id === deleteTarget)?.code}
              </strong>{" "}
              จะถูกลบถาวร
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}