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
/** `pin` (1-based line) parks a cursor at the end of that line instead of after its own typing. */
export interface CursorState { id: CursorId; docId: string | null; visible: boolean; pin?: number }
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

/**
 * Per chunk: [typed part, reserved newlines]. A chunk still being typed keeps the newlines of its
 * untyped remainder whenever a later chunk already shows text, so parallel lines never glue together.
 */
function layout(doc: Doc): [string, string][] {
  const out: [string, string][] = [];
  let laterTyped = false;
  for (let i = doc.chunks.length - 1; i >= 0; i--) {
    const c = doc.chunks[i];
    const typed = doc.text.slice(c.start, c.start + c.typed);
    const rest = laterTyped ? doc.text.slice(c.start + c.typed, c.start + c.len).replace(/[^\n]/g, '') : '';
    out[i] = [typed, rest];
    if (c.typed > 0) laterTyped = true;
  }
  return out;
}

/** The text currently on screen for a doc. */
export function visibleText(doc: Doc): string {
  return layout(doc).map(([a, b]) => a + b).join('');
}

/** Caret position (in visible-text coordinates) for a cursor: end of its latest chunk's typed part, else end of doc. */
export function cursorOffset(doc: Doc, id: CursorId): number {
  let pos = 0;
  let found = -1;
  let foundIdx = -1;
  const parts = layout(doc);
  parts.forEach(([typed, rest], i) => {
    pos += typed.length;
    if (doc.chunks[i].cursor === id) {
      found = pos;
      foundIdx = i;
    }
    pos += rest.length;
  });
  if (found < 0) return pos;
  // Finished chunk followed by someone else's visible text: park at the end of its own last line.
  const c = doc.chunks[foundIdx];
  const laterShown = parts.slice(foundIdx + 1).some(([t]) => t.length > 0);
  if (c.typed === c.len && laterShown) {
    const own = parts[foundIdx][0];
    found -= own.length - own.replace(/\n+$/, '').length;
  }
  return found;
}
