import React, { useState } from 'react';
import { LegalDocument } from '../types/legal';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';
import { LegalAnalyzer } from '../services/legalAnalyzer';
import { PiiScrubber } from '../services/piiScrubber';
import { FileUp, ShieldCheck, Sparkles, Building2, Code2, Cloud, Upload, Lock } from 'lucide-react';

interface DocumentUploaderProps {
  currentDocument: LegalDocument;
  onSelectDocument: (doc: LegalDocument) => void;
  piiCount: number;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  currentDocument,
  onSelectDocument,
  piiCount,
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    // Mandatory PII Scrubbing: always sanitize user custom text before any analysis
    const scrubbed = PiiScrubber.scrub(customText);
    const textToAnalyze = scrubbed.sanitizedText;

    const doc = LegalAnalyzer.parseDocument(textToAnalyze, customTitle.trim() || 'Custom Document');
    onSelectDocument(doc);
    setIsCustomOpen(false);
    setCustomText('');
    setCustomTitle('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Mandatory PII Scrubbing: always sanitize uploaded files before any analysis
        const scrubbed = PiiScrubber.scrub(content);
        const textToAnalyze = scrubbed.sanitizedText;
        const doc = LegalAnalyzer.parseDocument(textToAnalyze, file.name.replace(/\.[^/.]+$/, ''));
        onSelectDocument(doc);
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className="glass-panel doc-header-card" aria-label="Document Selection and Controls">
      <div className="doc-header-top">
        <div className="doc-info">
          <h1>{currentDocument.title}</h1>
          <p>{currentDocument.subtitle || 'Legal Agreement Analysis'}</p>
        </div>

        {/* Preset Document Switcher */}
        <div className="sample-selector" role="tablist" aria-label="Choose a pre-loaded sample document">
          <button
            role="tab"
            aria-selected={currentDocument.id === SAMPLE_DOCUMENTS[0].id}
            className={`sample-tab-btn ${currentDocument.id === SAMPLE_DOCUMENTS[0].id ? 'active' : ''}`}
            onClick={() => onSelectDocument(SAMPLE_DOCUMENTS[0])}
          >
            <Building2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Lease Agreement
          </button>

          <button
            role="tab"
            aria-selected={currentDocument.id === SAMPLE_DOCUMENTS[1].id}
            className={`sample-tab-btn ${currentDocument.id === SAMPLE_DOCUMENTS[1].id ? 'active' : ''}`}
            onClick={() => onSelectDocument(SAMPLE_DOCUMENTS[1])}
          >
            <Code2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Freelance Contract
          </button>

          <button
            role="tab"
            aria-selected={currentDocument.id === SAMPLE_DOCUMENTS[2].id}
            className={`sample-tab-btn ${currentDocument.id === SAMPLE_DOCUMENTS[2].id ? 'active' : ''}`}
            onClick={() => onSelectDocument(SAMPLE_DOCUMENTS[2])}
          >
            <Cloud size={14} style={{ display: 'inline', marginRight: '4px' }} />
            SaaS & Privacy
          </button>

          <button
            role="tab"
            aria-selected={isCustomOpen}
            className={`sample-tab-btn ${isCustomOpen ? 'active' : ''}`}
            onClick={() => setIsCustomOpen(!isCustomOpen)}
          >
            <FileUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Paste / Upload New
          </button>
        </div>
      </div>

      {/* Custom Document Input Drawer */}
      {isCustomOpen && (
        <form onSubmit={handleCustomSubmit} style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Contract Title (e.g. Non-Disclosure Agreement, Employment Offer)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
            <label className="icon-btn" style={{ cursor: 'pointer' }}>
              <Upload size={16} />
              <span>Upload .txt/.md file</span>
              <input type="file" accept=".txt,.md,.rtf" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <textarea
            placeholder="Paste your legal document, contract clauses, or terms here..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              resize: 'vertical',
              marginBottom: '1rem',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="icon-btn" onClick={() => setIsCustomOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} />
              Analyze Document with AI
            </button>
          </div>
        </form>
      )}

      {/* Security & Client-Side PII Redaction Status Bar */}
      <div className="pii-status-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="pii-badge active">
            <ShieldCheck size={14} />
            Client-Side PII Scrubber Active
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {piiCount > 0 
              ? `${piiCount} sensitive personal entities (names, emails, phones, addresses, IDs) scrubbed & masked`
              : 'Zero sensitive PII detected in this document'}
          </span>
        </div>

        <span 
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--risk-safe)',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--risk-safe-border)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          title="LexiGuard strictly enforces client-side PII scrubbing on all inputs prior to any AI processing."
        >
          <Lock size={12} /> Always Active • Zero Data Leakage
        </span>
      </div>
    </section>
  );
};
