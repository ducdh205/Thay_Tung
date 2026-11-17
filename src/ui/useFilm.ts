import { useSyncExternalStore } from 'react';
import type { FilmStore, FilmState } from '../engine/store';

export function useFilmState(store: FilmStore): FilmState {
  useSyncExternalStore(store.subscribe, store.version, store.version);
  return store.get();
}
