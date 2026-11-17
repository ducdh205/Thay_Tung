import { content } from '../content';
import { COLORS, CODE_FONT } from '../theme';

const W = 1640;
const H = 820;
const MAIN_Y = H / 2;
const X0 = 80;
const X1 = W - 260;
const LANES = [-250, 200, -130, 300, -330];
const PALETTE = [COLORS.cursor.em, COLORS.cursor.anhTung, COLORS.cursor.chiTrang, '#cba6f7', '#89dceb'];

/** Thầy's golden main line runs left→right; each opportunity branches off it as progress passes its fork. */
export function GitGraph({ progress }: { progress: number }) {
  const n = content.branches.length;
  const headX = X0 + (X1 - X0) * progress;
  const forks = content.branches.map((name, i) => {
    const fx = X0 + ((X1 - X0) * (i + 0.6)) / (n + 0.4);
    const y = MAIN_Y + LANES[i % LANES.length];
    const color = PALETTE[i % PALETTE.length];
    const local = Math.max(0, Math.min(1, (headX - fx) / (X1 - fx)));
    return { name, fx, y, color, local };
  });

  return (
    <div data-gitgraph style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {forks.map((f) => {
          if (f.local <= 0) return null;
          const endX = f.fx + 120 + (X1 + 120 - f.fx - 120) * f.local;
          const d = `M ${f.fx} ${MAIN_Y} C ${f.fx + 60} ${MAIN_Y}, ${f.fx + 60} ${f.y}, ${f.fx + 120} ${f.y} L ${endX} ${f.y}`;
          return (
            <g key={f.name}>
              <path d={d} stroke={f.color} strokeWidth={6} fill="none" strokeLinecap="round" />
              <circle cx={endX} cy={f.y} r={11} fill={f.color} />
              {f.local > 0.25 && (
                <text data-branch-label x={endX + 24} y={f.y + 9} fill={f.color} fontFamily={CODE_FONT} fontSize={28}>
                  {f.name}
                </text>
              )}
            </g>
          );
        })}
        {progress > 0 && (
          <>
            <line x1={X0} y1={MAIN_Y} x2={headX} y2={MAIN_Y} stroke={COLORS.cursor.thay} strokeWidth={9} strokeLinecap="round" />
            {forks.filter((f) => f.local > 0).map((f) => (
              <circle key={f.name} cx={f.fx} cy={MAIN_Y} r={12} fill={COLORS.bg} stroke={COLORS.cursor.thay} strokeWidth={5} />
            ))}
            <circle cx={X0} cy={MAIN_Y} r={14} fill={COLORS.cursor.thay} />
            <text x={X0} y={MAIN_Y + 56} fill={COLORS.dim} fontFamily={CODE_FONT} fontSize={24} textAnchor="middle">
              {content.mainBranch}
            </text>
            {/* Thầy's cursor flag rides the head of main. */}
            <g transform={`translate(${headX}, ${MAIN_Y})`}>
              <circle r={14} fill={COLORS.cursor.thay} />
              <rect x={22} y={-50} width={150} height={36} rx={6} fill={COLORS.cursor.thay} />
              <text x={97} y={-25} fill="#11111b" fontFamily="system-ui, Segoe UI, sans-serif" fontWeight={700} fontSize={20} textAnchor="middle">
                {content.cursors.thay.label}
              </text>
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
