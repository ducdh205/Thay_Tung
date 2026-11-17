export const SCENE_COUNT = 7;

/** Dev/test-only URL params: ?scene=N (1-based) and ?speed=K (timeScale). */
export function parseParams(search: string): { scene: number; speed: number } {
  const q = new URLSearchParams(search);
  const sceneRaw = Number.parseInt(q.get('scene') ?? '', 10);
  const speedRaw = Number.parseFloat(q.get('speed') ?? '');
  const scene = Number.isFinite(sceneRaw) ? Math.min(SCENE_COUNT, Math.max(1, sceneRaw)) : 1;
  const speed = Number.isFinite(speedRaw) && speedRaw > 0 ? speedRaw : 1;
  return { scene, speed };
}
