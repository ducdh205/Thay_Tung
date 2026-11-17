import type { Lang } from './highlight';

export type CursorId = 'em' | 'thay' | 'anhTung' | 'chiTrang';
export const CURSOR_IDS: CursorId[] = ['em', 'thay', 'anhTung', 'chiTrang'];

/** One run of typed text inside a doc. Several chunks may be typed at once by different cursors. */
export interface Chunk { start: number; len: number; typed: number; cursor: CursorId | null }

export interface Doc {
  id: string;
  fileName: string;
  lang: Lang;
  text: string;
  /** Total visible characters (sum of chunk.typed). */
  typed: number;
  chunks: Chunk[];
  errorLines: number[];
}
export interface CursorState { id: CursorId; docId: string | null; visible: boolean }
export interface ReviewComment { docId: string; line: number; author: CursorId; text: string; approved?: boolean }
export type PreviewStage = 'blank' | 'html' | 'css' | 'php' | 'card';
export type Overlay = 'none' | 'gitGraph' | 'contrib';

export interface FilmState {
  docs: Record<string, Doc>;
  tabs: string[];
  activeDoc: string | null;
  explorer: { visible: boolean; items: string[] };
  cursors: Record<CursorId, CursorState>;
  preview: { visible: boolean; stage: PreviewStage; phpRows: number; deployed: boolean; runPressed: boolean; full: number };
  terminal: { visible: boolean; lines: string[] };
  comments: ReviewComment[];
  overlay: Overlay;
  overlayProgress: number;
  subtitle: string | null;
  /** 0 = clear, 1 = black. */
  fade: number;
}

export function initialState(): FilmState {
  const cursors = {} as Record<CursorId, CursorState>;
  for (const id of CURSOR_IDS) cursors[id] = { id, docId: null, visible: false };
  return {
    docs: {},
    tabs: [],
    activeDoc: null,
    explorer: { visible: false, items: [] },
    cursors,
    preview: { visible: false, stage: 'blank', phpRows: 0, deployed: false, runPressed: false, full: 0 },
    terminal: { visible: false, lines: [] },
    comments: [],
    overlay: 'none',
    overlayProgress: 0,
    subtitle: null,
    fade: 1,
  };
}

export interface FilmStore {
  get(): FilmState;
  version(): number;
  patch(fn: (s: FilmState) => void): void;
  subscribe(cb: () => void): () => void;
  reset(): void;
}

export function createFilmStore(): FilmStore {
  let state = initialState();
  let ver = 0;
  const subs = new Set<() => void>();
  const notify = () => {
    ver++;
    subs.forEach((cb) => cb());
  };
  return {
    get: () => state,
    version: () => ver,
    patch(fn) {
      fn(state);
      notify();
    },
    subscribe(cb) {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    reset() {
      state = initialState();
      notify();
    },
  };
}

/** The text currently on screen for a doc. */
export function visibleText(doc: Doc): string {
  return doc.chunks.map((c) => doc.text.slice(c.start, c.start + c.typed)).join('');
}

/** Caret position (in visible-text coordinates) for a cursor: end of its latest chunk, else end of doc. */
export function cursorOffset(doc: Doc, id: CursorId): number {
  let pos = 0;
  let found = -1;
  for (const c of doc.chunks) {
    pos += c.typed;
    if (c.cursor === id) found = pos;
  }
  return found >= 0 ? found : pos;
}
