import { v4 as uuidv4 } from 'uuid';
import { StoredInterviewSession } from '../db/storage.js';

export interface QuestionTemplate {
  category: string;
  questionText: string;
  roleHint?: string;
  idealAnswerPoints: string[];
}

export const QUESTION_BANK: Record<string, QuestionTemplate[]> = {
  technical: [
    {
      category: 'Frontend & Architecture',
      questionText: 'Can you explain how the virtual DOM works in React and how React 18 uses fiber architecture and concurrent features to optimize re-renders?',
      idealAnswerPoints: [
        'Explaining tree reconciliation and diffing algorithm',
        'Batching state updates automatically in React 18',
        'Interruptible rendering and priority lanes in Fiber',
        'Avoiding unnecessary renders with useMemo, useCallback, or memo'
      ]
    },
    {
      category: 'Backend & Databases',
      questionText: 'How would you design a rate limiter middleware for a high-traffic REST API in Node.js? What storage and algorithms would you choose?',
      idealAnswerPoints: [
        'Mentioning algorithms like Token Bucket, Leaky Bucket, or Sliding Window Counter',
        'Using Redis with atomic INCR and EXPIRE operations or Lua scripts for low latency',
        'Handling multi-server distributed consistency',
        'Returning standard HTTP 429 Too Many Requests with Retry-After header'
      ]
    },
    {
      category: 'Data Structures & System Design',
      questionText: 'Suppose you have a database table with 10 million rows and a query is running slowly. How do you diagnose the bottleneck and optimize the query?',
      idealAnswerPoints: [
        'Using EXPLAIN ANALYZE to inspect execution plan',
        'Checking for sequential table scans vs index scans',
        'Adding B-Tree or compound indexes on filter and join columns',
        'Eliminating SELECT * and analyzing query caching'
      ]
    },
    {
      category: 'Machine Learning & AI',
      questionText: 'What is the difference between Precision and Recall, and how do you choose which metric to optimize for in an imbalanced classification problem like fraud detection?',
      idealAnswerPoints: [
        'Defining Precision (TP / (TP + FP)) and Recall (TP / (TP + FN))',
        'Explaining that in fraud detection or medical diagnosis, missing a positive (false negative) is catastrophic, so Recall is prioritized',
        'Balancing trade-offs with F1-score or PR-AUC curves',
        'Techniques for handling imbalance (SMOTE, class weights)'
      ]
    }
  ],
  behavioral: [
    {
      category: 'Conflict Resolution (STAR)',
      questionText: 'Tell me about a time you had a technical disagreement with a teammate or lead regarding an architecture or implementation choice. How did you resolve it?',
      idealAnswerPoints: [
        'Situation: Context of the project and differing viewpoints',
        'Task: The objective of reaching the best engineering outcome without friction',
        'Action: Relying on objective benchmarks, prototypes, or trade-off matrices rather than personal ego',
        'Result: Successful resolution, team alignment, and lessons learned'
      ]
    },
    {
      category: 'Handling Setbacks & Deadlines',
      questionText: 'Describe a situation where a project you were working on was falling behind schedule or encountered an unexpected critical roadblock. How did you manage it?',
      idealAnswerPoints: [
        'Proactive communication with stakeholders early',
        'Ruthless prioritization and scope trimming (MVP delivery)',
        'Root cause debugging and unblocking the team',
        'Shipping on revised milestones without sacrificing quality'
      ]
    },
    {
      category: 'Continuous Learning',
      questionText: 'Walk me through a recent complex technical tool, library, or framework you learned from scratch. How did you approach mastering it and applying it practically?',
      idealAnswerPoints: [
        'Clear motivation for learning the technology',
        'Hands-on build approach rather than just passive reading',
        'Building a proof of concept or contributing to production',
        'Sharing findings with peers through documentation or a tech talk'
      ]
    }
  ],
  mixed: []
};

// Combine for mixed
QUESTION_BANK.mixed = [...QUESTION_BANK.technical, ...QUESTION_BANK.behavioral];

