export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CODE_FONT_PX = 30;
export const CODE_FONT = "'JetBrains Mono', Consolas, 'Courier New', monospace";

export const COLORS = {
  bg: '#1e1e2e',
  bgDark: '#181825',
  bgPanel: '#11111b',
  text: '#cdd6f4',
  dim: '#585b70',
  border: '#313244',
  error: '#f38ba8',
  ok: '#a6e3a1',
  tok: {
    tag: '#89b4fa',
    attr: '#f9e2af',
    string: '#a6e3a1',
    keyword: '#cba6f7',
    variable: '#f5c2e7',
    comment: '#6c7086',
    punct: '#9399b2',
    prop: '#89dceb',
    value: '#fab387',
    plain: '#cdd6f4',
  },
  cursor: {
    em: '#4FA3FF',
    thay: '#F5B841',
    anhTung: '#4ADE80',
    chiTrang: '#F472B6',
  },
} as const;
