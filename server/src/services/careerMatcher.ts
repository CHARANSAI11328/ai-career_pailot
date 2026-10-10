import { BENCHMARK_ROLES, JobRoleDefinition } from '../data/jobRoles.js';
import { SKILLS_TAXONOMY, ALIAS_MAP } from '../data/skillsTaxonomy.js';
import { SkillExtractor } from './skillExtractor.js';

export interface RoleMatchResult {
  role: JobRoleDefinition;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingCoreSkills: string[];
  missingNiceToHaveSkills: string[];
  salaryInsight: {
    entry: [number, number];
    mid: [number, number];
    currency: string;
  };
  recommendationReason: string;
}

export interface JobDescriptionComparisonResult {
  jobTitle: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingCriticalSkills: string[];
  missingPreferredSkills: string[];
  evidenceBreakdown: Array<{
    skillName: string;
    isMatched: boolean;
    importance: 'critical' | 'preferred';
    snippet?: string;
  }>;
  tailoringAdvice: string[];
}

export class CareerMatcher {
  /**
   * Matches candidate's verified skills against all benchmark career tracks
   */
  public static matchAgainstRoles(candidateSkills: string[]): RoleMatchResult[] {
    const normalizedCandidateSkillIds = new Set<string>();

    candidateSkills.forEach(s => {
      const lower = s.toLowerCase().trim();
      const def = ALIAS_MAP.get(lower);
      if (def) {
        normalizedCandidateSkillIds.add(def.id);
      } else {
        normalizedCandidateSkillIds.add(lower);
      }
    });

    const results: RoleMatchResult[] = [];

    for (const role of BENCHMARK_ROLES) {
      const coreSkills = role.coreSkills;
      const niceSkills = role.niceToHaveSkills;

      const matchedCore = coreSkills.filter(id => normalizedCandidateSkillIds.has(id));
      const missingCore = coreSkills.filter(id => !normalizedCandidateSkillIds.has(id));
      const matchedNice = niceSkills.filter(id => normalizedCandidateSkillIds.has(id));
      const missingNice = niceSkills.filter(id => !normalizedCandidateSkillIds.has(id));

      // Scoring formula: Core skills represent 85% of base match, plus bonus for nice-to-have skills up to 15%
      const corePct = coreSkills.length > 0 ? (matchedCore.length / coreSkills.length) * 100 : 0;
      const niceBonus = niceSkills.length > 0 ? (matchedNice.length / niceSkills.length) * 15 : 0;
      const score = Math.min(100, Math.round(corePct * 0.85 + niceBonus));

      // Resolve human-readable skill names
      const getSkillName = (id: string) => {
        const found = SKILLS_TAXONOMY.find(s => s.id === id);
        return found ? found.name : id;
      };

      const entrySalary = role.salaryBenchmarks.find(s => s.experience === 'entry')?.inrRange || [600000, 1000000];
      const midSalary = role.salaryBenchmarks.find(s => s.experience === 'mid')?.inrRange || [1200000, 2000000];

      results.push({
        role,
        matchScore: score,
        matchedSkills: [...matchedCore, ...matchedNice].map(getSkillName),
        missingCoreSkills: missingCore.map(getSkillName),
        missingNiceToHaveSkills: missingNice.map(getSkillName),
        salaryInsight: {
          entry: entrySalary as [number, number],
          mid: midSalary as [number, number],
          currency: 'INR'
        },
        recommendationReason: `You have strong evidence in ${matchedCore.length} of ${coreSkills.length} core requirements. Bridging ${missingCore.slice(0, 2).map(getSkillName).join(' and ')} would raise your match to ${Math.min(95, score + 30)}%.`
      });
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Compare candidate resume skills with an arbitrary pasted Job Description
   */
  public static compareWithJobDescription(
    candidateSkillIds: string[],
    candidateResumeText: string,
    jobDescriptionText: string
  ): JobDescriptionComparisonResult {
    // 1. Extract skills from the Job Description
    const extractedJdSkills = SkillExtractor.extractSkills(jobDescriptionText);
    const candidateSkillsSet = new Set(candidateSkillIds.map(s => s.toLowerCase()));

    // Also extract skills directly from candidate resume text to ensure full capture
    const candidateExtracted = SkillExtractor.extractSkills(candidateResumeText);
    candidateExtracted.forEach(s => candidateSkillsSet.add(s.canonicalId.toLowerCase()));

    const matched: string[] = [];
    const missingCritical: string[] = [];
    const missingPreferred: string[] = [];
    const evidenceBreakdown: JobDescriptionComparisonResult['evidenceBreakdown'] = [];

    // Consider the first 60% of extracted JD skills as critical
    extractedJdSkills.forEach((jdSkill, index) => {
      const isCritical = index < Math.max(3, Math.ceil(extractedJdSkills.length * 0.6));
      const hasSkill = candidateSkillsSet.has(jdSkill.canonicalId.toLowerCase()) ||
                       candidateSkillsSet.has(jdSkill.name.toLowerCase());

      if (hasSkill) {
        matched.push(jdSkill.name);
      } else {
        if (isCritical) {
          missingCritical.push(jdSkill.name);
        } else {
          missingPreferred.push(jdSkill.name);
        }
      }

      evidenceBreakdown.push({
        skillName: jdSkill.name,
        isMatched: hasSkill,
        importance: isCritical ? 'critical' : 'preferred',
        snippet: jdSkill.evidenceSnippet
      });
    });

    const totalJd = extractedJdSkills.length || 1;
    const matchPercentage = Math.round((matched.length / totalJd) * 100);

    const tailoringAdvice: string[] = [];
    if (missingCritical.length > 0) {
      tailoringAdvice.push(`High Priority: Incorporate practical experience with ${missingCritical.slice(0, 3).join(', ')} if you have used them in past projects.`);
    }
    if (matchPercentage >= 70) {
      tailoringAdvice.push('Strong alignment: Your resume directly addresses the primary technology stack demanded by this posting.');
    } else {
      tailoringAdvice.push('Skill Gap Notice: Consider highlighting adjacent tools or completing a targeted portfolio project to bridge the gap.');
    }

    return {
      jobTitle: 'Target Role Alignment',
      matchPercentage,
      matchedSkills: matched,
      missingCriticalSkills: missingCritical,
      missingPreferredSkills: missingPreferred,
      evidenceBreakdown,
      tailoringAdvice
    };
  }
}
