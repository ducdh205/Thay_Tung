import type { SceneDef } from '../engine/director';
import { content } from '../content';
import { clearScreen } from './common';

const c = content.s7;
export const CARD_DOC = 'cam-on-thay';

/** Mọi con trỏ cùng gõ lời cảm ơn; bấm Run; tấm thiệp mở ra và phủ kín màn hình. */
export const s7: SceneDef = {
  id: 'cam-on',
  build(f) {
    f.set(clearScreen);
    f.openFile({ id: CARD_DOC, fileName: c.fileName, lang: 'html', text: '' });
    f.wait(0.6);
    f.type(CARD_DOC, 'thay', c.open, { cps: 23 });
    c.together.forEach(([who, line], i) => f.type(CARD_DOC, who, line, { cps: 15, with: i > 0 }));
    f.type(CARD_DOC, 'thay', c.close, { cps: 23 });
    f.wait(0.6);
    f.set((s) => void (s.preview.runPressed = true));
    f.wait(0.9);
    f.set((s) => {
      s.preview.visible = true;
      s.preview.stage = 'card';
      s.preview.full = 0;
    });
    f.wait(1.2);
    f.tween((s, p) => void (s.preview.full = p), 2.4);
    f.wait(5.8);
  },
};
