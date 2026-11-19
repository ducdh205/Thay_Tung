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
    heading: 'Hello world',
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
      thay: '<!DOCTYPE html>\n<html lang="vi">\n<body>\n  <h1>Hello world</h1>\n',
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

  /** Cảnh 5: dự án thực tế. */
  explorerItems: [
    'du-an-thuc-te/',
    '  app/',
    '    Http/Controllers/',
    '      OrderController.php',
    '    Models/',
    '  routes/',
    '    api.php',
    '  tests/',
    '  composer.json',
    '  .env.example',
  ],
  s5: {
    fileName: 'OrderController.php',
    terminal: ['$ git clone git@cong-ty:du-an-thuc-te.git', 'Cloning into du-an-thuc-te... 100%', '$ composer install', 'Installing 84 packages...', '✓ ready'],
    head: '<?php\n\n',
    first: 'public function store(Request $request)\n{\n',
    naive: '    $order = Order::create($request->all());\n',
    fixed: "    $data = $request->validate(['name' => 'required']);\n    $order = Order::create($data);\n    return response()->json($order);\n}",
    reviewAnhTung: 'Validate dữ liệu trước nhé em',
    reviewChiTrang: 'Code sạch rồi, merge thôi!',
  },

  /** Cảnh 7: cả bốn con trỏ cùng gõ tấm thiệp, rồi bấm Run. */
  s7: {
    fileName: 'cam-on-thay.html',
    open: '<!DOCTYPE html>\n<html lang="vi">\n<body>\n',
    together: [
      ['em', '  <h1>Cảm ơn thầy</h1>\n'],
      ['anhTung', '  <p>vì đã dẫn đường</p>\n'],
      ['chiTrang', '  <p>vì đã tin em</p>\n'],
    ] as [CursorId, string][],
    close: '</body>\n</html>',
    run: '▶ Run',
  },

  /** Cảnh 6: các nhánh git (cơ hội) mọc ra từ nhánh của thầy. */
  branches: ['thuc-tap', 'du-an-dau-tien', 'freelance', 'cuoc-thi', 'cong-viec-moi'],
  mainBranch: 'main',
  contribYears: ['Năm nhất', 'Năm hai', 'Năm ba', 'Năm tư'],

  phpRows: ['Trang web đầu tiên của em', 'Đã chạy được PHP rồi!', 'Cảm ơn thầy đã chỉ em từng dòng'],

  /** Tấm thiệp cuối phim: tranh lớp học bên trái, tờ giấy viết tay bên phải. */
  card: {
    kicker: 'Tri ân',
    title: 'Thầy Tùng',
    wish:
      'Chúc thầy luôn dồi dào sức khoẻ, niềm vui và hạnh phúc. Cảm ơn thầy đã cùng chúng em gõ những dòng code đầu tiên, ' +
      'kiên nhẫn gỡ từng con bug và mở lối cho chúng em trên hành trình trở thành những kỹ sư công nghệ.',
    footer: 'Chúc mừng ngày 20 tháng 11',
    signature: 'Đức, Trang, Tùng, Phương, Thơm',
    /** Tên trên thẻ đeo của từng người trong tranh (thứ tự khớp vị trí trong CardPreview). */
    teacher: 'Thầy Tùng',
    students: ['Đức', 'Trang', 'Tùng', 'Phương', 'Thơm'],
    /** Code tự gõ trên màn hình lớn trong tranh. */
    screen: {
      fileName: 'tri-an.js',
      lines: [
        'const thay = new GiangVien("Tùng");',
        'lopCNTT.forEach(thay.truyenLua);',
        '// Hôm nay là 20/11',
        'console.log("Cảm ơn thầy!");',
      ],
    },
  },
};
