import { describe, it, expect } from 'vitest';
import { buildMaster } from '../../src/engine/director';
import { createFilmStore } from '../../src/engine/store';
import { SCENES } from '../../src/scenes';
import { content } from '../../src/content';

const TARGETS = [20, 30, 30, 30, 35, 30, 40];

function film() {
  const store = createFilmStore();
  const m = buildMaster(SCENES, store);
  const endOf = (i: number) => (i + 1 < m.sceneStarts.length ? m.sceneStarts[i + 1] - 0.01 : m.duration);
  const at = (t: number) => {
    m.tl.seek(0, true);
    store.reset();
    m.tl.seek(t, false);
    return store.get();
  };
  return { m, endOf, at };
}

describe('scenes', () => {
  const { m, endOf, at } = film();

  it('each scene lasts close to its target length', () => {
    m.sceneStarts.forEach((start, i) => {
      const len = endOf(i) - start;
      expect(len, `scene ${i + 1}`).toBeGreaterThanOrEqual(TARGETS[i] * 0.8);
      expect(len, `scene ${i + 1}`).toBeLessThanOrEqual(TARGETS[i] * 1.2);
    });
  });

  it('scene 1 ends with the empty first-year file', () => {
    expect(at(endOf(0)).docs['nam-nhat'].text).toBe('');
  });

  it('scene 2 ends with the teacher present and plain HTML in preview', () => {
    const s = at(endOf(1));
    expect(s.preview.stage).toBe('html');
    expect(s.cursors.thay.visible).toBe(true);
  });

  it('scene 3 ends styled', () => {
    expect(at(endOf(2)).preview.stage).toBe('css');
  });

  it('scene 5 ends with both mentors present and an approved review', () => {
    const s = at(endOf(4));
    expect(s.comments.some((c) => c.approved)).toBe(true);
    expect(s.cursors.anhTung.visible).toBe(true);
    expect(s.cursors.chiTrang.visible).toBe(true);
    expect(s.cursors.thay.visible).toBe(true);
    expect(s.explorer.visible).toBe(true);
  });

  it('scene 6 ends on the full contribution grid with the subtitle gone', () => {
    const s = at(endOf(5));
    expect(s.overlay).toBe('contrib');
    expect(s.overlayProgress).toBe(1);
    expect(s.subtitle).toBeNull();
  });

  it('has all seven scenes and a 3–4 minute total', () => {
    expect(SCENES.length).toBe(7);
    expect(m.duration).toBeGreaterThanOrEqual(180);
    expect(m.duration).toBeLessThanOrEqual(240);
  });

  it('ends on the card after Run was pressed, filling the stage', () => {
    const s = at(m.duration);
    expect(s.preview.stage).toBe('card');
    expect(s.preview.runPressed).toBe(true);
    expect(s.preview.full).toBe(1);
  });

  it('has no placeholder TODOs in on-screen copy', () => {
    const { code: _code, ...copy } = content;
    expect(JSON.stringify(copy)).not.toMatch(/TODO/);
  });

  it('scene 4 ends with a deployed PHP site and three rows', () => {
    const s = at(endOf(3));
    expect(s.preview.stage).toBe('php');
    expect(s.preview.phpRows).toBe(3);
    expect(s.preview.deployed).toBe(true);
  });
});
