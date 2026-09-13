export type DocumentCategory = 
  | 'lease' 
  | 'freelance' 
  | 'saas' 
  | 'employment' 
  | 'nda' 
  | 'general';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Clause {
  id: string;
  number: string;
  title: string;
  originalText: string;
  simplifiedText: string;
  readingLevels: {
    tldr: string;
    plainEnglish: string;
    eli5: string;
  };
  category: string;
  riskLevel: RiskSeverity;
  riskExplanation?: string;
  counterProposalRecommendation?: string;
  tags?: string[];
}

export interface RiskFlag {
  id: string;
  clauseId: string;
  clauseNumber: string;
  title: string;
  severity: RiskSeverity;
  category: 'Termination' | 'Liability' | 'Financial' | 'Intellectual Property' | 'Restrictive Covenant' | 'Dispute Resolution' | 'Privacy';
  whyItMatters: string;
  recommendation: string;
  suggestedAlternativeText: string;
}

export interface RiskAssessment {
  overallScore: number; // 0 to 100 (100 is highest risk, 0 is safest)
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  verdict: string;
  summary: string;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  predatoryTrapsFound: string[];
  flags: RiskFlag[];
}

export interface DocumentObligation {
  id: string;
  clauseRef: string;
  party: 'user' | 'counterparty' | 'mutual';
  title: string;
  description: string;
  deadlineOrFrequency?: string;
  isRecurring: boolean;
  consequenceOfDefault: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  subtitle?: string;
  category: DocumentCategory;
  rawText: string;
  sanitizedText?: string;
  summary: {
    tldr: string;
    plainEnglish: string;
    eli5: string;
  };
  keyTakeaways: string[];
  clauses: Clause[];
  riskAssessment: RiskAssessment;
  obligations: DocumentObligation[];
  suggestedQuestions: string[];
}

export interface ClauseComparison {
  id: string;
  category: string;
  title: string;
  docAText: string;
  docBText: string;
  verdict: 'A_FAVORABLE' | 'B_FAVORABLE' | 'NEUTRAL' | 'RISK_ESCALATION';
  impactDescription: string;
  recommendation: string;
}

export interface ComparisonResult {
  docAName: string;
  docBName: string;
  summaryOfDifferences: string;
  riskShiftVerdict: string;
  overallScoreDelta: number; // e.g. +15 (more risky) or -10 (safer)
  keyTakeaways: string[];
  addedRisks: string[];
  removedProtections: string[];
  clauseComparisons: ClauseComparison[];
}

export interface QAResponse {
  question: string;
  answer: string;
  confidence: number;
  citedClauses: {
    clauseNumber: string;
    clauseTitle: string;
    verbatimQuote: string;
    practicalMeaning: string;
  }[];
  actionableAdvice: string;
  suggestedNextQuestions: string[];
}

export interface AttorneyBrief {
  clientName: string;
  documentTitle: string;
  generatedDate: string;
  executiveSummary: string;
  estimatedComplexity: 'Low' | 'Moderate' | 'High' | 'Complex';
  recommendedSpecialist: string;
  criticalRedFlags: {
    clauseRef: string;
    title: string;
    concern: string;
    questionsToAskLawyer: string[];
  }[];
  recommendedNegotiationPoints: string[];
  checklistForMeeting: string[];
}

export interface RedactedEntity {
  id: string;
  type: 'NAME' | 'EMAIL' | 'PHONE' | 'ADDRESS' | 'FINANCIAL' | 'DATE' | 'IDENTIFIER';
  originalText: string;
  redactedText: string;
  index: number;
}

export interface RedactionResult {
  sanitizedText: string;
  entitiesFound: RedactedEntity[];
  count: number;
}
