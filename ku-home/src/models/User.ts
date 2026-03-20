// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type UserRole =
  | 'admin'
  | 'staff'
  | 'housekeeping'
  | 'personnel'
  | 'guest';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  department?: string;  // faculty / หน่วยงาน
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt?: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  department?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  department?: string;
}

// ─── Response ─────────────────────────────────────────────────────────────────

export interface UserListResponse {
  users: User[];
  total?: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}