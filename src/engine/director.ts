import gsap from 'gsap';
import { createFilm, type FilmApi } from './film';
import type { FilmStore } from './store';

export interface SceneDef { id: string; build(film: FilmApi): void }

export const SCENE_FADE = 0.4;

/** Builds one paused master timeline: each scene fades in, plays, and (except the last) fades out. */
export function buildMaster(scenes: SceneDef[], store: FilmStore) {
  const tl = gsap.timeline({ paused: true });
  const film = createFilm(store, tl);
  const sceneStarts: number[] = [];
  scenes.forEach((scene, i) => {
    sceneStarts.push(tl.duration());
    film.fadeIn(SCENE_FADE);
    scene.build(film);
    if (i < scenes.length - 1) film.fadeOut(SCENE_FADE);
  });
  return { tl, sceneStarts, duration: tl.duration() };
}
