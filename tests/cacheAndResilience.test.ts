import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { LegalAnalyzer } from '../src/services/legalAnalyzer';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';

describe('Efficiency & Cache Optimization - Zero Latency & Memoization', () => {
  const sampleDoc = SAMPLE_DOCUMENTS[0];

  beforeEach(() => {
    GeminiService.clearCache();
    LegalAnalyzer.clearParseCache();
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

  it('should memoize parseDocument results to prevent redundant regex re-parsing', () => {
    const contractText = `
      1. Termination. Either party may terminate with 30 days notice.
      2. Payment. Net 30 days.
    `;

    // First parse
    const doc1 = LegalAnalyzer.parseDocument(contractText, 'Test Agreement');
    expect(doc1.clauses.length).toBe(2);
    expect(LegalAnalyzer.getParseCacheSize()).toBe(1);

    // Second parse of identical text returns the memoized instance immediately
    const doc2 = LegalAnalyzer.parseDocument(contractText, 'Test Agreement');
    expect(doc2).toBe(doc1);
    expect(LegalAnalyzer.getParseCacheSize()).toBe(1);
  });

  it('should support ephemeral sessionStorage as well as persistent localStorage', () => {
    // Mock sessionStorage and localStorage on window
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
    const controller = new AbortController();
    controller.abort();

    // Query with an already aborted signal rejects with AbortError
    await expect(
      GeminiService.askDocumentQuestion(sampleDoc, 'Will this abort?', true, controller.signal)
    ).rejects.toThrow();
  });
});