export class InterviewService {
  /**
   * Initializes a mock interview session with 3 questions
   */
  public static createSession(
    userId: string,
    role: string,
    level: string,
    interviewType: 'technical' | 'behavioral' | 'mixed'
  ): StoredInterviewSession {
    const bank = QUESTION_BANK[interviewType] || QUESTION_BANK.technical;
    // Shuffle and pick 3 questions
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const questions = selected.map((q, idx) => ({
      id: uuidv4(),
      questionNumber: idx + 1,
      questionText: q.questionText,
      category: q.category
    }));

    return {
      id: uuidv4(),
      userId,
      role,
      level,
      interviewType,
      startedAt: new Date().toISOString(),
      questions
    };
  }

  /**
   * Deterministic evaluation rubric for answers (works offline or when AI is in heuristic mode)
   */
  public static evaluateAnswerHeuristic(
    questionText: string,
    answerText: string,
    category: string
  ): {
    score: number;
    relevanceScore: number;
    technicalScore: number;
    clarityScore: number;
    strengths: string[];
    growthAreas: string[];
    feedback: string;
    exemplarAnswer: string;
  } {
    const trimmed = answerText.trim();
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    let relevanceScore = 70;
    let technicalScore = 70;
    let clarityScore = 75;
    const strengths: string[] = [];
    const growthAreas: string[] = [];

    // Length analysis
    if (wordCount < 25) {
      relevanceScore = 40;
      technicalScore = 35;
      clarityScore = 40;
      growthAreas.push('Response is too brief. Elaborate with specific details, examples, and technical context.');
    } else if (wordCount >= 60) {
      strengths.push('Detailed, substantive response providing adequate context.');
      relevanceScore = Math.min(95, relevanceScore + 15);
      technicalScore = Math.min(95, technicalScore + 15);
    }

    // Check STAR structure for behavioral
    if (category.toLowerCase().includes('star') || category.toLowerCase().includes('conflict') || category.toLowerCase().includes('behavioral')) {
      const lower = trimmed.toLowerCase();
      const hasSituation = lower.includes('situation') || lower.includes('when i was') || lower.includes('at my previous');
      const hasAction = lower.includes('i implemented') || lower.includes('i decided') || lower.includes('action') || lower.includes('i built');
      const hasResult = lower.includes('result') || lower.includes('outcome') || lower.includes('increased') || lower.includes('learned');

      if (hasSituation && hasAction && hasResult) {
        strengths.push('Strong structural adherence to the STAR (Situation, Task, Action, Result) framework.');
        clarityScore = 95;
      } else {
        growthAreas.push('Structure your answer more clearly using the STAR framework: explicitly state the Situation, your specific Action, and the measurable Result.');
      }
    }

    // Check technical keyword richness
    const techTerms = ['architecture', 'performance', 'latency', 'scale', 'database', 'security', 'test', 'cache', 'optimize', 'api', 'model'];
    const matchedTerms = techTerms.filter(t => trimmed.toLowerCase().includes(t));
    if (matchedTerms.length >= 2) {
      strengths.push(`Good command of technical domain terminology (${matchedTerms.slice(0, 3).join(', ')}).`);
      technicalScore = Math.min(95, technicalScore + 10);
    }

    const overallScore = Math.round((relevanceScore * 0.4) + (technicalScore * 0.4) + (clarityScore * 0.2));

    let feedback = '';
    if (overallScore >= 80) {
      feedback = 'Outstanding response. You conveyed key technical concepts with structured clarity and demonstrated authentic practical experience.';
    } else if (overallScore >= 60) {
      feedback = 'Solid baseline response. To elevate this from acceptable to exceptional, include concrete numerical outcomes and walk through architectural trade-offs.';
    } else {
      feedback = 'Needs refinement. Focus on addressing all aspects of the prompt directly with concrete examples rather than general statements.';
    }

    const exemplarAnswer = `In my previous project, we encountered this exact challenge. I analyzed the problem by examining system metrics and logs. I then implemented a modular solution with defensive error boundaries and caching, which resolved the bottleneck and improved throughput by 35%. What I learned from this was the importance of measuring before optimizing.`;

    return {
      score: overallScore,
      relevanceScore,
      technicalScore,
      clarityScore,
      strengths,
      growthAreas,
      feedback,
      exemplarAnswer
    };
  }
}
