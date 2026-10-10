import { v4 as uuidv4 } from 'uuid';
import { BENCHMARK_ROLES } from '../data/jobRoles.js';
import { LEARNING_RESOURCES } from '../data/learningResources.js';
import { ALIAS_MAP, SKILLS_TAXONOMY } from '../data/skillsTaxonomy.js';
import { StoredRoadmap } from '../db/storage.js';

export class RoadmapGenerator {
  public static generate(
    userId: string,
    targetRoleId: string,
    missingSkills: string[],
    weeklyHours: number = 10
  ): StoredRoadmap {
    // Find role
    const role = BENCHMARK_ROLES.find(r => r.id === targetRoleId) || BENCHMARK_ROLES[0];

    // Normalized missing skills
    const resolvedMissingSkills = missingSkills.length > 0 ? missingSkills : role.coreSkills;

    // Build weeks based on missing skills and weekly availability
    // Typically 4-6 weeks
    const weeks: StoredRoadmap['weeks'] = [];

    // Group skills into progression tiers:
    // Tier 1: Core Fundamentals
    // Tier 2: Frameworks & Implementation
    // Tier 3: Database & Cloud / Advanced
    // Tier 4: Portfolio Capstone & Interview Readiness

    const chunks = this.chunkSkills(resolvedMissingSkills, 4);

    const weekThemes = [
      {
        title: 'Core Architecture & Foundations',
        projectTitle: 'Foundational Prototype & API Design',
        deliverable: 'A clean repository implementing fundamental architectural patterns with automated tests.'
      },
      {
        title: 'Intermediate Frameworks & Deep Dive',
        projectTitle: 'Feature-Complete Modular Micro-Service',
        deliverable: 'A working containerized service featuring schema validation and caching.'
      },
      {
        title: 'Production Readiness & Optimization',
        projectTitle: 'Performance Benchmarking & CI/CD Pipeline',
        deliverable: 'Automated GitHub Actions pipeline with linter, test runner, and dockerized build.'
      },
      {
        title: 'Capstone Project & Portfolio Showcase',
        projectTitle: role.beginnerProject.title,
        deliverable: role.beginnerProject.deliverables.join('; ')
      }
    ];

    for (let i = 0; i < 4; i++) {
      const focusSkills = chunks[i] && chunks[i].length > 0 ? chunks[i] : [role.coreSkills[i % role.coreSkills.length]];
      const theme = weekThemes[i];

      // Find relevant verified learning resources for these focus skills
      const matchedResources: Array<{
        title: string;
        provider: string;
        url: string;
        type: string;
        cost: string;
      }> = [];

      focusSkills.forEach(skillName => {
        const lower = skillName.toLowerCase();
        const def = ALIAS_MAP.get(lower);
        const skillId = def ? def.id : lower;

        const found = LEARNING_RESOURCES.filter(r => r.skillId === skillId);
        found.forEach(res => {
          if (!matchedResources.some(m => m.url === res.url)) {
            matchedResources.push({
              title: res.title,
              provider: res.provider,
              url: res.url,
              type: res.type,
              cost: res.cost
            });
          }
        });
      });

      // If no direct resource found, add standard official docs
      if (matchedResources.length === 0) {
        matchedResources.push({
          title: `${focusSkills[0]} Official Documentation & Tutorial`,
          provider: 'Official Documentation',
          url: 'https://devdocs.io/',
          type: 'Official Documentation',
          cost: 'Free'
        });
      }

      weeks.push({
        weekNumber: i + 1,
        title: `Week ${i + 1}: ${theme.title}`,
        focusSkills,
        description: `Dedicate ${weeklyHours} hours to mastering ${focusSkills.join(', ')}. Complete targeted readings and build the weekly project milestone.`,
        resources: matchedResources.slice(0, 3),
        projectTask: {
          title: theme.projectTitle,
          description: i === 3 ? role.beginnerProject.description : `Build a practical module implementing ${focusSkills.join(' and ')} following industry clean-code standards.`,
          deliverable: theme.deliverable
        },
        isCompleted: false
      });
    }

    return {
      id: uuidv4(),
      userId,
      targetRole: role.id,
      targetRoleTitle: role.title,
      weeklyHours,
      generatedAt: new Date().toISOString(),
      weeks
    };
  }

  private static chunkSkills(skills: string[], count: number): string[][] {
    const result: string[][] = Array.from({ length: count }, () => []);
    skills.forEach((skill, index) => {
      result[index % count].push(skill);
    });
    return result;
  }
}
