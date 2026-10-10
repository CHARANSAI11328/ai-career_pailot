import { Router, Request, Response } from 'express';
import { storage } from '../db/storage.js';
import { RoadmapGenerator } from '../services/roadmapGenerator.js';

export const roadmapRoutes = Router();

// Generate roadmap
roadmapRoutes.post('/roadmap', (req: Request, res: Response) => {
  try {
    const { userId = 'default_user', targetRoleId, missingSkills = [], weeklyHours = 10 } = req.body;

    const roadmap = RoadmapGenerator.generate(
      userId,
      targetRoleId || 'fullstack_developer',
      Array.isArray(missingSkills) ? missingSkills : [],
      Number(weeklyHours) || 10
    );

    storage.saveRoadmap(roadmap);

    return res.json({
      success: true,
      roadmap
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user roadmap
roadmapRoutes.get('/progress', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const roadmap = storage.getRoadmapByUser(userId);
  return res.json({ roadmap });
});

// Update weekly completion status
roadmapRoutes.post('/update-progress', (req: Request, res: Response) => {
  try {
    const { userId = 'default_user', weekNumber, isCompleted } = req.body;
    const roadmap = storage.getRoadmapByUser(userId);

    if (!roadmap) {
      return res.status(404).json({ error: 'No active roadmap found for user.' });
    }

    const week = roadmap.weeks.find(w => w.weekNumber === Number(weekNumber));
    if (week) {
      week.isCompleted = Boolean(isCompleted);
      storage.saveRoadmap(roadmap);
    }

    return res.json({ success: true, roadmap });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
