import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, Search, Plus, Shield, User, Users, Wrench,
  GraduationCap, MoreVertical, Edit2, Trash2, X, Check,
  Mail, Phone, Building2, KeyRound, AlertCircle, Filter,
  UserCheck, UserX, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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

// ─── Config ───────────────────────────────────────────────────────────────────
const ROLES: {
  value: Role; label: string; description: string;
  icon: React.ReactNode; color: string; bg: string; dot: string;
}[] = [
  { value: 'admin',        label: 'Admin',        description: 'Full access + discount code management',    icon: <Shield className="w-3.5 h-3.5" />,       color: 'text-rose-700',    bg: 'bg-rose-50',    dot: 'bg-rose-500' },
  { value: 'staff',        label: 'Staff',        description: 'Dashboard, booking, check-in/out, reports', icon: <KeyRound className="w-3.5 h-3.5" />,      color: 'text-blue-700',    bg: 'bg-blue-50',    dot: 'bg-blue-500' },
  { value: 'housekeeping', label: 'Housekeeping', description: 'Housekeeping module only',                   icon: <Wrench className="w-3.5 h-3.5" />,        color: 'text-amber-700',   bg: 'bg-amber-50',   dot: 'bg-amber-400' },
  { value: 'personnel',    label: 'KU Personnel', description: 'Online booking at special rates',            icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  { value: 'guest',        label: 'Guest',        description: 'Online booking at standard rates',           icon: <User className="w-3.5 h-3.5" />,          color: 'text-gray-600',    bg: 'bg-gray-100',   dot: 'bg-gray-400' },
];

const ROLE_MAP = Object.fromEntries(ROLES.map(r => [r.value, r]));

const AVATAR_BG: Record<Role, string> = {
  admin: 'bg-rose-500', staff: 'bg-blue-500',
  housekeeping: 'bg-amber-400', personnel: 'bg-emerald-600', guest: 'bg-gray-400',
};

const MOCK_USERS: UserRecord[] = [
  { id: '1',  name: 'Somchai Rakdee',           email: 'somchai@ku.th',        phone: '081-234-5678', department: 'IT Department',          role: 'admin',        createdAt: '2024-01-15', lastLogin: '2025-03-18', isActive: true },
  { id: '2',  name: 'Nanthida Prom',            email: 'nanthida@ku.th',       phone: '082-345-6789', department: 'Front Desk',             role: 'staff',        createdAt: '2024-02-10', lastLogin: '2025-03-19', isActive: true },
  { id: '3',  name: 'Malee Srisuk',             email: 'malee@ku.th',          phone: '083-456-7890',                                       role: 'staff',        createdAt: '2024-02-10', lastLogin: '2025-03-17', isActive: true },
  { id: '4',  name: 'Boonsong Jantra',          email: 'boonsong@ku.th',       phone: '084-567-8901',                                       role: 'housekeeping', createdAt: '2024-03-01', lastLogin: '2025-03-18', isActive: true },
  { id: '5',  name: 'Wanphen Siriwong',         email: 'wanphen@ku.th',        phone: '085-678-9012',                                       role: 'housekeeping', createdAt: '2024-03-01', lastLogin: '2025-03-15', isActive: true },
  { id: '6',  name: 'Dr. Prasit Chaiyakul',     email: 'prasit@ku.ac.th',      phone: '086-789-0123', department: 'Faculty of Engineering', role: 'personnel',    createdAt: '2024-04-05', lastLogin: '2025-03-10', isActive: true },
  { id: '7',  name: 'Assoc. Prof. Sunisa',      email: 'sunisa@ku.ac.th',                             department: 'Faculty of Science',     role: 'personnel',    createdAt: '2024-04-12', lastLogin: '2025-02-28', isActive: true },
  { id: '8',  name: 'John Smith',               email: 'john.smith@gmail.com', phone: '087-890-1234',                                       role: 'guest',        createdAt: '2024-05-20', lastLogin: '2025-01-15', isActive: true },
  { id: '9',  name: 'Kanokwan Thongdee',        email: 'kanokwan@gmail.com',                                                                role: 'guest',        createdAt: '2024-06-01', lastLogin: '2025-03-05', isActive: false },
  { id: '10', name: 'Rattana Phakdee',          email: 'rattana@ku.th',        phone: '088-901-2345', department: 'Finance Division',       role: 'personnel',    createdAt: '2024-07-14', lastLogin: '2025-03-12', isActive: true },
];

// ─── Shared ───────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
  const r = ROLE_MAP[role];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${r.bg} ${r.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
      {r.icon}
      {r.label}
    </span>
  );
}

