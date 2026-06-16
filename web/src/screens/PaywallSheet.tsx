import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { FREE_TABLE_LIMIT, PRICE_MONTHLY, startTrial } from '../lib/pro';

interface Props {
  tableCount: number;
  onClose: () => void;
  onTrialStarted: () => void;
}

const BENEFITS = [
  'Unlimited tables — every meal, trip, and round',
  'Full payment history, never lose track',
  'Sync with the whole group for shared tables',
];

export function PaywallSheet({ tableCount, onClose, onTrialStarted }: Props) {
  const handleTrial = () => {
    startTrial();
    onTrialStarted();
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 90 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(28,27,41,.45)' }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--surface-app)', borderRadius: '28px 28px 0 0',
        padding: '12px 24px calc(28px + var(--wp-pad-bottom))', boxShadow: 'var(--shadow-xl)',
        animation: 'wp-sheet-up .32s cubic-bezier(.34,1.3,.64,1) both',
      }}>
        <div style={{ width: 44, height: 5, borderRadius: 99, background: 'var(--ink-300)', margin: '0 auto 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <img src="coin.svg" alt="" style={{ width: 54, height: 54 }} />
        </div>

        <h2 style={{ textAlign: 'center', fontSize: 24, marginBottom: 8 }}>Keep the tab open</h2>
        <p style={{ textAlign: 'center', fontSize: 15, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 22 }}>
          You've started {tableCount} of {FREE_TABLE_LIMIT} free tables.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 22 }}>
          {BENEFITS.map((b) => (
            <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 99, background: 'var(--mint-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1,
              }}>
                <Icon name="check" size={13} style={{ color: 'var(--mint-600)' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-800)', lineHeight: 1.4 }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--surface-sunken)', borderRadius: 16, padding: '13px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink-900)' }}>
              Pro — unlimited everything
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
              Cancel anytime
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--ink-900)' }}>
              {PRICE_MONTHLY}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>/month</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Button variant="primary" size="lg" block onClick={handleTrial}>
            Start 7-day free trial
          </Button>
          <button onClick={onClose} style={{
            border: 'none', background: 'none', cursor: 'pointer', padding: '12px',
            fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', width: '100%',
          }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
