import { StrictMode, Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import App from './App';

// In development, unregister any lingering service workers from a previous build
// so the dev server always serves fresh files.
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}

// Catch render-time errors so they show as readable text instead of a blank screen.
class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state: { err: Error | null } = { err: null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  render() {
    const { err } = this.state;
    if (!err) return this.props.children;
    return (
      <div style={{ padding: 32, fontFamily: 'monospace', color: '#c00', whiteSpace: 'pre-wrap' }}>
        <strong>App crashed</strong>{'\n\n'}{err.message}{'\n'}{err.stack}
      </div>
    );
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
