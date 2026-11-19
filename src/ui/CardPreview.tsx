import type { CSSProperties, ReactNode } from 'react';
import { content } from '../content';
import { CODE_FONT, COLORS } from '../theme';

/**
 * Tấm thiệp 20/11: tranh lớp CNTT (SVG, bên trái) + tờ giấy viết tay (HTML, bên phải).
 * Vẽ trên khung 1600×900 rồi co giãn vừa khung chứa (giữ tỉ lệ), nên đẹp cả khi ở nửa màn hình lẫn toàn màn hình.
 */
const W = 1600;
const H = 900;
/** Kích thước theo khung 1600×900, co theo cạnh hẹp hơn của khung chứa. */
const U = (px: number) => `min(${(px / W) * 100}cqw, ${(px / H) * 100}cqh)`;

const SCRIPT = "'Dancing Script', 'Lora', cursive";
const INK = '#2d4f86';
const SKIN = '#ffd9b8';
const BOARD_BG = '#263042';
const CHAR_W = 13.2; // JetBrains Mono 22px

type Hair = 'short' | 'spiky' | 'long' | 'bob' | 'bun' | 'teacher';
interface Look {
  hair: Hair;
  hairColor: string;
  shirt: string;
  shirt2: string;
  glasses?: boolean;
}

const css = `
@keyframes cpPop { 0% { transform: translateY(460px); } 100% { transform: none; } }
@keyframes cpBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes cpWave { 0%,100% { transform: rotate(var(--r)); } 50% { transform: rotate(calc(var(--r) + var(--w, 22deg))); } }
@keyframes cpSway { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@keyframes cpSpin { to { transform: rotate(360deg); } }
@keyframes cpTwinkle { 0%,100% { transform: scale(.35); opacity: .25; } 50% { transform: scale(1); opacity: 1; } }
@keyframes cpFall { 0% { transform: translateY(-60px) rotate(0); opacity: 0; } 8% { opacity: 1; } 100% { transform: translateY(980px) rotate(720deg); opacity: .8; } }
@keyframes cpRise { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translateY(-520px); opacity: 0; } }
@keyframes cpFlag { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes cpCap { 0%,100% { transform: translate(0,0) rotate(-14deg); } 50% { transform: translate(-16px,-26px) rotate(12deg); } }
@keyframes cpType { from { transform: scaleX(1); } to { transform: scaleX(0); } }
@keyframes cpBlink { 50% { opacity: 0; } }
@keyframes cpLed { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
@keyframes cpPaper { from { opacity: 0; transform: translateX(28%) rotate(7deg); } to { opacity: 1; transform: rotate(-1.2deg); } }
@keyframes cpWrite { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 -10% 0 0); } }
@keyframes cpIn { from { opacity: 0; transform: translateY(14px); filter: blur(3px); } to { opacity: 1; transform: none; filter: none; } }
.cp-pop { animation: cpPop 1s cubic-bezier(.34,1.45,.64,1) both; }
.cp-bob { animation: cpBob 1.7s ease-in-out infinite; }
.cp-fb { transform-box: fill-box; transform-origin: center; }
.cp-in { opacity: 0; animation: cpIn 1.1s ease forwards; }
`;

const anim = (a: string, origin?: string, box?: 'fill-box'): CSSProperties => ({
  animation: a,
  ...(origin ? { transformOrigin: origin } : {}),
  ...(box ? { transformBox: box } : {}),
});

/* ---------- Nhân vật ---------- */

function Hair({ look, layer }: { look: Look; layer: 'back' | 'front' }) {
  const c = look.hairColor;
  if (layer === 'back') {
    if (look.hair === 'long') return <path d="M-76 -92 C-84 -178 84 -178 76 -92 L86 26 Q0 46 -86 26 Z" fill={c} />;
    if (look.hair === 'bob') return <path d="M-78 -92 C-84 -176 84 -176 78 -92 L80 -18 Q64 -6 52 -26 L-52 -26 Q-64 -6 -80 -18 Z" fill={c} />;
    if (look.hair === 'bun') return <circle cx={0} cy={-162} r={30} fill={c} />;
    return null;
  }
  if (look.hair === 'teacher') {
    return (
      <g fill={c}>
        <path d="M-68 -66 C-76 -108 -62 -132 -38 -136 C-54 -116 -58 -96 -56 -66 Z" />
        <path d="M68 -66 C76 -108 62 -132 38 -136 C54 -116 58 -96 56 -66 Z" />
        <path d="M-40 -142 C-20 -156 20 -156 40 -142 C20 -148 -20 -148 -40 -142 Z" />
      </g>
    );
  }
  if (look.hair === 'spiky') {
    return (
      <path
        fill={c}
        d="M-70 -80 L-80 -120 L-56 -128 L-60 -160 L-28 -146 L-14 -174 L8 -150 L32 -172 L42 -144 L68 -152 L62 -120 L80 -110 L70 -80 C60 -110 30 -118 0 -110 C-30 -118 -58 -108 -70 -80 Z"
      />
    );
  }
  return <path fill={c} d="M-70 -78 C-80 -172 80 -172 70 -78 C62 -112 30 -124 8 -108 C-12 -128 -52 -120 -70 -78 Z" />;
}

