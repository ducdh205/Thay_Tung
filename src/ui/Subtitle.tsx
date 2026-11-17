import { useRef } from 'react';

/** Bottom-centered caption; keeps the last text while fading out. */
export function Subtitle({ text }: { text: string | null }) {
  const last = useRef<string | null>(null);
  if (text) last.current = text;
  return (
    <div
      data-subtitle
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 96, textAlign: 'center', pointerEvents: 'none',
        fontSize: 40, color: '#fff', textShadow: '0 2px 12px #000, 0 0 4px #000', fontFamily: 'system-ui, Segoe UI, sans-serif',
        opacity: text ? 1 : 0, transition: 'opacity .8s ease', zIndex: 20,
      }}
    >
      <span style={{ background: 'rgba(0,0,0,.45)', padding: '8px 28px', borderRadius: 8 }}>{last.current}</span>
    </div>
  );
}
