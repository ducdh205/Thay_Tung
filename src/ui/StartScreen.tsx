import { COLORS } from '../theme';
import { content } from '../content';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, zIndex: 50 }}>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke={COLORS.cursor.em} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="8 6 2 12 8 18" />
        <polyline points="16 6 22 12 16 18" />
        <line x1="14" y1="4" x2="10" y2="20" stroke={COLORS.cursor.thay} />
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: COLORS.dim }}>{content.windowTitle}</div>
      <button
        data-start
        onClick={onStart}
        style={{
          fontSize: 34, padding: '18px 56px', borderRadius: 14, border: `2px solid ${COLORS.cursor.em}`, background: 'transparent',
          color: COLORS.text, cursor: 'pointer', fontFamily: 'system-ui, Segoe UI, sans-serif',
        }}
      >
        ▶ Bắt đầu
      </button>
      <div style={{ fontSize: 20, color: COLORS.dim, fontFamily: 'system-ui, Segoe UI, sans-serif' }}>Nhấn F để toàn màn hình · Space để tạm dừng</div>
    </div>
  );
}
