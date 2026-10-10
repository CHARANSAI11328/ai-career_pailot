import { Router, Request, Response } from 'express';
import { AIRouter } from '../ai/aiRouter.js';
import { storage } from '../db/storage.js';
import { InterviewService } from '../services/interviewService.js';

export const interviewRoutes = Router();

// Start interview session
interviewRoutes.post('/start', (req: Request, res: Response) => {
  try {
    const { userId = 'default_user', role = 'Full Stack Software Engineer', level = 'Junior', interviewType = 'technical' } = req.body;

    const session = InterviewService.createSession(
      userId,
      role,
      level,
      interviewType
    );

    storage.saveInterview(session);

    return res.json({
      success: true,
      session
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Submit answer for a question
interviewRoutes.post('/answer', async (req: Request, res: Response) => {
  try {
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer) {
      return res.status(400).json({ error: 'sessionId, questionId, and answer are required.' });
    }

    const session = storage.getInterview(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const question = session.questions.find(q => q.id === questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found in this session.' });
    }

    question.userAnswer = answer;
    question.answeredAt = new Date().toISOString();

    // Evaluate answer via AIRouter
    const evalResult = await AIRouter.evaluateInterviewAnswer(
      question.questionText,
      answer,
      question.category,
      session.role
    );

    question.evaluation = evalResult.evaluation;
    storage.saveInterview(session);

    return res.json({
      success: true,
      question,
      evaluation: evalResult.evaluation,
      meta: evalResult.meta
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Finalize and summarize interview session
interviewRoutes.post('/evaluate', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const session = storage.getInterview(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const answered = session.questions.filter(q => q.evaluation);
    const overallScore = answered.length > 0
      ? Math.round(answered.reduce((acc, q) => acc + (q.evaluation?.score || 0), 0) / answered.length)
      : 0;

    session.completedAt = new Date().toISOString();
    session.overallScore = overallScore;

    let summary = '';
    if (overallScore >= 80) {
      summary = `Excellent performance! Demonstrated clear technical depth, articulate communication, and strong problem-solving readiness for ${session.role}.`;
    } else if (overallScore >= 60) {
      summary = `Good foundational readiness. Focus on providing more concrete numerical results and structured STAR responses to land top-tier offers.`;
    } else {
      summary = `Needs additional preparation. Practice technical explanations out loud and review core architectural concepts before live interviews.`;
    }

    session.summaryFeedback = summary;
    storage.saveInterview(session);

    return res.json({
      success: true,
      session
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Get interview session
interviewRoutes.get('/session/:id', (req: Request, res: Response) => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const session = storage.getInterview(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found.' });
  }
  return res.json({ session });
});
