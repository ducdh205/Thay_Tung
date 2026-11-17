import { describe, it, expect } from 'vitest';
import { parseParams } from '../../src/engine/params';

describe('parseParams', () => {
  it('defaults', () => expect(parseParams('')).toEqual({ scene: 1, speed: 1 }));
  it('reads scene and speed', () => expect(parseParams('?scene=5&speed=20')).toEqual({ scene: 5, speed: 20 }));
  it('ignores non-numeric scene', () => expect(parseParams('?scene=abc').scene).toBe(1));
  it('clamps scene to 7', () => expect(parseParams('?scene=99').scene).toBe(7));
  it('rejects zero speed', () => expect(parseParams('?speed=0').speed).toBe(1));
});
