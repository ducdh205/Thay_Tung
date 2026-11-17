import type { SceneDef } from '../engine/director';

// TEMP placeholder scene so playback can be checked; replaced by real scenes in Task 7.
export const SCENES: SceneDef[] = [
  {
    id: 'demo',
    build(f) {
      f.openFile({ id: 'a', fileName: 'index.html', lang: 'html', text: '' });
      f.type('a', 'thay', '<h1>Xin chào</h1>\n', { cps: 8 });
      f.wait(1);
    },
  },
];
