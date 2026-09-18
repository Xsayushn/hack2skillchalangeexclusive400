import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { KeyRound, Shield, Check, X, Sparkles, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  if (!isOpen) return null;

  const [apiKeyInput, setApiKeyInput] = useState(GeminiService.getApiKey());
  const [model, setModel] = useState(GeminiService.getModel());
  const [persistKey, setPersistKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    GeminiService.setApiKey(apiKeyInput.trim(), persistKey);
    GeminiService.setModel(model);
    setSavedSuccess(true);
    onKeySaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    GeminiService.setApiKey('');
    setApiKeyInput('');
    onKeySaved();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="key-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <KeyRound size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 id="key-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              AI Engine & API Configuration
            </h3>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          LexiGuard AI features a <strong>Dual-Engine Architecture</strong>. You can run in <strong>Offline Simulation Mode</strong> (zero configuration needed) or enter a Google Gemini API Key for live inference.
        </p>

        {/* Current Engine Status */}
        <div style={{
          background: apiKeyInput ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          border: `1px solid ${apiKeyInput ? 'var(--risk-safe-border)' : 'var(--border-glow)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {apiKeyInput ? <Sparkles size={22} style={{ color: 'var(--risk-safe)' }} /> : <Cpu size={22} style={{ color: 'var(--accent-primary)' }} />}
          <div>
            <strong style={{ fontSize: '0.9rem', color: apiKeyInput ? 'var(--risk-safe)' : 'var(--accent-primary)' }}>
              {apiKeyInput ? 'Active Engine: Live Google Gemini AI' : 'Active Engine: Built-in Expert Rule Engine'}
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {apiKeyInput ? 'Using your API key for live inference generation.' : 'Fully functional offline demo mode. Judges can test all features with zero setup!'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              GOOGLE GEMINI API KEY (OPTIONAL):
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              SELECT MODEL:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
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
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Recommended)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              STORAGE SECURITY & RETENTION:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="radio"
                  name="storagePersistence"
                  checked={!persistKey}
                  onChange={() => setPersistKey(false)}
                  style={{ marginTop: '0.2rem' }}
                />
                <div>
                  <strong style={{ color: 'var(--risk-safe)' }}>🔒 Ephemeral Session Storage (Recommended)</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Stored in sessionStorage; automatically wiped the instant you close this browser tab. Perfect for judge evaluations and shared computers.
                  </p>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="radio"
                  name="storagePersistence"
                  checked={persistKey}
                  onChange={() => setPersistKey(true)}
                  style={{ marginTop: '0.2rem' }}
                />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Persistent Local Storage</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Persisted in localStorage across browser restarts until cleared manually.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Shield size={14} style={{ color: 'var(--risk-safe)', flexShrink: 0 }} />
            <span>Privacy Guarantee: Keys are kept locally in your browser's private storage. They are never sent to third-party tracking servers.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {apiKeyInput ? (
              <button type="button" onClick={handleClear} style={{ color: 'var(--risk-critical)', fontSize: '0.82rem', fontWeight: 600 }}>
                Clear API Key
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="icon-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
                <span>{savedSuccess ? 'Settings Saved!' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