function Face({ look }: { look: Look }) {
  return (
    <g>
      <circle cx={-64} cy={-78} r={12} fill={SKIN} />
      <circle cx={64} cy={-78} r={12} fill={SKIN} />
      <circle cx={0} cy={-82} r={66} fill={SKIN} />
      <Hair look={look} layer="front" />
      <g stroke="#3b2a20" strokeWidth={5} strokeLinecap="round" fill="none">
        <path d="M-36 -76 Q-25 -91 -14 -76" />
        <path d="M14 -76 Q25 -91 36 -76" />
      </g>
      {look.glasses && (
        <g stroke="#333" strokeWidth={4} fill="rgba(255,255,255,.18)">
          <circle cx={-25} cy={-79} r={19} />
          <circle cx={25} cy={-79} r={19} />
          <path d="M-6 -81 L6 -81" />
        </g>
      )}
      <ellipse cx={-43} cy={-56} rx={13} ry={8} fill="#ff8a8a" opacity={0.55} />
      <ellipse cx={43} cy={-56} rx={13} ry={8} fill="#ff8a8a" opacity={0.55} />
      <path d="M-18 -56 Q0 -28 18 -56 Z" fill="#a8323e" />
      <ellipse cx={0} cy={-43} rx={8} ry={5} fill="#ff7b88" />
    </g>
  );
}

/** Cánh tay quay quanh vai; `wave` thì vẫy qua lại. */
function Arm({ side, deg, wave, color, delay = 0 }: { side: -1 | 1; deg: number; wave?: boolean; color: string; delay?: number }) {
  const style = (wave
    ? { '--r': `${deg}deg`, '--w': `${22 * -side}deg`, animation: `cpWave ${0.9 + delay * 0.1}s ease-in-out ${delay}s infinite`, transformOrigin: '0 0' }
    : { transform: `rotate(${deg}deg)`, transformOrigin: '0 0' }) as CSSProperties;
  return (
    <g transform={`translate(${70 * side} 30)`}>
      <g style={style}>
        <rect x={-19} y={-10} width={38} height={150} rx={19} fill={color} />
        <circle cx={0} cy={150} r={22} fill={SKIN} />
      </g>
    </g>
  );
}

function Badge({ name, x = 0, y = 62, teacher }: { name: string; x?: number; y?: number; teacher?: boolean }) {
  const w = Math.max(108, name.length * 11 + 26);
  return (
    <g transform={`translate(${x} ${y})`}>
      {!teacher && <path d="M-26 -62 L0 0 L26 -62" stroke="#e84a5f" strokeWidth={5} fill="none" />}
      <rect x={-w / 2} y={0} width={w} height={48} rx={7} fill="#fff" stroke="#c9d3e6" strokeWidth={2} />
      <rect x={-w / 2} y={0} width={w} height={14} rx={7} fill={teacher ? '#e84a5f' : '#3b6fd8'} />
      <text x={0} y={11} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff" fontFamily="system-ui, sans-serif" letterSpacing={1}>
        {teacher ? 'GIẢNG VIÊN' : 'SINH VIÊN CNTT'}
      </text>
      <text x={0} y={38} textAnchor="middle" fontSize={18} fontWeight={800} fill="#1f2a44" fontFamily="system-ui, 'Segoe UI', sans-serif">
        {name}
      </text>
    </g>
  );
}

