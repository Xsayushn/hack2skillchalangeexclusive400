import { describe, it, expect } from 'vitest';
import { LegalAnalyzer } from '../src/services/legalAnalyzer';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';

describe('Architecture, Edge Cases & Robustness Smoke Suite', () => {
  it('should generate a complete structured Attorney Consultation Brief', () => {
    const doc = SAMPLE_DOCUMENTS[1]; // Predatory freelance agreement
    const brief = LegalAnalyzer.generateAttorneyBrief(doc, 'Alex Rivera');

    expect(brief.clientName).toBe('Alex Rivera');
    expect(brief.documentTitle).toBe(doc.title);
    expect(brief.executiveSummary).toContain('overall risk rating');
    expect(brief.criticalRedFlags.length).toBeGreaterThan(0);
    expect(brief.criticalRedFlags[0].questionsToAskLawyer.length).toBeGreaterThan(0);
    expect(brief.checklistForMeeting.length).toBeGreaterThan(0);
  });

  it('should handle ultra-long contracts (50,000+ characters) without performance degradation', () => {
    const repetitiveClause = `
      Section 1. Obligation. The contractor shall deliver all milestone assets within specified intervals.
      Section 2. Liability. Contractor shall indemnify client for all foreseeable and consequential losses.
    `;
    const massiveText = repetitiveClause.repeat(250); // ~50k chars
    expect(massiveText.length).toBeGreaterThan(40000);

    const startTime = Date.now();
    const parsed = LegalAnalyzer.parseDocument(massiveText, 'Massive Enterprise Agreement');
    const elapsed = Date.now() - startTime;

    expect(parsed.clauses.length).toBeGreaterThan(1);
    expect(parsed.riskAssessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(elapsed).toBeLessThan(1500); // Must parse in <1.5 seconds
  });

  it('should handle weird inputs like emojis, special symbols, and zero alphanumeric characters gracefully', () => {
    const weirdInput = '🔥⚖️ 🛑 ⚠️ 🤖 \n\n @#$%^&*()_+=-~`[]{}|;:,.<>?';
    const parsed = LegalAnalyzer.parseDocument(weirdInput, 'Symbol Only Doc');

    expect(parsed).toBeDefined();
    expect(parsed.title).toBe('Symbol Only Doc');
    expect(parsed.riskAssessment.grade).toBeDefined();
    expect(parsed.clauses.length).toBeGreaterThanOrEqual(0);
  });

  it('should correctly calculate risk shifts when comparing safe vs predatory agreements', () => {
    const baselineDoc = SAMPLE_DOCUMENTS[2]; // SaaS terms (Score 74)
    const predatoryDoc = SAMPLE_DOCUMENTS[1]; // Predatory freelance agreement (Score 94)

    const comparison = LegalAnalyzer.compareDocuments(baselineDoc, predatoryDoc);

    expect(comparison.overallScoreDelta).toBeGreaterThan(0);
    expect(comparison.riskShiftVerdict).toContain('increases user liability');
    expect(comparison.clauseComparisons.length).toBeGreaterThan(0);
  });
});
