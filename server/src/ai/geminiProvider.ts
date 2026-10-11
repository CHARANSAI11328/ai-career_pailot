import { GoogleGenAI } from '@google/genai';

export class GeminiProvider {
  private client: GoogleGenAI | null = null;
  private currentKey: string = '';

  constructor(apiKey?: string) {
    if (apiKey) {
      this.init(apiKey);
    }
  }

  public init(apiKey: string) {
    if (!apiKey || apiKey === this.currentKey) return;
    this.currentKey = apiKey;
    try {
      // Clear out leaked or system environment variables to prevent @google/genai collision
      delete process.env.GOOGLE_API_KEY;
      delete process.env.GEMINI_API_KEY;

      this.client = new GoogleGenAI({ apiKey });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
      this.client = null;
    }
  }

  public isConfigured(): boolean {
    return !!this.client && !!this.currentKey;
  }

  /**
   * Generate raw text content with Gemini
   */
  public async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.client) {
      throw new Error('Gemini API client not initialized. Missing or invalid API key.');
    }

    // Support candidate models with graceful fallback
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastErr: any = null;
    for (const m of candidateModels) {
      try {
        const response = await this.client.models.generateContent({
          model: m,
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined
        });
        return response.text || '';
      } catch (err: any) {
        lastErr = err;
        if (err.message && (err.message.includes('API key not valid') || err.message.includes('permission'))) {
          throw err;
        }
      }
    }

    throw new Error(`Gemini API Error: ${lastErr?.message || 'Call failed'}`);
  }

  /**
   * Generate structured JSON with Gemini
   */
  public async generateJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    const raw = await this.generateText(prompt, systemInstruction);
    // Extract JSON between code blocks if present
    const cleaned = raw.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch (e) {
      // Try matching first { or [ to last } or ]
      const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      throw new Error(`Failed to parse Gemini JSON output: ${cleaned.substring(0, 200)}...`);
    }
  }
}
