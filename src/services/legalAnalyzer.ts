import {
  LegalDocument,
  Clause,
  RiskAssessment,
  RiskFlag,
  RiskSeverity,
  ComparisonResult,
  ClauseComparison,
  QAResponse,
  AttorneyBrief,
} from '../types/legal';

export class LegalAnalyzer {
  /**
   * Parses arbitrary contract text into structured clauses
   */
  static parseDocument(text: string, title = 'Custom Uploaded Agreement'): LegalDocument {
    const rawClauses = text.split(/\n(?=(?:\d+\.|\bSection\s+\d+|\bArticle\s+[IVXLCDM]+|\bClause\s+\d+))/i);

    const clauses: Clause[] = [];
    let clauseCounter = 1;

    for (let raw of rawClauses) {
      raw = raw.trim();
      if (!raw || raw.length < 20) continue;

      // Check for title or number
      const match = raw.match(/^(?:Section\s+|Article\s+|Clause\s+)?(\d+|[IVXLCDM]+)?[.:\s-]+([^\n]+)?/i);
      const number = match && match[1] ? match[1] : `${clauseCounter}`;
      const clauseTitle = match && match[2] && match[2].length < 80 ? match[2].trim() : `Clause ${clauseCounter}`;

      const risk = this.evaluateClauseRisk(raw);

      clauses.push({
        id: `clause-${clauseCounter}`,
        number,
        title: clauseTitle.replace(/^[^a-zA-Z0-9]+/, ''),
        originalText: raw,
        simplifiedText: this.generatePlainEnglishSummary(raw),
        readingLevels: {
          tldr: this.generateTLDR(raw),
          plainEnglish: this.generatePlainEnglishSummary(raw),
          eli5: this.generateELI5(raw),
        },
        category: risk.category,
        riskLevel: risk.severity,
        riskExplanation: risk.explanation,
        counterProposalRecommendation: risk.recommendation,
        tags: risk.tags,
      });

      clauseCounter++;
    }

    // If no numbered clauses detected, split by double newlines
    if (clauses.length <= 1) {
      const paragraphs = text.split(/\n\s*\n/);
      clauses.length = 0;
      paragraphs.forEach((p, idx) => {
        const clean = p.trim();
        if (clean.length > 25) {
          const risk = this.evaluateClauseRisk(clean);
          clauses.push({
            id: `p-${idx + 1}`,
            number: `${idx + 1}`,
            title: clean.slice(0, 45) + '...',
            originalText: clean,
            simplifiedText: this.generatePlainEnglishSummary(clean),
            readingLevels: {
              tldr: this.generateTLDR(clean),
              plainEnglish: this.generatePlainEnglishSummary(clean),
              eli5: this.generateELI5(clean),
            },
            category: risk.category,
            riskLevel: risk.severity,
            riskExplanation: risk.explanation,
            counterProposalRecommendation: risk.recommendation,
            tags: risk.tags,
          });
        }
      });
    }

    const riskAssessment = this.calculateOverallRisk(clauses);

    return {
      id: `doc-${Date.now()}`,
      title,
      subtitle: 'Parsed and Analyzed by LexiGuard Engine',
      category: 'general',
      rawText: text,
      summary: {
        tldr: this.generateTLDR(text.slice(0, 800)),
        plainEnglish: `This document contains ${clauses.length} distinct clauses. Our analysis identified ${riskAssessment.highRiskCount} high-risk clauses requiring careful attention.`,
        eli5: 'This is a legal agreement with rules you have to follow. Some rules might not be fair to you, so we flagged them in red.',
      },
      keyTakeaways: riskAssessment.predatoryTrapsFound.length > 0 
        ? riskAssessment.predatoryTrapsFound.map(t => `⚠️ ${t}`) 
        : ['Standard terms detected with moderate liability terms.'],
      clauses,
      riskAssessment,
      obligations: clauses
        .filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical')
        .map((c, i) => ({
          id: `ob-${i}`,
          clauseRef: `Clause ${c.number}`,
          party: 'user',
          title: c.title,
          description: c.simplifiedText,
          isRecurring: false,
          consequenceOfDefault: 'Potential breach or financial liability.',
        })),
      suggestedQuestions: [
        'What are the most dangerous clauses in this contract?',
        'Can either party cancel this agreement early?',
        'Who is responsible for damages and legal fees?',
        'Are there any restrictions on my future work or data privacy?',
      ],
    };
  }

