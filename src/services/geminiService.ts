import { LegalAnalyzer } from './legalAnalyzer';
import { LegalDocument, QAResponse } from '../types/legal';

const API_STORAGE_KEY = 'lexiguard_gemini_api_key';
const ACTIVE_MODEL_STORAGE_KEY = 'lexiguard_gemini_model';

export class GeminiService {
  /**
   * Retrieves the user's stored Gemini API Key, or falls back to import.meta.env
   */
  static getApiKey(): string {
    const stored = localStorage.getItem(API_STORAGE_KEY);
    if (stored && stored.trim().length > 0) return stored.trim();
    // @ts-ignore
    return (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
  }

  static setApiKey(key: string): void {
    if (!key) {
      localStorage.removeItem(API_STORAGE_KEY);
    } else {
      localStorage.setItem(API_STORAGE_KEY, key.trim());
    }
  }

  static getModel(): string {
    return localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY) || 'gemini-1.5-flash';
  }

  static setModel(model: string): void {
    localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, model);
  }

  static hasApiKey(): boolean {
    return this.getApiKey().length > 10;
  }

  /**
   * Calls Google Gemini REST API or falls back gracefully to Heuristic Engine
   */
  static async askDocumentQuestion(doc: LegalDocument, question: string): Promise<QAResponse> {
    const apiKey = this.getApiKey();

    if (!apiKey) {
      // Offline fallback: Use LegalAnalyzer grounded matching
      return LegalAnalyzer.answerQuestion(doc, question);
    }

    try {
      const model = this.getModel();
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const systemPrompt = `You are LexiGuard AI, an expert legal document analyst. 
You provide clear, accessible legal document explanations to everyday citizens, tenants, and small business owners.
CRITICAL SAFETY & GROUNDING RULES:
1. Always ground your answer directly in the provided contract text.
2. Quote the specific clause/section number whenever possible.
3. Distinguish between what the contract explicitly states vs potential legal risks.
4. Include a disclaimer that this is legal information, not formal attorney legal advice.
5. Provide the output in valid JSON format matching this schema:
{
  "answer": "Clear, direct explanation of the answer",
  "citedClauses": [
    {
      "clauseNumber": "Clause 2",
      "clauseTitle": "Title",
      "verbatimQuote": "exact quote from contract",
      "practicalMeaning": "what it actually means in plain English"
    }
  ],
  "actionableAdvice": "Practical steps the user can take or negotiate",
  "suggestedNextQuestions": ["question 1", "question 2"]
}`;

      const userPrompt = `DOCUMENT TITLE: ${doc.title}
DOCUMENT TEXT:
${doc.rawText}

USER QUESTION: "${question}"

Respond with ONLY the JSON object.`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt + '\n\n' + userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        console.warn('Gemini API call failed, falling back to local heuristic engine', response.statusText);
        return LegalAnalyzer.answerQuestion(doc, question);
      }

      const data = await response.json();
      const rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawOutput) {
        return LegalAnalyzer.answerQuestion(doc, question);
      }

      const parsed = JSON.parse(rawOutput);
      return {
        question,
        answer: parsed.answer || 'Analysis complete.',
        confidence: 0.98,
        citedClauses: parsed.citedClauses || [],
        actionableAdvice: parsed.actionableAdvice || 'Consider consulting a lawyer for formal advice.',
        suggestedNextQuestions: parsed.suggestedNextQuestions || [
          'Can this clause be negotiated?',
          'What happens if either party defaults?',
        ],
      };
    } catch (err) {
      console.warn('Error during Gemini API call, using offline engine:', err);
      return LegalAnalyzer.answerQuestion(doc, question);
    }
  }

  /**
   * Generates a tailored counter-proposal and redline amendment email
   */
  static async generateCounterProposal(
    doc: LegalDocument,
    clauseTitle: string,
    currentText: string,
    userObjective: string
  ): Promise<{ counterClause: string; emailDraft: string; rationale: string }> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const model = this.getModel();
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const prompt = `You are an expert contract negotiator assisting a user.
DOCUMENT: ${doc.title}
CLAUSE: ${clauseTitle}
CURRENT TEXT: ${currentText}
USER GOAL: ${userObjective}

Draft a polite, professional, commercially balanced counter-proposal.
Provide response in JSON:
{
  "counterClause": "The proposed revised legal clause wording",
  "emailDraft": "A polite, collaborative email message to send to the counterparty explaining the request",
  "rationale": "Brief strategic reasoning behind this proposal"
}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            return JSON.parse(jsonText);
          }
        }
      } catch (e) {
        console.warn('Gemini counter-proposal fallback:', e);
      }
    }

    // Default intelligent fallback draft
    return {
      counterClause: `Proposed Revision for ${clauseTitle}:\n"Both parties agree that liability and obligations under this Section shall be mutual, reasonable, and limited to direct actual damages. Neither party shall enter premises or terminate without at least twenty-four (24) hours advance written notice, and all IP created prior to this agreement or outside project scope remains the exclusive property of the creator."`,
      emailDraft: `Subject: Proposed Clarification on ${clauseTitle} - ${doc.title}

Hi there,

Thank you for sending over the agreement for review. I'm excited about working together and moving forward!

While reviewing the terms, I noticed that ${clauseTitle} has a few provisions that are a bit more restrictive than typical standard industry contracts (specifically regarding ${userObjective || 'liability and cancellation notice'}).

To ensure the agreement is mutually protective and balanced for both sides, I would like to propose a minor adjustment as shown below:

[Insert Proposed Revision]

Please let me know if this adjustment works for you, and we can finalize the agreement right away.

Best regards,
[Your Name]`,
      rationale: `This draft maintains a positive, collaborative tone while establishing clear, mutual boundaries and avoiding unmitigated liability.`,
    };
  }
}
