"use client";
import React, { createContext, useContext, ReactNode } from 'react';

interface RecentGame {
  problem: string;
  date: string;
  opponent: string;
  result: "Win" | "Loss";
  eloChange: string;
}

interface EloHistory {
    month: string;
    elo: number;
};

interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

interface Skill {
  skill: string;
  count: number;
}

interface Language {
  language: string;
  count: number;
}

interface Stats {
  recentGames: RecentGame[];
    eloHistory: EloHistory[];
  winRate: number;
  difficultyDistribution: DifficultyDistribution;
  skills: Skill[];
  languages: Language[];
}

interface ProfileContextType {
  username: string;
  isFriend: string;
  isCurrentUser: string;
  stats: Stats;
  pfp: string;
  elo: number;
  friendCount: number;
  rank: number;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
  children: ReactNode;
  profileInfo: {
    username: string;
    stats: string;
    isCurrentUser: string;
    isFriend: string;
    pfp: string;
    elo: number;
    friendCount: number;
    rank: number;
  };
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children, profileInfo }) => {
  const parsedProfileInfo: ProfileContextType = {
    ...profileInfo,
    stats: JSON.parse(profileInfo.stats),
  };

  return <ProfileContext.Provider value={parsedProfileInfo}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
