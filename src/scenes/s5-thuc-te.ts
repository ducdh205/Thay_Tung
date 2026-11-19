import type { SceneDef } from '../engine/director';
import { content } from '../content';
import { clearScreen } from './common';

const c = content.s5;
const DOC = 'controller';
const LINE_SIGNATURE = 3; // "public function store(...)"
const LINE_NAIVE = 5;

/** Dự án thật: clone, cài đặt; anh Tùng review, em sửa, chị Trang duyệt. Thầy vẫn ở đó. */
export const s5: SceneDef = {
  id: 'thuc-te',
  build(f) {
    f.set((s) => {
      clearScreen(s);
      s.explorer = { visible: true, items: [...content.explorerItems] };
      s.terminal = { visible: true, lines: [] };
    });
    for (const line of c.terminal) {
      f.wait(0.2);
      f.set((s) => void s.terminal.lines.push(line));
    }
    f.openFile({ id: DOC, fileName: c.fileName, lang: 'php', text: '' });
    f.type(DOC, 'thay', c.head, { cps: 40 });
    f.type(DOC, 'em', c.first + c.naive, { cps: 50 });
    f.showCursor('anhTung', DOC, true, LINE_NAIVE - 1); // on the brace above the line he reviews
    f.set((s) => void (s.comments = [{ docId: DOC, line: LINE_NAIVE, author: 'anhTung', text: c.reviewAnhTung }]));
    f.wait(1.8);
    f.erase(DOC, c.naive.length, { cps: 75 });
    f.type(DOC, 'em', c.fixed, { cps: 60 });
    f.set((s) => void (s.comments = []));
    f.showCursor('chiTrang', DOC, true, LINE_SIGNATURE);
    f.set((s) => void (s.comments = [{ docId: DOC, line: LINE_SIGNATURE, author: 'chiTrang', text: c.reviewChiTrang, approved: true }]));
    f.wait(1.8);
  },
};
