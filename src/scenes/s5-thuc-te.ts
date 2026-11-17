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
    });
    f.wait(1);
    f.set((s) => void (s.terminal = { visible: true, lines: [] }));
    for (const line of c.terminal) {
      f.set((s) => void s.terminal.lines.push(line));
      f.wait(0.9);
    }
    f.openFile({ id: DOC, fileName: c.fileName, lang: 'php', text: '' });
    f.type(DOC, 'thay', c.head, { cps: 20 });
    f.wait(0.8);
    f.type(DOC, 'em', c.first + c.naive, { cps: 16 });
    f.showCursor('anhTung', DOC, true, LINE_NAIVE - 1); // on the brace above the line he reviews
    f.wait(1);
    f.set((s) => void (s.comments = [{ docId: DOC, line: LINE_NAIVE, author: 'anhTung', text: c.reviewAnhTung }]));
    f.wait(3);
    f.erase(DOC, c.naive.length, { cps: 30 });
    f.type(DOC, 'em', c.fixed, { cps: 18 });
    f.set((s) => void (s.comments = []));
    f.showCursor('chiTrang', DOC, true, LINE_SIGNATURE);
    f.wait(1);
    f.set((s) => void (s.comments = [{ docId: DOC, line: LINE_SIGNATURE, author: 'chiTrang', text: c.reviewChiTrang, approved: true }]));
    f.wait(5);
  },
};
