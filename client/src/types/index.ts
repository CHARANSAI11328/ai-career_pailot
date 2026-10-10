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

export interface ScoreBreakdown {
  overall: number;
  sectionCompleteness: number;
  quantifiableImpact: number;
  actionVerbs: number;
  readability: number;
  skillDensity: number;
  atsFormatting: number;
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
  heuristicScore: ScoreBreakdown;
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

export interface JobDescriptionComparisonResult {
  jobTitle: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingCriticalSkills: string[];
  missingPreferredSkills: string[];
  evidenceBreakdown: Array<{
    skillName: string;
    isMatched: boolean;
    importance: 'critical' | 'preferred';
    snippet?: string;
  }>;
  tailoringAdvice: string[];
}

export interface RoleMatchResult {
  role: {
    id: string;
    title: string;
    category: string;
    summary: string;
    coreSkills: string[];
    niceToHaveSkills: string[];
    entryRequirements: string[];
    beginnerProject: {
      title: string;
      description: string;
      tools: string[];
      deliverables: string[];
    };
    learningPriorities: string[];
    adjacentRoles: string[];
  };
  matchScore: number;
  matchedSkills: string[];
  missingCoreSkills: string[];
  missingNiceToHaveSkills: string[];
  salaryInsight: {
    entry: [number, number];
    mid: [number, number];
    currency: string;
  };
  recommendationReason: string;
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
      score: number;
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

export interface EnrichedJobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  salaryRange: {
    currency: string;
    min: number;
    max: number;
    period: 'year' | 'month';
  };
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  postedDate: string;
  applicationUrl: string;
  source: string;
  isCuratedSample: boolean;
  matchPercentage: number;
  matchedSkillsList: string[];
  missingSkillsList: string[];
  fitExplanation: string;
  isSaved?: boolean;
}

export interface AIResponseMeta {
  provider: 'gemini-live' | 'heuristic-engine';
  model: string;
  isLive: boolean;
  notes?: string;
}