function Torso({ look, print }: { look: Look; print?: string }) {
  return (
    <g>
      <rect x={-14} y={-24} width={28} height={30} fill={SKIN} />
      <path d="M-82 40 C-80 10 -50 0 -26 -2 L26 -2 C50 0 80 10 82 40 L94 440 L-94 440 Z" fill={look.shirt} />
      <path d="M-44 0 Q0 34 44 0 Q30 -14 0 -12 Q-30 -14 -44 0 Z" fill={look.shirt2} />
      {print && (
        <text x={0} y={200} textAnchor="middle" fontSize={40} fontWeight={700} fill={look.shirt2} fontFamily={CODE_FONT}>
          {print}
        </text>
      )}
    </g>
  );
}

interface PersonProps {
  x: number;
  y: number;
  s?: number;
  delay: number;
  bob?: number;
  look: Look;
  children: ReactNode;
}

/** Người đứng ở (x, y) = gốc cổ; trồi lên từ dưới rồi nhún nhảy. */
function Person({ x, y, s = 1, delay, bob = 1.7, look, children }: PersonProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="cp-pop" style={{ animationDelay: `${delay}s` }}>
        <g className="cp-bob" style={{ animationDelay: `${delay + 1}s`, animationDuration: `${bob}s` }}>
          <Hair look={look} layer="back" />
          {children}
          <Face look={look} />
        </g>
      </g>
    </g>
  );
}

const LOOKS: Record<'thay' | 'duc' | 'trang' | 'tung' | 'phuong' | 'thom', Look> = {
  thay: { hair: 'teacher', hairColor: '#9a9a9a', shirt: '#5f6878', shirt2: '#454c59', glasses: true },
  duc: { hair: 'short', hairColor: '#2a1d15', shirt: '#4f8ef7', shirt2: '#2f62c4' },
  trang: { hair: 'long', hairColor: '#1f1a1a', shirt: '#f28bb0', shirt2: '#c85a85' },
  tung: { hair: 'spiky', hairColor: '#231a14', shirt: '#4caf7a', shirt2: '#2f7d53', glasses: true },
  phuong: { hair: 'bob', hairColor: '#3a2418', shirt: '#9b7bd4', shirt2: '#6f52a8' },
  thom: { hair: 'bun', hairColor: '#4a2c1a', shirt: '#f6a945', shirt2: '#c97c1c' },
};

function Teacher({ delay }: { delay: number }) {
  const L = LOOKS.thay;
  return (
    <Person x={500} y={565} s={1.15} delay={delay} bob={2.6} look={L}>
      <g style={anim('cpSway 3.2s ease-in-out infinite', '0px 400px')}>
        <path d="M-82 40 C-80 10 -50 0 -26 -2 L26 -2 C50 0 80 10 82 40 L94 440 L-94 440 Z" fill={L.shirt} />
        <rect x={-14} y={-24} width={28} height={30} fill={SKIN} />
        <path d="M-26 -2 L26 -2 L0 110 Z" fill="#fff" />
        <path d="M-8 6 L8 6 L12 86 L0 104 L-12 86 Z" fill="#d8434e" />
        <path d="M-26 -2 L-4 96 L-40 46 Z" fill={L.shirt2} />
        <path d="M26 -2 L4 96 L40 46 Z" fill={L.shirt2} />
        <Arm side={-1} deg={-12} color={L.shirt} />
        <Arm side={1} deg={18} color={L.shirt} />
        {/* Bó hoa */}
        <g transform="translate(-30 150) rotate(-16)">
          <g style={anim('cpSway 2.4s ease-in-out infinite', '0px 150px')}>
            {[[-34, -6, '#ff6b8a'], [-6, -20, '#ffd166'], [24, -8, '#ff9eb5'], [-22, -38, '#ff9eb5'], [10, -46, '#ff6b8a'], [38, -34, '#ffd166']].map(([cx, cy, f], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={21} fill={f as string} />
                <circle cx={cx} cy={cy} r={7} fill="#c2410c" opacity={0.6} />
              </g>
            ))}
            <path d="M-6 -24 L-4 -60 M14 -30 L22 -64" stroke="#3f9b5a" strokeWidth={5} />
            <path d="M-62 0 L62 0 L6 170 Z" fill="#e3edff" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
            <path d="M-20 120 L30 108" stroke="#e84a5f" strokeWidth={8} strokeLinecap="round" />
            <circle cx={4} cy={112} r={22} fill={SKIN} />
          </g>
        </g>
        <Badge name={content.card.teacher} x={26} y={22} teacher />
      </g>
    </Person>
  );
}

