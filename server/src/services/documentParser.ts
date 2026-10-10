import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export interface DocumentParseResult {
  text: string;
  isScannedSuspect: boolean;
  pageCount?: number;
  wordCount: number;
  format: 'pdf' | 'docx' | 'txt';
  error?: string;
}

export class DocumentParser {
  /**
   * Safely extract text from buffer based on file type
   */
  public static async parse(buffer: Buffer, originalName: string, mimeType?: string): Promise<DocumentParseResult> {
    const ext = originalName.split('.').pop()?.toLowerCase();

    if (buffer.length === 0) {
      throw new Error('The uploaded file is completely empty (0 bytes).');
    }

    if (buffer.length > 5 * 1024 * 1024) {
      throw new Error('File exceeds the maximum 5MB size limit.');
    }

    if (ext === 'txt' || mimeType === 'text/plain') {
      const text = buffer.toString('utf-8');
      const cleanText = this.normalize(text);
      return {
        text: cleanText,
        isScannedSuspect: false,
        wordCount: cleanText.split(/\s+/).filter(Boolean).length,
        format: 'txt'
      };
    }

    if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({ buffer });
        const cleanText = this.normalize(result.value);
        return {
          text: cleanText,
          isScannedSuspect: cleanText.length < 50 && buffer.length > 10000,
          wordCount: cleanText.split(/\s+/).filter(Boolean).length,
          format: 'docx'
        };
      } catch (err: any) {
        throw new Error(`Failed to parse DOCX document: ${err.message || 'Corrupt Word file'}`);
      }
    }

    if (ext === 'pdf' || mimeType === 'application/pdf') {
      try {
        const data = await pdfParse(buffer);
        const cleanText = this.normalize(data.text);
        const isScanned = cleanText.length < 50 && buffer.length > 15000;
        return {
          text: cleanText,
          isScannedSuspect: isScanned,
          pageCount: data.numpages,
          wordCount: cleanText.split(/\s+/).filter(Boolean).length,
          format: 'pdf'
        };
      } catch (err: any) {
        throw new Error(`Failed to extract text from PDF: ${err.message || 'Corrupt PDF structure'}`);
      }
    }

    throw new Error(`Unsupported document type .${ext}. Please upload a PDF, DOCX, or TXT file.`);
  }

  /**
   * Cleans and normalizes raw extracted text
   */
  public static normalize(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\t\f]/g, ' ')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Segment resume text into recognized standard sections
   */
  public static segmentSections(text: string): Record<string, string> {
    const lines = text.split('\n');
    const sections: Record<string, string[]> = {
      header: [],
      summary: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      other: []
    };

    let currentSection = 'header';

    const sectionPatterns: Array<{ name: keyof typeof sections; regex: RegExp }> = [
      { name: 'summary', regex: /^(professional\s+summary|summary|profile|about\s+me|objective)/i },
      { name: 'experience', regex: /^(work\s+experience|experience|employment|work\s+history|professional\s+experience)/i },
      { name: 'education', regex: /^(education|academic\s+background|qualifications|degrees)/i },
      { name: 'skills', regex: /^(technical\s+skills|skills|technologies|core\s+competencies|tools\s+&\s+skills)/i },
      { name: 'projects', regex: /^(projects|academic\s+projects|personal\s+projects|key\s+projects)/i },
      { name: 'certifications', regex: /^(certifications|licenses|courses|awards|achievements)/i }
    ];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let matchedSection: string | null = null;
      for (const pattern of sectionPatterns) {
        if (pattern.regex.test(line) && line.length < 50) {
          matchedSection = pattern.name;
          break;
        }
      }

      if (matchedSection) {
        currentSection = matchedSection;
      } else {
        sections[currentSection].push(line);
      }
    }

    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(sections)) {
      if (val.length > 0) {
        result[key] = val.join('\n');
      }
    }

    return result;
  }
}
