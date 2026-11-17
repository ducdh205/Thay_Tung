import type { CSSProperties } from 'react';
import type { FilmStore } from '../engine/store';
import { useFilmState } from './useFilm';
import { CodePane } from './CodePane';
import { Terminal } from './Terminal';
import { Subtitle } from './Subtitle';
import { Preview } from './Preview';
import { GitGraph } from './GitGraph';
import { ContribGrid } from './ContribGrid';
import { COLORS, STAGE_H, STAGE_W } from '../theme';
import { CARD_DOC } from '../scenes/s7-cam-on';
import { content } from '../content';

const TITLE_H = 44;
const TAB_H = 56;
const STATUS_H = 36;
const ACTIVITY_W = 64;
const EXPLORER_W = 320;

export interface EditorProps {
  store: FilmStore;
}

/**
 * Preview pane box. While `full` grows 0→1 it becomes `position: fixed`, which inside the
 * transformed Stage is relative to the 1920×1080 stage, and its insets shrink to 0 so the
 * same element (card animations keep running) grows to cover the whole stage.
 */
function previewBox(widthPct: number, full: number, explorer: boolean): CSSProperties {
  if (full <= 0) return { width: `${widthPct}%`, padding: 20, transition: 'width .8s ease', minWidth: 0 };
  const mainLeft = ACTIVITY_W + (explorer ? EXPLORER_W : 0);
  const left = mainLeft + (STAGE_W - mainLeft) / 2;
  const k = 1 - full;
  return { position: 'fixed', left: left * k, top: (TITLE_H + TAB_H) * k, right: 0, bottom: STATUS_H * k, padding: 20 * k, zIndex: 25 };
}

export function Editor({ store }: EditorProps) {
  const s = useFilmState(store);
  const doc = s.activeDoc ? s.docs[s.activeDoc] : null;
  const termH = s.terminal.visible ? Math.round((STAGE_H - TITLE_H - STATUS_H) * 0.3) : 0;
  const codeH = STAGE_H - TITLE_H - STATUS_H - TAB_H - termH;
  const previewW = s.preview.visible ? 50 + 50 * s.preview.full : 0; // percent of main area
  const collaborators = (['thay', 'anhTung', 'chiTrang'] as const).filter((id) => s.cursors[id].visible);

  return (
    <div style={{ position: 'absolute', inset: 0, background: COLORS.bg, color: COLORS.text, display: 'flex', flexDirection: 'column' }}>
      {/* Title bar */}
      <div style={{ height: TITLE_H, flex: 'none', background: COLORS.bgDark, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10 }}>
        {['#f38ba8', '#f9e2af', '#a6e3a1'].map((c) => (
          <i key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, display: 'block' }} />
        ))}
        <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: COLORS.dim }}>{content.windowTitle}</div>
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Activity bar */}
        <div style={{ width: ACTIVITY_W, flex: 'none', background: COLORS.bgDark, borderRight: `1px solid ${COLORS.border}` }} />
        {/* Explorer */}
        <div
          data-explorer
          style={{
            width: s.explorer.visible ? EXPLORER_W : 0, flex: 'none', overflow: 'hidden', background: COLORS.bgDark,
            borderRight: s.explorer.visible ? `1px solid ${COLORS.border}` : 'none', transition: 'width .6s ease',
          }}
        >
          <div style={{ padding: '14px 24px', fontSize: 16, letterSpacing: '.12em', color: COLORS.dim }}>EXPLORER</div>
          {s.explorer.items.map((it, i) => (
            <div key={i} style={{ padding: '4px 24px', fontSize: 20, whiteSpace: 'pre', color: it.trim().endsWith('/') ? COLORS.text : '#a6adc8', animation: `popIn .3s ease ${i * 0.05}s both` }}>
              {it}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          <div style={{ height: TAB_H, flex: 'none', background: COLORS.bgDark, display: 'flex', alignItems: 'flex-end' }}>
            {s.tabs.map((id) => (
              <div
                key={id}
                style={{
                  height: TAB_H - 6, padding: '0 28px', display: 'flex', alignItems: 'center', fontSize: 20,
                  background: id === s.activeDoc ? COLORS.bg : 'transparent', color: id === s.activeDoc ? COLORS.text : COLORS.dim,
                  borderTop: id === s.activeDoc ? `2px solid ${COLORS.cursor.em}` : '2px solid transparent',
                }}
              >
                {s.docs[id]?.fileName}
              </div>
            ))}
            <div style={{ flex: 1 }} />
            {s.activeDoc === CARD_DOC && (
              <div
                data-run
                data-pressed={s.preview.runPressed}
                style={{
                  alignSelf: 'center', marginRight: 24, padding: '6px 20px', borderRadius: 8, fontSize: 20, fontWeight: 700,
                  color: s.preview.runPressed ? '#11111b' : COLORS.ok, background: s.preview.runPressed ? COLORS.ok : 'transparent',
                  border: `2px solid ${COLORS.ok}`, transform: s.preview.runPressed ? 'scale(0.94)' : 'none',
                  boxShadow: s.preview.runPressed ? `0 0 28px ${COLORS.ok}` : 'none', transition: 'all .25s ease',
                }}
              >
                {content.s7.run}
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <div style={{ width: `${100 - previewW}%`, overflow: 'hidden', transition: 'width .8s ease' }}>
              {doc && <CodePane doc={doc} state={s} height={codeH} />}
            </div>
            {s.preview.visible && (
              <div style={previewBox(previewW, s.preview.full, s.explorer.visible)}>
                <Preview state={s.preview} />
              </div>
            )}
          </div>

          {s.terminal.visible && (
            <div style={{ height: termH, flex: 'none' }}>
              <Terminal lines={s.terminal.lines} />
            </div>
          )}

          {s.overlay !== 'none' && <div style={{ position: 'absolute', inset: 0, background: COLORS.bg, zIndex: 5 }}>{s.overlay === 'gitGraph' ? <GitGraph progress={s.overlayProgress} /> : <ContribGrid progress={s.overlayProgress} />}</div>}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ height: STATUS_H, flex: 'none', background: '#11111b', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 24, fontSize: 17, color: COLORS.dim }}>
        <span>main</span>
        {collaborators.length > 0 && (
          <span data-liveshare style={{ color: COLORS.cursor.thay }}>
            ● Live Share · {collaborators.map((id) => content.cursors[id].label).join(', ')}
          </span>
        )}
      </div>

      <Subtitle text={s.subtitle} />
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: s.fade, pointerEvents: 'none', zIndex: 30 }} />
    </div>
  );
}
