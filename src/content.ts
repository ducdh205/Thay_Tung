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
  subtitles: ['Năm nhất, em chỉ có một màn hình trống.', 'Mỗi nhánh em đi đều bắt đầu từ thầy.'],

  /** Code được gõ trong từng cảnh. */
  code: {
    s1: {
      question: 'Mình nên học gì?',
      tries: ['<h1>Hello', '\nprint("hi"'],
    },
    s2: {
      thay: '<!DOCTYPE html>\n<html lang="vi">\n<body>\n  <h1>Xin chào, thế giới của em</h1>\n',
      em: '  <p>Em bắt đầu học code</p>\n',
      close: '</body>\n</html>',
    },
    s3: [
      ['thay', 'body {\n'],
      ['em', '  font-family: sans-serif;\n'],
      ['thay', '  margin: 0;\n}\n'],
      ['em', 'h1 {\n'],
      ['thay', '  color: #4F6BFF;\n'],
      ['em', '  font-size: 54px;\n}\n'],
    ] as [CursorId, string][],
    s4: {
      em: '<?php\n$loiNhan = layLoiNhan();\n',
      thay: 'foreach ($loiNhan as $dong) {\n',
      em2: '  echo "<li>$dong</li>";\n}\n?>',
      deploy: ['$ git push', '$ deploy website', '✓ done'],
    },
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
