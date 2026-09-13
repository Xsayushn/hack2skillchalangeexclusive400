import { Scale, Sun, Moon, Eye, Type, KeyRound, FileText } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAttorneyBrief: () => void;
  hasApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  highContrast,
  toggleHighContrast,
  dyslexiaFont,
  toggleDyslexiaFont,
  onOpenApiKeyModal,
  onOpenAttorneyBrief,
  hasApiKey,
}) => {
  return (
    <header className="navbar" role="banner">
      <a href="#" className="brand-logo" aria-label="LexiGuard AI Home">
        <div className="brand-badge">
          <Scale size={22} aria-hidden="true" />
        </div>
        <div className="brand-title">
          LexiGuard <span>AI</span>
        </div>
      </a>

      <div className="nav-actions">
        {/* Attorney Brief Export Button */}
        <button
          className="icon-btn"
          onClick={onOpenAttorneyBrief}
          title="Generate Attorney Consultation Brief"
          aria-label="Generate Attorney Consultation Brief"
        >
          <FileText size={16} aria-hidden="true" />
          <span>Lawyer Brief</span>
        </button>

        {/* Gemini API Key / Engine Modal */}
        <button
          className={`icon-btn ${hasApiKey ? 'active' : ''}`}
          onClick={onOpenApiKeyModal}
          title="Configure Google Gemini API Key or Simulation Mode"
          aria-label="Configure Google Gemini API Key"
        >
          <KeyRound size={16} aria-hidden="true" />
          <span>{hasApiKey ? 'Gemini Live' : 'Offline Engine'}</span>
        </button>

        {/* Dyslexia Typography Toggle */}
        <button
          className={`icon-btn ${dyslexiaFont ? 'active' : ''}`}
          onClick={toggleDyslexiaFont}
          title="Toggle Dyslexia-Friendly High Legibility Font"
          aria-label="Toggle Dyslexia-Friendly High Legibility Font"
          aria-pressed={dyslexiaFont}
        >
          <Type size={16} aria-hidden="true" />
          <span>Dyslexia Font</span>
        </button>

        {/* High Contrast Mode Toggle */}
        <button
          className={`icon-btn ${highContrast ? 'active' : ''}`}
          onClick={toggleHighContrast}
          title="Toggle WCAG High-Contrast Mode"
          aria-label="Toggle High Contrast Mode"
          aria-pressed={highContrast}
        >
          <Eye size={16} aria-hidden="true" />
          <span>Contrast</span>
        </button>

        {/* Dark / Light Theme Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
};
