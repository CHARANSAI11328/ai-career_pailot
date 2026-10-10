import { SKILLS_TAXONOMY, ALIAS_MAP, SkillDefinition } from '../data/skillsTaxonomy.js';

export interface ExtractedSkillResult {
  skill: SkillDefinition;
  canonicalId: string;
  name: string;
  category: string;
  evidenceSnippet?: string;
  count: number;
}

export class SkillExtractor {
  /**
   * Extract skills present in text using normalized taxonomy matching
   */
  public static extractSkills(text: string): ExtractedSkillResult[] {
    const lowerText = ` ${text.toLowerCase()} `;
    const foundSkills = new Map<string, ExtractedSkillResult>();

    for (const skill of SKILLS_TAXONOMY) {
      // Check canonical name
      const patternsToCheck = [
        skill.name.toLowerCase(),
        skill.id.toLowerCase(),
        ...skill.aliases.map(a => a.toLowerCase())
      ];

      for (const pattern of patternsToCheck) {
        // Regex with word boundaries or punctuation boundaries (handling c++, c#, .net, etc.)
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Handle boundary like C++, C#, .NET where \b doesn't work after symbols
        const regex = new RegExp(`(?:^|[\\s,;()/\\[\\]:])${escaped}(?=[\\s,;()/\\[\\]:]|$)`, 'i');

        const match = regex.exec(lowerText);
        if (match) {
          if (!foundSkills.has(skill.id)) {
            // Find snippet in original text for evidence
            const snippet = this.findSnippet(text, pattern);
            foundSkills.set(skill.id, {
              skill,
              canonicalId: skill.id,
              name: skill.name,
              category: skill.category,
              evidenceSnippet: snippet,
              count: 1
            });
          } else {
            const existing = foundSkills.get(skill.id)!;
            existing.count += 1;
          }
          break; // Avoid double counting aliases of same skill
        }
      }
    }

    return Array.from(foundSkills.values());
  }

  /**
   * Find a snippet around the matched skill in the original text
   */
  private static findSnippet(text: string, term: string): string {
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return '';
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + term.length + 40);
    let snippet = text.substring(start, end).replace(/\n/g, ' ').trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    return snippet;
  }

  /**
   * Normalizes a user-entered skill string into a canonical skill definition if known
   */
  public static normalizeSkillName(input: string): string {
    const cleaned = input.trim().toLowerCase();
    const found = ALIAS_MAP.get(cleaned);
    return found ? found.name : input.trim();
  }
}
