import type { FilmState } from '../engine/store';
import { content } from '../content';
import { CardPreview } from './CardPreview';

const T = 'all 1.2s ease';

export function Preview({ state }: { state: FilmState['preview'] }) {
  const { stage } = state;
  const shown = stage !== 'blank';
  const styled = stage === 'css' || stage === 'php';
  const php = stage === 'php';
  const full = state.full;

  return (
    <div
      data-preview
      style={{
        height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 14 * (1 - full), overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,.5)', background: '#fff', animation: 'popIn .6s ease',
      }}
    >
      {full < 1 && (
        <div style={{ height: 52, flex: 'none', background: '#e6e6ea', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <i key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c, display: 'block' }} />
          ))}
          <div style={{ flex: 1, marginLeft: 14, background: '#fff', borderRadius: 8, padding: '6px 16px', fontSize: 18, color: '#555', fontFamily: 'system-ui, sans-serif' }}>
            {stage === 'card' ? 'localhost/cam-on-thay.html' : content.site.url}
          </div>
        </div>
      )}

      {stage === 'card' ? (
        <div style={{ flex: 1, minHeight: 0 }}>
          <CardPreview />
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', fontFamily: styled ? 'system-ui, Segoe UI, sans-serif' : "'Times New Roman', serif", color: '#111' }}>
          <div
            style={{
              height: styled ? 72 : 0, overflow: 'hidden', transition: T, display: 'flex', alignItems: 'center', padding: '0 32px',
              background: 'linear-gradient(90deg,#4FA3FF,#7c6cf6)', color: '#fff', fontWeight: 700, fontSize: 26,
            }}
          >
            {content.site.name}
          </div>
          {shown && (
            <div style={{ padding: styled ? '40px 44px' : '16px 12px', transition: T }}>
              <h1 style={{ fontSize: styled ? 54 : 40, fontWeight: styled ? 800 : 700, color: styled ? '#1e1e2e' : '#000', transition: T, lineHeight: 1.15 }}>
                {content.site.heading}
              </h1>
              <p style={{ fontSize: styled ? 26 : 22, marginTop: 14, color: styled ? '#555' : '#000', transition: T }}>{content.site.line}</p>

              {styled && (
                <div style={{ display: 'flex', gap: 20, marginTop: 28, animation: 'popIn .8s ease' }}>
                  {['HTML', 'CSS', 'PHP'].map((k) => (
                    <div key={k} style={{ flex: 1, height: 90, borderRadius: 14, background: k === 'PHP' && !php ? '#eef0f6' : '#f1f5ff', border: '2px solid #dfe6ff', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, color: k === 'PHP' && !php ? '#bbb' : '#4F6BFF', transition: T }}>
                      {k}
                    </div>
                  ))}
                </div>
              )}

              {php && (
                <div style={{ marginTop: 28, animation: 'popIn .6s ease' }}>
                  <div style={{ display: 'flex', gap: 12, fontSize: 22 }}>
                    <div style={{ flex: 1, border: '2px solid #ccd', borderRadius: 10, padding: '10px 16px', color: '#999' }}>{content.site.formLabel}…</div>
                    <div style={{ background: '#4F6BFF', color: '#fff', borderRadius: 10, padding: '10px 26px', fontWeight: 700 }}>{content.site.formButton}</div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    {content.phpRows.slice(0, state.phpRows).map((r, i) => (
                      <div key={i} data-php-row style={{ fontSize: 22, padding: '10px 4px', borderBottom: '1px solid #eee', animation: 'popIn .4s ease' }}>
                        💬 {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {state.deployed && (
            <div style={{ position: 'absolute', right: 24, bottom: 24, background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 24, padding: '12px 22px', borderRadius: 12, animation: 'popIn .5s ease', boxShadow: '0 10px 30px rgba(22,163,74,.4)' }}>
              ✓ Deploy thành công
            </div>
          )}
        </div>
      )}
    </div>
  );
}
