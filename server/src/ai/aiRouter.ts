import { GeminiProvider } from './geminiProvider.js';
import { HeuristicEngine } from './heuristicEngine.js';
import { storage } from '../db/storage.js';

export interface AIResponseMeta {
  provider: 'gemini-live' | 'heuristic-engine';
  model: string;
  isLive: boolean;
  notes?: string;
}

export class AIRouter {
  private static gemini: GeminiProvider = new GeminiProvider();

  public static getProviderStatus(): AIResponseMeta {
    const key = storage.getApiKey();
    if (key && key.trim().length > 10) {
      this.gemini.init(key);
      return {
        provider: 'gemini-live',
        model: 'gemini-3.8-flash',
        isLive: true,
        notes: 'Connected to live Google Gemini 3.8 Flash API.'
      };
    }

    return {
      provider: 'heuristic-engine',
      model: 'deterministic-nlp-v1',
      isLive: false,
      notes: 'Operating in heuristic demo mode. Supply a GEMINI_API_KEY to activate live generative inference.'
    };
  }

  /**
   * Career counseling conversation
   */
  public static async counsel(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    userProfile?: any,
    language: 'en' | 'te' | 'hi' = 'en'
  ): Promise<{ response: string; meta: AIResponseMeta }> {
    const status = this.getProviderStatus();

    if (status.isLive) {
      try {
        const langInstructions = {
          en: 'Respond in professional English.',
          te: 'Respond primarily in Telugu (తెలుగు) with appropriate technical English terms in parentheses.',
          hi: 'Respond primarily in Hindi (हिन्दी) with appropriate technical English terms in parentheses.'
        };

        const sysPrompt = `You are CareerPilot AI, an elite career counselor, tech recruiter, and career strategist.
User Profile:
- Education: ${userProfile?.education || 'Not specified'}
- Current Skills: ${userProfile?.skills?.join(', ') || 'Not specified'}
- Target Role: ${userProfile?.targetRole || 'Software Engineering'}
- Experience: ${userProfile?.experienceLevel || 'Entry level'}
- Goals: ${userProfile?.careerGoals || 'Career growth'}

Guidelines:
- Give evidence-based, actionable guidance.
- Break advice into structured bullet points with clear next steps.
- Do not claim deterministic certainty about hiring decisions.
- ${langInstructions[language] || langInstructions.en}`;

        const prompt = `Conversation history:
${history.map(h => `${h.role}: ${h.content}`).join('\n')}
user: ${userMessage}

Respond as the AI Career Counselor.`;

        const text = await this.gemini.generateText(prompt, sysPrompt);
        return { response: text, meta: status };
      } catch (err: any) {
        console.warn('Gemini counsel call failed, falling back to heuristic engine:', err.message);
      }
    }

    const fallback = HeuristicEngine.handleCareerCounseling(userMessage, history, userProfile, language);
    return {
      response: fallback,
      meta: {
        provider: 'heuristic-engine',
        model: 'deterministic-nlp-v1',
        isLive: false,
        notes: 'Generated via rule-based career guidance heuristic engine.'
      }
    };
  }

  /**
   * Rewrite resume bullet point
   */
  public static async rewriteBullet(
    bullet: string,
    roleContext?: string
  ): Promise<{
    original: string;
    suggested: string;
    impactExplanation: string;
    meta: AIResponseMeta;
  }> {
    const status = this.getProviderStatus();

    if (status.isLive) {
      try {
        const prompt = `Rewrite this resume bullet point using the Google XYZ framework ("Accomplished [X] as measured by [Y], by doing [Z]").
Original bullet: "${bullet}"
Target role context: "${roleContext || 'Software Engineer'}"

Rules:
- DO NOT invent false employment, degrees, or certifications.
- Enhance active verbs, clarity, and emphasize realistic quantifiable outcomes.
- Return ONLY valid JSON in this format:
{
  "original": "...",
  "suggested": "...",
  "impactExplanation": "..."
}`;
        const result = await this.gemini.generateJSON<{ original: string; suggested: string; impactExplanation: string }>(prompt);
        return { ...result, meta: status };
      } catch (err: any) {
        console.warn('Gemini bullet rewrite failed, falling back to heuristic:', err.message);
      }
    }

    const fallback = HeuristicEngine.rewriteBulletPoints(bullet, roleContext);
    return {
      ...fallback,
      meta: {
        provider: 'heuristic-engine',
        model: 'deterministic-nlp-v1',
        isLive: false
      }
    };
  }

