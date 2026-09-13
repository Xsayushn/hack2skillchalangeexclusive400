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
});
