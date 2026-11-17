import { describe, it, expect } from 'vitest';
import { computeStageFit } from '../../src/engine/stage';

describe('computeStageFit', () => {
  it('is identity at 1920x1080', () => {
    expect(computeStageFit(1920, 1080)).toEqual({ scale: 1, x: 0, y: 0 });
  });
  it('fits by height at 1366x768', () => {
    expect(computeStageFit(1366, 768).scale).toBeCloseTo(0.7111, 3);
  });
  it('letterboxes top/bottom on 5:4', () => {
    const r = computeStageFit(1280, 1024);
    expect(r.scale).toBeCloseTo(0.6667, 3);
    expect(r.x).toBe(0);
    expect(r.y).toBeCloseTo(152, 0);
  });
  it('pillarboxes on ultrawide', () => {
    const w = computeStageFit(2560, 1080);
    expect(w.scale).toBe(1);
    expect(w.x).toBe(320);
    expect(w.y).toBe(0);
  });
});