  /**
   * Evaluate mock interview response
   */
  public static async evaluateInterviewAnswer(
    questionText: string,
    userAnswer: string,
    category: string,
    role: string
  ): Promise<{
    evaluation: {
      score: number;
      relevanceScore: number;
      technicalScore: number;
      clarityScore: number;
      strengths: string[];
      growthAreas: string[];
      feedback: string;
      exemplarAnswer: string;
    };
    meta: AIResponseMeta;
  }> {
    const status = this.getProviderStatus();

    if (status.isLive) {
      try {
        const prompt = `You are an expert technical interviewer evaluating a candidate for the role: ${role}.
Question: "${questionText}"
Category: "${category}"
Candidate's Answer: "${userAnswer}"

Evaluate the answer strictly based on:
1. Relevance (did it directly answer the prompt?)
2. Technical accuracy / domain validity
3. Clarity and structure (e.g. STAR method for behavioral)

Return ONLY valid JSON matching this schema:
{
  "score": <number 0-100>,
  "relevanceScore": <number 0-100>,
  "technicalScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "strengths": ["string", "string"],
  "growthAreas": ["string", "string"],
  "feedback": "string summarizing actionable coaching advice",
  "exemplarAnswer": "string demonstrating an ideal high-scoring answer"
}`;
        const evalJson = await this.gemini.generateJSON<any>(prompt);
        return { evaluation: evalJson, meta: status };
      } catch (err: any) {
        console.warn('Gemini interview evaluation failed, falling back to heuristic:', err.message);
      }
    }

    // Heuristic fallback
    const { InterviewService } = await import('../services/interviewService.js');
    const fallback = InterviewService.evaluateAnswerHeuristic(questionText, userAnswer, category);
    return {
      evaluation: fallback,
      meta: {
        provider: 'heuristic-engine',
        model: 'deterministic-nlp-v1',
        isLive: false
      }
    };
  }

  /**
   * Generate LinkedIn branding
   */
  public static async generateBranding(
    profile: {
      name: string;
      title: string;
      targetRole: string;
      skills: string[];
      bio?: string;
    }
  ): Promise<{
    branding: {
      headline: string;
      about: string;
      projectHighlights: string[];
      networkingPitch: string;
    };
    meta: AIResponseMeta;
  }> {
    const status = this.getProviderStatus();

    if (status.isLive) {
      try {
        const prompt = `Create an optimized LinkedIn profile and professional branding package for:
Name: ${profile.name}
Current Title: ${profile.title}
Target Role: ${profile.targetRole}
Skills: ${profile.skills.join(', ')}
Bio: ${profile.bio || 'Motivated professional'}

Return ONLY valid JSON in this format:
{
  "headline": "string",
  "about": "string with paragraphs and call to action",
  "projectHighlights": ["bullet 1", "bullet 2"],
  "networkingPitch": "personalized cold message to a recruiter or engineering manager"
}`;
        const brandingJson = await this.gemini.generateJSON<any>(prompt);
        return { branding: brandingJson, meta: status };
      } catch (err: any) {
        console.warn('Gemini branding generation failed, falling back to heuristic:', err.message);
      }
    }

    const fallback = HeuristicEngine.generateBranding(profile);
    return {
      branding: fallback,
      meta: {
        provider: 'heuristic-engine',
        model: 'deterministic-nlp-v1',
        isLive: false
      }
    };
  }
}
