import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiService } from '../src/services/geminiService';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';

describe('GeminiService - Dual Engine, RAG Retrieval & Fallback Resilience', () => {
  const leaseDoc = SAMPLE_DOCUMENTS[0];
  const storage: Record<string, string> = {};

  beforeEach(() => {
    for (const k in storage) delete storage[k];
    // @ts-ignore
    globalThis.window = {
      localStorage: {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => { storage[k] = String(v); },
        removeItem: (k: string) => { delete storage[k]; },
        clear: () => { for (const k in storage) delete storage[k]; },
        length: 0,
        key: () => null,
      },
    };
    vi.restoreAllMocks();
  });

  it('should detect when no API key is present and declare offline mode', () => {
    expect(GeminiService.hasApiKey()).toBe(false);
  });

  it('should fall back gracefully to local heuristic engine with metadata tag when no API key exists', async () => {
    const response = await GeminiService.askDocumentQuestion(leaseDoc, 'Can the landlord enter without notice?');

    expect(response.answer).toBeDefined();
    expect(response.engineUsed).toBe('local-heuristic');
    expect(response.citedClauses.length).toBeGreaterThan(0);
    expect(response.citedClauses[0].clauseNumber).toBe('Clause 4');
  });

  it('should retrieve only top relevant clauses (RAG) rather than transmitting entire document', () => {
    const question = 'What are the rules regarding landlord visits and inspections?';
    const context = GeminiService.retrieveRelevantContext(leaseDoc, question, 2);

    // Should include the access clause
    expect(context).toContain('Clause 4');
    expect(context).toContain('Inspection');

    // Should NOT include every single unrelated clause (like Dispute Resolution Clause 8)
    expect(context.length).toBeLessThan(leaseDoc.rawText.length);
  });

  it('should fall back to local heuristic engine if external API throws network or HTTP 500 error', async () => {
    // Simulate active API key
    GeminiService.setApiKey('AIzaSyFakeKeyForTesting1234567890');
    expect(GeminiService.hasApiKey()).toBe(true);

    // Mock fetch to simulate network failure / 500 Internal Server Error
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      return {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Service Unavailable' }),
      } as unknown as Response;
    });

    const response = await GeminiService.askDocumentQuestion(leaseDoc, 'Can I terminate early?');

    // Verify it caught the error and fell back seamlessly to heuristic engine
    expect(response).toBeDefined();
    expect(response.engineUsed).toBe('local-heuristic');
    expect(response.answer).toContain('Clause');
  });

  it('should generate intelligent negotiation counter-proposals offline', async () => {
    const counter = await GeminiService.generateCounterProposal(
      leaseDoc,
      'Clause 4: Landlord Entry',
      'Landlord may enter at any time without notice',
      'Require 24 hours advance written notice'
    );

    expect(counter.counterClause).toContain('twenty-four (24) hours advance written notice');
    expect(counter.emailDraft).toContain('Subject:');
    expect(counter.rationale).toBeDefined();
  });

  it('should scrub PII inside counter-proposal inputs before processing', async () => {
    const counter = await GeminiService.generateCounterProposal(
      leaseDoc,
      'Clause 10: Contact',
      'Please call tenant Jane Doe at +1 (555) 000-1111 or email jane@doe.com for access.',
      'Change contact email to contact@business.com'
    );

    expect(counter.counterClause).toBeDefined();
    // The default template or AI response should not leak raw phone/email
    expect(counter.emailDraft).not.toContain('jane@doe.com');
  });

  it('should handle single-clause contracts in retrieveRelevantContext without failure', () => {
    const singleClauseDoc = {
      ...leaseDoc,
      clauses: [leaseDoc.clauses[0]],
    };

    const context = GeminiService.retrieveRelevantContext(singleClauseDoc, 'What is the rent?');
    expect(context).toContain('Clause');
  });
});
