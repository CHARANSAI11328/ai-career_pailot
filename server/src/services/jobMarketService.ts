import { CURATED_JOB_LISTINGS, JobListing } from '../data/jobListings.js';
import { SKILLS_TAXONOMY, ALIAS_MAP } from '../data/skillsTaxonomy.js';

export interface EnrichedJobMatch extends JobListing {
  matchPercentage: number;
  matchedSkillsList: string[];
  missingSkillsList: string[];
  fitExplanation: string;
  isSaved?: boolean;
}

export class JobMarketService {
  /**
   * Search and filter jobs with personalized skill-match calculations
   */
  public static searchJobs(
    query?: string,
    location?: string,
    workMode?: string,
    experienceLevel?: string,
    candidateSkills: string[] = [],
    savedJobIds: string[] = []
  ): EnrichedJobMatch[] {
    const candidateSkillsLower = new Set(
      candidateSkills.map(s => {
        const def = ALIAS_MAP.get(s.toLowerCase().trim());
        return def ? def.id : s.toLowerCase().trim();
      })
    );

    let filtered = [...CURATED_JOB_LISTINGS];

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (location && location.trim() && location.toLowerCase() !== 'all') {
      const loc = location.toLowerCase().trim();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (workMode && workMode !== 'Any' && workMode !== 'All') {
      filtered = filtered.filter(j => j.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (experienceLevel && experienceLevel !== 'Any' && experienceLevel !== 'All') {
      filtered = filtered.filter(j => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
    }

    const getSkillName = (id: string) => {
      const found = SKILLS_TAXONOMY.find(s => s.id === id);
      return found ? found.name : id;
    };

    return filtered.map(job => {
      const matched = job.requiredSkills.filter(s => candidateSkillsLower.has(s.toLowerCase()));
      const missing = job.requiredSkills.filter(s => !candidateSkillsLower.has(s.toLowerCase()));

      const pct = job.requiredSkills.length > 0
        ? Math.round((matched.length / job.requiredSkills.length) * 100)
        : 70;

      let fitExplanation = '';
      if (pct >= 80) {
        fitExplanation = `High Match: Your profile demonstrates proficiency in ${matched.length} of ${job.requiredSkills.length} key required skills including ${matched.slice(0, 3).map(getSkillName).join(', ')}.`;
      } else if (pct >= 50) {
        fitExplanation = `Moderate Match: You satisfy core requirements (${matched.map(getSkillName).join(', ')}), but learning ${missing.slice(0, 2).map(getSkillName).join(' and ')} will make you an ideal candidate.`;
      } else {
        fitExplanation = `Growth Opportunity: This role requires ${missing.map(getSkillName).join(', ')}. Consider completing the recommended learning roadmap first.`;
      }

      return {
        ...job,
        matchPercentage: pct,
        matchedSkillsList: matched.map(getSkillName),
        missingSkillsList: missing.map(getSkillName),
        fitExplanation,
        isSaved: savedJobIds.includes(job.id)
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}
