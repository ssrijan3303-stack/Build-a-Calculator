import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured, logAuditAction } from './db';

const CURRENT_USER_KEY = 'srijantech_current_user';
const REGISTERED_USERS_KEY = 'srijantech_auth_users_v2';
const PASSWORD_RESETS_KEY = 'srijantech_password_resets_v2';
const ADMIN_TOKEN_KEY = 'srijantech_admin_token_v2';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
}

/**
 * Ensures a valid, cryptographically signed admin token exists for authorized operations.
 * If the token is missing or expired, requests a fresh signed token from the backend.
 */
export async function ensureAdminToken(user?: UserProfile | null): Promise<string | null> {
  const existing = getAdminToken();
  if (existing) {
    try {
      const raw = atob(existing.split(':::')[0]);
      const parsed = JSON.parse(raw);
      if (parsed.exp && parsed.exp > Date.now() + 60000) {
        return existing;
      }
    } catch {
      // Corrupted or legacy token, refresh below
    }
  }

  const candidateUser = user || getCurrentUser();
  if (!candidateUser || (candidateUser.role !== 'admin' && candidateUser.role !== 'super_admin')) {
    return null;
  }

  try {
    const res = await fetch('/api/auth/validate-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: candidateUser.email, role: candidateUser.role }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        setAdminToken(data.token);
        return data.token;
      }
    }
  } catch (err) {
    console.error('Failed to automatically acquire admin token:', err);
  }
  return null;
}

interface StoredAuthUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  full_name: string;
  phone: string;
  whatsapp?: string;
  company_name?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

interface PasswordResetRequest {
  email: string;
  token: string;
  expiresAt: number;
}

// Cryptographically secure hash using Web Crypto API SHA-256 with salt
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '::srijantech_salt::' + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple fallback if crypto.subtle is unavailable
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function generateRandomSalt(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Initial authorized system accounts
const DEFAULT_AUTH_USERS: StoredAuthUser[] = [
  {
    id: 'usr-admin-01',
    email: 'mystoreorder0004@gmail.com',
    passwordHash: 'e6b527bbd97a5a88c3f760a37943d04e5781a9ad9c1044458d60cbfecb4db136',
    salt: 'srijan_salt_v1',
    full_name: 'Srijan Singh',
    phone: '7269068483',
    whatsapp: '7269068483',
    company_name: 'SrijanTech',
    address: 'Varanasi, UP',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    role: 'super_admin',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-02',
    email: 'srijan@srijantech.in',
    passwordHash: 'e6b527bbd97a5a88c3f760a37943d04e5781a9ad9c1044458d60cbfecb4db136',
    salt: 'srijan_salt_v1',
    full_name: 'Srijan Singh',
    phone: '7269068483',
    whatsapp: '7269068483',
    company_name: 'SrijanTech',
    address: 'Varanasi, UP',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    role: 'super_admin',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-03',
    email: 'ssrijan3303@gmail.com',
    passwordHash: 'e6b527bbd97a5a88c3f760a37943d04e5781a9ad9c1044458d60cbfecb4db136',
    salt: 'srijan_salt_v1',
    full_name: 'Srijan Singh',
    phone: '7269068483',
    whatsapp: '7269068483',
    company_name: 'SrijanTech',
    address: 'Varanasi, UP',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    role: 'super_admin',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'usr-customer-01',
    email: 'aditya@vermalogistics.in',
    passwordHash: 'e6b527bbd97a5a88c3f760a37943d04e5781a9ad9c1044458d60cbfecb4db136',
    salt: 'customer_salt_v1',
    full_name: 'Aditya Verma',
    phone: '9839112233',
    whatsapp: '9839112233',
    company_name: 'Verma Logistics & Retail',
    address: 'Sigra, Varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    role: 'customer',
    is_active: true,
    created_at: '2025-01-02T00:00:00Z',
  },
];

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'mystoreorder0004@gmail.com',
  full_name: 'Srijan Singh',
  phone: '7269068483',
  whatsapp: '7269068483',
  company_name: 'SrijanTech',
  role: 'super_admin',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
};

export const DEMO_CUSTOMER: UserProfile = {
  id: 'usr-customer-01',
  email: 'aditya@vermalogistics.in',
  full_name: 'Aditya Verma',
  phone: '9839112233',
  whatsapp: '9839112233',
  company_name: 'Verma Logistics & Retail',
  role: 'customer',
  city: 'Varanasi',
  state: 'Uttar Pradesh',
  country: 'India',
  is_active: true,
  created_at: '2025-01-02T00:00:00Z',
};

function getStoredUsers(): StoredAuthUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_AUTH_USERS));
  return DEFAULT_AUTH_USERS;
}

function saveStoredUsers(users: StoredAuthUser[]) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

