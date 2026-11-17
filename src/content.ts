// Mọi chữ hiện trên phim nằm ở đây. Sửa xong chạy `npm run build`.
import type { CursorId } from './engine/store';

export const content = {
  windowTitle: 'hanh-trinh-cua-em',
  cursors: {
    em: { label: 'Em' },
    thay: { label: 'Thầy Tùng' },
    anhTung: { label: 'Anh Tùng' },
    chiTrang: { label: 'Chị Trang' },
  } satisfies Record<CursorId, { label: string }>,
};
