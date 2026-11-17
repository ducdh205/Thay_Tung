import { STAGE_W, STAGE_H } from '../theme';

/** Scale + offset that fits the fixed 1920×1080 stage into a viewport, letterboxed. */
export function computeStageFit(vw: number, vh: number): { scale: number; x: number; y: number } {
  const scale = Math.min(vw / STAGE_W, vh / STAGE_H);
  return { scale, x: (vw - STAGE_W * scale) / 2, y: (vh - STAGE_H * scale) / 2 };
}