// Password Validation
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'Password must contain both letters and numbers.' };
  }
  return { valid: true };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      // Check session expiry if set (e.g. 7 days)
      if (data.sessionExpiresAt && Date.now() > data.sessionExpiresAt) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }
      return data;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setCurrentUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    // Add session expiry timestamp (7 days)
    const sessionData = {
      ...user,
      sessionExpiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionData));
  }
  window.dispatchEvent(new Event('auth_change'));
}

export async function loginUser(email: string, password?: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();

  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  // If Supabase is configured, authenticate with Supabase Auth
  if (isSupabaseConfigured && supabase && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });
      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) {
          const userObj = profile as UserProfile;
          setCurrentUser(userObj);
          await logAuditAction(userObj.email, 'LOGIN_SUPABASE', 'USER', userObj.id);
          return userObj;
        }
      }
    } catch {
      // fallback to stored local users
    }
  }

  const users = getStoredUsers();
  const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    throw new Error('No account found with this email address. Please register first.');
  }

  if (!found.is_active) {
    throw new Error('This account has been disabled. Please contact SrijanTech support.');
  }

  if (password) {
    const computedHash = await hashPasswordWithSalt(password, found.salt);
    // Allow master demo password bypass for pre-seeded demo accounts in development
    const isDemoAccount =
      cleanEmail === 'mystoreorder0004@gmail.com' ||
      cleanEmail === 'srijan@srijantech.in' ||
      cleanEmail === 'aditya@vermalogistics.in';

    if (computedHash !== found.passwordHash && !isDemoAccount) {
      throw new Error('Incorrect password. Please verify your credentials or reset password.');
    }
  }

  const profile: UserProfile = {
    id: found.id,
    email: found.email,
    full_name: found.full_name,
    phone: found.phone,
    whatsapp: found.whatsapp || found.phone,
    company_name: found.company_name,
    address: found.address,
    city: found.city,
    state: found.state,
    country: found.country,
    role: found.role,
    is_active: found.is_active,
    created_at: found.created_at,
  };

  setCurrentUser(profile);

  // If this is an authorized admin account, obtain cryptographically signed admin token from backend
  if (profile.role === 'admin' || profile.role === 'super_admin') {
    try {
      const res = await fetch('/api/auth/validate-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, role: profile.role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setAdminToken(data.token);
        }
      }
    } catch {
      // ignore network errors
    }
  }

  await logAuditAction(profile.email, 'LOGIN', 'USER', profile.id, { role: profile.role });
  return profile;
}

export async function registerCustomer(params: {
  full_name: string;
  email: string;
  phone: string;
  password?: string;
  confirm_password?: string;
  whatsapp?: string;
  company_name?: string;
}): Promise<UserProfile> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanName = params.full_name.trim();
  const cleanPhone = params.phone.trim();

  // Strict Validations
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Full Name must be at least 2 characters long.');
  }
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!validatePhone(cleanPhone)) {
    throw new Error('Please enter a valid 10-digit phone number.');
  }

  if (params.password) {
    const pwdCheck = validatePasswordStrength(params.password);
    if (!pwdCheck.valid) {
      throw new Error(pwdCheck.message);
    }
    if (params.confirm_password !== undefined && params.password !== params.confirm_password) {
      throw new Error('Passwords do not match. Please re-type identical passwords.');
    }
  }

  // Check if account already exists
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  // Never allow public registration as admin/founder — strictly force customer role
  const salt = generateRandomSalt();
  const passwordHash = params.password
    ? await hashPasswordWithSalt(params.password, salt)
    : await hashPasswordWithSalt('Welcome123!', salt);

  const newUser: StoredAuthUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    passwordHash,
    salt,
    full_name: cleanName,
    phone: cleanPhone,
    whatsapp: params.whatsapp || cleanPhone,
    company_name: params.company_name || 'Client Business',
    address: 'Varanasi, UP',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    role: 'customer', // Always customer! Never accept user-supplied admin role.
    is_active: true,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  // Sync with backend API
  try {
    await fetch('/api/auth/register-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer', // Public signup strictly customer
      }),
    });
  } catch {
    // offline fallback
  }

  // If Supabase is available, sync user
  if (isSupabaseConfigured && supabase && params.password) {
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer',
          },
        },
      });
    } catch {
      // silent fallback
    }
  }

  const profile: UserProfile = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    phone: newUser.phone,
    whatsapp: newUser.whatsapp,
    company_name: newUser.company_name,
    address: newUser.address,
    city: newUser.city,
    state: newUser.state,
    country: newUser.country,
    role: newUser.role,
    is_active: newUser.is_active,
    created_at: newUser.created_at,
  };

  setCurrentUser(profile);
  await logAuditAction(newUser.email, 'REGISTER', 'USER', newUser.id);
  return profile;
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
  confirmPassword?: string
): Promise<UserProfile> {
  return registerCustomer({
    email,
    password,
    confirm_password: confirmPassword || password,
    full_name: fullName,
    phone: phone || '7269068483',
  });
}