function UserAvatar({ name, role, size = 'md' }: { name: string; role: Role; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('');
  return (
    <div className={`${sizes[size]} ${AVATAR_BG[role]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 select-none`}>
      {initials}
    </div>
  );
}

// ─── User Modal ───────────────────────────────────────────────────────────────
function UserModal({ user, onClose, onSave }: {
  user: Partial<UserRecord> | null;
  onClose: () => void;
  onSave: (u: Partial<UserRecord>) => void;
}) {
  const isNew = !user?.id;
  const [form, setForm] = useState<Partial<UserRecord>>(user ?? { role: 'guest', isActive: true });
  const update = (patch: Partial<UserRecord>) => setForm(f => ({ ...f, ...patch }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden">
        <div className="bg-[#006b54] px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{isNew ? 'Add New User' : 'Edit User'}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name *</label>
            <Input value={form.name ?? ''} onChange={e => update({ name: e.target.value })} placeholder="e.g. Somchai Rakdee" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
              <Mail className="w-3.5 h-3.5 inline mr-1" />Email *
            </label>
            <Input type="email" value={form.email ?? ''} onChange={e => update({ email: e.target.value })} placeholder="name@ku.th" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                <Phone className="w-3.5 h-3.5 inline mr-1" />Phone
              </label>
              <Input value={form.phone ?? ''} onChange={e => update({ phone: e.target.value })} placeholder="081-234-5678" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                <Building2 className="w-3.5 h-3.5 inline mr-1" />Dept.
              </label>
              <Input value={form.department ?? ''} onChange={e => update({ department: e.target.value })} placeholder="Faculty..." />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role *</label>
            <div className="space-y-2">
              {ROLES.map(r => (
                <label key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.role === r.value ? 'border-[#006b54] bg-[#006b54]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={() => update({ role: r.value })} className="accent-[#006b54]" />
                  <div className={`flex items-center gap-1.5 font-semibold text-sm ${r.color}`}>{r.icon} {r.label}</div>
                  <p className="text-xs text-gray-400 ml-auto hidden sm:block truncate max-w-[160px]">{r.description}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Account Active</p>
              <p className="text-xs text-gray-500">Inactive users cannot log in</p>
            </div>
            <button onClick={() => update({ isActive: !form.isActive })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-[#006b54]' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {isNew && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              A temporary password will be sent to the user's email automatically.
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-[#006b54] hover:bg-[#005a46]" onClick={() => {
            if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
            onSave(form);
          }}>
            <Check className="w-4 h-4 mr-1.5" />
            {isNew ? 'Create' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ user, onCancel, onConfirm }: { user: UserRecord; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Delete User</h3>
        <p className="text-sm text-gray-500 mb-6">Remove <strong>{user.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile: Expandable Card ──────────────────────────────────────────────────
function UserMobileCard({ user, onEdit, onDelete, onToggleActive }: {
  user: UserRecord; onEdit: () => void; onDelete: () => void; onToggleActive: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${user.isActive ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
      {/* Collapsed row */}
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setExpanded(e => !e)}>
        <UserAvatar name={user.name} role={user.role} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
            {!user.isActive && (
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Off</span>
            )}
          </div>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <RoleBadge role={user.role} />
        <span className="text-gray-400 flex-shrink-0 ml-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {user.phone && (
              <div>
                <p className="text-gray-400 mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                <p className="font-medium text-gray-700">{user.phone}</p>
              </div>
            )}
            {user.department && (
              <div>
                <p className="text-gray-400 mb-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" /> Dept.</p>
                <p className="font-medium text-gray-700 truncate">{user.department}</p>
              </div>
            )}
            {user.lastLogin && (
              <div>
                <p className="text-gray-400 mb-0.5">Last Login</p>
                <p className="font-medium text-gray-700">
                  {new Date(user.lastLogin).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            <div>
              <p className="text-gray-400 mb-0.5">Status</p>
              <span className={`font-semibold ${user.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={onToggleActive} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              {user.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
            </button>
            <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#006b54] text-xs font-semibold text-[#006b54] hover:bg-[#006b54]/5 transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={onDelete} className="flex items-center justify-center px-3 py-2 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Desktop: Table Row ───────────────────────────────────────────────────────
function UserTableRow({ user, onEdit, onDelete, onToggleActive }: {
  user: UserRecord; onEdit: () => void; onDelete: () => void; onToggleActive: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <tr className={`group border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${!user.isActive ? 'bg-gray-50/60 opacity-80' : ''}`}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} role={user.role} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
              {!user.isActive && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full flex-shrink-0">Inactive</span>}
            </div>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5"><RoleBadge role={user.role} /></td>
      <td className="px-5 py-3.5 hidden lg:table-cell">
        {user.department
          ? <div className="flex items-center gap-1.5 text-sm text-gray-600"><Building2 className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" /><span className="truncate max-w-[160px]">{user.department}</span></div>
          : <span className="text-gray-300 text-sm">—</span>}
      </td>
      <td className="px-5 py-3.5 hidden xl:table-cell">
        {user.lastLogin
          ? <div><p className="text-xs font-medium text-gray-700">{new Date(user.lastLogin).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p><p className="text-[10px] text-gray-400">{new Date(user.lastLogin).getFullYear()}</p></div>
          : <span className="text-gray-300 text-xs">Never</span>}
      </td>
      <td className="px-5 py-3.5">
        <button onClick={onToggleActive} className={`flex items-center gap-2 text-xs font-semibold transition-colors ${user.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${user.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${user.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <span className="hidden md:inline">{user.isActive ? 'Active' : 'Inactive'}</span>
        </button>
      </td>
      <td className="px-4 py-3.5">
        <div className="relative flex items-center justify-end">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 w-36 overflow-hidden">
                <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit</button>
                <button onClick={() => { onToggleActive(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  {user.isActive ? <><UserX className="w-3.5 h-3.5 text-gray-400" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5 text-gray-400" /> Activate</>}
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [modalUser, setModalUser] = useState<Partial<UserRecord> | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.department ?? '').toLowerCase().includes(q);
    return matchSearch && (roleFilter === 'all' || u.role === roleFilter);
  });

  const counts = ROLES.reduce((acc, r) => ({ ...acc, [r.value]: users.filter(u => u.role === r.value).length }), {} as Record<Role, number>);

  const handleSave = (form: Partial<UserRecord>) => {
    if (form.id) {
      setUsers(prev => prev.map(u => u.id === form.id ? { ...u, ...form } as UserRecord : u));
      toast.success('User updated');
    } else {
      setUsers(prev => [{ id: String(Date.now()), name: form.name!, email: form.email!, phone: form.phone, department: form.department, role: form.role ?? 'guest', isActive: form.isActive ?? true, createdAt: new Date().toISOString().split('T')[0] }, ...prev]);
      toast.success('User created');
    }
    setModalUser(undefined);
  };

  const handleDelete = (user: UserRecord) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setDeleteTarget(null);
    toast.success(`${user.name} deleted`);
  };

  const handleToggleActive = (id: string) => setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 sm:top-20 z-40">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006b54] font-medium mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Admin Portal
          </Link>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 text-sm mt-0.5 hidden sm:block">Manage accounts and role permissions · {users.length} users</p>
            </div>
            <Button className="bg-[#006b54] hover:bg-[#005a46] flex-shrink-0" onClick={() => setModalUser(null)}>
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add User</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4">

        {/* Stat cards — horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 md:grid-cols-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`flex-shrink-0 sm:flex-shrink flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left min-w-[130px] sm:min-w-0 ${roleFilter === 'all' ? 'border-[#006b54] bg-[#006b54]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-none">{users.length}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">All Users</p>
            </div>
          </button>
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => setRoleFilter(roleFilter === r.value ? 'all' : r.value)}
              className={`flex-shrink-0 sm:flex-shrink flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left min-w-[130px] sm:min-w-0 ${roleFilter === r.value ? 'border-[#006b54] bg-[#006b54]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.bg}`}>
                <span className={r.color}>{r.icon}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-none">{counts[r.value] ?? 0}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{r.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search name, email, department…" className="pl-9 bg-gray-50 border-gray-200 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {/* Mobile: filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center gap-1.5 px-3 rounded-lg border text-sm font-semibold transition-colors flex-shrink-0 ${showFilters || roleFilter !== 'all' ? 'bg-[#006b54] text-white border-[#006b54]' : 'border-gray-200 text-gray-600 bg-white'}`}
            >
              <Filter className="w-4 h-4" />
              {roleFilter !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          </div>

          {/* Pills — always show on desktop, toggle on mobile */}
          <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100`}>
            <span className="text-xs text-gray-400 flex items-center gap-1 mr-1 self-center">
              <Filter className="w-3.5 h-3.5" /> Role:
            </span>
            {(['all', ...ROLES.map(r => r.value)] as (Role | 'all')[]).map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${roleFilter === r ? 'bg-[#006b54] text-white border-[#006b54]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {r === 'all' ? 'All' : ROLE_MAP[r].label}
              </button>
            ))}
            {roleFilter !== 'all' && (
              <button onClick={() => setRoleFilter('all')} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 ml-auto self-center">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* MOBILE: Card list */}
        <div className="block md:hidden space-y-2">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-14 text-center">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-500 text-sm">No users found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          ) : filtered.map(u => (
            <UserMobileCard key={u.id} user={u}
              onEdit={() => setModalUser(u)}
              onDelete={() => setDeleteTarget(u)}
              onToggleActive={() => handleToggleActive(u.id)}
            />
          ))}
          <p className="text-center text-xs text-gray-400 pt-1">{filtered.length} of {users.length} users</p>
        </div>

        {/* DESKTOP: Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Department</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Last Login</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="font-semibold text-gray-500">No users found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
                    </td>
                  </tr>
                ) : filtered.map(u => (
                  <UserTableRow key={u.id} user={u}
                    onEdit={() => setModalUser(u)}
                    onDelete={() => setDeleteTarget(u)}
                    onToggleActive={() => handleToggleActive(u.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
            <span>Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of <span className="font-semibold text-gray-600">{users.length}</span> users</span>
            {roleFilter !== 'all' && (
              <button onClick={() => setRoleFilter('all')} className="text-[#006b54] hover:text-[#005a46] font-semibold flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Role legend */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#006b54]" /> Role Permissions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {ROLES.map(r => (
              <div key={r.value} className={`rounded-xl p-3 ${r.bg}`}>
                <div className={`flex items-center gap-1.5 font-bold text-xs sm:text-sm mb-1 ${r.color}`}>{r.icon} {r.label}</div>
                <p className="text-xs text-gray-500 leading-relaxed hidden sm:block">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      {modalUser !== undefined && <UserModal user={modalUser} onClose={() => setModalUser(undefined)} onSave={handleSave} />}
      {deleteTarget && <DeleteConfirm user={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} />}
    </div>
  );
}