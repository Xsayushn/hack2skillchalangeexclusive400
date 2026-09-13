import React, { useState } from 'react';
import { LegalDocument } from '../types/legal';
import { GeminiService } from '../services/geminiService';
import { Mail, Copy, Check, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionNavigatorViewProps {
  document: LegalDocument;
}

export const ActionNavigatorView: React.FC<ActionNavigatorViewProps> = ({ document }) => {
  const [selectedClauseId, setSelectedClauseId] = useState<string>(document.clauses[1]?.id || document.clauses[0]?.id || '');
  const [userObjective, setUserObjective] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{
    counterClause: string;
    emailDraft: string;
    rationale: string;
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<'clause' | 'email' | null>(null);

  const selectedClause = document.clauses.find(c => c.id === selectedClauseId) || document.clauses[0];

  const handleGenerateCounterProposal = async () => {
    if (!selectedClause) return;
    setIsGenerating(true);
    try {
      const result = await GeminiService.generateCounterProposal(
        document,
        selectedClause.title,
        selectedClause.originalText,
        userObjective || 'Ensure fair, mutual, and standard commercially reasonable terms'
      );
      setGeneratedDraft(result);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, section: 'clause' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <section aria-label="Action Navigator and Negotiation Drafter">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
          Action Navigator & Counter-Proposal Drafter
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Understand your practical next steps, track deadlines, and generate professional negotiation emails to push back on unfair terms.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Counter-Proposal & Email Drafter */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Mail size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              AI Negotiation & Redline Drafter
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Select any clause you are uncomfortable with, specify what you want changed, and let AI generate a diplomatic counter-offer email.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              SELECT CLAUSE TO NEGOTIATE:
            </label>
            <select
              value={selectedClauseId}
              onChange={(e) => {
                setSelectedClauseId(e.target.value);
                setGeneratedDraft(null);
              }}
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
              {document.clauses.map(c => (
                <option key={c.id} value={c.id}>
                  § {c.number}: {c.title} ({c.riskLevel.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              YOUR GOAL OR DESIRED OUTCOME:
            </label>
            <input
              type="text"
              placeholder="e.g. Reduce 90 days notice to 30 days; remove 2-year non-compete"
              value={userObjective}
              onChange={(e) => setUserObjective(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.88rem',
              }}
            />
          </div>

          <button
            onClick={handleGenerateCounterProposal}
            disabled={isGenerating}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={16} />
            {isGenerating ? 'Drafting Counter-Proposal...' : 'Generate Counter-Proposal & Email'}
          </button>

          {/* Generated Result Output */}
          {generatedDraft && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              {/* Proposed Legal Revision */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    PROPOSED LEGAL REDLINE WORDING:
                  </span>
                  <button
                    className="icon-btn"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => copyToClipboard(generatedDraft.counterClause, 'clause')}
                  >
                    {copiedSection === 'clause' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSection === 'clause' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.83rem', fontFamily: 'var(--font-mono)' }}>
                  {generatedDraft.counterClause}
                </div>
              </div>

              {/* Ready-to-Send Email */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--risk-safe)' }}>
                    POLITE NEGOTIATION EMAIL DRAFT:
                  </span>
                  <button
                    className="icon-btn"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => copyToClipboard(generatedDraft.emailDraft, 'email')}
                  >
                    {copiedSection === 'email' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSection === 'email' ? 'Copied' : 'Copy Email'}</span>
                  </button>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {generatedDraft.emailDraft}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Obligations & Deadlines Checklist */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Calendar size={18} style={{ color: 'var(--accent-secondary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Obligation Tracker & Critical Deadlines
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Never miss a required legal notice window, payment schedule, or contractual milestone.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
            {document.obligations.length > 0 ? (
              document.obligations.map((ob) => (
                <div
                  key={ob.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.92rem' }}>{ob.title}</strong>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-secondary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {ob.clauseRef}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                    {ob.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span><strong>Due:</strong> {ob.deadlineOrFrequency || 'Ongoing during term'}</span>
                    <span style={{ color: 'var(--risk-high)' }}>⚠️ {ob.consequenceOfDefault}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No critical unilateral obligations detected in this document.
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--risk-safe)' }}>
            <ShieldCheck size={16} />
            <span>Compliance with notice deadlines prevents automatic renewals and deposit forfeiture.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