  /**
   * Risk heuristic engine that checks for predatory terms and traps
   */
  static evaluateClauseRisk(text: string): {
    severity: RiskSeverity;
    category: 'Termination' | 'Liability' | 'Financial' | 'Intellectual Property' | 'Restrictive Covenant' | 'Dispute Resolution' | 'Privacy';
    explanation?: string;
    recommendation?: string;
    tags: string[];
  } {
    const lower = text.toLowerCase();

    // 1. IP Grab
    if (
      (lower.includes('all right, title, and interest') || lower.includes('irrevocably assigns')) &&
      (lower.includes('outside normal business hours') || lower.includes('whether or not conceived on company') || lower.includes('moral rights'))
    ) {
      return {
        severity: 'critical',
        category: 'Intellectual Property',
        explanation: 'Attempts to claim personal, hobby, or side-project IP created outside work.',
        recommendation: 'Scope assignment strictly to direct client deliverables created during paid hours.',
        tags: ['Overbroad IP Grab', 'Personal Project Risk'],
      };
    }

    // 2. Non-Compete & Restraint of Trade
    if (
      (lower.includes('non-compete') || lower.includes('not, directly or indirectly') || lower.includes('shall not compete')) &&
      (lower.includes('worldwide') || lower.includes('twenty-four') || lower.includes('24 month') || lower.includes('technology sector'))
    ) {
      return {
        severity: 'critical',
        category: 'Restrictive Covenant',
        explanation: 'Excessive non-compete restriction that could prevent earning a livelihood.',
        recommendation: 'Strike non-compete entirely; substitute with reasonable client non-solicitation.',
        tags: ['Restraint of Trade', 'Unreasonable Non-Compete'],
      };
    }

    // 3. Uncapped Consequential Damages
    if (
      lower.includes('indemnify') &&
      (lower.includes('uncapped') || lower.includes('consequential damages') || lower.includes('lost profits'))
    ) {
      return {
        severity: 'critical',
        category: 'Liability',
        explanation: 'Exposes personal assets to unlimited claims including lost business profits.',
        recommendation: 'Cap maximum liability to fees paid over the last 3–6 months and exclude indirect damages.',
        tags: ['Unlimited Liability', 'Consequential Damages'],
      };
    }

    // 4. Landlord Entry without Notice
    if (
      (lower.includes('enter the premises') || lower.includes('landlord access')) &&
      (lower.includes('without prior notice') || lower.includes('at any time'))
    ) {
      return {
        severity: 'critical',
        category: 'Privacy',
        explanation: 'Violates statutory tenant right to quiet enjoyment and reasonable 24-hour advance notice.',
        recommendation: 'Require at least 24 hours written notice before non-emergency entry.',
        tags: ['Invasion of Privacy', 'No-Notice Entry'],
      };
    }

    // 5. Unlawful Deposit Forfeiture
    if (
      lower.includes('security deposit') &&
      (lower.includes('forfeited as liquidated damages') || lower.includes('non-refundable cleaning fee') || lower.includes('operating account'))
    ) {
      return {
        severity: 'high',
        category: 'Financial',
        explanation: 'Unfair deposit forfeiture and arbitrary fees that violate statutory deposit trust rules.',
        recommendation: 'Specify deposits must be held in escrow and returned with itemized receipts within 30 days.',
        tags: ['Deposit Forfeiture', 'Unwarranted Fee'],
      };
    }

    // 6. Evergreen Auto-Renewal
    if (
      (lower.includes('automatically renew') || lower.includes('evergreen')) &&
      (lower.includes('90') || lower.includes('certified registered mail') || lower.includes('increase'))
    ) {
      return {
        severity: 'high',
        category: 'Termination',
        explanation: 'Difficult cancellation procedure with a large auto-renewal lock-in period.',
        recommendation: 'Switch to month-to-month tenancy or standard 30-day email notice.',
        tags: ['Auto-Renewal Trap', 'Price Escalation'],
      };
    }

    // 7. AI Model Training on User Files
    if (
      (lower.includes('train') || lower.includes('machine learning') || lower.includes('artificial intelligence')) &&
      (lower.includes('user content') || lower.includes('uploaded data') || lower.includes('license to use'))
    ) {
      return {
        severity: 'high',
        category: 'Intellectual Property',
        explanation: 'Allows platform to feed your confidential files and text into commercial AI models.',
        recommendation: 'Seek an enterprise opt-out or explicit non-retention guarantee.',
        tags: ['AI Training Rights', 'Data Confidentiality'],
      };
    }

    // 8. Unilateral Arbitrator Selection or Class Action Waiver
    if (
      lower.includes('arbitration') &&
      (lower.includes('selected solely') || lower.includes('borne entirely by') || lower.includes('class action'))
    ) {
      return {
        severity: 'high',
        category: 'Dispute Resolution',
        explanation: 'One-sided dispute resolution mechanism favoring the drafting party.',
        recommendation: 'Reserve small-claims court rights and mutual AAA/JAMS arbitration.',
        tags: ['Arbitration Trap', 'Class Action Waiver'],
      };
    }

    // Moderate clauses
    if (lower.includes('terminate') || lower.includes('convenience') || lower.includes('net 90') || lower.includes('warranty')) {
      return {
        severity: 'medium',
        category: 'Termination',
        explanation: 'Standard unilateral business terms that may place an unbalanced burden.',
        recommendation: 'Check mutual termination and reasonable payment timelines (Net 30).',
        tags: ['Business Terms'],
      };
    }

    return {
      severity: 'low',
      category: 'Termination',
      tags: ['Standard Clause'],
    };
  }

