import { describe, it, expect } from 'vitest';
import gsap from 'gsap';
import { createFilmStore, visibleText, cursorOffset } from '../../src/engine/store';
import { createFilm } from '../../src/engine/film';
import { buildMaster } from '../../src/engine/director';

function setup() {
  const store = createFilmStore();
  const tl = gsap.timeline({ paused: true });
  const f = createFilm(store, tl);
  return { store, tl, f };
}

describe('FilmApi', () => {
  it('types, runs in parallel, erases and shows subtitles reproducibly on seek', () => {
    const { store, tl, f } = setup();
    f.openFile({ id: 'a', fileName: 'index.html', lang: 'html', text: '' });
    f.type('a', 'thay', '<h1>Hi</h1>', { cps: 10 }); // 11 chars → 1.1s
    expect(tl.duration()).toBeCloseTo(1.1, 2);
    tl.seek(0.55, false);
    expect(store.get().docs.a.typed).toBe(5);
    tl.seek(1.1, false);
    expect(store.get().docs.a.typed).toBe(11);
    expect(store.get().activeDoc).toBe('a');
    expect(store.get().cursors.thay.docId).toBe('a');

    f.type('a', 'em', 'x', { cps: 1 });
    f.type('a', 'thay', 'y', { cps: 1, with: true });
    expect(tl.duration()).toBeCloseTo(2.1, 2);

    f.erase('a', 3, { cps: 10 });
    tl.seek(tl.duration(), false);
    expect(store.get().docs.a.text).toBe('<h1>Hi</h1>xy'.slice(0, 10)); // 13 chars - 3
    expect(store.get().docs.a.typed).toBe(10);

    f.subtitle('Năm nhất', 2);
    const t0 = f.now() - 2;
    tl.seek(t0 + 1, false);
    expect(store.get().subtitle).toBe('Năm nhất');
    tl.seek(tl.duration(), false);
    expect(store.get().subtitle).toBeNull();
  });

  it('lets two cursors type different lines of one doc at the same time', () => {
    const { store, tl, f } = setup();
    f.openFile({ id: 'c', fileName: 'style.css', lang: 'css', text: '' });
    f.type('c', 'thay', 'AAAA\n', { cps: 10 });
    f.type('c', 'em', 'BBBB\n', { cps: 5, with: true });
    tl.seek(0.2, false);
    const d = store.get().docs.c;
    // Thầy's unfinished line keeps its newline so Em's line does not glue onto it.
    expect(visibleText(d)).toBe('AA\nB');
    expect(cursorOffset(d, 'thay')).toBe(2);
    expect(cursorOffset(d, 'em')).toBe(4);
    tl.seek(tl.duration(), false);
    const done = store.get().docs.c;
    expect(visibleText(done)).toBe('AAAA\nBBBB\n');
    // A finished cursor parks at the end of its own line, not on the start of someone else's.
    expect(cursorOffset(done, 'thay')).toBe(4);
    expect(cursorOffset(done, 'em')).toBe(10);
  });
});

describe('buildMaster', () => {
  it('records scene start times including 0.6s fades', () => {
    const m = buildMaster(
      [{ id: 'x', build: (f) => f.wait(2) }, { id: 'y', build: (f) => f.wait(3) }],
      createFilmStore(),
    );
    expect(m.sceneStarts).toEqual([0, 3.2]);
    expect(m.duration).toBeCloseTo(3.2 + 0.6 + 3, 2);
    expect(m.tl.paused()).toBe(true);
  });
});
