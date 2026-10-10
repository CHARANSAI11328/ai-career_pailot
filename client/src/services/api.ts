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

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const STORAGE_KEYS = {
  PROFILE: 'careerpilot_profile',
  RESUME: 'careerpilot_resume',
  ROADMAP: 'careerpilot_roadmap',
  INTERVIEWS: 'careerpilot_interviews',
  SAVED_JOBS: 'careerpilot_saved_jobs',
  API_KEY: 'careerpilot_gemini_key'
};

const DEMO_PROFILES = [
  {
    id: 'demo_fullstack',
    name: 'Priya Sharma',
    education: 'B.Tech in Computer Science (2025)',
    fieldOfStudy: 'Computer Science',
    experienceLevel: 'Fresher' as const,
    targetRole: 'Full Stack Software Engineer',
    skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git', 'Node.js', 'SQL'],
    preferredLocation: 'Bangalore',
    workMode: 'Hybrid' as const,
    weeklyHours: 10,
    careerGoals: 'Build high-scale web platforms and master cloud system architecture.',
    preferredLanguage: 'en' as const,
    updatedAt: new Date().toISOString(),
    resumeText: `PRIYA SHARMA
Bengaluru, India | priya.sharma@example.com | +91 98765 43210
LinkedIn: linkedin.com/in/priya-sharma-dev | GitHub: github.com/priyasharma-web

PROFESSIONAL SUMMARY
Motivated Software Developer with 1 year of hands-on experience building web applications using React, JavaScript, and Node.js. Seeking to transition into a Full Stack Software Engineer role to leverage expertise in component architecture and API integration.

EDUCATION
Bachelor of Technology in Computer Science and Engineering
National Institute of Technology | 2021 – 2025
CGPA: 8.6/10

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript (Basic), Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Express.js, Node.js, Tailwind CSS, Bootstrap
Databases & Tools: PostgreSQL, MongoDB, Git, GitHub, Postman, VS Code

EXPERIENCE
Frontend Developer Intern | TechSpire Solutions, Bengaluru
July 2024 – December 2024
- Developed responsive client dashboard pages using React, Tailwind CSS, and Context API.
- Integrated 15+ RESTful API endpoints for user authentication, payment processing, and profile management.
- Improved web application page load speed by 28% by code splitting and optimizing image assets.
- Collaborated in a 5-member Agile scrum team with daily standups and bi-weekly sprint reviews.

PROJECTS
1. DevConnect – Developer Networking Platform
- Built a full-stack social platform enabling developers to share code snippets, articles, and job postings.
- Implemented user authentication with JSON Web Tokens (JWT) and bcrypt password hashing.
- Designed database schema in PostgreSQL with 6 normalized tables and indexed foreign keys.
- Deployed frontend to Vercel and backend service to Render, supporting 400+ active users.

CERTIFICATIONS
- Meta Front-End Developer Professional Certificate (Coursera)
- HackerRank Certified JavaScript (Intermediate)`
  },
  {
    id: 'demo_ai_ml',
    name: 'Alex Chen',
    education: 'M.S. in Data Science (2025)',
    fieldOfStudy: 'Data Science',
    experienceLevel: 'Fresher' as const,
    targetRole: 'AI / Machine Learning Engineer',
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'SQL', 'Git'],
    preferredLocation: 'Remote',
    workMode: 'Remote' as const,
    weeklyHours: 12,
    careerGoals: 'Develop applied machine learning pipelines and fine-tune generative AI models.',
    preferredLanguage: 'en' as const,
    updatedAt: new Date().toISOString(),
    resumeText: `ALEX CHEN
San Francisco, CA | alex.chen@example.com | (555) 321-7654
LinkedIn: linkedin.com/in/alexchen-ai | GitHub: github.com/alexchen-ml

PROFESSIONAL SUMMARY
Applied Machine Learning Researcher and Graduate Data Scientist with strong skills in Python, PyTorch, Scikit-Learn, and statistical data modeling.

EDUCATION
Master of Science in Data Science | University of California | 2023 – 2025 | GPA: 3.85/4.0

TECHNICAL SKILLS
Languages & Frameworks: Python, SQL, PyTorch, Scikit-Learn, Pandas, NumPy, FastAPI

EXPERIENCE
Machine Learning Intern | Dataview Analytics
- Built customer churn prediction model using Scikit-Learn (XGBoost) achieving 87% ROC-AUC score.
- Cleaned and normalized 500,000+ customer transaction rows using Pandas.
- Deployed inference endpoint as a containerized FastAPI service on AWS EC2.`
  }
];

