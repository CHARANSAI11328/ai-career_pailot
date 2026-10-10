import {
  UserProfile,
  StoredResumeAnalysis,
  JobDescriptionComparisonResult,
  RoleMatchResult,
  StoredRoadmap,
  StoredInterviewSession,
  EnrichedJobMatch,
  AIResponseMeta
} from '../types';

const BASE_URL = '/api';

export const api = {
  // System status & API Key
  async getSystemStatus(): Promise<{ status: string; aiProvider: AIResponseMeta; hasApiKey: boolean }> {
    const res = await fetch(`${BASE_URL}/system/status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  async setApiKey(apiKey: string): Promise<{ success: boolean; aiProvider: AIResponseMeta }> {
    const res = await fetch(`${BASE_URL}/system/set-api-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    if (!res.ok) throw new Error('Failed to update API key');
    return res.json();
  },

  // Profile & Career
  async getProfile(userId = 'default_user'): Promise<{ profile: UserProfile | null }> {
    const res = await fetch(`${BASE_URL}/career/profile?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async saveProfile(profile: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await fetch(`${BASE_URL}/career/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to save profile');
    return res.json();
  },

  async getRoleRecommendations(skills: string[], userId = 'default_user'): Promise<{ recommendations: RoleMatchResult[] }> {
    const res = await fetch(`${BASE_URL}/career/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, userId })
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async chatCounselor(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>, userId = 'default_user', language = 'en'): Promise<{ response: string; meta: AIResponseMeta }> {
    const res = await fetch(`${BASE_URL}/career/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, userId, language })
    });
    if (!res.ok) throw new Error('Failed to contact counselor');
    return res.json();
  },

  async submitAssessment(responses: Record<string, number>): Promise<{
    topDimensions: Array<{ dim: string; score: number }>;
    suggestedRoleTrack: string;
    rationale: string;
    disclaimer: string;
  }> {
    const res = await fetch(`${BASE_URL}/career/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses })
    });
    if (!res.ok) throw new Error('Failed to evaluate assessment');
    return res.json();
  },

  // Resume Analyzer
  async uploadResume(file: File, userId = 'default_user'): Promise<{ success: boolean; resume: StoredResumeAnalysis }> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', userId);

    const res = await fetch(`${BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload resume');
    }
    return res.json();
  },

  async analyzeResumeText(text: string, userId = 'default_user'): Promise<{ success: boolean; resume: StoredResumeAnalysis }> {
    const res = await fetch(`${BASE_URL}/resume/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, userId })
    });
    if (!res.ok) throw new Error('Failed to analyze resume text');
    return res.json();
  },

  async compareJobDescription(resumeId: string | undefined, resumeText: string | undefined, jobDescription: string): Promise<{ comparison: JobDescriptionComparisonResult }> {
    const res = await fetch(`${BASE_URL}/resume/compare-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeId, resumeText, jobDescription })
    });
    if (!res.ok) throw new Error('Failed to compare job description');
    return res.json();
  },

  async suggestBulletEdit(bullet: string, targetRole?: string): Promise<{ original: string; suggested: string; impactExplanation: string; meta: AIResponseMeta }> {
    const res = await fetch(`${BASE_URL}/resume/suggest-edits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bullet, targetRole })
    });
    if (!res.ok) throw new Error('Failed to suggest bullet edit');
    return res.json();
  },

  async deleteResume(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/resume/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete resume');
    return res.json();
  },

  // Roadmap
  async generateRoadmap(targetRoleId: string, missingSkills: string[] = [], weeklyHours = 10, userId = 'default_user'): Promise<{ roadmap: StoredRoadmap }> {
    const res = await fetch(`${BASE_URL}/learning/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetRoleId, missingSkills, weeklyHours, userId })
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  async getRoadmap(userId = 'default_user'): Promise<{ roadmap: StoredRoadmap | null }> {
    const res = await fetch(`${BASE_URL}/learning/progress?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  async updateRoadmapProgress(weekNumber: number, isCompleted: boolean, userId = 'default_user'): Promise<{ success: boolean; roadmap: StoredRoadmap }> {
    const res = await fetch(`${BASE_URL}/learning/update-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekNumber, isCompleted, userId })
    });
    if (!res.ok) throw new Error('Failed to update progress');
    return res.json();
  },

  // Mock Interview
  async startInterview(role: string, level = 'Junior', interviewType: 'technical' | 'behavioral' | 'mixed' = 'technical', userId = 'default_user'): Promise<{ session: StoredInterviewSession }> {
    const res = await fetch(`${BASE_URL}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, level, interviewType, userId })
    });
    if (!res.ok) throw new Error('Failed to start interview');
    return res.json();
  },

  async submitInterviewAnswer(sessionId: string, questionId: string, answer: string): Promise<{
    question: any;
    evaluation: any;
    meta: AIResponseMeta;
  }> {
    const res = await fetch(`${BASE_URL}/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId, answer })
    });
    if (!res.ok) throw new Error('Failed to submit answer');
    return res.json();
  },

  async evaluateInterview(sessionId: string): Promise<{ session: StoredInterviewSession }> {
    const res = await fetch(`${BASE_URL}/interview/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    if (!res.ok) throw new Error('Failed to finalize interview');
    return res.json();
  },

  // Job Market
  async searchJobs(params: { q?: string; location?: string; workMode?: string; experienceLevel?: string; userId?: string } = {}): Promise<{ count: number; jobs: EnrichedJobMatch[] }> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.location) searchParams.set('location', params.location);
    if (params.workMode) searchParams.set('workMode', params.workMode);
    if (params.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);
    searchParams.set('userId', params.userId || 'default_user');

    const res = await fetch(`${BASE_URL}/jobs/search?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to search jobs');
    return res.json();
  },

  async toggleSaveJob(jobId: string, userId = 'default_user'): Promise<{ isSaved: boolean }> {
    const res = await fetch(`${BASE_URL}/jobs/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, userId })
    });
    if (!res.ok) throw new Error('Failed to save job');
    return res.json();
  },

  async getSavedJobs(userId = 'default_user'): Promise<{ jobs: EnrichedJobMatch[] }> {
    const res = await fetch(`${BASE_URL}/jobs/saved?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch saved jobs');
    return res.json();
  },

  // Branding
  async optimizeBranding(data: { name?: string; title?: string; targetRole?: string; skills?: string[]; bio?: string; userId?: string }): Promise<{
    branding: {
      headline: string;
      about: string;
      projectHighlights: string[];
      networkingPitch: string;
    };
    meta: AIResponseMeta;
  }> {
    const res = await fetch(`${BASE_URL}/branding/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to optimize branding');
    return res.json();
  },

  // Judge Demo Mode
  async getDemoProfiles(): Promise<{ profiles: any[] }> {
    const res = await fetch(`${BASE_URL}/demo/profiles`);
    if (!res.ok) throw new Error('Failed to fetch demo profiles');
    return res.json();
  },

  async loadDemoProfile(profileId: string, userId = 'default_user'): Promise<{
    message: string;
    profile: UserProfile;
    resume: StoredResumeAnalysis;
    roadmap: StoredRoadmap;
  }> {
    const res = await fetch(`${BASE_URL}/demo/load/${profileId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Failed to load demo profile');
    return res.json();
  },

  async resetDemoData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${BASE_URL}/demo/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  }
};
