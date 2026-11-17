import type { SceneDef } from '../engine/director';
import { content } from '../content';

const code = content.code.s4;
const ROWS = content.phpRows.length;

/** PHP làm trang "sống" dậy, rồi deploy thành công. */
export const s4: SceneDef = {
  id: 'php',
  build(f) {
    f.openFile({ id: 'php', fileName: 'website.php', lang: 'php', text: '' });
    f.wait(1.2);
    f.type('php', 'em', code.em, { cps: 10 });
    f.wait(0.6);
    f.type('php', 'thay', code.thay, { cps: 10 });
    f.wait(0.6);
    f.type('php', 'em', code.em2, { cps: 10 });
    f.set((s) => {
      s.preview.stage = 'php';
      s.preview.phpRows = 0;
    });
    f.wait(1.5);
    f.tween((s, p) => void (s.preview.phpRows = Math.min(ROWS, Math.floor(p * ROWS))), 3);
    f.wait(1.5);
    f.set((s) => void (s.terminal = { visible: true, lines: [] }));
    for (const line of code.deploy) {
      f.set((s) => void s.terminal.lines.push(line));
      f.wait(1.2);
    }
    f.set((s) => void (s.preview.deployed = true));
    f.wait(4);
  },
};
