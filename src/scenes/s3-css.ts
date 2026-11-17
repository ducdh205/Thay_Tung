import type { SceneDef } from '../engine/director';
import { content } from '../content';

const lines = content.code.s3;
const CPS = 8;

/** Thầy một dòng, em một dòng; trang nở ra màu sắc. */
export const s3: SceneDef = {
  id: 'css',
  build(f) {
    f.set((s) => {
      s.cursors.em.docId = null;
      s.cursors.thay.docId = null;
    });
    f.openFile({ id: 'style', fileName: 'style.css', lang: 'css', text: '' });
    f.wait(1.5);
    // Dòng 1–2 lần lượt, rồi từng cặp gõ cùng lúc.
    f.type('style', lines[0][0], lines[0][1], { cps: CPS });
    f.wait(0.6);
    f.type('style', lines[1][0], lines[1][1], { cps: CPS });
    f.wait(0.6);
    f.type('style', lines[2][0], lines[2][1], { cps: CPS });
    f.type('style', lines[3][0], lines[3][1], { cps: CPS, with: true });
    f.set((s) => void (s.preview.stage = 'css'));
    f.wait(5);
    f.type('style', lines[4][0], lines[4][1], { cps: CPS });
    f.type('style', lines[5][0], lines[5][1], { cps: CPS, with: true });
    f.wait(7);
  },
};