function People() {
  const st = content.card.students;
  return (
    <g>
      {/* Hàng sau */}
      <Person x={110} y={610} s={0.95} delay={0.6} bob={1.5} look={LOOKS.tung}>
        <Torso look={LOOKS.tung} print="{ }" />
        <Badge name={st[2]} />
        <Arm side={-1} deg={150} wave color={LOOKS.tung.shirt} delay={0.2} />
        <Arm side={1} deg={-62} color={LOOKS.tung.shirt} />
      </Person>
      <Person x={320} y={520} s={0.9} delay={0.8} bob={1.8} look={LOOKS.thom}>
        <Torso look={LOOKS.thom} />
        <Badge name={st[4]} />
        <Arm side={-1} deg={160} wave color={LOOKS.thom.shirt} delay={0.5} />
        <Arm side={1} deg={-160} wave color={LOOKS.thom.shirt} delay={0.1} />
      </Person>
      <Person x={880} y={585} s={0.95} delay={1} bob={1.6} look={LOOKS.phuong}>
        {/* Bóng bay bay lơ lửng, dây buộc ở tay trái */}
        <g style={anim('cpFlag 3s ease-in-out infinite', '-145px -100px')}>
          <path d="M-145 -100 Q-150 -130 -100 -164" stroke="#888" strokeWidth={2.5} fill="none" />
          <ellipse cx={-100} cy={-226} rx={52} ry={62} fill="#ff5d73" />
          <ellipse cx={-116} cy={-248} rx={12} ry={18} fill="#fff" opacity={0.45} />
          <path d="M-108 -164 L-92 -164 L-100 -154 Z" fill="#ff5d73" />
          <text x={-100} y={-214} textAnchor="middle" fontSize={30} fontWeight={800} fill="#fff" fontFamily={CODE_FONT}>
            20/11
          </text>
        </g>
        <Torso look={LOOKS.phuong} print="</>" />
        <Badge name={st[3]} />
        <Arm side={-1} deg={150} color={LOOKS.phuong.shirt} />
        <Arm side={1} deg={-150} wave color={LOOKS.phuong.shirt} delay={0.3} />
      </Person>

      <Teacher delay={0.3} />

      {/* Hàng trước */}
      <Person x={270} y={775} s={0.95} delay={1.2} bob={1.4} look={LOOKS.trang}>
        <Torso look={LOOKS.trang} />
        <Badge name={st[1]} />
        <Arm side={-1} deg={155} wave color={LOOKS.trang.shirt} />
        <Arm side={1} deg={-158} wave color={LOOKS.trang.shirt} delay={0.4} />
      </Person>
      <Person x={720} y={712} s={0.95} delay={1.4} bob={1.9} look={LOOKS.duc}>
        <Torso look={LOOKS.duc} />
        <Badge name={st[0]} y={56} />
        <Arm side={-1} deg={6} color={LOOKS.duc.shirt} />
        <Arm side={1} deg={-6} color={LOOKS.duc.shirt} />
        {/* Laptop quay màn hình ra ngoài */}
        <g transform="translate(0 116)">
          <rect x={-92} y={0} width={184} height={118} rx={10} fill="#2b2f3a" />
          <rect x={-82} y={10} width={164} height={98} rx={4} fill={BOARD_BG} />
          {[['#89b4fa', 70], ['#a6e3a1', 110], ['#f9e2af', 54], ['#cba6f7', 90], ['#fab387', 64]].map(([c, w], i) => (
            <rect key={i} x={-72 + (i % 2) * 12} y={20 + i * 17} width={w as number} height={8} rx={4} fill={c as string} style={anim(`cpLed 2.4s ease-in-out ${i * 0.35}s infinite`)} />
          ))}
          <path d="M-108 118 L108 118 L96 136 L-96 136 Z" fill="#9aa3b5" />
          <circle cx={-92} cy={74} r={22} fill={SKIN} />
          <circle cx={92} cy={74} r={22} fill={SKIN} />
        </g>
      </Person>
    </g>
  );
}

/* ---------- Phông nền ---------- */

