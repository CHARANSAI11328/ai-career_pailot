import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AIRouter } from '../ai/aiRouter.js';
import { storage, UserProfile } from '../db/storage.js';
import { CareerMatcher } from '../services/careerMatcher.js';

export const careerRoutes = Router();

// Save / update profile
careerRoutes.post('/profile', (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      email,
      education,
      fieldOfStudy,
      experienceLevel,
      targetRole,
      skills,
      preferredLocation,
      workMode,
      weeklyHours,
      expectedSalary,
      careerGoals,
      preferredLanguage
    } = req.body;

    const profileId = id || 'default_user';
    const profile: UserProfile = {
      id: profileId,
      name: name || 'Career Seeker',
      email,
      education: education || 'Undergraduate',
      fieldOfStudy: fieldOfStudy || 'Computer Science',
      experienceLevel: experienceLevel || 'Student',
      targetRole: targetRole || 'Full Stack Software Engineer',
      skills: Array.isArray(skills) ? skills : [],
      preferredLocation: preferredLocation || 'Remote / Hybrid',
      workMode: workMode || 'Hybrid',
      weeklyHours: Number(weeklyHours) || 10,
      expectedSalary,
      careerGoals: careerGoals || 'Secure an impactful software engineering position.',
      preferredLanguage: preferredLanguage || 'en',
      updatedAt: new Date().toISOString()
    };

    storage.saveProfile(profile);
    return res.json({ success: true, profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user profile
careerRoutes.get('/profile', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const profile = storage.getProfile(userId);
  return res.json({ profile });
});

// Recommend career paths based on profile skills
careerRoutes.post('/recommend', (req: Request, res: Response) => {
  try {
    const { skills, userId } = req.body;
    let candidateSkills: string[] = [];

    if (Array.isArray(skills) && skills.length > 0) {
      candidateSkills = skills;
    } else if (userId) {
      const p = storage.getProfile(userId);
      candidateSkills = p?.skills || [];
    }

    const matches = CareerMatcher.matchAgainstRoles(candidateSkills);
    return res.json({
      success: true,
      count: matches.length,
      recommendations: matches
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Career counseling interactive chat
careerRoutes.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userId = 'default_user', language = 'en' } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const profile = storage.getProfile(userId);
    const result = await AIRouter.counsel(message, history, profile, language);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Career Interest Questionnaire Assessment
careerRoutes.post('/assess', (req: Request, res: Response) => {
  try {
    // 6 dimensions: building, analytical, helping, business, creative, operational
    const { responses } = req.body; // e.g. { building: 4, analytical: 5, helping: 2, business: 3, creative: 3, operational: 2 }

    const dims = responses || { building: 4, analytical: 4, helping: 3, business: 3, creative: 2, operational: 3 };

    // Calculate top dimensions
    const sorted = Object.entries(dims)
      .map(([dim, score]) => ({ dim, score: Number(score) }))
      .sort((a, b) => b.score - a.score);

    const primary = sorted[0]?.dim || 'building';
    const secondary = sorted[1]?.dim || 'analytical';

    let suggestedRoleTrack = 'Full Stack Software Engineer';
    let rationale = '';

    if (primary === 'analytical' && secondary === 'building') {
      suggestedRoleTrack = 'AI / Machine Learning Engineer';
      rationale = 'High affinity for rigorous analytical problem solving and scientific data modeling.';
    } else if (primary === 'building' && secondary === 'operational') {
      suggestedRoleTrack = 'Cloud & DevOps Platform Engineer';
      rationale = 'Strong drive to construct reliable infrastructure, automate workflows, and maintain operational stability.';
    } else if (primary === 'analytical' && secondary === 'business') {
      suggestedRoleTrack = 'Data Analyst & Analytics Engineer';
      rationale = 'Combines data manipulation with translating analytical insights into business decisions.';
    } else if (primary === 'business' || primary === 'helping') {
      suggestedRoleTrack = 'Technical Product Manager';
      rationale = 'Empathy for user needs coupled with strategic prioritization and cross-functional leadership.';
    } else {
      suggestedRoleTrack = 'Full Stack Software Engineer';
      rationale = 'Enjoys end-to-end hands-on creation of software systems, interfaces, and APIs.';
    }

    return res.json({
      success: true,
      topDimensions: sorted.slice(0, 3),
      suggestedRoleTrack,
      rationale,
      disclaimer: 'This assessment maps your reported task preferences to career themes. It is an exploration guide, not a fixed psychometric constraint.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
