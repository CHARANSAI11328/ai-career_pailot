import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AIRouter } from '../ai/aiRouter.js';
import { storage, StoredResumeAnalysis } from '../db/storage.js';
import { CareerMatcher } from '../services/careerMatcher.js';
import { ContactExtractor } from '../services/contactExtractor.js';
import { DocumentParser } from '../services/documentParser.js';
import { ScoringEngine } from '../services/scoringEngine.js';
import { SkillExtractor } from '../services/skillExtractor.js';

export const resumeRoutes = Router();

// Configure in-memory upload (no permanent disk storage of raw documents)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  storage: multer.memoryStorage()
});

// Upload and analyze resume file
resumeRoutes.post('/upload', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file (PDF, DOCX, or TXT).' });
    }

    const userId = (req.body.userId as string) || 'default_user';
    const parsedDoc = await DocumentParser.parse(req.file.buffer, req.file.originalname, req.file.mimetype);

    // Segment sections
    const sections = DocumentParser.segmentSections(parsedDoc.text);

    // Extract contact
    const contactInfo = ContactExtractor.extract(parsedDoc.text);

    // Extract skills
    const extractedSkills = SkillExtractor.extractSkills(parsedDoc.text);
    const skillNames = extractedSkills.map(s => s.name);

    // Deterministic scoring & feedback
    const evaluation = ScoringEngine.evaluate(parsedDoc.text, sections, extractedSkills);

    const resumeRecord: StoredResumeAnalysis = {
      id: uuidv4(),
      userId,
      fileName: req.file.originalname,
      fileType: parsedDoc.format,
      uploadedAt: new Date().toISOString(),
      rawText: parsedDoc.text,
      parsedSections: sections,
      contactInfo,
      extractedSkills: skillNames,
      heuristicScore: evaluation.scores,
      feedback: evaluation.feedback
    };

    storage.saveResume(resumeRecord);

    // Optionally update user's profile skills with detected skills
    const profile = storage.getProfile(userId);
    if (profile) {
      const merged = Array.from(new Set([...profile.skills, ...skillNames]));
      profile.skills = merged;
      storage.saveProfile(profile);
    }

    return res.json({
      success: true,
      resume: resumeRecord,
      isScannedSuspect: parsedDoc.isScannedSuspect,
      wordCount: parsedDoc.wordCount
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Analyze raw text directly (e.g. pasted text or sample demo resume)
resumeRoutes.post('/analyze-text', (req: Request, res: Response) => {
  try {
    const { text, userId = 'default_user', fileName = 'pasted_resume.txt' } = req.body;
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide at least 50 characters of resume text.' });
    }

    const cleanText = DocumentParser.normalize(text);
    const sections = DocumentParser.segmentSections(cleanText);
    const contactInfo = ContactExtractor.extract(cleanText);
    const extractedSkills = SkillExtractor.extractSkills(cleanText);
    const skillNames = extractedSkills.map(s => s.name);
    const evaluation = ScoringEngine.evaluate(cleanText, sections, extractedSkills);

    const resumeRecord: StoredResumeAnalysis = {
      id: uuidv4(),
      userId,
      fileName,
      fileType: 'txt',
      uploadedAt: new Date().toISOString(),
      rawText: cleanText,
      parsedSections: sections,
      contactInfo,
      extractedSkills: skillNames,
      heuristicScore: evaluation.scores,
      feedback: evaluation.feedback
    };

    storage.saveResume(resumeRecord);

    return res.json({
      success: true,
      resume: resumeRecord
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Compare resume with Job Description
resumeRoutes.post('/compare-job', (req: Request, res: Response) => {
  try {
    const { resumeId, resumeText, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ error: 'Please provide a job description of at least 30 characters.' });
    }

    let textToUse = resumeText;
    let candidateSkills: string[] = [];

    if (resumeId) {
      const stored = storage.getResume(resumeId);
      if (stored) {
        textToUse = stored.rawText;
        candidateSkills = stored.extractedSkills;
      }
    }

    if (!textToUse) {
      return res.status(400).json({ error: 'No resume text or valid resumeId provided.' });
    }

    const comparison = CareerMatcher.compareWithJobDescription(
      candidateSkills,
      textToUse,
      jobDescription
    );

    return res.json({
      success: true,
      comparison
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Suggest rewrite for bullet point
resumeRoutes.post('/suggest-edits', async (req: Request, res: Response) => {
  try {
    const { bullet, targetRole } = req.body;
    if (!bullet || !bullet.trim()) {
      return res.status(400).json({ error: 'Bullet text is required.' });
    }

    const result = await AIRouter.rewriteBullet(bullet, targetRole);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get resume by ID
resumeRoutes.get('/:id', (req: Request, res: Response) => {
  const resumeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const resume = storage.getResume(resumeId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found.' });
  }
  return res.json({ resume });
});

// Delete resume (privacy control)
resumeRoutes.delete('/:id', (req: Request, res: Response) => {
  const resumeId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const resume = storage.getResume(resumeId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found.' });
  }
  // Remove from storage
  delete (storage as any).data.resumes[resumeId];
  (storage as any).save();
  return res.json({ success: true, message: 'Resume records and parsed text deleted permanently.' });
});
