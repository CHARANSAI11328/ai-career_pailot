import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile, StoredResumeAnalysis, StoredRoadmap, AIResponseMeta } from '../types';

interface ProfileContextType {
  userId: string;
  profile: UserProfile | null;
  resume: StoredResumeAnalysis | null;
  roadmap: StoredRoadmap | null;
  aiStatus: AIResponseMeta | null;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshData: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setResume: (resume: StoredResumeAnalysis | null) => void;
  setRoadmap: (roadmap: StoredRoadmap | null) => void;
  loadDemoProfile: (profileId: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId] = useState<string>('default_user');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resume, setResume] = useState<StoredResumeAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<StoredRoadmap | null>(null);
  const [aiStatus, setAiStatus] = useState<AIResponseMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('landing');

  const refreshData = async () => {
    try {
      setIsLoading(true);
      // Fetch system status
      const statusRes = await api.getSystemStatus().catch(() => null);
      if (statusRes?.aiProvider) {
        setAiStatus(statusRes.aiProvider);
      }

      // Fetch profile
      const profRes = await api.getProfile(userId).catch(() => null);
      if (profRes?.profile) {
        setProfile(profRes.profile);
      }

      // Fetch roadmap
      const roadRes = await api.getRoadmap(userId).catch(() => null);
      if (roadRes?.roadmap) {
        setRoadmap(roadRes.roadmap);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    const res = await api.saveProfile({ ...profile, ...data, id: userId });
    setProfile(res.profile);
  };

  const loadDemoProfile = async (profileId: string) => {
    setIsLoading(true);
    try {
      const res = await api.loadDemoProfile(profileId, userId);
      setProfile(res.profile);
      setResume(res.resume);
      setRoadmap(res.roadmap);
      setActiveTab('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDemoData = async () => {
    setIsLoading(true);
    try {
      await api.resetDemoData();
      setProfile(null);
      setResume(null);
      setRoadmap(null);
      await refreshData();
      setActiveTab('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const setApiKey = async (key: string) => {
    const res = await api.setApiKey(key);
    if (res.aiProvider) {
      setAiStatus(res.aiProvider);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        userId,
        profile,
        resume,
        roadmap,
        aiStatus,
        isLoading,
        activeTab,
        setActiveTab,
        refreshData,
        updateProfile,
        setResume,
        setRoadmap,
        loadDemoProfile,
        resetDemoData,
        setApiKey
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
