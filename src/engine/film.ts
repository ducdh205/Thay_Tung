import type { FilmState, FilmStore, Doc, CursorId, Chunk } from './store';

export interface VerbOpts { with?: boolean }
export interface TypeOpts extends VerbOpts { cps?: number }

export interface FilmApi {
  openFile(doc: Omit<Doc, 'typed' | 'errorLines' | 'chunks'>): void;
  type(docId: string, cursor: CursorId, text: string, o?: TypeOpts): void;
  erase(docId: string, count: number, o?: TypeOpts): void;
  showCursor(id: CursorId, docId: string | null, visible?: boolean): void;
  set(fn: (s: FilmState) => void): void;
  tween(fn: (s: FilmState, p: number) => void, dur: number, o?: VerbOpts): void;
  wait(sec: number): void;
  subtitle(text: string, holdSec: number): void;
  fadeOut(sec: number): void;
  fadeIn(sec: number): void;
  now(): number;
}

export const DEFAULT_CPS = 14;

/**
 * Director verbs over a GSAP timeline. Each verb appends at the end of the timeline,
 * or with `{ with: true }` starts together with the previous verb.
 * Build-time shadow docs track text so every runtime change is a pure function of build data,
 * which keeps forward seeks (`tl.seek(t, false)`) reproducible.
 */
export function createFilm(store: FilmStore, tl: gsap.core.Timeline): FilmApi {
  const shadow: Record<string, { text: string; chunks: Chunk[] }> = {};
  let lastStart = 0;

  const at = (o?: VerbOpts) => {
    const t = o?.with ? lastStart : tl.duration();
    lastStart = t;
    return t;
  };
  const patch = (fn: (s: FilmState) => void) => store.patch(fn);
  const setAt = (t: number, fn: (s: FilmState) => void) => {
    tl.call(() => patch(fn), undefined, t);
  };
  const tweenAt = (t: number, dur: number, fn: (s: FilmState, p: number) => void) => {
    const proxy = { p: 0 };
    tl.fromTo(
      proxy,
      { p: 0 },
      { p: 1, duration: dur, ease: 'none', immediateRender: false, onUpdate: () => patch((s) => fn(s, proxy.p)) },
      t,
    );
  };
  const sumTyped = (d: Doc) => d.chunks.reduce((n, c) => n + c.typed, 0);

  const api: FilmApi = {
    openFile(doc) {
      const t = at();
      const chunks: Chunk[] = doc.text ? [{ start: 0, len: doc.text.length, typed: doc.text.length, cursor: null }] : [];
      shadow[doc.id] = { text: doc.text, chunks: chunks.map((c) => ({ ...c })) };
      setAt(t, (s) => {
        s.docs[doc.id] = { ...doc, chunks: chunks.map((c) => ({ ...c })), typed: doc.text.length, errorLines: [] };
        if (!s.tabs.includes(doc.id)) s.tabs.push(doc.id);
        s.activeDoc = doc.id;
      });
    },

    type(docId, cursor, text, o) {
      const t = at(o);
      const sh = shadow[docId];
      const start = sh.text.length;
      sh.text += text;
      const fullText = sh.text;
      const idx = sh.chunks.length;
      sh.chunks.push({ start, len: text.length, typed: text.length, cursor });
      const dur = text.length / (o?.cps ?? DEFAULT_CPS);
      setAt(t, (s) => {
        const d = s.docs[docId];
        if (!d) return;
        d.text = fullText.length > d.text.length ? fullText : d.text;
        if (!d.chunks[idx]) d.chunks[idx] = { start, len: text.length, typed: 0, cursor };
        s.cursors[cursor].docId = docId;
        s.cursors[cursor].visible = true;
      });
      tweenAt(t, dur, (s, p) => {
        const d = s.docs[docId];
        if (!d) return;
        if (!d.chunks[idx]) return;
        d.chunks[idx].typed = Math.floor(text.length * p + 1e-9);
        d.typed = sumTyped(d);
      });
    },

    erase(docId, count, o) {
      const t = at(o);
      const sh = shadow[docId];
      const before = sh.chunks.map((c) => c.typed);
      const remaining = sh.text.length - count;
      // Shadow after erase: trim chunks from the end.
      let left = count;
      for (let i = sh.chunks.length - 1; i >= 0 && left > 0; i--) {
        const cut = Math.min(left, sh.chunks[i].len);
        sh.chunks[i].len -= cut;
        sh.chunks[i].typed -= cut;
        left -= cut;
      }
      sh.chunks = sh.chunks.filter((c) => c.len > 0);
      sh.text = sh.text.slice(0, remaining);
      const after = sh.chunks.map((c) => ({ ...c }));
      const finalText = sh.text;
      tweenAt(t, count / (o?.cps ?? DEFAULT_CPS), (s, p) => {
        const d = s.docs[docId];
        if (!d) return;
        let k = Math.floor(count * p + 1e-9);
        for (let i = before.length - 1; i >= 0; i--) {
          const cut = Math.min(k, before[i]);
          if (d.chunks[i]) d.chunks[i].typed = before[i] - cut;
          k -= cut;
        }
        d.typed = sumTyped(d);
        if (p >= 1) {
          d.text = finalText;
          d.chunks = after.map((c) => ({ ...c }));
          d.typed = sumTyped(d);
        }
      });
    },

    showCursor(id, docId, visible = true) {
      setAt(at(), (s) => {
        s.cursors[id].docId = docId;
        s.cursors[id].visible = visible;
      });
    },

    set(fn) {
      setAt(at(), fn);
    },

    tween(fn, dur, o) {
      tweenAt(at(o), dur, fn);
    },

    wait(sec) {
      tl.to({}, { duration: sec }, at());
    },

    subtitle(text, holdSec) {
      const t = at();
      setAt(t, (s) => void (s.subtitle = text));
      tl.to({}, { duration: holdSec }, t);
      setAt(t + holdSec, (s) => void (s.subtitle = null));
    },

    fadeOut(sec) {
      tweenAt(at(), sec, (s, p) => void (s.fade = p));
    },

    fadeIn(sec) {
      tweenAt(at(), sec, (s, p) => void (s.fade = 1 - p));
    },

    now: () => tl.duration(),
  };
  return api;
}
