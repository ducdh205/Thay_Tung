import { useEffect, useState, type ReactNode } from 'react';
import { computeStageFit } from '../engine/stage';
import { STAGE_W, STAGE_H } from '../theme';

export function Stage({ children, hideCursor = false }: { children: ReactNode; hideCursor?: boolean }) {
  const [fit, setFit] = useState(() => computeStageFit(window.innerWidth, window.innerHeight));
  useEffect(() => {
    const update = () => setFit(computeStageFit(window.innerWidth, window.innerHeight));
    window.addEventListener('resize', update);
    document.addEventListener('fullscreenchange', update);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('fullscreenchange', update);
    };
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden', cursor: hideCursor ? 'none' : 'default' }}>
      <div
        data-stage
        style={{
          position: 'absolute', left: 0, top: 0, width: STAGE_W, height: STAGE_H,
          transformOrigin: '0 0', transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.scale})`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
