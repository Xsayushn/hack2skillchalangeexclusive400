import React, { useState } from 'react';
import { LegalDocument, ComparisonResult } from '../types/legal';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { LegalAnalyzer } from '../services/legalAnalyzer';
import { ArrowLeftRight, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComparisonViewProps {
  currentDocument: LegalDocument;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ currentDocument }) => {
  const [docAId, setDocAId] = useState<string>(SAMPLE_DOCUMENTS[0].id);
  const [docBId, setDocBId] = useState<string>(SAMPLE_DOCUMENTS[1].id);

  const docA = SAMPLE_DOCUMENTS.find(d => d.id === docAId) || currentDocument;
  const docB = SAMPLE_DOCUMENTS.find(d => d.id === docBId) || SAMPLE_DOCUMENTS[1];

  const comparison: ComparisonResult = LegalAnalyzer.compareDocuments(docA, docB);

  return (
    <section aria-label="Contract Comparison and Diff Matrix">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
          Side-by-Side Contract Comparison & Risk Shift Matrix
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Compare two versions of an agreement, counter-proposals, or alternative vendor policies to detect shifted liabilities.
        </p>
      </div>

      {/* Document Selectors Header */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
          {/* Doc A Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              BASELINE DOCUMENT (DOCUMENT A)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            >
              {SAMPLE_DOCUMENTS.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', paddingTop: '1.2rem' }}>
            <ArrowLeftRight size={24} />
          </div>

          {/* Doc B Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              REVISED / COMPARISON AGREEMENT (DOCUMENT B)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            >
              {SAMPLE_DOCUMENTS.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Net Risk Shift Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              COMPARATIVE RISK SHIFT VERDICT:
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {comparison.summaryOfDifferences}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: comparison.overallScoreDelta > 0 ? 'var(--risk-critical-bg)' : 'var(--risk-safe-bg)',
              color: comparison.overallScoreDelta > 0 ? 'var(--risk-critical)' : 'var(--risk-safe)',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}>
              {comparison.overallScoreDelta > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>{comparison.overallScoreDelta > 0 ? `+${comparison.overallScoreDelta}` : comparison.overallScoreDelta} Risk Delta</span>
            </div>
          </div>
        </div>

        {/* Added vs Removed List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Added Risks */}
          <div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--risk-critical)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={15} /> Added Liabilities in Document B:
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem' }}>
              {comparison.addedRisks.length > 0 ? (
                comparison.addedRisks.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)' }}>⚠️ {item}</li>
                ))
              ) : (
                <li style={{ color: 'var(--text-muted)' }}>No major new risks introduced in Document B.</li>
              )}
            </ul>
          </div>

          {/* Favorable Protections */}
          <div>
            <strong style={{ fontSize: '0.85rem', color: 'var(--risk-safe)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={15} /> Protections or Favorable Terms:
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.88rem' }}>
              {comparison.removedProtections.length > 0 ? (
                comparison.removedProtections.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)' }}>✓ {item}</li>
                ))
              ) : (
                <li style={{ color: 'var(--text-muted)' }}>No notable protections removed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Side-by-Side Clause Diff Table */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
        Clause-by-Clause Comparison Matrix ({comparison.clauseComparisons.length} Mapped Clauses)
      </h3>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
        <table className="diff-table">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Category & Clause</th>
              <th style={{ width: '36%' }}>Document A: {docA.title}</th>
              <th style={{ width: '36%' }}>Document B: {docB.title}</th>
              <th style={{ width: '10%' }}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {comparison.clauseComparisons.map((c) => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{c.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                </td>
                <td>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {c.docAText}
                  </p>
                </td>
                <td>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {c.docBText}
                  </p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Impact:</strong> {c.impactDescription}
                  </div>
                </td>
                <td>
                  <span className={`diff-badge ${
                    c.verdict === 'RISK_ESCALATION' ? 'escalation' : c.verdict === 'B_FAVORABLE' ? 'favorable' : 'neutral'
                  }`}>
                    {c.verdict.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
