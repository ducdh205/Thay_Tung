import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Stage } from './ui/Stage';
import { Editor } from './ui/Editor';
import { StartScreen } from './ui/StartScreen';
import { EndOverlay } from './ui/EndOverlay';
import { createFilmStore } from './engine/store';
import { buildMaster } from './engine/director';
import { createMusic } from './engine/audio';
import { createPlayback, shouldHideCursor, type Playback, type PlayState } from './engine/playback';
import { attachControls, toggleFullscreen } from './engine/controls';
import { parseParams } from './engine/params';
import { SCENES } from './scenes';

const MUSIC_SRC = 'music.mp3';
const SYNC_EVERY_MS = 2000;

function enterFullscreen() {
  try {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => {});
  } catch {
    /* not available */
  }
}

export function App() {
  const params = useMemo(() => parseParams(window.location.search), []);
  const store = useMemo(() => createFilmStore(), []);
  const [run, setRun] = useState(0); // 0 = waiting for Start; n > 0 = n-th playthrough
  const [state, setState] = useState<PlayState>('idle');
  const [moved, setMoved] = useState(false);
  const pb = useRef<Playback | null>(null);

  // Build one playthrough: fresh store, fresh timeline, fresh music element.
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    store.reset();
    const master = buildMaster(SCENES, store);
    const start = master.sceneStarts[params.scene - 1] ?? 0;
    master.tl.seek(start, false);
    const music = createMusic(MUSIC_SRC);
    const p = createPlayback({ tl: master.tl, music, speed: params.speed, onState: setState });
    pb.current = p;
    (window as unknown as { __film?: unknown }).__film = master.tl;
    if (run > 0) p.start();
    return () => {
      p.stop();
      master.tl.kill();
    };
  }, [run, store, params]);

  useEffect(() => {
    const detach = attachControls(window, {
      started: () => pb.current?.state() === 'playing' || pb.current?.state() === 'paused',
      toggle: () => pb.current?.toggle(),
      fullscreen: () => toggleFullscreen(),
    });
    const sync = () => pb.current?.sync();
    const id = setInterval(sync, SYNC_EVERY_MS);
    // On return, let GSAP tick first (it jumps ahead by the hidden time), then pull music to it.
    const onVis = () => {
      if (document.visibilityState === 'visible') requestAnimationFrame(() => requestAnimationFrame(sync));
    };
    document.addEventListener('visibilitychange', onVis);
    const onMove = () => setMoved(true);
    window.addEventListener('mousemove', onMove);
    return () => {
      detach();
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Track mouse movement only after the film ends, so the arrow stays off the card until wanted.
  useEffect(() => {
    if (state !== 'ended') setMoved(false);
  }, [state]);

  const onStart = () => {
    if (run > 0) return;
    enterFullscreen();
    setRun(1);
  };

  return (
    <Stage hideCursor={shouldHideCursor(state, moved)}>
      <Editor store={store} />
      {run === 0 && <StartScreen onStart={onStart} />}
      {state === 'ended' && <EndOverlay onReplay={() => setRun((r) => r + 1)} />}
    </Stage>
  );
}
