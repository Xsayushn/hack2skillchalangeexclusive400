import React, { useState } from 'react';
import { LegalDocument, Clause } from '../types/legal';
import { BookOpen, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SimplifierViewProps {
  document: LegalDocument;
}

// Built-in glossary for complex legalese definitions
const LEGAL_GLOSSARY: Record<string, string> = {
  'liquidated damages': 'A fixed pre-agreed penalty amount that you must pay if you break the contract, regardless of whether the other side suffered actual losses.',
  'indemnification': 'An agreement where you promise to pay the other party\'s legal fees and court damages if a third party sues them because of your work.',
  'quiet enjoyment': 'A basic legal right that protects tenants from landlord harassment, trespass, or unreasonable interference in their home.',
  'consequential damages': 'Indirect financial losses (like lost business sales or profits) resulting from a breach, rather than direct physical damage.',
  'severability': 'A clause stating that if a court rules one paragraph illegal, the rest of the contract still remains legally valid.',
  'arbitration': 'A private court process where a hired referee (arbitrator) makes a final, binding decision instead of a public judge and jury.',
  'evergreen clause': 'A contract provision that automatically renews the agreement for another full term unless one side explicitly cancels in writing before a strict deadline.',
  'force majeure': 'An unforeseeable emergency or disaster (like an earthquake, war, or epidemic) that excuses both parties from contract duties.',
  'net 90': 'A payment term meaning the client does not have to send your payment until 90 days after receiving and approving your invoice.',
};

export const SimplifierView: React.FC<SimplifierViewProps> = ({ document }) => {
  const [readingLevel, setReadingLevel] = useState<'plainEnglish' | 'tldr' | 'eli5'>('plainEnglish');
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [speakingClauseId, setSpeakingClauseId] = useState<string | null>(null);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<{ term: string; definition: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedClauses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSpeak = (clauseId: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    if (speakingClauseId === clauseId) {
      window.speechSynthesis.cancel();
      setSpeakingClauseId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingClauseId(null);
    utterance.onerror = () => setSpeakingClauseId(null);

    setSpeakingClauseId(clauseId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section aria-label="Legal Document Simplifier">
      {/* Top Controls: Reading Level Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
            Demystified Document Intelligence
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Translate jargon into clear, accessible language at your preferred reading level.
          </p>
        </div>

        <div className="reading-level-switch" role="radiogroup" aria-label="Select Reading Level">
          <button
            role="radio"
            aria-checked={readingLevel === 'tldr'}
            className={`level-btn ${readingLevel === 'tldr' ? 'active' : ''}`}
            onClick={() => setReadingLevel('tldr')}
          >
            ⚡ Executive TL;DR
          </button>
          <button
            role="radio"
            aria-checked={readingLevel === 'plainEnglish'}
            className={`level-btn ${readingLevel === 'plainEnglish' ? 'active' : ''}`}
            onClick={() => setReadingLevel('plainEnglish')}
          >
            🎓 Plain English
          </button>
          <button
            role="radio"
            aria-checked={readingLevel === 'eli5'}
            className={`level-btn ${readingLevel === 'eli5' ? 'active' : ''}`}
            onClick={() => setReadingLevel('eli5')}
          >
            🧒 Explain Like I'm 5
          </button>
        </div>
      </div>

      {/* High-Level Document Summary Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
            Document Overview ({readingLevel === 'tldr' ? 'Quick TL;DR' : readingLevel === 'eli5' ? 'Simple Analogy' : 'Plain English Breakdown'})
          </span>
        </div>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          {document.summary[readingLevel]}
        </p>

        {/* Key Takeaways */}
        <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            KEY TAKEAWAYS AT A GLANCE:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {document.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Glossary Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          <BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Glossary Quick Tips:
        </span>
        {Object.keys(LEGAL_GLOSSARY).slice(0, 6).map(term => (
          <button
            key={term}
            onClick={() => setActiveGlossaryTerm({ term, definition: LEGAL_GLOSSARY[term] })}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.2rem 0.65rem',
              fontSize: '0.75rem',
              color: 'var(--accent-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {term}
          </button>
        ))}
      </div>

      {/* Active Glossary Popup */}
      {activeGlossaryTerm && (
        <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <strong style={{ color: 'var(--accent-secondary)', fontSize: '0.9rem', textTransform: 'capitalize' }}>
              📚 Legal Term: {activeGlossaryTerm.term}
            </strong>
            <button onClick={() => setActiveGlossaryTerm(null)} style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              ✕ Close
            </button>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            {activeGlossaryTerm.definition}
          </p>
        </div>
      )}

      {/* Clause by Clause Analysis */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
          Detailed Clause-by-Clause Breakdown ({document.clauses.length} Clauses)
        </h3>

        {document.clauses.map((clause: Clause) => {
          const isExpanded = !!expandedClauses[clause.id];
          const isSpeaking = speakingClauseId === clause.id;
          const currentText = clause.readingLevels[readingLevel] || clause.simplifiedText;

          return (
            <article key={clause.id} className={`glass-panel clause-card ${clause.riskLevel}`}>
              <div className="clause-header">
                <div className="clause-title-area">
                  <span className="clause-num-badge">§ {clause.number}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{clause.title}</h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* TTS Button */}
                  <button
                    className="icon-btn"
                    style={{ padding: '0.35rem 0.6rem' }}
                    onClick={() => handleSpeak(clause.id, currentText)}
                    title={isSpeaking ? 'Stop speaking' : 'Read clause aloud (Text-to-Speech)'}
                    aria-label={`Read clause ${clause.number} aloud`}
                  >
                    {isSpeaking ? <VolumeX size={15} style={{ color: 'var(--risk-critical)' }} /> : <Volume2 size={15} />}
                  </button>

                  <span className={`severity-pill ${clause.riskLevel}`}>
                    {clause.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Simplified Plain-English Content */}
              <div className="clause-body">
                <p>{currentText}</p>
              </div>

              {/* Risk Alert Box if High or Critical */}
              {clause.riskExplanation && (
                <div className="clause-risk-box">
                  <strong>⚠️ Legal Red Flag Alert:</strong>
                  <span>{clause.riskExplanation}</span>
                  {clause.counterProposalRecommendation && (
                    <div style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <strong>Suggested Fix:</strong> {clause.counterProposalRecommendation}
                    </div>
                  )}
                </div>
              )}

              {/* Collapsible Original Legal Text */}
              <div>
                <button
                  onClick={() => toggleExpand(clause.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{isExpanded ? 'Hide Original Legal Wording' : 'View Original Verbatim Legal Text'}</span>
                </button>

                {isExpanded && (
                  <div className="clause-quote-box" style={{ marginTop: '0.75rem' }}>
                    {clause.originalText}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
