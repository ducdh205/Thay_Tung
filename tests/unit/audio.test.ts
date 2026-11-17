import { describe, it, expect } from 'vitest';
import { createMusic } from '../../src/engine/audio';

function fakeAudio(opts: { reject?: boolean } = {}) {
  const listeners: Record<string, (() => void)[]> = {};
  const a = {
    currentTime: 0,
    volume: 1,
    paused: true,
    preload: '',
    plays: 0,
    play() {
      a.plays++;
      return opts.reject ? Promise.reject(new Error('NotAllowedError')) : Promise.resolve();
    },
    pause() {},
    addEventListener(ev: string, cb: () => void) {
      (listeners[ev] ??= []).push(cb);
    },
    emit(ev: string) {
      (listeners[ev] ?? []).forEach((cb) => cb());
    },
  };
  return a;
}

describe('createMusic', () => {
  it('swallows a rejected play() and marks itself unavailable', async () => {
    const a = fakeAudio({ reject: true });
    const m = createMusic('music.mp3', () => a as unknown as HTMLAudioElement);
    await expect(m.play(0)).resolves.toBeUndefined();
    expect(m.available).toBe(false);
  });

  it('becomes a no-op after a load error', async () => {
    const a = fakeAudio();
    const m = createMusic('music.mp3', () => a as unknown as HTMLAudioElement);
    a.emit('error');
    expect(m.available).toBe(false);
    expect(() => m.syncTo(5)).not.toThrow();
    expect(() => m.fadeOut(1)).not.toThrow();
    await m.play(0);
    expect(a.plays).toBe(0);
  });

  it('only resyncs when drift exceeds 0.25s', () => {
    const a = fakeAudio();
    const m = createMusic('music.mp3', () => a as unknown as HTMLAudioElement);
    a.currentTime = 9.9;
    m.syncTo(10);
    expect(a.currentTime).toBe(9.9);
    a.currentTime = 9;
    m.syncTo(10);
    expect(a.currentTime).toBe(10);
  });
});
