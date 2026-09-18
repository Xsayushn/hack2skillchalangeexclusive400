import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { LegalDocument } from './types/legal';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { PiiScrubber } from './services/piiScrubber';
import { GeminiService } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { DocumentUploader } from './components/DocumentUploader';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  BookOpen,
  ShieldAlert,
  ArrowLeftRight,
  MessageSquare,
  Compass,
  Sparkles,
} from 'lucide-react';

// Code-splitting via React.lazy for optimal initial bundle and performance
const SimplifierView = lazy(() => import('./components/SimplifierView').then(m => ({ default: m.SimplifierView })));
const RiskRadarView = lazy(() => import('./components/RiskRadarView').then(m => ({ default: m.RiskRadarView })));
const ComparisonView = lazy(() => import('./components/ComparisonView').then(m => ({ default: m.ComparisonView })));
const DocumentQAView = lazy(() => import('./components/DocumentQAView').then(m => ({ default: m.DocumentQAView })));
const ActionNavigatorView = lazy(() => import('./components/ActionNavigatorView').then(m => ({ default: m.ActionNavigatorView })));
const AttorneyBriefModal = lazy(() => import('./components/AttorneyBriefModal').then(m => ({ default: m.AttorneyBriefModal })));
const ApiKeyModal = lazy(() => import('./components/ApiKeyModal').then(m => ({ default: m.ApiKeyModal })));

export const App: React.FC = () => {
  // Theme & Accessibility States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  // Document Pool: maintains sample contracts + any user-uploaded agreements
  const [allDocuments, setAllDocuments] = useState<LegalDocument[]>(SAMPLE_DOCUMENTS);
  const [activeDocument, setActiveDocument] = useState<LegalDocument>(SAMPLE_DOCUMENTS[0]);
  const [activeTab, setActiveTab] = useState<'simplifier' | 'risk-radar' | 'comparison' | 'grounded-qa' | 'action-navigator'>('simplifier');

  // Security / PII Scrubbing State (Mandatory Client-Side Enforcement)
  const [piiCount, setPiiCount] = useState(4);

  // Modals
  const [isAttorneyModalOpen, setIsAttorneyModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(GeminiService.hasApiKey());

  // Apply Theme attributes to root HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.setAttribute('data-dyslexia-font', String(dyslexiaFont));
  }, [dyslexiaFont]);

  // Recalculate PII counts when document changes
  useEffect(() => {
    if (activeDocument) {
      const scrubbed = PiiScrubber.scrub(activeDocument.rawText);
      setPiiCount(scrubbed.count);
    }
  }, [activeDocument]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  const toggleDyslexiaFont = useCallback(() => {
    setDyslexiaFont(prev => !prev);
  }, []);

  // Update active document and add to pool if custom
  const handleSelectDocument = useCallback((doc: LegalDocument) => {
    setActiveDocument(doc);
    setAllDocuments(prev => {
      if (prev.some(d => d.id === doc.id)) return prev;
      return [doc, ...prev];
    });
  }, []);

  // Keyboard shortcut listener: Escape closes any open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAttorneyModalOpen(false);
        setIsApiKeyModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const viewFallback = useMemo(() => (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      <Sparkles size={28} className="pulse-icon" style={{ color: 'var(--accent-primary)', margin: '0 auto 0.75rem' }} />
      <p style={{ fontSize: '0.9rem' }}>Loading view intelligence...</p>
    </div>
  ), []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar with Accessibility & Engine Controls */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        highContrast={highContrast}
        toggleHighContrast={toggleHighContrast}
        dyslexiaFont={dyslexiaFont}
        toggleDyslexiaFont={toggleDyslexiaFont}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenAttorneyBrief={() => setIsAttorneyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      <main className="app-container" role="main">
        {/* Prominent Legal Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Document Switcher & PII Scrubber Status Header */}
        <DocumentUploader
          currentDocument={activeDocument}
          onSelectDocument={handleSelectDocument}
          piiCount={piiCount}
        />

        {/* Feature Navigation Tabs */}
        <nav className="tabs-navigation" role="tablist" aria-label="Legal Assistant Views">
          <button
            role="tab"
            aria-selected={activeTab === 'simplifier'}
            className={`nav-tab ${activeTab === 'simplifier' ? 'active' : ''}`}
            onClick={() => setActiveTab('simplifier')}
          >
            <BookOpen size={17} />
            <span>Plain-English Simplifier</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'risk-radar'}
            className={`nav-tab ${activeTab === 'risk-radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk-radar')}
          >
            <ShieldAlert size={17} />
            <span>Risk Radar</span>
            <span className="tab-badge">
              {activeDocument.riskAssessment.overallScore}/100
            </span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'comparison'}
            className={`nav-tab ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <ArrowLeftRight size={17} />
            <span>Contract Comparison</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'grounded-qa'}
            className={`nav-tab ${activeTab === 'grounded-qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('grounded-qa')}
          >
            <MessageSquare size={17} />
            <span>Grounded Q&A</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'action-navigator'}
            className={`nav-tab ${activeTab === 'action-navigator' ? 'active' : ''}`}
            onClick={() => setActiveTab('action-navigator')}
          >
            <Compass size={17} />
            <span>Action & Negotiation</span>
          </button>
        </nav>

        {/* Active View Container with Suspense Code-Splitting and Robust Error Boundary */}
        <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
          <ErrorBoundary>
            <Suspense fallback={viewFallback}>
              {activeTab === 'simplifier' && (
                <SimplifierView document={activeDocument} />
              )}

              {activeTab === 'risk-radar' && (
                <RiskRadarView document={activeDocument} />
              )}

              {activeTab === 'comparison' && (
                <ComparisonView currentDocument={activeDocument} allDocuments={allDocuments} />
              )}

              {activeTab === 'grounded-qa' && (
                <DocumentQAView document={activeDocument} />
              )}

              {activeTab === 'action-navigator' && (
                <ActionNavigatorView document={activeDocument} />
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <p>
          <strong>LexiGuard AI</strong> — Built for the <strong>AI for Legal Assistance & Access</strong> Challenge.
        </p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
          Empowering citizens, tenants, employees, and small business owners with transparent legal intelligence.
        </p>
      </footer>

      {/* Lazy Loaded Modals */}
      <Suspense fallback={null}>
        {isAttorneyModalOpen && (
          <AttorneyBriefModal
            document={activeDocument}
            isOpen={isAttorneyModalOpen}
            onClose={() => setIsAttorneyModalOpen(false)}
          />
        )}

        {isApiKeyModalOpen && (
          <ApiKeyModal
            isOpen={isApiKeyModalOpen}
            onClose={() => setIsApiKeyModalOpen(false)}
            onKeySaved={() => setHasApiKey(GeminiService.hasApiKey())}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;
