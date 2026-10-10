import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DEMO_PROFILES } from '../data/sampleProfiles.js';
import { storage, UserProfile, StoredResumeAnalysis } from '../db/storage.js';
import { CareerMatcher } from '../services/careerMatcher.js';
import { ContactExtractor } from '../services/contactExtractor.js';
import { DocumentParser } from '../services/documentParser.js';
import { RoadmapGenerator } from '../services/roadmapGenerator.js';
import { ScoringEngine } from '../services/scoringEngine.js';
import { SkillExtractor } from '../services/skillExtractor.js';

export const demoRoutes = Router();

// Get list of demo profiles
demoRoutes.get('/profiles', (req: Request, res: Response) => {
  return res.json({ profiles: DEMO_PROFILES });
});

// Load demo profile into active user session
demoRoutes.post('/load/:profileId', (req: Request, res: Response) => {
  try {
    const profileDef = DEMO_PROFILES.find(p => p.id === req.params.profileId) || DEMO_PROFILES[0];
    const userId = (req.body.userId as string) || 'default_user';

    // 1. Create Profile
    const profile: UserProfile = {
      id: userId,
      name: profileDef.name,
      education: profileDef.education,
      fieldOfStudy: profileDef.education.includes('Data') ? 'Data Science' : 'Computer Science',
      experienceLevel: profileDef.experienceYears === 0 ? 'Fresher' : '1-3 years',
      targetRole: profileDef.targetRole,
      skills: profileDef.skills,
      preferredLocation: 'Bangalore / Remote',
      workMode: 'Hybrid',
      weeklyHours: 12,
      careerGoals: profileDef.bio,
      preferredLanguage: 'en',
      updatedAt: new Date().toISOString()
    };
    storage.saveProfile(profile);

    // 2. Parse and analyze resume
    const cleanText = DocumentParser.normalize(profileDef.resumeText);
    const sections = DocumentParser.segmentSections(cleanText);
    const contactInfo = ContactExtractor.extract(cleanText);
    const extractedSkills = SkillExtractor.extractSkills(cleanText);
    const skillNames = extractedSkills.map(s => s.name);
    const evaluation = ScoringEngine.evaluate(cleanText, sections, extractedSkills);

    // Compare with target job
    const jobComparison = CareerMatcher.compareWithJobDescription(
      skillNames,
      cleanText,
      profileDef.targetJobDescription
    );

    const resumeRecord: StoredResumeAnalysis = {
      id: `demo_resume_${profileDef.id}`,
      userId,
      fileName: `${profileDef.name.replace(/\s+/g, '_')}_Resume.pdf`,
      fileType: 'pdf',
      uploadedAt: new Date().toISOString(),
      rawText: cleanText,
      parsedSections: sections,
      contactInfo,
      extractedSkills: skillNames,
      heuristicScore: evaluation.scores,
      feedback: evaluation.feedback,
      jobComparison: {
        targetJobTitle: profileDef.targetRole,
        matchedSkills: jobComparison.matchedSkills,
        missingCriticalSkills: jobComparison.missingCriticalSkills,
        missingPreferredSkills: jobComparison.missingPreferredSkills,
        matchPercentage: jobComparison.matchPercentage,
        recommendations: jobComparison.tailoringAdvice
      }
    };
    storage.saveResume(resumeRecord);

    // 3. Generate Roadmap
    const roadmap = RoadmapGenerator.generate(
      userId,
      profileDef.id === 'demo_ai_ml' ? 'ai_ml_engineer' : 'fullstack_developer',
      jobComparison.missingCriticalSkills,
      12
    );
    storage.saveRoadmap(roadmap);

    return res.json({
      success: true,
      message: `Demo profile for ${profileDef.name} loaded successfully into active session.`,
      profile,
      resume: resumeRecord,
      roadmap
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Reset demo data
demoRoutes.post('/reset', (req: Request, res: Response) => {
  storage.resetDemoData();
  return res.json({ success: true, message: 'All demo and session data has been reset to clean state.' });
});