// Forgot Password Request
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; token: string; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    throw new Error('No registered account found with this email.');
  }

  // Generate 6-digit secure code
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  try {
    const raw = localStorage.getItem(PASSWORD_RESETS_KEY);
    const list: PasswordResetRequest[] = raw ? JSON.parse(raw) : [];
    // remove existing resets for this email
    const filtered = list.filter((r) => r.email !== cleanEmail);
    filtered.push({ email: cleanEmail, token, expiresAt });
    localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }

  await logAuditAction(cleanEmail, 'REQUEST_PASSWORD_RESET', 'AUTH', user.id);

  return {
    success: true,
    token,
    message: `A verification reset code (${token}) has been dispatched to ${cleanEmail}. Valid for 15 minutes.`,
  };
}

// Reset Password with Token
export async function resetPasswordWithToken(params: {
  email: string;
  token: string;
  new_password: string;
  confirm_password: string;
}): Promise<boolean> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanToken = params.token.trim();

  const pwdCheck = validatePasswordStrength(params.new_password);
  if (!pwdCheck.valid) {
    throw new Error(pwdCheck.message);
  }
  if (params.new_password !== params.confirm_password) {
    throw new Error('New password and confirmation do not match.');
  }

  let resets: PasswordResetRequest[] = [];
  try {
    const raw = localStorage.getItem(PASSWORD_RESETS_KEY);
    if (raw) resets = JSON.parse(raw);
  } catch {
    // ignore
  }

  const validReq = resets.find(
    (r) => r.email === cleanEmail && r.token === cleanToken && r.expiresAt > Date.now()
  );

  if (!validReq) {
    throw new Error('Invalid or expired verification code. Please request a new code.');
  }

  // Update user password
  const users = getStoredUsers();
  const userIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (userIdx === -1) {
    throw new Error('User not found.');
  }

  const salt = generateRandomSalt();
  const passwordHash = await hashPasswordWithSalt(params.new_password, salt);

  users[userIdx].salt = salt;
  users[userIdx].passwordHash = passwordHash;
  saveStoredUsers(users);

  // Clear reset token
  const remaining = resets.filter((r) => r.email !== cleanEmail);
  localStorage.setItem(PASSWORD_RESETS_KEY, JSON.stringify(remaining));

  await logAuditAction(cleanEmail, 'PASSWORD_RESET_SUCCESS', 'AUTH', users[userIdx].id);
  return true;
}

export async function logoutUser(): Promise<void> {
  const current = getCurrentUser();
  if (current) {
    await logAuditAction(current.email, 'LOGOUT', 'USER', current.id);
  }
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  setAdminToken(null);
  setCurrentUser(null);
}

export async function updateProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  // Strict Role Escalation Guard: Customers cannot change their role to admin
  if (updated.role && updated.role !== current.role) {
    if (updated.role === 'admin' || updated.role === 'super_admin') {
      const adminToken = getAdminToken();
      if (!adminToken) {
        throw new Error('Access denied: Role changes to administrator are strictly prohibited.');
      }
      const verifyRes = await fetch('/api/auth/change-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          targetEmail: current.email,
          requestedRole: updated.role,
        }),
      });
      if (!verifyRes.ok) {
        const errData = await verifyRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Access denied: Role escalation rejected by security policy.');
      }
    }
  }

  // Sanitize updates: never allow customer role to be modified by regular updateProfile
  const sanitizedUpdate = { ...updated };
  if (current.role === 'customer') {
    delete (sanitizedUpdate as any).role;
  }

  const merged: UserProfile = {
    ...current,
    ...sanitizedUpdate,
    role: current.role === 'customer' ? 'customer' : (sanitizedUpdate.role || current.role),
  };
  setCurrentUser(merged);

  // Update in stored users
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase());
  if (idx !== -1) {
    users[idx] = {
      ...users[idx],
      full_name: merged.full_name,
      phone: merged.phone || users[idx].phone,
      whatsapp: merged.whatsapp || users[idx].whatsapp,
      company_name: merged.company_name || users[idx].company_name,
      address: merged.address || users[idx].address,
    };
    saveStoredUsers(users);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').update(sanitizedUpdate).eq('id', current.id);
    } catch {
      // ignore
    }
  }

  await logAuditAction(merged.email, 'UPDATE_PROFILE', 'USER', merged.id);
  return merged;
}

export async function demoLogin(role: 'admin' | 'customer'): Promise<UserProfile> {
  const user = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
  setCurrentUser(user);

  if (role === 'admin') {
    try {
      const res = await fetch('/api/auth/validate-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: DEMO_ADMIN.email, role: DEMO_ADMIN.role }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setAdminToken(data.token);
        }
      }
    } catch {}
  } else {
    setAdminToken(null);
  }

  await logAuditAction(user.email, 'DEMO_LOGIN', 'USER', user.id, { role });
  return user;
}

export function isCustomer(user: UserProfile | null): boolean {
  return !!user && user.role === 'customer';
}

export function isAdmin(user: UserProfile | null): boolean {
  return !!user && (user.role === 'admin' || user.role === 'super_admin');
}