const SAMPLE_JOBS: EnrichedJobMatch[] = [
  {
    id: 'job_1',
    title: 'Junior Full Stack Engineer',
    company: 'Nexus Cloud Technologies',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    experienceLevel: 'Entry',
    salaryRange: { currency: '₹', min: 600000, max: 950000, period: 'year' },
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    preferredSkills: ['TypeScript', 'PostgreSQL', 'Docker'],
    description: 'Join our cloud platform team building resilient microservices and React web frontends.',
    responsibilities: ['Develop frontend components in React', 'Build backend REST APIs in Node.js'],
    postedDate: '2 days ago',
    applicationUrl: 'https://example.com/apply/nexus',
    source: 'Curated Sample',
    isCuratedSample: true,
    matchPercentage: 88,
    matchedSkillsList: ['JavaScript', 'React', 'Node.js', 'SQL'],
    missingSkillsList: ['TypeScript', 'PostgreSQL'],
    fitExplanation: 'Strong match with your frontend React and JavaScript background.',
    isSaved: false
  },
  {
    id: 'job_2',
    title: 'Associate Machine Learning Engineer',
    company: 'Cognitive Dynamics AI',
    location: 'Hyderabad, India',
    workMode: 'Remote',
    experienceLevel: 'Entry',
    salaryRange: { currency: '₹', min: 800000, max: 1200000, period: 'year' },
    requiredSkills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'],
    preferredSkills: ['PyTorch', 'FastAPI', 'Docker'],
    description: 'Develop and fine-tune applied machine learning and natural language processing pipelines.',
    responsibilities: ['Train ML models using Scikit-Learn', 'Deploy model APIs with FastAPI'],
    postedDate: '1 day ago',
    applicationUrl: 'https://example.com/apply/cognitive',
    source: 'Curated Sample',
    isCuratedSample: true,
    matchPercentage: 84,
    matchedSkillsList: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'],
    missingSkillsList: ['PyTorch', 'FastAPI'],
    fitExplanation: 'High alignment with your Python and statistical machine learning skills.',
    isSaved: false
  }
];

function analyzeTextLocally(text: string): StoredResumeAnalysis {
  const upper = text.toUpperCase();
  const hasContact = upper.includes('@') || upper.includes('LINKEDIN') || upper.includes('PHONE');
  const hasSummary = upper.includes('SUMMARY') || upper.includes('OBJECTIVE');
  const hasEdu = upper.includes('EDUCATION') || upper.includes('UNIVERSITY');
  const hasExp = upper.includes('EXPERIENCE') || upper.includes('INTERN');
  const hasSkills = upper.includes('SKILLS') || upper.includes('TECHNOLOGIES');

  const secScore = (hasContact ? 4 : 0) + (hasSummary ? 3 : 0) + (hasEdu ? 4 : 0) + (hasExp ? 5 : 0) + (hasSkills ? 4 : 0);
  const metrics = (text.match(/(\d+%\b|\$\d+|\d+\+|\d+k\b)/gi) || []).length;
  const impScore = Math.min(20, metrics * 5);
  const verbScore = 13;
  const readScore = 14;
  const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML5', 'CSS3', 'Git', 'TypeScript', 'PostgreSQL'];
  const detected = commonSkills.filter(s => text.toLowerCase().includes(s.toLowerCase()));
  const skillScore = Math.min(15, detected.length * 3);
  const atsScore = 14;

  const overall = Math.min(100, Math.max(50, secScore + impScore + verbScore + readScore + skillScore + atsScore));

  return {
    id: 'resume_' + Date.now(),
    userId: 'default_user',
    fileName: 'Resume_Analysis.pdf',
    fileType: 'pdf',
    uploadedAt: new Date().toISOString(),
    rawText: text,
    parsedSections: {
      Summary: 'Software developer with experience building web applications.',
      Education: 'B.Tech in Computer Science',
      Skills: detected.join(', ')
    },
    contactInfo: {
      email: (text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || ['user@example.com'])[0],
      phone: '+91 98765 43210',
      linkedin: 'linkedin.com/in/user'
    },
    extractedSkills: detected.length > 0 ? detected : ['JavaScript', 'React', 'Git', 'SQL'],
    heuristicScore: {
      overall,
      sectionCompleteness: secScore,
      quantifiableImpact: impScore,
      actionVerbs: verbScore,
      readability: readScore,
      skillDensity: Math.round(skillScore),
      atsFormatting: atsScore
    },
    feedback: {
      strengths: [
        'Clear educational background and contact information.',
        'Identified relevant technical skills section.'
      ],
      criticalIssues: [
        metrics === 0 ? 'Missing quantifiable metrics (percentages, numbers).' : 'Could increase density of project metrics.'
      ],
      improvements: [
        {
          section: 'Experience',
          originalSnippet: 'Worked on React web application.',
          suggestedFix: 'Developed responsive React dashboard pages, reducing page load latency by 28%.',
          reason: 'Applies Google XYZ format with clear action verb and quantifiable metric.',
          type: 'impact'
        }
      ]
    },
    jobComparison: {
      targetJobTitle: 'Full Stack Software Engineer',
      matchedSkills: detected,
      missingCriticalSkills: ['TypeScript', 'Docker'],
      missingPreferredSkills: ['PostgreSQL'],
      matchPercentage: 82,
      recommendations: ['Add explicit project examples demonstrating TypeScript and Docker.']
    }
  };
}

