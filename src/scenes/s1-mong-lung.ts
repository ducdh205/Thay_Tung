import type { SceneDef } from '../engine/director';
import { content } from '../content';
import { clearScreen } from './common';

const { question, tries } = content.code.s1;

/** Năm nhất: màn hình trống, gõ rồi xoá, lỗi đỏ. */
export const s1: SceneDef = {
  id: 'mong-lung',
  build(f) {
    f.set(clearScreen);
    f.openFile({ id: 'nam-nhat', fileName: 'nam-nhat.txt', lang: 'text', text: '' });
    f.showCursor('em', 'nam-nhat');
    f.wait(0.9);
    f.type('nam-nhat', 'em', question, { cps: 12 });
    f.wait(0.6);
    f.erase('nam-nhat', question.length, { cps: 30 });
    for (const t of tries) f.type('nam-nhat', 'em', t, { cps: 15 });
    f.set((s) => void (s.docs['nam-nhat'].errorLines = [1, 2]));
    f.wait(0.9);
    f.erase('nam-nhat', tries.join('').length, { cps: 37 });
    f.set((s) => void (s.docs['nam-nhat'].errorLines = []));
    f.subtitle(content.subtitles[0], 5);
  },
};
