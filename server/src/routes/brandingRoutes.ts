import { Router, Request, Response } from 'express';
import { AIRouter } from '../ai/aiRouter.js';
import { storage } from '../db/storage.js';

export const brandingRoutes = Router();

brandingRoutes.post('/optimize', async (req: Request, res: Response) => {
  try {
    const { userId = 'default_user', name, title, targetRole, skills, bio } = req.body;

    const profile = storage.getProfile(userId);

    const inputData = {
      name: name || profile?.name || 'Candidate',
      title: title || profile?.education || 'Software Developer',
      targetRole: targetRole || profile?.targetRole || 'Full Stack Software Engineer',
      skills: Array.isArray(skills) && skills.length > 0 ? skills : (profile?.skills || ['JavaScript', 'React', 'Node.js']),
      bio: bio || profile?.careerGoals
    };

    const result = await AIRouter.generateBranding(inputData);
    return res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
