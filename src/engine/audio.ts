export interface Music {
  readonly available: boolean;
  play(at: number): Promise<void>;
  pause(): void;
  syncTo(t: number): void;
  fadeOut(sec: number): void;
}

const DRIFT = 0.25;

/** Background music that never throws: a missing file or a blocked play() just makes it silent. */
export function createMusic(src: string, audioFactory: (src: string) => HTMLAudioElement = (s) => new Audio(s)): Music {
  let ok = true;
  let fadeTimer: ReturnType<typeof setInterval> | null = null;
  let audio: HTMLAudioElement | null = null;
  try {
    audio = audioFactory(src);
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      ok = false;
    });
  } catch {
    ok = false;
  }

  return {
    get available() {
      return ok && !!audio;
    },
    async play(at) {
      if (!ok || !audio) return;
      try {
        audio.currentTime = at;
        await audio.play();
      } catch {
        ok = false;
      }
    },
    pause() {
      if (!ok || !audio) return;
      try {
        audio.pause();
      } catch {
        /* ignore */
      }
    },
    syncTo(t) {
      if (!ok || !audio) return;
      if (Math.abs(audio.currentTime - t) > DRIFT) audio.currentTime = t;
    },
    fadeOut(sec) {
      if (!ok || !audio) return;
      const a = audio;
      const start = a.volume;
      const steps = Math.max(1, Math.round(sec * 20));
      let i = 0;
      if (fadeTimer) clearInterval(fadeTimer);
      fadeTimer = setInterval(() => {
        i++;
        a.volume = Math.max(0, start * (1 - i / steps));
        if (i >= steps && fadeTimer) {
          clearInterval(fadeTimer);
          fadeTimer = null;
        }
      }, 50);
    },
  };
}
