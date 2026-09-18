import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { LegalAnalyzer } from '../src/services/legalAnalyzer';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';

describe('Efficiency, Resilience & Deterministic Citation Verification', () => {
  const sampleDoc = SAMPLE_DOCUMENTS[0];

  beforeEach(() => {
    GeminiService.clearCache();
    vi.restoreAllMocks();
  });

  it('should serve repeated questions from high-speed in-memory cache with zero network calls', async () => {
    const question = 'Can landlord enter without notice?';

    // First call: executes local heuristic and saves into cache
    const initialResponse = await GeminiService.askDocumentQuestion(sampleDoc, question);
    expect(initialResponse.answer).toBeTruthy();
    expect(initialResponse.cached).toBeFalsy();
    expect(GeminiService.getCacheSize()).toBe(1);

    // Second call with identical question: served directly from cache in 0ms
    const cachedResponse = await GeminiService.askDocumentQuestion(sampleDoc, question);
    expect(cachedResponse.answer).toBe(initialResponse.answer);
    expect(cachedResponse.cached).toBe(true);
    expect(GeminiService.getCacheSize()).toBe(1);
  });

  it('should clear cache properly when clearCache is called', async () => {
    await GeminiService.askDocumentQuestion(sampleDoc, 'Question 1');
    await GeminiService.askDocumentQuestion(sampleDoc, 'Question 2');
    expect(GeminiService.getCacheSize()).toBe(2);

    GeminiService.clearCache();
    expect(GeminiService.getCacheSize()).toBe(0);
  });

  it('should evict oldest entries when LRU cache exceeds MAX_CACHE_ENTRIES (50)', async () => {
    GeminiService.clearCache();

    // Populate 50 entries
    for (let i = 1; i <= 50; i++) {
      await GeminiService.askDocumentQuestion(sampleDoc, `Query number ${i}`);
    }
    expect(GeminiService.getCacheSize()).toBe(50);

    // Add 51st entry - should evict the oldest entry and maintain size at 50
    await GeminiService.askDocumentQuestion(sampleDoc, 'Query number 51');
    expect(GeminiService.getCacheSize()).toBe(50);
  });

  it('should guarantee fresh, distinct contract parsing without cache collisions', () => {
    const textDocA = `1. Rent. Rent is $1,000 per month. Tenant may terminate with 30 days notice.`;
    const textDocB = `1. Rent. Rent is $9,999 per month. No early termination is permitted whatsoever.`;

    const parsedA = LegalAnalyzer.parseDocument(textDocA, 'Lease Agreement');
    const parsedB = LegalAnalyzer.parseDocument(textDocB, 'Lease Agreement');

    // Both documents must be completely separate instances and reflect their distinct terms
    expect(parsedA).not.toBe(parsedB);
    expect(parsedA.clauses[0].originalText).toContain('$1,000');
    expect(parsedB.clauses[0].originalText).toContain('$9,999');
  });

  it('should deterministically verify authentic citations and detect hallucinations', () => {
    // 1. Verbatim quote from lease agreement Clause 4 (Landlord Access)
    const authenticQuote = 'enter the Premises at any time, with or without prior notice';
    const isAuthentic = LegalAnalyzer.verifyCitation(sampleDoc, authenticQuote, '4');
    expect(isAuthentic).toBe(true);

    // 2. Hallucinated quote not present in contract
    const fakeQuote = 'Landlord must provide a 10-course gourmet meal prior to any inspection';
    const isFake = LegalAnalyzer.verifyCitation(sampleDoc, fakeQuote);
    expect(isFake).toBe(false);

    // 3. Evidence strength calculation
    const highEvidence = LegalAnalyzer.calculateEvidenceStrength([
      { clauseNumber: '4', clauseTitle: 'Landlord Access', verbatimQuote: authenticQuote, practicalMeaning: 'No notice', isVerifiedInSource: true },
    ]);
    expect(highEvidence).toBe('HIGH');

    const limitedEvidence = LegalAnalyzer.calculateEvidenceStrength([]);
    expect(limitedEvidence).toBe('LIMITED');
  });

  it('should match clauses deterministically without index [i] fallback in compareDocuments', () => {
    const docA = SAMPLE_DOCUMENTS[0]; // Lease
    const docB = SAMPLE_DOCUMENTS[1]; // Freelance

    const comparison = LegalAnalyzer.compareDocuments(docA, docB);
    expect(comparison.clauseComparisons.length).toBeGreaterThan(0);
    // Every matched comparison must have matching categories or titles
    comparison.clauseComparisons.forEach(comp => {
      if (comp.clauseA && comp.clauseB) {
        expect(comp.clauseA.category === comp.clauseB.category || comp.clauseA.title.toLowerCase().includes(comp.clauseB.title.toLowerCase())).toBe(true);
      }
    });
  });

  it('should support ephemeral sessionStorage as well as persistent localStorage', () => {
    const sessionStore: Record<string, string> = {};
    const localStore: Record<string, string> = {};

    // @ts-ignore
    globalThis.window = {
      sessionStorage: {
        getItem: (key: string) => sessionStore[key] || null,
        setItem: (key: string, val: string) => { sessionStore[key] = val; },
        removeItem: (key: string) => { delete sessionStore[key]; },
      },
      localStorage: {
        getItem: (key: string) => localStore[key] || null,
        setItem: (key: string, val: string) => { localStore[key] = val; },
        removeItem: (key: string) => { delete localStore[key]; },
      },
    };

    // 1. Set ephemeral key (persist = false)
    GeminiService.setApiKey('AIzaSyEphemeralKey12345', false);
    expect(sessionStore['lexiguard_gemini_api_key']).toBe('AIzaSyEphemeralKey12345');
    expect(localStore['lexiguard_gemini_api_key']).toBeUndefined();
    expect(GeminiService.getApiKey()).toBe('AIzaSyEphemeralKey12345');

    // 2. Set persistent key (persist = true)
    GeminiService.setApiKey('AIzaSyPersistentKey98765', true);
    expect(localStore['lexiguard_gemini_api_key']).toBe('AIzaSyPersistentKey98765');
    expect(sessionStore['lexiguard_gemini_api_key']).toBeUndefined();
    expect(GeminiService.getApiKey()).toBe('AIzaSyPersistentKey98765');
  });

  it('should handle AbortSignal gracefully if query request is cancelled', async () => {
    // Provide a dummy API key so fetch is initiated and respects signal
    // @ts-ignore
    globalThis.window = {
      sessionStorage: { getItem: () => 'AIzaSyTestKeyDummy12345' },
      localStorage: { getItem: () => null }
    };

    const controller = new AbortController();
    controller.abort();

    // Query with an already aborted signal throws AbortError
    await expect(
      GeminiService.askDocumentQuestion(sampleDoc, 'Will this abort?', controller.signal)
    ).rejects.toThrow();
  });
});
