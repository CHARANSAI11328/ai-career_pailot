import { Router, Request, Response } from 'express';
import { AIRouter } from '../ai/aiRouter.js';
import { storage } from '../db/storage.js';

export const systemRoutes = Router();

systemRoutes.get('/status', (req: Request, res: Response) => {
  const providerMeta = AIRouter.getProviderStatus();
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiProvider: providerMeta,
    hasApiKey: !!storage.getApiKey()
  });
});

systemRoutes.post('/set-api-key', (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a valid API key string.' });
    }

    storage.setApiKey(apiKey.trim());
    const providerMeta = AIRouter.getProviderStatus();

    return res.json({
      success: true,
      message: 'Gemini API key updated successfully.',
      aiProvider: providerMeta
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
