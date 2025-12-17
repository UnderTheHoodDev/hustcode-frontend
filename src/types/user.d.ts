export type UserInfo = {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  role: string;
};

export type UserStats = {
  solved: number;
  inProgress: number;
  accepted: number;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'USER';
  rating: number | null;
  contributions: number | null;
  stats: UserStats;
  languagesUsed: string[];
};