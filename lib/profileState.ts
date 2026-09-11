import { useState, useEffect } from 'react';

// ==========================================
// TYPES
// ==========================================
export interface UserProfile {
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUri: string | null;
  joinDate: string;
  level: number;
  xp: number;
  targetXp: number;
  streak: number;
  longestStreak: number;
  learnedWords: number;
  league: {
    name: string;
    rank: number;
    tier: string;
  };
}

// ==========================================
// INITIAL STATE
// ==========================================
const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Nguyen',
  username: '@alexnguyen',
  email: 'alex@example.com',
  bio: 'Mỗi ngày tích lũy thêm từ vựng mới cùng Snapy! 🚀',
  avatarUri: null,
  joinDate: 'Tháng 3, 2024',
  level: 12,
  xp: 2450,
  targetXp: 3000,
  streak: 12,
  longestStreak: 27,
  learnedWords: 1284,
  league: {
    name: 'Giải đấu Bạc',
    rank: 12,
    tier: 'silver'
  }
};

let currentProfile: UserProfile = { ...INITIAL_PROFILE };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

// ==========================================
// STORE
// ==========================================
export const profileStore = {
  getState(): UserProfile {
    return currentProfile;
  },

  updateProfile(partial: Partial<UserProfile>) {
    currentProfile = {
      ...currentProfile,
      ...partial
    };
    notify();
    return currentProfile;
  },

  setAvatar(uri: string | null) {
    currentProfile = {
      ...currentProfile,
      avatarUri: uri
    };
    notify();
    return currentProfile;
  },

  reset() {
    currentProfile = { ...INITIAL_PROFILE };
    notify();
  }
};

// ==========================================
// REACT HOOK
// ==========================================
export function useProfileState(): [UserProfile, typeof profileStore] {
  const [profile, setProfile] = useState<UserProfile>(profileStore.getState());

  useEffect(() => {
    const listener = () => setProfile(profileStore.getState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [profile, profileStore];
}

// ==========================================
// HELPERS
// ==========================================
export function getProfileInitials(name: string): string {
  if (!name) return 'SV';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