  /**
   * Calculates overall risk score (0-100) based on weighted severity of flags
   */
  static calculateOverallRisk(clauses: Clause[]): RiskAssessment {
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    const flags: RiskFlag[] = [];
    const trapsFound: string[] = [];

    clauses.forEach((c, idx) => {
      if (c.riskLevel === 'critical') {
        criticalCount++;
        flags.push({
          id: `flag-${idx}`,
          clauseId: c.id,
          clauseNumber: `Clause ${c.number}`,
          title: c.title,
          severity: 'critical',
          category: c.category as any,
          whyItMatters: c.riskExplanation || 'Contains high-liability or non-standard provisions.',
          recommendation: c.counterProposalRecommendation || 'Demand striking or revising this term.',
          suggestedAlternativeText: `Revision for Clause ${c.number}: Both parties agree to mutual and commercially standard terms.`,
        });
        if (c.riskExplanation) trapsFound.push(c.riskExplanation);
      } else if (c.riskLevel === 'high') {
        highCount++;
        flags.push({
          id: `flag-${idx}`,
          clauseId: c.id,
          clauseNumber: `Clause ${c.number}`,
          title: c.title,
          severity: 'high',
          category: c.category as any,
          whyItMatters: c.riskExplanation || 'Shifts excessive obligation onto one party.',
          recommendation: c.counterProposalRecommendation || 'Request softening language.',
          suggestedAlternativeText: `Revision for Clause ${c.number}: Reasonable mutual obligations apply.`,
        });
        if (c.riskExplanation) trapsFound.push(c.riskExplanation);
      } else if (c.riskLevel === 'medium') {
        mediumCount++;
      } else {
        lowCount++;
      }
    });

    // Score calculation: 0 = completely safe, 100 = extreme trap
    let score = (criticalCount * 25) + (highCount * 14) + (mediumCount * 6) + (lowCount * 1);
    score = Math.min(Math.max(score, 12), 98);

    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
    let verdict = 'Fair & Balanced Agreement';

    if (score >= 80) {
      grade = 'F';
      verdict = 'Critical Risk — Contains Severe Predatory Clauses';
    } else if (score >= 65) {
      grade = 'D';
      verdict = 'High Caution — Heavy One-Sided Liabilities Detected';
    } else if (score >= 45) {
      grade = 'C';
      verdict = 'Moderate Risk — Several Clauses Need Negotiation';
    } else if (score >= 25) {
      grade = 'B';
      verdict = 'Relatively Safe — Minor Standard Cautions';
    }

    return {
      overallScore: score,
      grade,
      verdict,
      summary: `Document analysis detected ${criticalCount} critical and ${highCount} high risk provisions. Overall Risk Score: ${score}/100 (Grade: ${grade}).`,
      highRiskCount: criticalCount + highCount,
      mediumRiskCount: mediumCount,
      lowRiskCount: lowCount,
      predatoryTrapsFound: Array.from(new Set(trapsFound)),
      flags,
    };
  }

