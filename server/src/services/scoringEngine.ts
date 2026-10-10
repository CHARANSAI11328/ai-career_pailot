import { ExtractedSkillResult } from './skillExtractor.js';

export interface ScoreBreakdown {
  overall: number;
  sectionCompleteness: number;
  quantifiableImpact: number;
  actionVerbs: number;
  readability: number;
  skillDensity: number;
  atsFormatting: number;
}

export interface DetailedFeedback {
  strengths: string[];
  criticalIssues: string[];
  improvements: Array<{
    section: string;
    originalSnippet?: string;
    suggestedFix: string;
    reason: string;
    type: 'impact' | 'verb' | 'formatting' | 'missing_evidence';
  }>;
}

export class ScoringEngine {
  // Strong active verbs commonly praised by technical recruiters
  private static STRONG_VERBS = [
    'architected', 'spearheaded', 'engineered', 'implemented', 'optimized',
    'automated', 'orchestrated', 'streamlined', 'deployed', 'developed',
    'designed', 'refactored', 'reduced', 'increased', 'accelerated',
    'mentored', 'authored', 'scaled', 'migrated', 'transformed',
    'diagnosed', 'debugged', 'integrated', 'delivered', 'formulated'
  ];

  // Weak/passive phrases to flag
  private static WEAK_VERBS = [
    'helped with', 'assisted with', 'worked on', 'responsible for',
    'handled', 'participated in', 'tasked with', 'attempted to', 'involved in'
  ];

