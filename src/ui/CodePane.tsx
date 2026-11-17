import { tokenize, type Token } from '../engine/highlight';
import { cursorOffset, visibleText, CURSOR_IDS, type Doc, type FilmState } from '../engine/store';
import { COLORS, CODE_FONT, CODE_FONT_PX } from '../theme';
import { content } from '../content';

const LINE_H = Math.round(CODE_FONT_PX * 1.6);
const PAD_TOP = 28;
const GUTTER = 84;
/** JetBrains Mono advance is 600/1000 em; `ch` is unreliable here (browser measured 0.5em). */
const CHAR_W = CODE_FONT_PX * 0.6;

function splitLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const t of tokens) {
    const parts = t.text.split('\n');
    parts.forEach((p, i) => {
      if (i > 0) lines.push([]);
      if (p) lines[lines.length - 1].push({ text: p, kind: t.kind });
    });
  }
  return lines;
}

function lineCol(text: string, offset: number) {
  const before = text.slice(0, offset);
  const line = before.split('\n').length - 1;
  const col = offset - (before.lastIndexOf('\n') + 1);
  return { line, col };
}

export function CodePane({ doc, state, height }: { doc: Doc; state: FilmState; height: number }) {
  const text = visibleText(doc);
  const lines = splitLines(tokenize(text, doc.lang));
  const textLines = text.split('\n');
  const carets = CURSOR_IDS.filter((id) => state.cursors[id].visible && state.cursors[id].docId === doc.id).map((id) => {
    const pin = state.cursors[id].pin;
    if (pin) {
      const line = Math.min(pin, textLines.length) - 1;
      return { id, line, col: textLines[line].length };
    }
    return { id, ...lineCol(text, cursorOffset(doc, id)) };
  });
  const comments = state.comments.filter((c) => c.docId === doc.id);

  // Keep the lowest caret on screen.
  const visibleLines = Math.floor((height - PAD_TOP * 2) / LINE_H);
  const lowest = Math.max(0, ...carets.map((c) => c.line));
  const scroll = Math.max(0, lowest - visibleLines + 3) * LINE_H;

  return (
    <div data-code-pane style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: CODE_FONT, fontSize: CODE_FONT_PX }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: PAD_TOP, transform: `translateY(${-scroll}px)`, transition: 'transform .5s ease' }}>
        {lines.map((toks, i) => (
          <div
            key={i}
            data-error-line={doc.errorLines.includes(i + 1) ? i + 1 : undefined}
            style={{ height: LINE_H, lineHeight: `${LINE_H}px`, whiteSpace: 'pre', display: 'flex' }}
          >
            <span style={{ width: GUTTER, flex: 'none', textAlign: 'right', paddingRight: 28, color: COLORS.dim, fontSize: CODE_FONT_PX * 0.8 }}>
              {i + 1}
            </span>
            <span
              style={
                doc.errorLines.includes(i + 1)
                  ? { textDecoration: `wavy underline ${COLORS.error}`, textUnderlineOffset: 8 }
                  : undefined
              }
            >
              {toks.map((t, j) => (
                <span key={j} style={{ color: COLORS.tok[t.kind] }}>
                  {t.text}
                </span>
              ))}
            </span>
          </div>
        ))}

        {carets.map((c) => (
          <div
            key={c.id}
            data-caret={c.id}
            data-line={c.line}
            data-col={c.col}
            style={{
              position: 'absolute',
              top: c.line * LINE_H,
              left: GUTTER + c.col * CHAR_W,
              height: LINE_H,
              transition: 'left 0.08s linear, top 0.15s ease',
            }}
          >
            <div className="caret-bar" style={{ width: 3, height: LINE_H * 0.8, marginTop: LINE_H * 0.1, background: COLORS.cursor[c.id] }} />
            <div
              style={{
                // Right of the caret on its own line: the space there is always still untyped.
                position: 'absolute', top: LINE_H * 0.2, left: 12, whiteSpace: 'nowrap', lineHeight: 1.3, opacity: 0.92,
                background: COLORS.cursor[c.id], color: '#11111b', fontFamily: 'system-ui, Segoe UI, sans-serif',
                fontSize: 18, fontWeight: 700, padding: '2px 10px', borderRadius: '0 6px 6px 6px',
              }}
            >
              {content.cursors[c.id].label}
            </div>
          </div>
        ))}

        {comments.map((c, i) => (
          <div
            key={i}
            data-comment
            style={{
              position: 'absolute', right: 40, top: (c.line - 1) * LINE_H - 6, maxWidth: 560,
              background: COLORS.bgDark, border: `2px solid ${COLORS.cursor[c.author]}`, borderRadius: 10,
              padding: '10px 16px', fontFamily: 'system-ui, Segoe UI, sans-serif', fontSize: 22, color: COLORS.text,
              boxShadow: '0 8px 24px rgba(0,0,0,.4)', animation: 'popIn .4s ease',
            }}
          >
            <b style={{ color: COLORS.cursor[c.author] }}>{content.cursors[c.author].label}</b>
            <span style={{ marginLeft: 10 }}>{c.text}</span>
            {c.approved && <div style={{ color: COLORS.ok, fontWeight: 700, marginTop: 4 }}>✓ Approved</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
