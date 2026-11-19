import type { SceneDef } from '../engine/director';
import { content } from '../content';
import { clearScreen, splitAt } from './common';

const code = content.code.s2;
const [skeleton, heading] = splitAt(code.thay, '  <h1>');

/** Con trỏ của thầy xuất hiện và gõ khung HTML đầu tiên. */
export const s2: SceneDef = {
  id: 'thay-den',
  build(f) {
    f.set(clearScreen);
    f.openFile({ id: 'index', fileName: 'index.html', lang: 'html', text: '' });
    f.showCursor('em', 'index');
    f.wait(0.6);
    f.showCursor('thay', 'index'); // khoảnh khắc thầy xuất hiện
    f.wait(1);
    f.type('index', 'thay', skeleton, { cps: 30 });
    f.set((s) => void (s.preview.visible = true));
    f.type('index', 'thay', heading, { cps: 28 });
    f.set((s) => void (s.preview.stage = 'html'));
    f.wait(0.6);
    f.type('index', 'em', code.em, { cps: 25 });
    f.type('index', 'thay', code.close, { cps: 30 });
    f.wait(1.2);
  },
};