  public static evaluate(
    rawText: string,
    sections: Record<string, string>,
    extractedSkills: ExtractedSkillResult[],
    jobDescription?: string
  ): { scores: ScoreBreakdown; feedback: DetailedFeedback } {
    const strengths: string[] = [];
    const criticalIssues: string[] = [];
    const improvements: DetailedFeedback['improvements'] = [];

    // 1. SECTION COMPLETENESS (Weight: 20 pts)
    let completenessScore = 0;
    const requiredSections = ['summary', 'experience', 'education', 'skills', 'projects'];
    let presentCount = 0;

    for (const sec of requiredSections) {
      if (sections[sec] && sections[sec].trim().length > 30) {
        presentCount++;
      } else {
        criticalIssues.push(`Missing or sparse ${sec.toUpperCase()} section. Adding this section provides clear context for ATS parsers.`);
        improvements.push({
          section: sec,
          suggestedFix: `Add a dedicated ${sec.toUpperCase()} section with 2-4 structured items.`,
          reason: `Recruiters and ATS look specifically for a clearly marked ${sec} section.`,
          type: 'formatting'
        });
      }
    }
    completenessScore = Math.round((presentCount / requiredSections.length) * 100);
    if (completenessScore >= 80) {
      strengths.push('Comprehensive section coverage: includes Education, Experience, Skills, and Projects.');
    }

    // 2. QUANTIFIABLE IMPACT & METRICS (Weight: 20 pts)
    // Find numbers, percentages (e.g. 35%), dollar values ($50,000), multipliers (3x), counts (10,000+)
    const metricMatches = rawText.match(/(?:\d+%\s*(?:increase|reduction|growth)?|\$\d[\d,kmb]*|\b\d+x\b|\b\d{1,3}(?:,\d{3})+\+?|\b\d+\+\s*(?:users|requests|clients|members|endpoints|testers))/gi) || [];
    let impactScore = Math.min(100, Math.round((metricMatches.length / 4) * 100));

    if (metricMatches.length >= 4) {
      strengths.push(`Strong quantifiable evidence detected (${metricMatches.length} metrics/percentages found). Demonstrates business impact.`);
    } else {
      criticalIssues.push(`Low quantifiable achievements (${metricMatches.length} metrics found). Resumes with numbers and metrics get 40% more interview callbacks.`);
      improvements.push({
        section: 'experience',
        suggestedFix: 'Quantify your impact using the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
        reason: 'Generic duties fail to show depth of contribution. Specify latency drop %, users served, or time saved.',
        type: 'impact'
      });
    }

    // 3. ACTION VERB STRENGTH (Weight: 15 pts)
    const lowerText = rawText.toLowerCase();
    let strongVerbCount = 0;
    for (const verb of this.STRONG_VERBS) {
      if (new RegExp(`\\b${verb}\\b`, 'i').test(lowerText)) {
        strongVerbCount++;
      }
    }

    let weakVerbCount = 0;
    for (const weak of this.WEAK_VERBS) {
      if (lowerText.includes(weak)) {
        weakVerbCount++;
        improvements.push({
          section: 'experience',
          originalSnippet: weak,
          suggestedFix: `Replace passive phrase "${weak}" with a strong action verb such as "Engineered", "Orchestrated", or "Automated".`,
          reason: 'Passive phrasing weakens your perceived ownership and leadership.',
          type: 'verb'
        });
      }
    }

    let actionVerbScore = Math.min(100, Math.max(30, Math.round(((strongVerbCount - weakVerbCount * 1.5) / 6) * 100)));
    if (strongVerbCount >= 5 && weakVerbCount === 0) {
      strengths.push(`Excellent active verb vocabulary (${strongVerbCount} high-impact leadership verbs used).`);
    }

    // 4. READABILITY & STRUCTURE (Weight: 15 pts)
    const lines = rawText.split('\n').filter(l => l.trim().length > 0);
    const words = rawText.split(/\s+/).filter(Boolean);
    const avgWordsPerLine = words.length / (lines.length || 1);
    let readabilityScore = 85;

    if (words.length < 150) {
      readabilityScore -= 30;
      criticalIssues.push('Resume is excessively brief (< 150 words). May lack sufficient technical depth.');
    } else if (words.length > 1200) {
      readabilityScore -= 20;
      improvements.push({
        section: 'summary',
        suggestedFix: 'Condense content to 1-2 pages maximum (approx. 400-800 words).',
        reason: 'Overly long resumes risk getting skimmed and losing recruiter attention.',
        type: 'formatting'
      });
    }

    // Check bullet point consistency (presence of -, *, •)
    const bulletCount = (rawText.match(/^[\s]*[-•*]/gm) || []).length;
    if (bulletCount >= 6) {
      strengths.push(`Clean bulleted structure (${bulletCount} bullet items detected) facilitates rapid recruiter scanning.`);
    }

    // 5. SKILL DENSITY & RELEVANCY (Weight: 15 pts)
    let skillDensityScore = Math.min(100, Math.round((extractedSkills.length / 8) * 100));
    if (extractedSkills.length >= 7) {
      strengths.push(`Rich technical skill taxonomy detected (${extractedSkills.length} verified technical skills mapped).`);
    } else {
      improvements.push({
        section: 'skills',
        suggestedFix: 'Explicitly list your core technologies, libraries, and tools in a structured Technical Skills section.',
        reason: 'Recruiters and automated filters perform skill keyword checks.',
        type: 'missing_evidence'
      });
    }

    // 6. ATS FORMATTING CHECKS (Weight: 15 pts)
    let atsScore = 95;
    // Check for unusual characters or complex tabular dividers
    if (rawText.includes('| | |') || rawText.includes('┌─') || rawText.includes('├──')) {
      atsScore -= 25;
      improvements.push({
        section: 'header',
        suggestedFix: 'Avoid multi-column tables and box-drawing characters. Use simple linear top-to-bottom layout.',
        reason: 'Many legacy ATS parsers scramble text when reading multi-column tables.',
        type: 'formatting'
      });
    }

    // Check contact info completeness
    if (!rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
      atsScore -= 20;
      criticalIssues.push('No email address detected! Recruiters cannot contact you.');
    }

    // Overall Weighted Calculation
    const overall = Math.round(
      completenessScore * 0.20 +
      impactScore * 0.20 +
      actionVerbScore * 0.15 +
      readabilityScore * 0.15 +
      skillDensityScore * 0.15 +
      atsScore * 0.15
    );

    const scores: ScoreBreakdown = {
      overall,
      sectionCompleteness: completenessScore,
      quantifiableImpact: impactScore,
      actionVerbs: actionVerbScore,
      readability: readabilityScore,
      skillDensity: skillDensityScore,
      atsFormatting: atsScore
    };

    return { scores, feedback: { strengths, criticalIssues, improvements } };
  }
}