  /**
   * Plain English text generation heuristics
   */
  static generatePlainEnglishSummary(text: string): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length < 50) return clean;
    return `In plain English: This section sets out rules regarding rights and obligations. Carefully check deadlines, financial liabilities, and notice procedures before agreeing.`;
  }

  static generateTLDR(text: string): string {
    const sentences = text.split(/[.!?]\s+/);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
  }

  static generateELI5(_text: string): string {
    return `Imagine making a deal on the playground: this rule says what happens if someone changes their mind or breaks a promise.`;
  }

  /**
   * Grounded Document Q&A Engine
   */
  static answerQuestion(doc: LegalDocument, question: string): QAResponse {
    const qLower = question.toLowerCase();

    // Score each clause for keyword matches
    const scoredClauses = doc.clauses.map(c => {
      let score = 0;
      const cText = (c.title + ' ' + c.originalText + ' ' + c.simplifiedText).toLowerCase();
      
      const words = qLower.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
      words.forEach(w => {
        if (cText.includes(w)) score += 2;
      });

      // Boost on legal concept matches
      if (qLower.includes('enter') || qLower.includes('notice') || qLower.includes('inspect')) {
        if (cText.includes('enter') || cText.includes('access') || cText.includes('inspection')) score += 10;
      }
      if (qLower.includes('deposit') || qLower.includes('money') || qLower.includes('cleaning')) {
        if (cText.includes('deposit') || cText.includes('fee') || cText.includes('forfeited')) score += 10;
      }
      if (qLower.includes('renew') || qLower.includes('cancel') || qLower.includes('terminate')) {
        if (cText.includes('renew') || cText.includes('terminate') || cText.includes('vacate')) score += 10;
      }
      if (qLower.includes('own') || qLower.includes('ip') || qLower.includes('code') || qLower.includes('invention')) {
        if (cText.includes('intellectual property') || cText.includes('assigns') || cText.includes('authorship')) score += 10;
      }
      if (qLower.includes('compete') || qLower.includes('work') || qLower.includes('job')) {
        if (cText.includes('non-compete') || cText.includes('solicit')) score += 10;
      }
      if (qLower.includes('sue') || qLower.includes('court') || qLower.includes('arbitrat')) {
        if (cText.includes('arbitration') || cText.includes('jury') || cText.includes('dispute')) score += 10;
      }

      return { clause: c, score };
    });

    scoredClauses.sort((a, b) => b.score - a.score);

    const topMatches = scoredClauses.filter(s => s.score > 0).slice(0, 2);

    if (topMatches.length === 0) {
      return {
        question,
        answer: `I could not locate an explicit clause in this agreement that directly addresses "${question}". This matter may be governed by default statutory law or is omitted from the contract.`,
        confidence: 0.45,
        citedClauses: [],
        actionableAdvice: 'Consider asking the counterparty to insert explicit clarifying language on this point before signing.',
        suggestedNextQuestions: [
          'What are the key obligations for both parties?',
          'What is the dispute resolution procedure?',
          'What notice is required for termination?',
        ],
      };
    }

    const primaryClause = topMatches[0].clause;

    // Create tailored practical explanation
    let practicalAnswer = '';
    if (primaryClause.riskExplanation) {
      practicalAnswer = `According to Clause ${primaryClause.number} ("${primaryClause.title}"), ${primaryClause.simplifiedText} Note that this is flagged as ${primaryClause.riskLevel.toUpperCase()} RISK: ${primaryClause.riskExplanation}`;
    } else {
      practicalAnswer = `According to Clause ${primaryClause.number} ("${primaryClause.title}"), ${primaryClause.simplifiedText}`;
    }

    return {
      question,
      answer: practicalAnswer,
      confidence: 0.94,
      citedClauses: topMatches.map(m => ({
        clauseNumber: `Clause ${m.clause.number}`,
        clauseTitle: m.clause.title,
        verbatimQuote: m.clause.originalText.slice(0, 260) + (m.clause.originalText.length > 260 ? '...' : ''),
        practicalMeaning: m.clause.readingLevels.plainEnglish,
      })),
      actionableAdvice: primaryClause.counterProposalRecommendation 
        ? `Recommended Action: ${primaryClause.counterProposalRecommendation}`
        : 'Ensure you review the exact wording with all stakeholders.',
      suggestedNextQuestions: [
        `How can I modify Clause ${primaryClause.number} to be more balanced?`,
        'What happens if either party defaults on this clause?',
        'Does local statutory law override this clause?',
      ],
    };
  }

  /**
   * Side-by-side Contract Comparison & Diff Matrix
   */
  static compareDocuments(docA: LegalDocument, docB: LegalDocument): ComparisonResult {
    const clauseComparisons: ClauseComparison[] = [];
    const addedRisks: string[] = [];
    const removedProtections: string[] = [];

    const scoreDelta = docB.riskAssessment.overallScore - docA.riskAssessment.overallScore;

    // Map through clauses in B and compare with A
    docB.clauses.forEach((bClause, i) => {
      const aClause = docA.clauses[i] || docA.clauses.find(a => a.category === bClause.category);

      let verdict: 'A_FAVORABLE' | 'B_FAVORABLE' | 'NEUTRAL' | 'RISK_ESCALATION' = 'NEUTRAL';
      let impact = 'Terms remain substantially equivalent.';
      let rec = 'No action needed.';

      if (!aClause) {
        verdict = 'RISK_ESCALATION';
        impact = `Newly introduced clause in Document B: "${bClause.title}". Adds new obligations.`;
        rec = 'Scrutinize new clause closely.';
        addedRisks.push(`Added new restriction: ${bClause.title}`);
      } else if (bClause.riskLevel === 'critical' && aClause.riskLevel !== 'critical') {
        verdict = 'RISK_ESCALATION';
        impact = `Risk escalated from ${aClause.riskLevel} to CRITICAL. Significant increase in counterparty power.`;
        rec = `Push back to restore Document A wording for ${bClause.title}.`;
        addedRisks.push(`Escalated risk in ${bClause.title}`);
      } else if (bClause.riskLevel === 'low' && (aClause.riskLevel === 'high' || aClause.riskLevel === 'critical')) {
        verdict = 'B_FAVORABLE';
        impact = `Document B provides much fairer and balanced terms than Document A.`;
        rec = 'Accept Document B wording.';
        removedProtections.push(`Favorable amendment in ${bClause.title}`);
      }

      clauseComparisons.push({
        id: `comp-${i}`,
        category: bClause.category,
        title: bClause.title,
        docAText: aClause ? aClause.originalText : '[Clause not present in Document A]',
        docBText: bClause.originalText,
        verdict,
        impactDescription: impact,
        recommendation: rec,
      });
    });

    let verdictSummary = '';
    if (scoreDelta > 15) {
      verdictSummary = `${docB.title} is significantly MORE RISKY than ${docA.title} (+${scoreDelta} risk score surge).`;
    } else if (scoreDelta < -15) {
      verdictSummary = `${docB.title} is significantly SAFER and more balanced than ${docA.title} (${scoreDelta} risk score reduction).`;
    } else {
      verdictSummary = `Both documents share comparable risk profiles (Delta: ${scoreDelta > 0 ? '+' : ''}${scoreDelta}).`;
    }

    return {
      docAName: docA.title,
      docBName: docB.title,
      summaryOfDifferences: verdictSummary,
      riskShiftVerdict: scoreDelta > 0 ? 'Document B increases user liability' : 'Document B provides fairer terms',
      overallScoreDelta: scoreDelta,
      keyTakeaways: [
        `${docA.title} Risk Score: ${docA.riskAssessment.overallScore}/100 (Grade ${docA.riskAssessment.grade})`,
        `${docB.title} Risk Score: ${docB.riskAssessment.overallScore}/100 (Grade ${docB.riskAssessment.grade})`,
        `Net Risk Shift: ${scoreDelta > 0 ? '+' : ''}${scoreDelta} points`,
      ],
      addedRisks,
      removedProtections,
      clauseComparisons,
    };
  }

  /**
   * Generates a structured Attorney Consultation Brief
   */
  static generateAttorneyBrief(doc: LegalDocument, clientName = 'Client'): AttorneyBrief {
    const criticalFlags = doc.riskAssessment.flags.filter(f => f.severity === 'critical' || f.severity === 'high');

    let complexity: 'Low' | 'Moderate' | 'High' | 'Complex' = 'Moderate';
    if (doc.riskAssessment.overallScore > 80) complexity = 'Complex';
    else if (doc.riskAssessment.overallScore < 40) complexity = 'Low';

    let specialist = 'General Contract Attorney';
    if (doc.category === 'lease') specialist = 'Tenant Rights & Real Estate Attorney';
    else if (doc.category === 'freelance' || doc.category === 'employment') specialist = 'Labor & Employment Attorney (IP Specialist)';
    else if (doc.category === 'saas') specialist = 'Commercial Technology & Privacy Lawyer';

    return {
      clientName,
      documentTitle: doc.title,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      executiveSummary: `This brief summarizes key areas of concern identified in "${doc.title}". The agreement has an overall risk rating of ${doc.riskAssessment.overallScore}/100 (${doc.riskAssessment.grade}) with ${criticalFlags.length} flagged high-risk provisions that may warrant legal revision or negotiation prior to execution.`,
      estimatedComplexity: complexity,
      recommendedSpecialist: specialist,
      criticalRedFlags: criticalFlags.map(f => ({
        clauseRef: f.clauseNumber,
        title: f.title,
        concern: f.whyItMatters,
        questionsToAskLawyer: [
          `Is this specific clause legally enforceable under our state/local jurisdiction?`,
          `What are the typical market standard terms for ${f.category} in this type of agreement?`,
          `What is the best strategic redline proposal to offer the other party?`,
        ],
      })),
      recommendedNegotiationPoints: criticalFlags.map(f => f.recommendation),
      checklistForMeeting: [
        `Bring a complete, un-redacted copy of the agreement and all referenced addenda.`,
        `Bring all email correspondence and written representations made by the other party.`,
        `Note your primary non-negotiable priorities (e.g. payment terms, termination freedom, IP ownership).`,
        `Review the specific questions outlined in this brief during the initial 30 minutes of consultation.`,
      ],
    };
  }
}
