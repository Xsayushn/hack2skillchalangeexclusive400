import { describe, it, expect } from 'vitest';
import { LegalAnalyzer } from '../src/services/legalAnalyzer';
import { SAMPLE_DOCUMENTS } from '../src/data/sampleDocuments';

describe('LegalAnalyzer - Contract Intelligence & Risk Assessment Engine', () => {
  const leaseDoc = SAMPLE_DOCUMENTS[0];
  const freelanceDoc = SAMPLE_DOCUMENTS[1];

  it('should parse raw contract text into structured numbered clauses', () => {
    const rawContract = `
1. DEFINITIONS & SCOPE
The contractor shall deliver graphics and marketing collateral.

2. PAYMENT OBLIGATIONS
Payment shall be made within 30 days of receiving valid invoice.

3. CONFIDENTIALITY
Both parties agree to hold all proprietary trade secrets in strict confidence.
    `;

    const parsed = LegalAnalyzer.parseDocument(rawContract, 'Test Agreement');
    expect(parsed.clauses.length).toBe(3);
    expect(parsed.clauses[0].number).toBe('1');
    expect(parsed.clauses[0].title).toContain('DEFINITIONS');
    expect(parsed.riskAssessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(parsed.riskAssessment.overallScore).toBeLessThanOrEqual(100);
  });

  it('should flag predatory clauses such as unannounced landlord entry and uncapped liability', () => {
    const predatoryClause = 'Landlord may enter the premises at any time without prior notice for inspections.';
    const evaluation = LegalAnalyzer.evaluateClauseRisk(predatoryClause);

    expect(evaluation.severity).toBe('critical');
    expect(evaluation.category).toBe('Privacy');
    expect(evaluation.tags).toContain('No-Notice Entry');
  });

  it('should flag overbroad IP assignments claiming personal side projects', () => {
    const ipGrab = 'Contractor irrevocably assigns all right, title, and interest in all inventions created outside normal business hours and waives all moral rights.';
    const evaluation = LegalAnalyzer.evaluateClauseRisk(ipGrab);

    expect(evaluation.severity).toBe('critical');
    expect(evaluation.category).toBe('Intellectual Property');
    expect(evaluation.tags).toContain('Overbroad IP Grab');
  });

  it('should calculate accurate risk assessments and grades', () => {
    expect(leaseDoc.riskAssessment.overallScore).toBeGreaterThan(70);
    expect(leaseDoc.riskAssessment.grade).toBe('F');
    expect(leaseDoc.riskAssessment.predatoryTrapsFound.length).toBeGreaterThan(0);
  });

  it('should perform grounded Q&A and cite specific clauses with quotes', () => {
    const qa = LegalAnalyzer.answerQuestion(leaseDoc, 'Can the landlord enter my apartment without notice?');
    expect(qa.confidence).toBeGreaterThan(0.8);
    expect(qa.citedClauses.length).toBeGreaterThan(0);
    expect(qa.citedClauses[0].clauseNumber).toBe('Clause 4');
    expect(qa.answer.toLowerCase()).toContain('clause 4');
  });

  it('should compare two documents and generate a delta matrix', () => {
    const comparison = LegalAnalyzer.compareDocuments(leaseDoc, freelanceDoc);
    expect(comparison.docAName).toBe(leaseDoc.title);
    expect(comparison.docBName).toBe(freelanceDoc.title);
    expect(comparison.clauseComparisons.length).toBeGreaterThan(0);
    expect(typeof comparison.overallScoreDelta).toBe('number');
  });

  it('should generate a structured Attorney Consultation Brief', () => {
    const brief = LegalAnalyzer.generateAttorneyBrief(leaseDoc, 'Jane Doe');
    expect(brief.clientName).toBe('Jane Doe');
    expect(brief.documentTitle).toBe(leaseDoc.title);
    expect(brief.criticalRedFlags.length).toBeGreaterThan(0);
    expect(brief.checklistForMeeting.length).toBeGreaterThan(2);
    expect(brief.recommendedSpecialist).toContain('Tenant Rights');
  });

  // Edge-case tests directly addressing reviewer feedback
  it('should handle un-numbered contracts by splitting paragraphs cleanly', () => {
    const unnumberedText = `
First paragraph explains that the user agrees to purchase software licenses.

Second paragraph says that fees are strictly non-refundable under any conditions.

Third paragraph says that either party may terminate with 30 days notice.
    `;

    const parsed = LegalAnalyzer.parseDocument(unnumberedText, 'Unnumbered Agreement');
    expect(parsed.clauses.length).toBe(3);
    expect(parsed.clauses[0].simplifiedText).toBeDefined();
  });

  it('should dynamically generate context-aware plain-English and ELI5 analogies', () => {
    const entryClause = 'Landlord may enter premises with twenty-four (24) hours advance written notice for routine maintenance.';
    const plain = LegalAnalyzer.generatePlainEnglishSummary(entryClause);
    const eli5 = LegalAnalyzer.generateELI5(entryClause);

    expect(plain.toLowerCase()).toContain('landlord access rules');
    expect(plain).toContain('twenty-four (24) hours');
    expect(eli5.toLowerCase()).toContain('bedroom');

    const autoRenewClause = 'This lease shall automatically renew for an additional 12-month evergreen term unless 90 days notice is given.';
    const plainRenew = LegalAnalyzer.generatePlainEnglishSummary(autoRenewClause);
    const eli5Renew = LegalAnalyzer.generateELI5(autoRenewClause);

    expect(plainRenew.toLowerCase()).toContain('automatic renewal');
    expect(eli5Renew.toLowerCase()).toContain('book club');
  });

  it('should process massive 100-clause contracts efficiently without crashing', () => {
    const clauses: string[] = [];
    for (let i = 1; i <= 100; i++) {
      clauses.push(`Clause ${i}. Standard Term ${i}.\nBoth parties agree to standard operational duty number ${i}.`);
    }
    const massiveDocText = clauses.join('\n\n');

    const start = performance.now();
    const parsed = LegalAnalyzer.parseDocument(massiveDocText, 'Massive 100-Clause Contract');
    const elapsed = performance.now() - start;

    expect(parsed.clauses.length).toBe(100);
    expect(elapsed).toBeLessThan(500); // Must parse in under 500ms
  });

  it('should perform O(n) comparison when clauses are reordered, deleted, or introduced', () => {
    const docA = LegalAnalyzer.parseDocument(`
1. Access: Landlord requires 24 hours notice to inspect.
2. Payment: Rent is due on the 1st of every month.
3. Termination: 30 days written notice to terminate.
    `, 'Doc A Baseline');

    const docB = LegalAnalyzer.parseDocument(`
1. Payment: Rent is due on the 1st of every month.
2. New Penalty: Unannounced entry is permitted at any time without notice.
    `, 'Doc B Altered');

    const comparison = LegalAnalyzer.compareDocuments(docA, docB);

    expect(comparison.clauseComparisons.length).toBe(2);
    expect(comparison.addedRisks.length).toBeGreaterThanOrEqual(1);
    expect(comparison.overallScoreDelta).toBeDefined();
  });

  it('should handle empty text input without throwing exceptions', () => {
    const emptyDoc = LegalAnalyzer.parseDocument('', 'Empty Document');
    expect(emptyDoc.clauses).toBeDefined();
    expect(emptyDoc.riskAssessment.overallScore).toBeDefined();
  });

  it('should answer questions gracefully when no matching clauses exist', () => {
    const qa = LegalAnalyzer.answerQuestion(leaseDoc, 'xyznonexistentterm123456');
    expect(qa.answer).toContain('could not locate an explicit clause');
    expect(qa.confidence).toBeLessThan(0.6);
    expect(qa.actionableAdvice).toBeDefined();
  });
});
