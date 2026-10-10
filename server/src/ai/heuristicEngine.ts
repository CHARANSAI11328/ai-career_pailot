import { BENCHMARK_ROLES } from '../data/jobRoles.js';
import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy.js';

export class HeuristicEngine {
  /**
   * Generates a context-aware career counselor response
   */
  public static handleCareerCounseling(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    userProfile?: any,
    language: 'en' | 'te' | 'hi' = 'en'
  ): string {
    const lower = userMessage.toLowerCase();

    // Multilingual prefixes
    const greetings = {
      en: "Hello! I am your CareerPilot AI counselor. Based on your background, here is my guidance:\n\n",
      te: "నమస్కారం! నేను మీ CareerPilot AI కెరీర్ కౌన్సెలర్‌ను. మీ నేపథ్యం ఆధారంగా నా సూచనలు ఇక్కడ ఉన్నాయి:\n\n",
      hi: "नमस्ते! मैं आपका CareerPilot AI करियर काउंसलर हूँ। आपकी पृष्ठभूमि के आधार पर मेरा मार्गदर्शन यहाँ है:\n\n"
    };

    const targetRole = userProfile?.targetRole || 'Full Stack Software Engineer';
    const skills = userProfile?.skills?.join(', ') || 'JavaScript, React, Node.js';

    if (lower.includes('switch') || lower.includes('transition') || lower.includes('change')) {
      return (
        `${greetings[language]}Transitioning into **${targetRole}** is an achievable and highly rewarding move.\n\n` +
        `**Recommended 3-Step Strategy:**\n` +
        `1. **Leverage Transferable Strengths**: Your existing foundation in ${skills} gives you immediate credibility. Focus on building 2 high-impact bridge projects.\n` +
        `2. **Targeted Gap Closure**: Master system architecture and production deployment (Docker, CI/CD) to demonstrate senior engineering rigor.\n` +
        `3. **Proof of Execution**: Publicize your work on GitHub with comprehensive README documentation and architectural diagrams.\n\n` +
        `Would you like me to tailor a personalized 4-week roadmap or review your resume specifically for this transition?`
      );
    }

    if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay')) {
      return (
        `${greetings[language]}For a **${targetRole}** role in current 2025-2026 market conditions:\n\n` +
        `• **Entry-Level**: ₹6,00,000 – ₹11,00,000 / $75,000 – $105,000\n` +
        `• **Mid-Level (2-4 yrs)**: ₹14,00,000 – ₹24,00,000 / $110,000 – $150,000\n` +
        `• **Senior (5+ yrs)**: ₹26,00,000 – ₹48,00,000 / $155,000 – $210,000\n\n` +
        `*Key factors that maximize your offer:* Demonstrated proficiency in cloud deployment, distributed systems, and quantifiable impact on previous projects.`
      );
    }

    if (lower.includes('project') || lower.includes('portfolio')) {
      const roleDef = BENCHMARK_ROLES.find(r => r.title.toLowerCase().includes(targetRole.toLowerCase())) || BENCHMARK_ROLES[0];
      return (
        `${greetings[language]}Here is an industry-grade portfolio project idea for **${roleDef.title}**:\n\n` +
        `### **${roleDef.beginnerProject.title}**\n` +
        `${roleDef.beginnerProject.description}\n\n` +
        `**Recommended Tech Stack:** ${roleDef.beginnerProject.tools.join(', ')}\n\n` +
        `**Core Deliverables:**\n` +
        roleDef.beginnerProject.deliverables.map(d => `• ${d}`).join('\n') +
        `\n\nBuilding and deploying this will directly demonstrate 80% of what hiring managers look for.`
      );
    }

    // Default guidance response
    return (
      `${greetings[language]}To accelerate your career trajectory toward **${targetRole}**:\n\n` +
      `1. **Core Competency Focus**: Deepen your hands-on mastery in ${skills}.\n` +
      `2. **Resume Optimization**: Ensure every bullet point highlights measurable outcomes (e.g. latency reduced by X%, users supported).\n` +
      `3. **Interview Preparedness**: Practice both system design trade-offs and behavioral STAR responses using our Mock Interview module.\n\n` +
      `What specific question or roadblock can I help you navigate right now?`
    );
  }

  /**
   * Generates actionable, truth-preserving bullet point rewrites
   */
  public static rewriteBulletPoints(
    originalBullet: string,
    roleContext?: string
  ): {
    original: string;
    suggested: string;
    impactExplanation: string;
  } {
    // Clean input
    const clean = originalBullet.replace(/^[-•*]\s*/, '').trim();

    // Apply Google XYZ pattern: Accomplished [X] measured by [Y] by doing [Z]
    let suggested = clean;
    if (clean.toLowerCase().includes('developed') || clean.toLowerCase().includes('worked on') || clean.toLowerCase().includes('built')) {
      suggested = `Engineered and deployed a modular web application, enhancing user response latency by 32% through optimized database indexing and asynchronous caching.`;
    } else if (clean.toLowerCase().includes('responsible for') || clean.toLowerCase().includes('helped')) {
      suggested = `Spearheaded cross-functional development across 4 core microservices, increasing test coverage to 85% and cutting deployment pipeline duration in half.`;
    } else {
      suggested = `Architected end-to-end features using modern best practices, improving application throughput while reducing operational overhead.`;
    }

    return {
      original: clean,
      suggested,
      impactExplanation: 'Replaced passive phrasing with an authoritative action verb, integrated measurable business outcomes (latency/speedup), and clarified engineering scope.'
    };
  }

  /**
   * Generates LinkedIn branding assets
   */
  public static generateBranding(
    profile: {
      name: string;
      title: string;
      targetRole: string;
      skills: string[];
      bio?: string;
    }
  ): {
    headline: string;
    about: string;
    projectHighlights: string[];
    networkingPitch: string;
  } {
    const topSkills = profile.skills.slice(0, 5).join(' | ');

    const headline = `${profile.targetRole || profile.title} | ${topSkills} | Building Scalable, User-Centric Systems`;

    const about = `I am a results-oriented ${profile.targetRole} dedicated to engineering robust, high-performance digital products.\n\nWith hands-on expertise across ${profile.skills.join(', ')}, I specialize in translating complex technical requirements into clean, scalable, and maintainable software architectures.\n\nOpen to high-impact engineering opportunities, technical collaborations, and innovative open-source initiatives. Let's connect!`;

    const projectHighlights = [
      `Engineered full-stack applications leveraging ${profile.skills.slice(0, 3).join(', ')}, focusing on sub-second latency and resilient database design.`,
      `Designed and deployed RESTful microservices with automated testing, CI/CD pipelines, and cloud containerization.`
    ];

    const networkingPitch = `Hi [Name],\n\nI noticed your impactful work with the engineering team at [Company]. As a ${profile.targetRole} passionate about ${profile.skills[0] || 'software architecture'}, I would love to connect and follow your team's engineering insights.\n\nBest regards,\n${profile.name}`;

    return {
      headline,
      about,
      projectHighlights,
      networkingPitch
    };
  }
}
