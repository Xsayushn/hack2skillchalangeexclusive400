import React from 'react';
import { LegalDocument, RiskFlag } from '../types/legal';
import { ShieldAlert, Copy, Check, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RiskRadarViewProps {
  document: LegalDocument;
}

export const RiskRadarView: React.FC<RiskRadarViewProps> = ({ document }) => {
  const { riskAssessment } = document;
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--risk-critical)';
    if (score >= 60) return 'var(--risk-high)';
    if (score >= 40) return 'var(--risk-medium)';
    return 'var(--risk-safe)';
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section aria-label="Risk Radar & Predatory Clause Scanner">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
          Automated Risk Radar & Predatory Clause Scanner
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time vulnerability assessment flagging trap clauses, asymmetric liability, and unconscionable terms.
        </p>
      </div>

      {/* Top Overview Grid */}
      <div className="risk-overview-grid">
        {/* Score Dial Card */}
        <div className="glass-panel risk-score-card">
          <div
            className="score-circle"
            style={{
              border: `6px solid ${getScoreColor(riskAssessment.overallScore)}`,
              color: getScoreColor(riskAssessment.overallScore),
            }}
          >
            <span className="score-number">{riskAssessment.overallScore}</span>
            <span className="score-label">Risk Index</span>
          </div>

          <div
            className="grade-badge"
            style={{
              background: getScoreColor(riskAssessment.overallScore),
              color: '#ffffff',
            }}
          >
            Grade {riskAssessment.grade}
          </div>

          <div style={{ fontWeight: 700, fontSize: '1rem', color: getScoreColor(riskAssessment.overallScore), marginBottom: '0.4rem' }}>
            {riskAssessment.verdict}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
            0 is completely fair and balanced; 100 indicates severe predatory exposure.
          </p>
        </div>

        {/* Breakdown Stats & Traps */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Risk Severity Breakdown
            </h3>

            {/* Metric Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--risk-critical-bg)', border: '1px solid var(--risk-critical-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--risk-critical)', display: 'block' }}>
                  {riskAssessment.highRiskCount}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Critical Traps
                </span>
              </div>

              <div style={{ background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--risk-high)', display: 'block' }}>
                  {riskAssessment.mediumRiskCount}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Moderate Risks
                </span>
              </div>

              <div style={{ background: 'var(--risk-safe-bg)', border: '1px solid var(--risk-safe-border)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--risk-safe)', display: 'block' }}>
                  {riskAssessment.lowRiskCount}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Standard Clauses
                </span>
              </div>
            </div>

            {/* Predatory Traps List */}
            {riskAssessment.predatoryTrapsFound.length > 0 && (
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--risk-critical)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <ShieldAlert size={16} />
                  PRIMARY PREDATORY MECHANISMS DETECTED:
                </span>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {riskAssessment.predatoryTrapsFound.map((trap, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--risk-critical)', fontWeight: 700 }}>•</span>
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {riskAssessment.summary}
          </div>
        </div>
      </div>

      {/* Flagged Clauses Drilldown */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
        Flagged Risk Items & Suggested Counter-Proposals ({riskAssessment.flags.length})
      </h3>

      {riskAssessment.flags.map((flag: RiskFlag) => (
        <div key={flag.id} className={`glass-panel clause-card ${flag.severity}`}>
          <div className="clause-header">
            <div className="clause-title-area">
              <span className="clause-num-badge">{flag.clauseNumber}</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{flag.title}</h4>
              <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                {flag.category}
              </span>
            </div>

            <span className={`severity-pill ${flag.severity}`}>
              {flag.severity}
            </span>
          </div>

          {/* Why It Matters */}
          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--risk-critical)', display: 'block', marginBottom: '0.2rem' }}>
              Why this hurts you:
            </span>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {flag.whyItMatters}
            </p>
          </div>

          {/* Recommendation */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-secondary)', display: 'block', marginBottom: '0.2rem' }}>
              Strategic Recommendation:
            </span>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
              {flag.recommendation}
            </p>
          </div>

          {/* Suggested Alternative Counter-Clause */}
          {flag.suggestedAlternativeText && (
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lightbulb size={14} />
                  Ready-to-Use Counter-Clause Wording (Copy for Redline)
                </span>
                <button
                  className="icon-btn"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => handleCopy(flag.id, flag.suggestedAlternativeText)}
                  title="Copy counter-clause to clipboard"
                >
                  {copiedId === flag.id ? <Check size={13} style={{ color: 'var(--risk-safe)' }} /> : <Copy size={13} />}
                  <span>{copiedId === flag.id ? 'Copied!' : 'Copy Redline'}</span>
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                "{flag.suggestedAlternativeText}"
              </p>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
