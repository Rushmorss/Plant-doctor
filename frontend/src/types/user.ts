export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
  location: string;
  memberSince: string;
  avatar: string;
}

export type ProfilePatch = Partial<Pick<UserProfile, 'fullName' | 'phone' | 'role' | 'organization' | 'location'>>;

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: string;
}