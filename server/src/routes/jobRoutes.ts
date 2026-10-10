import { Router, Request, Response } from 'express';
import { storage } from '../db/storage.js';
import { JobMarketService } from '../services/jobMarketService.js';

export const jobRoutes = Router();

// Search jobs with personalized match calculation
jobRoutes.get('/search', (req: Request, res: Response) => {
  try {
    const {
      q,
      location,
      workMode,
      experienceLevel,
      userId = 'default_user'
    } = req.query;

    const profile = storage.getProfile(userId as string);
    const savedJobs = storage.getSavedJobs(userId as string);

    const candidateSkills = profile?.skills || [];

    const jobs = JobMarketService.searchJobs(
      q as string,
      location as string,
      workMode as string,
      experienceLevel as string,
      candidateSkills,
      savedJobs
    );

    return res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Toggle save job
jobRoutes.post('/save', (req: Request, res: Response) => {
  try {
    const { userId = 'default_user', jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required.' });
    }

    const isSaved = storage.toggleSaveJob(userId, jobId);
    return res.json({ success: true, jobId, isSaved });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user saved jobs
jobRoutes.get('/saved', (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'default_user';
    const profile = storage.getProfile(userId);
    const savedJobIds = storage.getSavedJobs(userId);

    const allJobs = JobMarketService.searchJobs(
      undefined,
      undefined,
      undefined,
      undefined,
      profile?.skills || [],
      savedJobIds
    );

    const savedList = allJobs.filter(j => savedJobIds.includes(j.id));
    return res.json({ success: true, count: savedList.length, jobs: savedList });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
