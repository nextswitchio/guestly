// ── Core Platform Types ──────────────────────────────────────────────────────

export type UserRole = "attendee" | "organiser" | "organizer" | "vendor" | "admin" | "affiliate";

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: {
    city: string;
    country: string;
  };
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  interests?: string[];
  createdAt: number;
  updatedAt: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthResponse = {
  ok: boolean;
  user?: User;
  tokens?: AuthTokens;
  role?: UserRole;
  error?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  role?: UserRole;
};

export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
};

export type PasswordResetRequest = {
  email: string;
};

export type VerifyEmailRequest = {
  token: string;
};
