import { describe, it, expect, vi } from 'vitest';
import gsap from 'gsap';
import { attachControls } from '../../src/engine/controls';
import { createPlayback } from '../../src/engine/playback';

const key = (k: string) => {
  const e = new KeyboardEvent('keydown', { key: k, code: k === ' ' ? 'Space' : `Key${k.toUpperCase()}`, cancelable: true });
  window.dispatchEvent(e);
  return e;
};

describe('attachControls', () => {
  it('ignores Space before the film starts', () => {
    const h = { started: () => false, toggle: vi.fn(), fullscreen: vi.fn() };
    const off = attachControls(window, h);
    key(' ');
    expect(h.toggle).not.toHaveBeenCalled();
    off();
  });

  it('toggles on Space once started and prevents page scroll', () => {
    const h = { started: () => true, toggle: vi.fn(), fullscreen: vi.fn() };
    const off = attachControls(window, h);
    const e = key(' ');
    expect(h.toggle).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
    off();
  });

  it('F toggles fullscreen, and detaching removes the listeners', () => {
    const h = { started: () => true, toggle: vi.fn(), fullscreen: vi.fn() };
    const off = attachControls(window, h);
    key('f');
    expect(h.fullscreen).toHaveBeenCalledTimes(1);
    off();
    key(' ');
    expect(h.toggle).not.toHaveBeenCalled();
  });
});

function fakeMusic() {
  return { available: true, play: vi.fn(async () => {}), pause: vi.fn(), syncTo: vi.fn(), fadeOut: vi.fn() };
}

describe('createPlayback', () => {
  const mk = (speed = 1) => {
    const tl = gsap.timeline({ paused: true });
    tl.to({}, { duration: 10 });
    const music = fakeMusic();
    return { tl, music, pb: createPlayback({ tl, music, speed }) };
  };

  it('starts only once even if Start is pressed twice', () => {
    const { tl, music, pb } = mk();
    pb.start();
    pb.start();
    expect(music.play).toHaveBeenCalledTimes(1);
    expect(tl.paused()).toBe(false);
    expect(pb.state()).toBe('playing');
  });

  it('toggle before start does nothing', () => {
    const { tl, music, pb } = mk();
    pb.toggle();
    expect(pb.state()).toBe('idle');
    expect(tl.paused()).toBe(true);
    expect(music.play).not.toHaveBeenCalled();
  });

  it('pause stops picture and music; resume resyncs music to the timeline', () => {
    const { tl, music, pb } = mk();
    pb.start();
    tl.seek(4, false);
    pb.toggle();
    expect(pb.state()).toBe('paused');
    expect(tl.paused()).toBe(true);
    expect(music.pause).toHaveBeenCalled();
    pb.toggle();
    expect(pb.state()).toBe('playing');
    expect(music.play).toHaveBeenLastCalledWith(4);
  });

  it('keeps music silent when speed is not 1', () => {
    const { music, pb } = mk(20);
    pb.start();
    expect(music.play).not.toHaveBeenCalled();
  });
});