const KEYWORDS = /^(const|new|for|of|let|return)$/;
function CodeLine({ text }: { text: string }) {
  const comment = text.trim().startsWith('//');
  const parts = text.split(/("[^"]*"|\b[A-Za-zÀ-ỹ_]+\b)/u).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        const next = parts[i + 1] ?? '';
        const fill = comment
          ? COLORS.tok.comment
          : p.startsWith('"')
          ? COLORS.tok.string
          : KEYWORDS.test(p)
            ? COLORS.tok.keyword
            : /^[A-Za-z]/.test(p) && next.startsWith('(')
              ? COLORS.tok.tag
              : /^[A-Za-z]/.test(p)
                ? COLORS.tok.variable
                : COLORS.tok.punct;
        return (
          <tspan key={i} fill={fill}>
            {p}
          </tspan>
        );
      })}
    </>
  );
}

function Screen() {
  const { fileName, lines } = content.card.screen;
  let t = 1.6;
  const timing = lines.map((l) => {
    const d = Math.max(0.3, l.length * 0.055);
    const r = { delay: t, dur: d };
    t += d + 0.25;
    return r;
  });
  const last = lines.length - 1;
  return (
    <g>
      <rect x={290} y={150} width={630} height={330} rx={18} fill="#c8b9a6" />
      <rect x={302} y={162} width={606} height={306} rx={10} fill={BOARD_BG} />
      <rect x={302} y={162} width={606} height={34} rx={10} fill="#1b2231" />
      {['#f38ba8', '#f9e2af', '#a6e3a1'].map((c, i) => (
        <circle key={c} cx={324 + i * 22} cy={179} r={7} fill={c} />
      ))}
      <text x={605} y={185} textAnchor="middle" fontSize={16} fill="#7f8aa3" fontFamily={CODE_FONT}>
        {fileName}
      </text>
      {lines.map((l, i) => (
        <g key={i}>
          <text x={322} y={234 + i * 38} fontSize={22} fontFamily={CODE_FONT} xmlSpace="preserve" style={{ whiteSpace: 'pre' }}>
            <CodeLine text={l} />
          </text>
          <rect
            x={318}
            y={212 + i * 38}
            width={l.length * CHAR_W + 12}
            height={32}
            fill={BOARD_BG}
            style={{
              transformBox: 'fill-box',
              transformOrigin: '100% 50%',
              animation: `cpType ${timing[i].dur}s steps(${Math.max(1, l.length)}) ${timing[i].delay}s both`,
            }}
          />
        </g>
      ))}
      <rect
        x={322 + lines[last].length * CHAR_W + 4}
        y={214 + last * 38}
        width={12}
        height={26}
        fill="#cdd6f4"
        style={{ opacity: 0, animation: `cpIn .1s linear ${t}s forwards, cpBlink 1s steps(1) ${t}s infinite` }}
      />
    </g>
  );
}

function Shelf() {
  const books: [string, string, number][] = [
    ['#4f8ef7', 'C++', 64], ['#e84a5f', 'Java', 66], ['#f6a945', 'SQL', 58], ['#4caf7a', 'Python', 70], ['#9b7bd4', 'AI', 62],
  ];
  return (
    <g>
      <rect x={22} y={230} width={230} height={430} rx={8} fill="#b9855a" />
      <rect x={34} y={242} width={206} height={406} fill="#8f5f3a" />
      {[0, 1].map((row) => (
        <g key={row}>
          {books.map(([c, t, h], i) => {
            const bx = 44 + i * 38;
            const by = 340 + row * 140 - h + (row ? (i % 2) * 6 : 0);
            return (
              <g key={i}>
                <rect x={bx} y={by} width={32} height={h} rx={3} fill={row ? books[(i + 2) % 5][0] : c} />
                {!row && (
                  <text x={bx + 16} y={by + h / 2} fontSize={12} fontWeight={700} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontFamily={CODE_FONT} transform={`rotate(-90 ${bx + 16} ${by + h / 2})`}>
                    {t}
                  </text>
                )}
              </g>
            );
          })}
          <rect x={34} y={340 + row * 140} width={206} height={10} fill="#b9855a" />
        </g>
      ))}
      {/* Vịt cao su gỡ bug + cốc cà phê */}
      <g transform="translate(78 205)">
        <ellipse cx={0} cy={14} rx={30} ry={18} fill="#ffd23f" />
        <circle cx={14} cy={-8} r={15} fill="#ffd23f" />
        <circle cx={18} cy={-11} r={3} fill="#222" />
        <path d="M26 -6 L40 -3 L27 2 Z" fill="#ff8c1a" />
      </g>
      <g transform="translate(180 196)">
        <rect x={-20} y={0} width={40} height={34} rx={6} fill="#fff" stroke="#c9d3e6" strokeWidth={2} />
        <path d="M20 8 Q34 16 20 26" stroke="#c9d3e6" strokeWidth={5} fill="none" />
        <path d="M-8 -6 Q-2 -16 -8 -26 M6 -6 Q12 -16 6 -26" stroke="#bbb" strokeWidth={3} fill="none" style={anim('cpLed 2s ease-in-out infinite')} />
      </g>
    </g>
  );
}

