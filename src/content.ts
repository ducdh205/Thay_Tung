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

  /** Khung "trình duyệt" xem trước, cảnh 2–4. */
  site: {
    url: 'localhost/website-dau-tay',
    name: 'Website đầu tay',
    heading: 'Xin chào, thế giới của em',
    line: 'Em bắt đầu học code',
    formLabel: 'Lời nhắn',
    formButton: 'Gửi',
  },
  phpRows: ['Trang web đầu tiên của em', 'Đã chạy được PHP rồi!', 'Cảm ơn thầy đã chỉ em từng dòng'],

  card: {
    title: 'Cảm ơn thầy',
    body: [
      'Năm nhất, em chỉ có một màn hình trống và rất nhiều câu hỏi.',
      'Thầy đã cùng em gõ những dòng code đầu tiên, rồi mở cho em cả một con đường.',
      'Mọi điều em làm được hôm nay đều có dấu con trỏ của thầy trong đó.',
    ],
    wish: 'Chúc thầy một ngày 20/11 thật nhiều sức khoẻ và niềm vui.',
    signature: 'Em – [Tên của bạn]',
  },
};
