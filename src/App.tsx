import React, { useState, useEffect } from 'react';
import { LegalDocument } from './types/legal';
import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { PiiScrubber } from './services/piiScrubber';
import { GeminiService } from './services/geminiService';
import { Navbar } from './components/Navbar';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { DocumentUploader } from './components/DocumentUploader';
import { SimplifierView } from './components/SimplifierView';
import { RiskRadarView } from './components/RiskRadarView';
import { ComparisonView } from './components/ComparisonView';
import { DocumentQAView } from './components/DocumentQAView';
import { ActionNavigatorView } from './components/ActionNavigatorView';
import { AttorneyBriefModal } from './components/AttorneyBriefModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import {
  BookOpen,
  ShieldAlert,
  ArrowLeftRight,
  MessageSquare,
  Compass,
} from 'lucide-react';

export const App: React.FC = () => {
  // Theme & Accessibility States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  // Active Legal Document State
  const [activeDocument, setActiveDocument] = useState<LegalDocument>(SAMPLE_DOCUMENTS[0]);
  const [activeTab, setActiveTab] = useState<'simplifier' | 'risk-radar' | 'comparison' | 'grounded-qa' | 'action-navigator'>('simplifier');

  // Security / PII Scrubbing State
  const [piiScrubbingEnabled, setPiiScrubbingEnabled] = useState(true);
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
    if (activeDocument && piiScrubbingEnabled) {
      const scrubbed = PiiScrubber.scrub(activeDocument.rawText);
      setPiiCount(scrubbed.count);
    }
  }, [activeDocument, piiScrubbingEnabled]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleDyslexiaFont = () => {
    setDyslexiaFont(prev => !prev);
  };

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
          onSelectDocument={setActiveDocument}
          piiScrubbingEnabled={piiScrubbingEnabled}
          onTogglePiiScrubbing={() => setPiiScrubbingEnabled(!piiScrubbingEnabled)}
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

        {/* Active View Container */}
        <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
          {activeTab === 'simplifier' && (
            <SimplifierView document={activeDocument} />
          )}

          {activeTab === 'risk-radar' && (
            <RiskRadarView document={activeDocument} />
          )}

          {activeTab === 'comparison' && (
            <ComparisonView currentDocument={activeDocument} />
          )}

          {activeTab === 'grounded-qa' && (
            <DocumentQAView document={activeDocument} />
          )}

          {activeTab === 'action-navigator' && (
            <ActionNavigatorView document={activeDocument} />
          )}
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

      {/* Attorney Consultation Brief Modal */}
      <AttorneyBriefModal
        document={activeDocument}
        isOpen={isAttorneyModalOpen}
        onClose={() => setIsAttorneyModalOpen(false)}
      />

      {/* API Key & Engine Config Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => setHasApiKey(GeminiService.hasApiKey())}
      />
    </div>
  );
};
export default App;