function Clock() {
  return (
    <g transform="translate(140 112)">
      <circle r={56} fill="#fff" stroke="#7c8db5" strokeWidth={9} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={-2} y={-44} width={4} height={i % 3 ? 6 : 11} fill="#7c8db5" transform={`rotate(${i * 30})`} />
      ))}
      <g style={anim('cpSpin 120s linear infinite', '0 0')}>
        <rect x={-3.5} y={-26} width={7} height={30} rx={3.5} fill="#3a3f55" />
      </g>
      <g style={anim('cpSpin 10s linear infinite', '0 0')}>
        <rect x={-2.5} y={-40} width={5} height={44} rx={2.5} fill="#e84a5f" />
      </g>
      <circle r={6} fill="#3a3f55" />
    </g>
  );
}

function Bunting() {
  const colors = ['#ff6b8a', '#ffd166', '#4f8ef7', '#4caf7a', '#9b7bd4'];
  const pt = (t: number) => ({ x: (1 - t) ** 2 * 300 + 2 * t * (1 - t) * 650 + t * t * 1000, y: (1 - t) ** 2 * 18 + 2 * t * (1 - t) * 96 + t * t * 18 });
  return (
    <g>
      <path d="M300 18 Q650 96 1000 18" stroke="#a08060" strokeWidth={3} fill="none" />
      {Array.from({ length: 11 }, (_, i) => {
        const p = pt((i + 0.5) / 11);
        return (
          <g key={i} transform={`translate(${p.x} ${p.y})`}>
            <path d="M-22 0 L22 0 L0 42 Z" fill={colors[i % 5]} style={anim(`cpFlag ${2 + (i % 3) * 0.4}s ease-in-out ${i * 0.2}s infinite`, '0 0')} />
          </g>
        );
      })}
    </g>
  );
}

function GradCap() {
  return (
    <g transform="translate(955 290)">
      <g style={anim('cpCap 3.6s ease-in-out infinite', '0 0')}>
        <path d="M-28 6 L28 6 L26 34 Q0 46 -26 34 Z" fill="#1f2a44" />
        <path d="M0 -24 L64 2 L0 28 L-64 2 Z" fill="#2b3a5c" />
        <path d="M0 2 Q40 8 44 40" stroke="#ffc93c" strokeWidth={4} fill="none" />
        <circle cx={44} cy={44} r={7} fill="#ffc93c" />
      </g>
    </g>
  );
}

