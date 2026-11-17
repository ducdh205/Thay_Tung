import { content } from '../content';
import { COLORS } from '../theme';

const GOLD = COLORS.cursor.thay;
const SERIF = "'Lora', 'Times New Roman', serif";
const DISPLAY = "'Playfair Display', 'Times New Roman', serif";

/** Size relative to the card's own width (designed at 1600px), so it scales from half-pane to full stage. */
const u = (px: number) => `${(px / 1600) * 100}cqw`;

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 1.7) % 9,
  dur: 9 + (i % 5) * 1.6,
  size: 12 + (i % 4) * 5,
}));

const css = `
@keyframes cardIn { from { opacity: 0; transform: translateY(18px); filter: blur(4px); } to { opacity: 1; transform: none; filter: none; } }
@keyframes petal { 0% { transform: translateY(-60px) rotate(0) translateX(0); opacity: 0; } 10% { opacity: .85; } 100% { transform: translateY(110cqh) rotate(540deg) translateX(80px); opacity: .6; } }
@keyframes glow { 0%,100% { opacity: .55; } 50% { opacity: .9; } }
.card-line { opacity: 0; animation: cardIn 1.2s ease forwards; }
`;

export function CardPreview() {
  let step = 0;
  const next = () => ({ animationDelay: `${0.4 + 1.1 * step++}s` });
  return (
    <div
      data-card
      style={{
        containerType: 'size', position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 70% 110%, #b8692c 0%, #7a4a22 30%, #3a2516 65%, #2a1a10 100%)',
        color: '#f8ead2', display: 'grid', placeItems: 'center',
      }}
    >
      <style>{css}</style>
      <div style={{ position: 'absolute', width: u(900), height: u(900), right: u(-250), bottom: u(-420), borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,120,.45), transparent 65%)', animation: 'glow 6s ease-in-out infinite' }} />
      {PETALS.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute', top: 0, left: `${p.left}%`, width: u(p.size), height: u(p.size),
            background: i % 3 ? '#f3b6a0' : '#f7d08a', borderRadius: '0 60% 60% 60%', opacity: 0,
            animation: `petal ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      <div
        style={{
          position: 'relative', width: u(1180), padding: `${u(56)} ${u(80)}`, textAlign: 'center',
          border: `2px solid ${GOLD}`, borderRadius: u(24), background: 'rgba(30,18,10,.35)',
          boxShadow: `0 0 0 ${u(10)} rgba(245,184,65,.08), 0 ${u(30)} ${u(80)} rgba(0,0,0,.45)`,
        }}
      >
        <div className="card-line" style={{ ...next(), fontFamily: SERIF, letterSpacing: '.4em', color: GOLD, fontSize: u(24) }}>20 · 11</div>
        <h1 className="card-line" style={{ ...next(), fontFamily: DISPLAY, fontWeight: 400, fontSize: u(100), margin: `${u(10)} 0 ${u(26)}`, color: '#ffe2b0', lineHeight: 1.15 }}>
          {content.card.title}
        </h1>
        {content.card.body.map((b, i) => (
          <p key={i} className="card-line" style={{ ...next(), fontFamily: SERIF, fontSize: u(31), lineHeight: 1.55, margin: `${u(8)} 0` }}>
            {b}
          </p>
        ))}
        <p className="card-line" style={{ ...next(), fontFamily: SERIF, fontStyle: 'italic', fontSize: u(30), color: GOLD, marginTop: u(28) }}>
          {content.card.wish}
        </p>
        <p className="card-line" style={{ ...next(), fontFamily: SERIF, fontStyle: 'italic', fontSize: u(34), marginTop: u(30), textAlign: 'right' }}>
          {content.card.signature}
        </p>
      </div>
    </div>
  );
}
