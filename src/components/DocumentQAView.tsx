import React, { useState, useRef, useEffect } from 'react';
import { LegalDocument, QAResponse } from '../types/legal';
import { GeminiService } from '../services/geminiService';
import { Send, Sparkles, Quote, HelpCircle, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface DocumentQAViewProps {
  document: LegalDocument;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  qaResponse?: QAResponse;
  timestamp: string;
}

export const DocumentQAView: React.FC<DocumentQAViewProps> = ({ document }) => {
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am your LexiGuard AI legal assistant. I have reviewed "${document.title}". Ask me any question about your obligations, termination rules, landlord visits, deposits, or liability, and I will answer with exact clause quotes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = async (qText?: string) => {
    const query = qText || questionInput;
    if (!query.trim() || isLoading) return;

    // Abort any existing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setQuestionInput('');
    setIsLoading(true);

    try {
      const qaResponse = await GeminiService.askDocumentQuestion(document, query, controller.signal);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: qaResponse.answer,
        qaResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        console.log('Previous Q&A request cancelled by user');
        return;
      }
      console.error('Q&A error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="Grounded Legal Document Q and A">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.2rem' }}>
            Grounded Document Q&A with Verbatim Clause Citations
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ask any specific question and receive context-grounded answers with direct section quotes to eliminate hallucinations.
          </p>
        </div>

        {/* Engine Transparency Indicator */}
        <div>
          {GeminiService.hasApiKey() ? (
            <span style={{ fontSize: '0.78rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--risk-safe)', border: '1px solid var(--risk-safe-border)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--risk-safe)' }}></span>
              Live Gemini AI (Cloud RAG)
            </span>
          ) : (
            <span style={{ fontSize: '0.78rem', fontWeight: 600, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-secondary)', border: '1px solid var(--border-glow)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></span>
              Local Heuristic Engine (Offline / Privacy)
            </span>
          )}
        </div>
      </div>

      <div className="qa-container">
        {/* Main Chat Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          {/* Messages Thread with Screen Reader Live Announcement */}
          <div className="chat-thread" role="log" aria-live="polite" style={{ flex: 1 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                <div style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {msg.text}
                </div>

                {/* Engine Source & Evidence Strength Pill */}
                {msg.sender === 'ai' && msg.id !== 'welcome-1' && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={11} />
                      {msg.qaResponse?.engineUsed === 'gemini-live' ? 'Generated by Google Gemini Flash' : 'Processed by Local Grounded Heuristic Engine'}
                    </span>
                    {msg.qaResponse?.evidenceStrength && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                        background: msg.qaResponse.evidenceStrength === 'HIGH' ? 'rgba(16, 185, 129, 0.12)' : msg.qaResponse.evidenceStrength === 'MEDIUM' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(148, 163, 184, 0.12)',
                        color: msg.qaResponse.evidenceStrength === 'HIGH' ? 'var(--risk-safe)' : msg.qaResponse.evidenceStrength === 'MEDIUM' ? 'var(--risk-medium)' : 'var(--text-muted)',
                        border: `1px solid ${msg.qaResponse.evidenceStrength === 'HIGH' ? 'rgba(16, 185, 129, 0.3)' : msg.qaResponse.evidenceStrength === 'MEDIUM' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                      }}>
                        <ShieldCheck size={10} />
                        {msg.qaResponse.evidenceStrength === 'HIGH' ? 'Evidence: Verified Source Clause' : msg.qaResponse.evidenceStrength === 'MEDIUM' ? 'Evidence: Context Inferred' : 'Evidence: Limited Grounding'}
                      </span>
                    )}
                    {msg.qaResponse?.cached && (
                      <span style={{ color: 'var(--risk-safe)', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        ⚡ High-Speed Cache (0ms)
                      </span>
                    )}
                  </div>
                )}

                {/* Cited Verbatim Clauses */}
                {msg.qaResponse && msg.qaResponse.citedClauses && msg.qaResponse.citedClauses.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                      <Quote size={13} />
                      Verified Source Clause Citation:
                    </div>

                    {msg.qaResponse.citedClauses.map((c, i) => (
                      <div key={i} className="cited-clause-pill" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <strong>{c.clauseNumber}: {c.clauseTitle}</strong>
                          {c.isVerifiedInSource !== undefined && (
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              color: c.isVerifiedInSource ? 'var(--risk-safe)' : 'var(--risk-medium)',
                              background: c.isVerifiedInSource ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px'
                            }}>
                              {c.isVerifiedInSource ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                              {c.isVerifiedInSource ? 'Authentic Verbatim' : 'Paraphrased'}
                            </span>
                          )}
                        </div>
                        <div className="quote">
                          "{c.verbatimQuote}"
                        </div>
                        <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
                          <strong>Meaning:</strong> {c.practicalMeaning}
                        </div>
                      </div>
                    ))}

                    {msg.qaResponse.actionableAdvice && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.84rem', color: 'var(--text-primary)', background: 'rgba(99,102,241,0.1)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                        <strong>Action Step:</strong> {msg.qaResponse.actionableAdvice}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} className="pulse-icon" style={{ color: 'var(--accent-primary)' }} />
                <span>Retrieving relevant contract clauses & cross-referencing legal definitions...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}
          >
            <input
              type="text"
              placeholder={`Ask a question about ${document.title}...`}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !questionInput.trim()}
              className="btn-primary"
              style={{ padding: '0.75rem 1.25rem' }}
              aria-label="Send question"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Sidebar: Suggested Questions for This Contract */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '620px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <HelpCircle size={16} style={{ color: 'var(--accent-primary)' }} />
            Suggested Questions
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Click any question to query the document immediately:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
            {document.suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                style={{
                  textAlign: 'left',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
                className="hover-card"
              >
                <span>{sq}</span>
                <ArrowRight size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              </button>
            ))}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 All queries are processed with strict client-side PII scrubbing enabled.
          </div>
        </div>
      </div>
    </section>
  );
};
