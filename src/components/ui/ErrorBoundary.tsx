import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode; name?: string }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 320, gap: 16, padding: 40,
          background: '#FFF8F7', border: '1px solid #FECACA', borderRadius: 14,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} color="#dc2626" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#102A43' }}>
              Erro ao carregar {this.props.name || 'módulo'}
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#667085', maxWidth: 360 }}>
              {this.state.error?.message || 'Ocorreu um erro inesperado.'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
              borderRadius: 8, border: '1px solid #D9E1E7', background: '#FFFFFF',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#003B5C',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={13} /> Tentar novamente
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