const SPARKS = [[250, 205], [960, 520], [610, 120], [40, 470], [930, 75], [420, 520], [220, 360], [760, 120]] as const;
function Sparkles() {
  return (
    <g>
      {SPARKS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + (i % 3) * 0.35})`}>
          <path className="cp-fb" d="M0 -18 Q3 -3 18 0 Q3 3 0 18 Q-3 3 -18 0 Q-3 -3 0 -18 Z" fill="#ffc93c" style={{ animation: `cpTwinkle ${1.6 + (i % 4) * 0.5}s ease-in-out ${i * 0.37}s infinite` }} />
        </g>
      ))}
    </g>
  );
}

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 83) % 1000,
  delay: (i * 0.73) % 8,
  dur: 6 + (i % 5) * 1.3,
  color: ['#ff6b8a', '#ffd166', '#4f8ef7', '#4caf7a', '#9b7bd4', '#f6a945'][i % 6],
}));
const SYMBOLS = ['</>', '{ }', '01', '#', '=>', '()'];

function Particles() {
  return (
    <g>
      {CONFETTI.map((c, i) => (
        <g key={i} transform={`translate(${c.x} 0)`}>
          <rect x={-7} y={-4} width={14} height={8} rx={2} fill={c.color} style={{ opacity: 0, animation: `cpFall ${c.dur}s linear ${c.delay}s infinite` }} />
        </g>
      ))}
      {SYMBOLS.map((s, i) => (
        <text
          key={s}
          x={60 + i * 165}
          y={880}
          fontSize={30}
          fontWeight={700}
          fill={['#4f8ef7', '#9b7bd4', '#4caf7a'][i % 3]}
          fontFamily={CODE_FONT}
          style={{ opacity: 0, animation: `cpRise ${7 + (i % 3)}s ease-out ${2 + i * 1.1}s infinite` }}
        >
          {s}
        </text>
      ))}
    </g>
  );
}

function Scene() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0, display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id="cpWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf4e8" />
          <stop offset="1" stopColor="#f7e6d2" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#cpWall)" />
      <g opacity={0.35} stroke="#e9cfae" strokeWidth={3} fill="none">
        <path d="M30 40 q20 -20 40 0 t40 0" />
        <path d="M560 860 q20 -20 40 0 t40 0" />
        <path d="M1000 600 q20 -20 40 0 t40 0" />
      </g>
      <Bunting />
      <Clock />
      <Shelf />
      <Screen />
      <GradCap />
      <Sparkles />
      <People />
      <Particles />
    </svg>
  );
}

/* ---------- Tờ giấy ---------- */

const TORN = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) pts.push(`${((i % 2 ? 3.4 : 0.4) + ((i * 7) % 5) * 0.4).toFixed(2)}% ${(i * 2.5).toFixed(1)}%`);
  return `polygon(${pts.join(', ')}, 100% 100%, 100% 0%)`;
})();

const LINE = 50;

function Paper() {
  const c = content.card;
  let step = 0;
  const next = () => ({ animationDelay: `${2.4 + 0.7 * step++}s` });
  return (
    <div
      style={{
        position: 'absolute', left: U(1000), top: U(34), width: U(570), height: U(832),
        filter: `drop-shadow(${U(-6)} ${U(10)} ${U(18)} rgba(80,60,40,.28))`,
        animation: 'cpPaper 1.2s cubic-bezier(.2,.8,.3,1) .2s both',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0, clipPath: TORN,
          backgroundColor: '#f8f8f5',
          backgroundImage: [
            `linear-gradient(90deg, transparent ${U(88)}, rgba(232,74,95,.45) ${U(88)}, rgba(232,74,95,.45) ${U(91)}, transparent ${U(91)})`,
            `repeating-linear-gradient(180deg, transparent 0, transparent calc(${U(LINE)} - 2px), #b8c6e3 calc(${U(LINE)} - 2px), #b8c6e3 ${U(LINE)})`,
            'radial-gradient(ellipse at 30% 20%, rgba(0,0,0,.035), transparent 55%)',
            'radial-gradient(ellipse at 80% 75%, rgba(0,0,0,.04), transparent 60%)',
          ].join(', '),
          backgroundPosition: `0 0, 0 ${U(22)}, 0 0, 0 0`,
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0, padding: `${U(70)} ${U(44)} 0 ${U(112)}`, color: INK, fontFamily: SCRIPT, textAlign: 'center',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ fontSize: U(66), lineHeight: 1.1, animation: 'cpWrite 1.2s ease 1.2s both' }}>{c.kicker}</div>
        <div style={{ fontSize: U(96), whiteSpace: 'nowrap', lineHeight: 1.15, fontWeight: 600, marginBottom: U(22), animation: 'cpWrite 1.6s ease 1.7s both' }}>{c.title}</div>
        <p className="cp-in" style={{ ...next(), fontSize: U(33), lineHeight: U(LINE), margin: 0 }}>
          {c.wish}
        </p>
        <div className="cp-in" style={{ ...next(), marginTop: U(30), fontFamily: CODE_FONT, fontWeight: 700, fontSize: U(21), letterSpacing: '.06em', textTransform: 'uppercase', color: '#1f2a44' }}>
          {c.footer}
        </div>
        <div className="cp-in" style={{ ...next(), marginTop: U(20), fontSize: U(34), textAlign: 'right', color: '#b5354a' }}>
          {c.signature}
        </div>
      </div>
    </div>
  );
}

export function CardPreview() {
  return (
    <div
      data-card
      style={{ containerType: 'size', position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#f7e6d2', display: 'grid', placeItems: 'center' }}
    >
      <style>{css}</style>
      <div style={{ position: 'relative', width: U(W), height: U(H), overflow: 'hidden' }}>
        <Scene />
        <Paper />
      </div>
    </div>
  );
}
