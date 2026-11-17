import { CURSOR_IDS, initialState, type FilmState } from '../engine/store';

/** Close every tab and panel; docs stay in memory but nothing is on screen. */
export function clearScreen(s: FilmState) {
  const fresh = initialState();
  s.tabs = [];
  s.activeDoc = null;
  for (const id of CURSOR_IDS) s.cursors[id] = { id, docId: null, visible: false };
  s.preview = fresh.preview;
  s.terminal = fresh.terminal;
  s.explorer = fresh.explorer;
  s.comments = [];
  s.overlay = 'none';
  s.overlayProgress = 0;
}

/** Splits `text` right before the first occurrence of `marker`. */
export function splitAt(text: string, marker: string): [string, string] {
  const i = text.indexOf(marker);
  return i < 0 ? [text, ''] : [text.slice(0, i), text.slice(i)];
}
