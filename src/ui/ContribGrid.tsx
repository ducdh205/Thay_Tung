import { content } from '../content';
import { COLORS } from '../theme';

const COLS = 53;
const ROWS = 7;
const TOTAL = COLS * ROWS;
const CELL = 24;
const GAP = 6;
const LEVELS = ['#0e4429', '#006d32', '#26a641', '#39d353'];

/** Deterministic pseudo-random intensity per cell, brighter as the years go on. */
function level(i: number) {
  const h = (Math.sin(i * 12.9898) * 43758.5453) % 1;
  const r = Math.abs(h);
  const growth = i / TOTAL;
  return Math.min(3, Math.floor(r * 2 + growth * 2.4));
}

export function ContribGrid({ progress }: { progress: number }) {
  const on = Math.round(Math.max(0, Math.min(1, progress)) * TOTAL);
  const w = COLS * (CELL + GAP);
  return (
    <div data-contrib style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <div>
        <div style={{ display: 'grid', gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`, gridAutoFlow: 'column', gridAutoColumns: `${CELL}px`, gap: GAP }}>
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              data-cell
              data-on={i < on ? 'true' : 'false'}
              style={{ width: CELL, height: CELL, borderRadius: 5, background: i < on ? LEVELS[level(i)] : COLORS.bgDark, transition: 'background .3s ease' }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', width: w, marginTop: 22 }}>
          {content.contribYears.map((y) => (
            <div key={y} style={{ flex: 1, fontSize: 24, color: COLORS.dim, fontFamily: 'system-ui, Segoe UI, sans-serif' }}>
              {y}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
