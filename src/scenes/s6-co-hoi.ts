import type { SceneDef } from '../engine/director';
import { content } from '../content';
import { clearScreen } from './common';

/** Các nhánh cơ hội mọc ra từ nhánh của thầy; rồi những năm tháng xanh dần. */
export const s6: SceneDef = {
  id: 'co-hoi',
  build(f) {
    f.set((s) => {
      clearScreen(s);
      s.overlay = 'gitGraph';
      s.overlayProgress = 0;
    });
    f.tween((s, p) => void (s.overlayProgress = p), 5.4);
    f.set((s) => {
      s.overlay = 'contrib';
      s.overlayProgress = 0;
    });
    f.tween((s, p) => void (s.overlayProgress = p), 4.5);
    f.subtitle(content.subtitles[1], 5.4, { with: true });
  },
};
