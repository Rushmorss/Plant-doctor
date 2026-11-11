import { userProfile } from '../data/profile';
import type { ProfilePatch, RegisterInput, UserProfile } from '../types/user';
import { ApiError } from './errors';
import { mockRequest } from './mockScenario';
import { readJSON, removeKey, writeJSON } from './storage';

/**
 * Xác thực người dùng.
 * CHỜ BACKEND: tài khoản được lưu cục bộ trên trình duyệt chỉ để demo luồng giao diện.
 * Mật khẩu KHÔNG được mã hóa ở chế độ này — tuyệt đối không dùng cho dữ liệu thật.
 */
interface StoredUser extends UserProfile {
  password: string;
  verified: boolean;
}

const USERS_KEY = 'apd.users.v1';
const SESSION_KEY = 'apd.session.v1';
const INVALID_OTP = '000000';

export const DEMO_CREDENTIALS = { email: userProfile.email, password: 'Demo@123' };

const demoUser: StoredUser = {
  id: 'u-demo',
  fullName: userProfile.fullName,
  email: userProfile.email,
  phone: userProfile.phone,
  role: userProfile.role,
  organization: userProfile.organization,
  location: userProfile.location,
  memberSince: userProfile.memberSince,
  avatar: userProfile.avatar,
  password: DEMO_CREDENTIALS.password,
  verified: true
};

const resetSessions = new Set<string>();
const normalize = (email: string) => email.trim().toLowerCase();

function loadUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(USERS_KEY, [demoUser]);
}

function saveUsers(users: StoredUser[]): void {
  if (!writeJSON(USERS_KEY, users)) {
    throw new ApiError('storage', 'Không thể lưu dữ liệu trên thiết bị. Hãy kiểm tra bộ nhớ trình duyệt.');
  }
}

function toProfile(user: StoredUser): UserProfile {
  const { password: _password, verified: _verified, ...profile } = user;
  return profile;
}

function findUser(users: StoredUser[], email: string): StoredUser | undefined {
  return users.find((u) => normalize(u.email) === normalize(email));
}

function startSession(user: StoredUser): UserProfile {
  const profile = toProfile(user);
  writeJSON(SESSION_KEY, profile);
  return profile;
}

function assertOtp(code: string): void {
  if (code === INVALID_OTP) throw new ApiError('validation', 'Mã xác thực không đúng hoặc đã hết hạn.');
}

export const authService = {
  getSession(): UserProfile | null {
    return readJSON<UserProfile | null>(SESSION_KEY, null);
  },

  login(email: string, password: string): Promise<UserProfile> {
    return mockRequest(() => {
      const user = findUser(loadUsers(), email);
      if (!user || user.password !== password) {
        throw new ApiError('unauthorized', 'Email hoặc mật khẩu không đúng.');
      }
      return startSession(user);
    }, 800);
  },

  register(input: RegisterInput): Promise<void> {
    return mockRequest(() => {
      const users = loadUsers();
      if (findUser(users, input.email)) {
        throw new ApiError('conflict', 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.');
      }
      const now = new Date();
      saveUsers([
      ...users,
      {
        id: `u-${Date.now()}`,
        fullName: input.fullName.trim(),
        email: input.email.trim(),
        phone: '',
        role: input.role,
        organization: '',
        location: '',
        memberSince: `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`,
        avatar: '',
        password: input.password,
        verified: false
      }]
      );
    }, 900);
  },

  verifySignup(email: string, code: string): Promise<UserProfile> {
    return mockRequest(() => {
      assertOtp(code);
      const users = loadUsers();
      const user = findUser(users, email);
      if (!user) throw new ApiError('not_found', 'Không tìm thấy tài khoản cần xác thực.');
      user.verified = true;
      saveUsers(users);
      return startSession(user);
    }, 800);
  },

  requestPasswordReset(email: string): Promise<void> {
    return mockRequest(() => {
      if (!findUser(loadUsers(), email)) {
        throw new ApiError('not_found', 'Không tìm thấy tài khoản với email này.');
      }
    }, 800);
  },

  verifyReset(email: string, code: string): Promise<void> {
    return mockRequest(() => {
      assertOtp(code);
      if (!findUser(loadUsers(), email)) throw new ApiError('not_found', 'Không tìm thấy tài khoản.');
      resetSessions.add(normalize(email));
    }, 800);
  },

  resendOtp(_email: string): Promise<void> {
    return mockRequest(() => undefined, 600);
  },

  resetPassword(email: string, password: string): Promise<void> {
    return mockRequest(() => {
      if (!resetSessions.has(normalize(email))) {
        throw new ApiError('validation', 'Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu mã mới.');
      }
      const users = loadUsers();
      const user = findUser(users, email);
      if (!user) throw new ApiError('not_found', 'Không tìm thấy tài khoản.');
      user.password = password;
      saveUsers(users);
      resetSessions.delete(normalize(email));
    }, 800);
  },

  logout(): void {
    removeKey(SESSION_KEY);
  },

  updateProfile(id: string, patch: ProfilePatch): Promise<UserProfile> {
    return mockRequest(() => {
      const users = loadUsers();
      const user = users.find((u) => u.id === id);
      if (!user) throw new ApiError('unauthorized', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      Object.assign(user, patch);
      saveUsers(users);
      return startSession(user);
    }, 700);
  },

  changePassword(id: string, current: string, next: string): Promise<void> {
    return mockRequest(() => {
      const users = loadUsers();
      const user = users.find((u) => u.id === id);
      if (!user) throw new ApiError('unauthorized', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      if (user.password !== current) throw new ApiError('validation', 'Mật khẩu hiện tại không đúng.');
      user.password = next;
      saveUsers(users);
    }, 800);
  }
};