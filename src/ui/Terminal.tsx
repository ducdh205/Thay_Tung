import { tokenize } from '../engine/highlight';
import { COLORS, CODE_FONT } from '../theme';

export function Terminal({ lines }: { lines: string[] }) {
  return (
    <div data-terminal style={{ height: '100%', background: COLORS.bgPanel, borderTop: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 28px', fontSize: 18, letterSpacing: '.12em', color: COLORS.dim, fontFamily: 'system-ui, sans-serif' }}>TERMINAL</div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 28px', fontFamily: CODE_FONT, fontSize: 24, lineHeight: 1.6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ whiteSpace: 'pre' }}>
            {tokenize(l, 'shell').map((t, j) => (
              <span key={j} style={{ color: COLORS.tok[t.kind] }}>{t.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
