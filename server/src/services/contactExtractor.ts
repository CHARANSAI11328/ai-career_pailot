export interface ExtractedContact {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
}

export class ContactExtractor {
  public static extract(text: string): ExtractedContact {
    const contact: ExtractedContact = {};

    // 1. Email Extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      contact.email = emailMatch[0].trim();
    }

    // 2. Phone Extraction (US and International formats, e.g. +91, (555), etc.)
    const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      contact.phone = phoneMatch[0].trim();
    }

    // 3. LinkedIn
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:\s*)([a-zA-Z0-9_-]+)/i);
    if (linkedinMatch) {
      contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;
    }

    // 4. GitHub
    const githubMatch = text.match(/(?:github\.com\/|github:\s*)([a-zA-Z0-9_-]+)/i);
    if (githubMatch) {
      contact.github = `github.com/${githubMatch[1]}`;
    }

    // 5. Name Heuristic (usually first 1 or 2 lines of the resume before contacts)
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      const firstLine = lines[0];
      // If first line doesn't contain @ or http, is short and mostly letters
      if (!firstLine.includes('@') && !firstLine.includes('http') && firstLine.length < 40 && !firstLine.toLowerCase().includes('resume')) {
        contact.name = firstLine;
      }
    }

    // 6. Common Location Indicators
    const locationMatch = text.match(/(?:Bengaluru|Bangalore|Hyderabad|Mumbai|Delhi|Pune|San Francisco|New York|Seattle|Austin|London|Toronto|Remote|California|CA|NY|TX)(?:,\s*[A-Za-z\s]+)?/i);
    if (locationMatch) {
      contact.location = locationMatch[0].trim();
    }

    return contact;
  }
}
