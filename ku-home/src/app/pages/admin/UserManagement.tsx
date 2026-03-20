import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Search,
  Plus,
  Shield,
  User,
  Users,
  Wrench,
  GraduationCap,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  Mail,
  Phone,
  Building2,
  KeyRound,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'admin' | 'staff' | 'housekeeping' | 'personnel' | 'guest';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: Role;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES: { value: Role; label: string; description: string; icon: React.ReactNode; color: string; bg: string }[] = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access + discount code management',
    icon: <Shield className="w-4 h-4" />,
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'Dashboard, booking, check-in/out, reports',
    icon: <KeyRound className="w-4 h-4" />,
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    value: 'housekeeping',
    label: 'Housekeeping',
    description: 'Housekeeping module only',
    icon: <Wrench className="w-4 h-4" />,
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
  {
    value: 'personnel',
    label: 'KU Personnel',
    description: 'Online booking at special rates',
    icon: <GraduationCap className="w-4 h-4" />,
    color: 'text-[#006b54]',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  {
    value: 'guest',
    label: 'Guest',
    description: 'Online booking at standard rates',
    icon: <User className="w-4 h-4" />,
    color: 'text-gray-700',
    bg: 'bg-gray-50 border-gray-200',
  },
];

const ROLE_MAP = Object.fromEntries(ROLES.map((r) => [r.value, r]));

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: UserRecord[] = [
  { id: '1', name: 'Somchai Rakdee', email: 'somchai@ku.th', phone: '081-234-5678', department: 'IT Department', role: 'admin', createdAt: '2024-01-15', lastLogin: '2025-03-18', isActive: true },
  { id: '2', name: 'Nanthida Prom', email: 'nanthida@ku.th', phone: '082-345-6789', department: 'Front Desk', role: 'staff', createdAt: '2024-02-10', lastLogin: '2025-03-19', isActive: true },
  { id: '3', name: 'Malee Srisuk', email: 'malee@ku.th', phone: '083-456-7890', role: 'staff', createdAt: '2024-02-10', lastLogin: '2025-03-17', isActive: true },
  { id: '4', name: 'Boonsong Jantra', email: 'boonsong@ku.th', phone: '084-567-8901', role: 'housekeeping', createdAt: '2024-03-01', lastLogin: '2025-03-18', isActive: true },
  { id: '5', name: 'Wanphen Siriwong', email: 'wanphen@ku.th', phone: '085-678-9012', role: 'housekeeping', createdAt: '2024-03-01', lastLogin: '2025-03-15', isActive: true },
  { id: '6', name: 'Dr. Prasit Chaiyakul', email: 'prasit@ku.ac.th', phone: '086-789-0123', department: 'Faculty of Engineering', role: 'personnel', createdAt: '2024-04-05', lastLogin: '2025-03-10', isActive: true },
  { id: '7', name: 'Assoc. Prof. Sunisa Meechai', email: 'sunisa@ku.ac.th', department: 'Faculty of Science', role: 'personnel', createdAt: '2024-04-12', lastLogin: '2025-02-28', isActive: true },
  { id: '8', name: 'John Smith', email: 'john.smith@gmail.com', phone: '087-890-1234', role: 'guest', createdAt: '2024-05-20', lastLogin: '2025-01-15', isActive: true },
  { id: '9', name: 'Kanokwan Thongdee', email: 'kanokwan@gmail.com', role: 'guest', createdAt: '2024-06-01', lastLogin: '2025-03-05', isActive: false },
  { id: '10', name: 'Rattana Phakdee', email: 'rattana@ku.th', phone: '088-901-2345', department: 'Finance Division', role: 'personnel', createdAt: '2024-07-14', lastLogin: '2025-03-12', isActive: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
  const r = ROLE_MAP[role];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${r.bg} ${r.color}`}>
      {r.icon}
      {r.label}
    </span>
  );
}

function StatCard({ label, count, icon, color }: { label: string; count: number; icon: React.ReactNode; color: string }) {
  return (
    <div className={`rounded-xl p-4 border ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </div>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({
  user,
  onClose,
  onSave,
}: {
  user: Partial<UserRecord> | null;
  onClose: () => void;
  onSave: (u: Partial<UserRecord>) => void;
}) {
  const isNew = !user?.id;
  const [form, setForm] = useState<Partial<UserRecord>>(
    user ?? { role: 'guest', isActive: true }
  );

  const update = (patch: Partial<UserRecord>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#006b54] px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">
            {isNew ? 'Add New User' : 'Edit User'}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
            <Input
              value={form.name ?? ''}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Somchai Rakdee"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              <Mail className="w-3.5 h-3.5 inline mr-1" />Email *
            </label>
            <Input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="e.g. name@ku.th"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              <Phone className="w-3.5 h-3.5 inline mr-1" />Phone
            </label>
            <Input
              value={form.phone ?? ''}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="e.g. 081-234-5678"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              <Building2 className="w-3.5 h-3.5 inline mr-1" />Department / Faculty
            </label>
            <Input
              value={form.department ?? ''}
              onChange={(e) => update({ department: e.target.value })}
              placeholder="e.g. Faculty of Engineering"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role *</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.role === r.value
                      ? 'border-[#006b54] bg-[#006b54]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={form.role === r.value}
                    onChange={() => update({ role: r.value })}
                    className="mt-0.5 accent-[#006b54]"
                  />
                  <div className="flex-1">
                    <div className={`flex items-center gap-1.5 font-semibold text-sm ${r.color}`}>
                      {r.icon} {r.label}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Account Active</p>
              <p className="text-xs text-gray-500">Inactive users cannot log in</p>
            </div>
            <button
              onClick={() => update({ isActive: !form.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.isActive ? 'bg-[#006b54]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isNew && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              A temporary password will be sent to the user's email automatically.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            className="bg-[#006b54] hover:bg-[#005a46]"
            onClick={() => {
              if (!form.name || !form.email) {
                toast.error('Name and email are required');
                return;
              }
              onSave(form);
            }}
          >
            <Check className="w-4 h-4 mr-1.5" />
            {isNew ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ user, onCancel, onConfirm }: { user: UserRecord; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Delete User</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [modalUser, setModalUser] = useState<Partial<UserRecord> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // ── Derived ──
  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department ?? '').toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = ROLES.reduce(
    (acc, r) => ({ ...acc, [r.value]: users.filter((u) => u.role === r.value).length }),
    {} as Record<Role, number>
  );

  // ── Handlers ──
  const handleSave = (form: Partial<UserRecord>) => {
    if (form.id) {
      setUsers((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...form } as UserRecord : u)));
      toast.success('User updated successfully');
    } else {
      const newUser: UserRecord = {
        id: String(Date.now()),
        name: form.name!,
        email: form.email!,
        phone: form.phone,
        department: form.department,
        role: form.role ?? 'guest',
        isActive: form.isActive ?? true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success('User created successfully');
    }
    setModalUser(undefined);
  };

  const handleDelete = (user: UserRecord) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setDeleteTarget(null);
    toast.success(`${user.name} has been deleted`);
  };

  const handleToggleActive = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Admin Portal
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 mt-1">Manage accounts and role permissions</p>
            </div>
            <Button
              className="bg-[#006b54] hover:bg-[#005a46] self-start md:self-auto"
              onClick={() => setModalUser(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
            <StatCard
              label="Admin"
              count={counts.admin ?? 0}
              icon={<Shield className="w-7 h-7" />}
              color="bg-red-50 border-red-200 text-red-800"
            />
            <StatCard
              label="Staff"
              count={counts.staff ?? 0}
              icon={<KeyRound className="w-7 h-7" />}
              color="bg-blue-50 border-blue-200 text-blue-800"
            />
            <StatCard
              label="Housekeeping"
              count={counts.housekeeping ?? 0}
              icon={<Wrench className="w-7 h-7" />}
              color="bg-orange-50 border-orange-200 text-orange-800"
            />
            <StatCard
              label="KU Personnel"
              count={counts.personnel ?? 0}
              icon={<GraduationCap className="w-7 h-7" />}
              color="bg-emerald-50 border-emerald-200 text-emerald-800"
            />
            <StatCard
              label="Guest"
              count={counts.guest ?? 0}
              icon={<Users className="w-7 h-7" />}
              color="bg-gray-100 border-gray-200 text-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* ── Filters ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {(['all', ...ROLES.map((r) => r.value)] as (Role | 'all')[]).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  roleFilter === r
                    ? 'bg-[#006b54] text-white border-[#006b54]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {r === 'all' ? 'All' : ROLE_MAP[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Department</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Last Login</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No users found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* User info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#006b54] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-gray-600 text-sm">{u.department ?? '—'}</span>
                      </td>

                      {/* Last login */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-gray-500 text-xs">
                          {u.lastLogin
                            ? new Date(u.lastLogin).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </span>
                      </td>

                      {/* Status toggle */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(u.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            u.isActive ? 'bg-[#006b54]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              u.isActive ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <span className={`ml-2 text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions menu */}
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenuId === u.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40 overflow-hidden">
                                <button
                                  onClick={() => {
                                    setModalUser(u);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-400" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget(u);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500 bg-gray-50">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>

        {/* ── Role legend ── */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#006b54]" /> Role Permissions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ROLES.map((r) => (
              <div key={r.value} className={`rounded-xl border p-3 ${r.bg}`}>
                <div className={`flex items-center gap-1.5 font-bold text-sm mb-1 ${r.color}`}>
                  {r.icon} {r.label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modalUser !== undefined && (
        <UserModal
          user={modalUser}
          onClose={() => setModalUser(undefined)}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          user={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget)}
        />
      )}
    </div>
  );
}