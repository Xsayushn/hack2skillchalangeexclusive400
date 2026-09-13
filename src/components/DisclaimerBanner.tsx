import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside className="disclaimer-banner" role="complementary" aria-label="Legal Disclaimer">
      <div className="disclaimer-content">
        <span className="disclaimer-badge">Legal Information Only</span>
        <AlertCircle size={16} aria-hidden="true" style={{ color: '#818cf8', flexShrink: 0 }} />
        <span>
          <strong>Notice:</strong> LexiGuard AI provides document intelligence, accessibility translation, and educational analysis.
          It does <strong>not</strong> provide formal legal advice and does not establish an attorney-client relationship. Always consult a licensed attorney for critical legal decisions.
        </span>
      </div>
    </aside>
  );
};
