import type { Music } from './audio';

export type PlayState = 'idle' | 'playing' | 'paused' | 'ended';

export interface PlaybackOpts {
  tl: gsap.core.Timeline;
  music: Music;
  speed?: number;
  /** Seconds before the end at which music starts fading. */
  fadeOutSec?: number;
  onState?: (s: PlayState) => void;
}

/** Keeps the master timeline and the music in lockstep. Music time == timeline time. */
export function createPlayback({ tl, music, speed = 1, fadeOutSec = 8, onState }: PlaybackOpts) {
  let st: PlayState = 'idle';
  const withMusic = speed === 1;
  const set = (s: PlayState) => {
    st = s;
    onState?.(s);
  };
  tl.timeScale(speed);
  tl.eventCallback('onComplete', () => set('ended'));
  const total = tl.duration();
  if (withMusic && total > fadeOutSec) tl.call(() => music.fadeOut(fadeOutSec), undefined, total - fadeOutSec);

  return {
    state: () => st,
    start() {
      if (st !== 'idle') return;
      set('playing');
      if (withMusic) void music.play(tl.time());
      tl.play();
    },
    toggle() {
      if (st === 'playing') {
        tl.pause();
        music.pause();
        set('paused');
      } else if (st === 'paused') {
        if (withMusic) void music.play(tl.time());
        tl.play();
        set('playing');
      }
    },
    sync() {
      if (st === 'playing' && withMusic) music.syncTo(tl.time());
    },
    stop() {
      tl.pause();
      music.pause();
    },
  };
}
export type Playback = ReturnType<typeof createPlayback>;
