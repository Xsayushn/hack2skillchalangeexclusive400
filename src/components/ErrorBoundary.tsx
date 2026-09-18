import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('LexiGuard ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="glass-panel"
          style={{
            margin: '2rem auto',
            maxWidth: '600px',
            padding: '2.5rem',
            textAlign: 'center',
            border: '1px solid var(--risk-critical-border, rgba(239, 68, 68, 0.4))',
            borderRadius: 'var(--radius-lg, 16px)',
            background: 'var(--bg-secondary, rgba(30, 41, 59, 0.7))',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--risk-critical, #ef4444)',
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {this.props.fallbackTitle || 'Something went wrong rendering this view'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            LexiGuard encountered an unexpected UI rendering error. Your uploaded documents and contract data remain safe and uncorrupted in memory.
          </p>

          {this.state.error && (
            <pre
              style={{
                textAlign: 'left',
                fontSize: '0.78rem',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                color: 'var(--text-muted)',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                maxHeight: '120px',
              }}
            >
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md, 8px)',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} />
            <span>Reload View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
