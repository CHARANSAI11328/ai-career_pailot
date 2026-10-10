import fs from 'fs';
import path from 'path';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  education: string;
  fieldOfStudy: string;
  experienceLevel: 'Student' | 'Fresher' | '1-3 years' | '3-5 years' | '5+ years';
  targetRole: string;
  skills: string[];
  preferredLocation: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite' | 'Any';
  weeklyHours: number;
  expectedSalary?: string;
  careerGoals: string;
  preferredLanguage: 'en' | 'te' | 'hi';
  updatedAt: string;
}

export interface StoredResumeAnalysis {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  rawText: string;
  parsedSections: Record<string, string>;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  extractedSkills: string[];
  heuristicScore: {
    overall: number;
    sectionCompleteness: number;
    quantifiableImpact: number;
    actionVerbs: number;
    readability: number;
    skillDensity: number;
    atsFormatting: number;
  };
  feedback: {
    strengths: string[];
    criticalIssues: string[];
    improvements: Array<{
      section: string;
      originalSnippet?: string;
      suggestedFix: string;
      reason: string;
      type: 'impact' | 'verb' | 'formatting' | 'missing_evidence';
    }>;
  };
  jobComparison?: {
    targetJobTitle: string;
    matchedSkills: string[];
    missingCriticalSkills: string[];
    missingPreferredSkills: string[];
    matchPercentage: number;
    recommendations: string[];
  };
}

export interface StoredRoadmap {
  id: string;
  userId: string;
  targetRole: string;
  targetRoleTitle: string;
  weeklyHours: number;
  generatedAt: string;
  weeks: Array<{
    weekNumber: number;
    title: string;
    focusSkills: string[];
    description: string;
    resources: Array<{
      title: string;
      provider: string;
      url: string;
      type: string;
      cost: string;
    }>;
    projectTask: {
      title: string;
      description: string;
      deliverable: string;
    };
    isCompleted: boolean;
  }>;
}

export interface StoredInterviewSession {
  id: string;
  userId: string;
  role: string;
  level: string;
  interviewType: 'technical' | 'behavioral' | 'mixed';
  startedAt: string;
  completedAt?: string;
  questions: Array<{
    id: string;
    questionNumber: number;
    questionText: string;
    category: string;
    userAnswer?: string;
    answeredAt?: string;
    evaluation?: {
      score: number; // 0-100
      relevanceScore: number;
      technicalScore: number;
      clarityScore: number;
      strengths: string[];
      growthAreas: string[];
      feedback: string;
      exemplarAnswer: string;
    };
  }>;
  overallScore?: number;
  summaryFeedback?: string;
}

export interface StorageData {
  profiles: Record<string, UserProfile>;
  resumes: Record<string, StoredResumeAnalysis>;
  roadmaps: Record<string, StoredRoadmap>;
  interviews: Record<string, StoredInterviewSession>;
  savedJobIds: Record<string, string[]>; // userId -> jobIds
  customApiKey?: string;
}

class StorageEngine {
  private dataDir: string;
  private filePath: string;
  private data: StorageData;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), '.data');
    this.filePath = path.join(this.dataDir, 'storage.json');
    this.data = {
      profiles: {},
      resumes: {},
      roadmaps: {},
      interviews: {},
      savedJobIds: {},
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('Storage initialization fallback to memory:', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write storage file:', err);
    }
  }

  // Profile Methods
  public getProfile(userId: string): UserProfile | null {
    return this.data.profiles[userId] || null;
  }

  public saveProfile(profile: UserProfile): void {
    this.data.profiles[profile.id] = profile;
    this.save();
  }

  // Resume Methods
  public getResume(id: string): StoredResumeAnalysis | null {
    return this.data.resumes[id] || null;
  }

  public getResumesByUser(userId: string): StoredResumeAnalysis[] {
    return Object.values(this.data.resumes).filter(r => r.userId === userId);
  }

  public saveResume(resume: StoredResumeAnalysis): void {
    this.data.resumes[resume.id] = resume;
    this.save();
  }

  // Roadmap Methods
  public getRoadmapByUser(userId: string): StoredRoadmap | null {
    const list = Object.values(this.data.roadmaps).filter(r => r.userId === userId);
    return list.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0] || null;
  }

  public saveRoadmap(roadmap: StoredRoadmap): void {
    this.data.roadmaps[roadmap.id] = roadmap;
    this.save();
  }

  // Interview Methods
  public getInterview(id: string): StoredInterviewSession | null {
    return this.data.interviews[id] || null;
  }

  public getInterviewsByUser(userId: string): StoredInterviewSession[] {
    return Object.values(this.data.interviews).filter(i => i.userId === userId);
  }

  public saveInterview(interview: StoredInterviewSession): void {
    this.data.interviews[interview.id] = interview;
    this.save();
  }

  // Saved Jobs
  public getSavedJobs(userId: string): string[] {
    return this.data.savedJobIds[userId] || [];
  }

  public toggleSaveJob(userId: string, jobId: string): boolean {
    if (!this.data.savedJobIds[userId]) {
      this.data.savedJobIds[userId] = [];
    }
    const idx = this.data.savedJobIds[userId].indexOf(jobId);
    let isSaved = false;
    if (idx >= 0) {
      this.data.savedJobIds[userId].splice(idx, 1);
    } else {
      this.data.savedJobIds[userId].push(jobId);
      isSaved = true;
    }
    this.save();
    return isSaved;
  }

  // API Key override
  public getApiKey(): string | undefined {
    return this.data.customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  }

  public setApiKey(key: string): void {
    this.data.customApiKey = key;
    this.save();
  }

  // Reset Demo Data
  public resetDemoData(): void {
    this.data.profiles = {};
    this.data.resumes = {};
    this.data.roadmaps = {};
    this.data.interviews = {};
    this.data.savedJobIds = {};
    this.save();
  }
}

export const storage = new StorageEngine();