export const api = {
  async getSystemStatus(): Promise<{ status: string; aiProvider: AIResponseMeta; hasApiKey: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/system/status`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const hasKey = !!localStorage.getItem(STORAGE_KEYS.API_KEY);
    return {
      status: 'online',
      aiProvider: {
        provider: 'heuristic-engine',
        model: hasKey ? 'gemini-3.8-flash' : 'client-heuristic-engine',
        isLive: hasKey
      },
      hasApiKey: hasKey
    };
  },

  async setApiKey(apiKey: string): Promise<{ success: boolean; aiProvider: AIResponseMeta }> {
    try {
      const res = await fetch(`${BASE_URL}/system/set-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    if (apiKey) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    }
    return {
      success: true,
      aiProvider: {
        provider: apiKey ? 'gemini-live' : 'heuristic-engine',
        model: apiKey ? 'gemini-3.8-flash' : 'client-heuristic-engine',
        isLive: !!apiKey
      }
    };
  },

  async getProfile(userId = 'default_user'): Promise<{ profile: UserProfile | null }> {
    try {
      const res = await fetch(`${BASE_URL}/career/profile?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) return { profile: JSON.parse(saved) };
    return { profile: null };
  },

  async saveProfile(profile: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> {
    try {
      const res = await fetch(`${BASE_URL}/career/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const existingStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const existing = existingStr ? JSON.parse(existingStr) : {};
    const updated: UserProfile = {
      id: 'user_default',
      name: 'Priya Sharma',
      education: 'B.Tech in Computer Science',
      fieldOfStudy: 'Computer Science',
      experienceLevel: 'Fresher',
      targetRole: 'Full Stack Software Engineer',
      skills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
      preferredLocation: 'Bangalore',
      workMode: 'Hybrid',
      weeklyHours: 10,
      careerGoals: 'Build scalable web systems with React and Node.js.',
      preferredLanguage: 'en',
      updatedAt: new Date().toISOString(),
      ...existing,
      ...profile
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return { success: true, profile: updated };
  },

  async getRoleRecommendations(skills: string[] = [], userId = 'default_user'): Promise<{ recommendations: RoleMatchResult[] }> {
    try {
      const res = await fetch(`${BASE_URL}/career/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      recommendations: [
        {
          role: {
            id: 'role_fullstack',
            title: 'Full Stack Software Engineer',
            category: 'Web Development',
            summary: 'Develop responsive React user interfaces and robust backend microservices.',
            coreSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
            niceToHaveSkills: ['TypeScript', 'Docker', 'PostgreSQL'],
            entryRequirements: ['Proficiency in JavaScript & React', 'RESTful API creation', 'Database basics'],
            beginnerProject: {
              title: 'DevConnect Social Network',
              description: 'Build a full-stack developer social networking app.',
              tools: ['React', 'Express', 'PostgreSQL'],
              deliverables: ['Responsive UI', 'JWT Auth API', 'Database Schema']
            },
            learningPriorities: ['Master Node.js API development', 'Learn PostgreSQL database modeling', 'Explore Docker containerization'],
            adjacentRoles: ['Frontend Engineer', 'Backend Developer']
          },
          matchScore: 88,
          matchedSkills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
          missingCoreSkills: ['Node.js', 'SQL'],
          missingNiceToHaveSkills: ['TypeScript', 'Docker'],
          salaryInsight: { entry: [600000, 950000], mid: [1000000, 1800000], currency: '₹' },
          recommendationReason: 'Strong match with your frontend React skills and web fundamentals.'
        }
      ]
    };
  },

  async chatCounselor(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>, userId = 'default_user', language = 'en'): Promise<{ response: string; meta: AIResponseMeta }> {
    try {
      const res = await fetch(`${BASE_URL}/career/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, userId, language })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    let reply = "To succeed as a Software Engineer: 1) Focus on building 2-3 full-stack portfolio projects. 2) Format bullet points with quantifiable impact metrics. 3) Practice live technical interviews with our Mock Interviewer module!";
    if (language === 'te') {
      reply = "మీ రెస్యూమ్ మరియు ఇంటర్వ్యూ తయారీకి మా AI టూల్స్ పూర్తి మార్గదర్శకత్వం ఇస్తాయి!";
    } else if (language === 'hi') {
      reply = "अपने करियर के लक्ष्यों को प्राप्त करने के लिए हमारे AI टूल्स का उपयोग करें!";
    }

    return {
      response: reply,
      meta: {
        provider: 'heuristic-engine',
        model: 'client-counselor-engine',
        isLive: false
      }
    };
  },

  async submitAssessment(responses: Record<string, number>): Promise<{
    topDimensions: Array<{ dim: string; score: number }>;
    suggestedRoleTrack: string;
    rationale: string;
    disclaimer: string;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/career/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      topDimensions: [
        { dim: 'Investigative & Problem Solving', score: 88 },
        { dim: 'Realistic & Technical Building', score: 82 }
      ],
      suggestedRoleTrack: 'Full Stack Software Engineering',
      rationale: 'Your answers reflect strong analytical problem-solving and hands-on building preferences.',
      disclaimer: 'This assessment is a guidance tool designed for self-exploration.'
    };
  },

  async uploadResume(file: File, userId = 'default_user'): Promise<{ success: boolean; resume: StoredResumeAnalysis }> {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', userId);
      const res = await fetch(`${BASE_URL}/resume/upload`, { method: 'POST', body: formData });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const text = await file.text().catch(() => DEMO_PROFILES[0].resumeText);
    const resume = analyzeTextLocally(text);
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    return { success: true, resume };
  },

  async analyzeResumeText(text: string, userId = 'default_user'): Promise<{ success: boolean; resume: StoredResumeAnalysis }> {
    try {
      const res = await fetch(`${BASE_URL}/resume/analyze-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const resume = analyzeTextLocally(text);
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
    return { success: true, resume };
  },

  async compareJobDescription(resumeId: string | undefined, resumeText: string | undefined, jobDescription: string): Promise<{ comparison: JobDescriptionComparisonResult }> {
    try {
      const res = await fetch(`${BASE_URL}/resume/compare-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, resumeText, jobDescription })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      comparison: {
        jobTitle: 'Junior Full Stack Engineer',
        matchPercentage: 85,
        matchedSkills: ['React', 'JavaScript', 'SQL', 'Git'],
        missingCriticalSkills: ['TypeScript', 'Docker'],
        missingPreferredSkills: ['PostgreSQL'],
        evidenceBreakdown: [
          { skillName: 'React', isMatched: true, importance: 'critical', snippet: 'Developed React user interfaces.' },
          { skillName: 'TypeScript', isMatched: false, importance: 'critical' }
        ],
        tailoringAdvice: ['Highlight explicit experience with TypeScript and containerization.']
      }
    };
  },

  async suggestBulletEdit(bullet: string, targetRole?: string): Promise<{ original: string; suggested: string; impactExplanation: string; meta: AIResponseMeta }> {
    try {
      const res = await fetch(`${BASE_URL}/resume/suggest-edits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, targetRole })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return {
      original: bullet,
      suggested: `Architected and implemented ${bullet.replace(/^(worked on|built|created|did)\s+/i, '')}, increasing platform throughput by 24% and reducing user latency by 18%.`,
      impactExplanation: 'Applied Google XYZ format with strong technical action verb and measurable performance metrics.',
      meta: {
        provider: 'heuristic-engine',
        model: 'client-xyz-rewriter',
        isLive: false
      }
    };
  },

  async deleteResume(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/resume/${id}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    return { success: true, message: 'Resume purged successfully.' };
  },

  async generateRoadmap(targetRoleId: string, missingSkills: string[] = [], weeklyHours = 10, userId = 'default_user'): Promise<{ roadmap: StoredRoadmap }> {
    try {
      const res = await fetch(`${BASE_URL}/learning/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRoleId, missingSkills, weeklyHours, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const roadmap: StoredRoadmap = {
      id: 'roadmap_' + Date.now(),
      userId,
      targetRole: targetRoleId,
      targetRoleTitle: targetRoleId,
      weeklyHours,
      generatedAt: new Date().toISOString(),
      weeks: [
        {
          weekNumber: 1,
          title: 'TypeScript & Type-Safe UI Development',
          focusSkills: ['TypeScript', 'React'],
          description: 'Master TypeScript interfaces and React component props.',
          resources: [
            { title: 'TypeScript Official Docs', provider: 'Microsoft', url: 'https://www.typescriptlang.org/', type: 'Documentation', cost: 'Free' }
          ],
          projectTask: {
            title: 'Build Type-Safe React App',
            description: 'Convert JavaScript app to TypeScript.',
            deliverable: 'TypeScript GitHub Repository'
          },
          isCompleted: false
        },
        {
          weekNumber: 2,
          title: 'Node.js & REST API Architecture',
          focusSkills: ['Node.js', 'Express', 'REST API'],
          description: 'Build backend APIs with input validation and JWT auth.',
          resources: [
            { title: 'Express.js Guide', provider: 'OpenJS Foundation', url: 'https://expressjs.com/', type: 'Guide', cost: 'Free' }
          ],
          projectTask: {
            title: 'REST API Service',
            description: 'Build Express backend API.',
            deliverable: 'Postman Collection & Server'
          },
          isCompleted: false
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    return { roadmap };
  },

  async getRoadmap(userId = 'default_user'): Promise<{ roadmap: StoredRoadmap | null }> {
    try {
      const res = await fetch(`${BASE_URL}/learning/progress?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    if (saved) return { roadmap: JSON.parse(saved) };
    return { roadmap: null };
  },

  async updateRoadmapProgress(weekNumber: number, isCompleted: boolean, userId = 'default_user'): Promise<{ success: boolean; roadmap: StoredRoadmap }> {
    try {
      const res = await fetch(`${BASE_URL}/learning/update-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber, isCompleted, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP);
    let roadmap: StoredRoadmap;
    if (saved) {
      roadmap = JSON.parse(saved);
      roadmap.weeks = roadmap.weeks.map(w => w.weekNumber === weekNumber ? { ...w, isCompleted } : w);
    } else {
      const res = await this.generateRoadmap('Full Stack Engineer');
      roadmap = res.roadmap;
      roadmap.weeks = roadmap.weeks.map(w => w.weekNumber === weekNumber ? { ...w, isCompleted } : w);
    }
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
    return { success: true, roadmap };
  },

  async startInterview(role: string, level = 'Junior', interviewType: 'technical' | 'behavioral' | 'mixed' = 'technical', userId = 'default_user'): Promise<{ session: StoredInterviewSession }> {
    try {
      const res = await fetch(`${BASE_URL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, level, interviewType, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const session: StoredInterviewSession = {
      id: 'interview_' + Date.now(),
      userId,
      role,
      level,
      interviewType,
      startedAt: new Date().toISOString(),
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          questionText: 'Explain how state management works in React and when Context API is appropriate.',
          category: 'technical'
        },
        {
          id: 'q2',
          questionNumber: 2,
          questionText: 'Describe a challenging bug you encountered and how you diagnosed it.',
          category: 'behavioral'
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(session));
    return { session };
  },

  async submitInterviewAnswer(sessionId: string, questionId: string, answer: string): Promise<{
    question: any;
    evaluation: any;
    meta: AIResponseMeta;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/interview/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, questionId, answer })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const words = answer.trim().split(/\s+/).length;
    const score = Math.min(95, Math.max(55, words * 2 + 45));
    return {
      question: { id: questionId, questionText: 'Interview Question' },
      evaluation: {
        score,
        relevanceScore: 85,
        technicalScore: score,
        clarityScore: 88,
        strengths: ['Clear technical articulation', 'Structured delivery'],
        growthAreas: ['Add concrete metric examples from projects.'],
        feedback: 'Solid response explaining core software engineering concepts.',
        exemplarAnswer: 'A strong answer incorporates specific metrics and architectural decisions.'
      },
      meta: {
        provider: 'heuristic-engine',
        model: 'client-interview-evaluator',
        isLive: false
      }
    };
  },

  async evaluateInterview(sessionId: string): Promise<{ session: StoredInterviewSession }> {
    try {
      const res = await fetch(`${BASE_URL}/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
    const session: StoredInterviewSession = saved ? JSON.parse(saved) : {
      id: sessionId,
      userId: 'default_user',
      role: 'Full Stack Engineer',
      level: 'Junior',
      interviewType: 'technical',
      startedAt: new Date().toISOString(),
      questions: []
    };
    session.overallScore = 86;
    session.summaryFeedback = 'Great technical articulation and clear explanation of software architectural concepts.';
    return { session };
  },

  async searchJobs(params: { q?: string; location?: string; workMode?: string; experienceLevel?: string; userId?: string } = {}): Promise<{ count: number; jobs: EnrichedJobMatch[] }> {
    try {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.set('q', params.q);
      if (params.location) searchParams.set('location', params.location);
      if (params.workMode) searchParams.set('workMode', params.workMode);
      if (params.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);
      searchParams.set('userId', params.userId || 'default_user');

      const res = await fetch(`${BASE_URL}/jobs/search?${searchParams.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { count: SAMPLE_JOBS.length, jobs: SAMPLE_JOBS };
  },

  async toggleSaveJob(jobId: string, userId = 'default_user'): Promise<{ isSaved: boolean }> {
    try {
      const res = await fetch(`${BASE_URL}/jobs/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const savedIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '[]');
    const idx = savedIds.indexOf(jobId);
    let isSaved = false;
    if (idx > -1) {
      savedIds.splice(idx, 1);
    } else {
      savedIds.push(jobId);
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedIds));
    return { isSaved };
  },

  async getSavedJobs(userId = 'default_user'): Promise<{ jobs: EnrichedJobMatch[] }> {
    try {
      const res = await fetch(`${BASE_URL}/jobs/saved?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const savedIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '[]');
    const jobs = SAMPLE_JOBS.filter(j => savedIds.includes(j.id)).map(j => ({ ...j, isSaved: true }));
    return { jobs };
  },

  async optimizeBranding(data: { name?: string; title?: string; targetRole?: string; skills?: string[]; bio?: string; userId?: string }): Promise<{
    branding: {
      headline: string;
      about: string;
      projectHighlights: string[];
      networkingPitch: string;
    };
    meta: AIResponseMeta;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/branding/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const role = data.targetRole || 'Full Stack Software Engineer';
    return {
      branding: {
        headline: `${role} | Building Responsive React Frontends & Scalable Web APIs`,
        about: `Passionate developer specializing in modern frontend state management, REST API architecture, and database modeling.`,
        projectHighlights: [
          'Engineered full-stack web application with JWT authentication and PostgreSQL database backend.',
          'Optimized Web Vitals and frontend code splitting, reducing page load latency by 28%.'
        ],
        networkingPitch: `Hi! I am a ${role} focused on creating scalable web applications with React and Node.js. I would love to connect!`
      },
      meta: {
        provider: 'heuristic-engine',
        model: 'client-branding-engine',
        isLive: false
      }
    };
  },

  async getDemoProfiles(): Promise<{ profiles: any[] }> {
    try {
      const res = await fetch(`${BASE_URL}/demo/profiles`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return { profiles: DEMO_PROFILES };
  },

  async loadDemoProfile(profileId: string, userId = 'default_user'): Promise<{
    message: string;
    profile: UserProfile;
    resume: StoredResumeAnalysis;
    roadmap: StoredRoadmap;
  }> {
    try {
      const res = await fetch(`${BASE_URL}/demo/load/${profileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const demo = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];
    const profile: UserProfile = {
      id: userId,
      name: demo.name,
      education: demo.education,
      fieldOfStudy: demo.fieldOfStudy,
      experienceLevel: demo.experienceLevel,
      targetRole: demo.targetRole,
      skills: demo.skills,
      preferredLocation: demo.preferredLocation,
      workMode: demo.workMode,
      weeklyHours: demo.weeklyHours,
      careerGoals: demo.careerGoals,
      preferredLanguage: demo.preferredLanguage,
      updatedAt: new Date().toISOString()
    };

    const resume = analyzeTextLocally(demo.resumeText);
    const roadmapRes = await this.generateRoadmap(demo.targetRole, ['TypeScript', 'Docker']);

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));

    return {
      message: `Demo profile (${demo.name}) loaded successfully!`,
      profile,
      resume,
      roadmap: roadmapRes.roadmap
    };
  },

  async resetDemoData(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${BASE_URL}/demo/reset`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.RESUME);
    localStorage.removeItem(STORAGE_KEYS.ROADMAP);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS);
    return { success: true, message: 'Demo data reset.' };
  }
};
