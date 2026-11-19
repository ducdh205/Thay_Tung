# Phim cảm ơn thầy Tùng – 20/11

Một "thước phim" khoảng 1 phút, chạy trong trình duyệt. Phim kể hành trình từ năm nhất đến hôm nay, và kết thúc bằng tấm thiệp cảm ơn thầy.

## Chiếu phim

1. Chép **`dist/index.html`** và **`music.mp3`** vào cùng một thư mục (chép thẳng ra USB hoặc Desktop cũng được).
2. Mở đúp `index.html` bằng **Edge** hoặc **Chrome**. Không cần mạng.
3. Bấm **▶ Bắt đầu**. Phim tự vào toàn màn hình và chạy đến hết.

| Phím | Tác dụng |
|---|---|
| `Space` | Tạm dừng / chạy tiếp (cả hình lẫn nhạc) |
| `F` | Bật / tắt toàn màn hình |
| `Esc` | Thoát toàn màn hình (phim vẫn chạy) |

Hết phim, tấm thiệp vẫn giữ trên màn hình. Góc dưới bên phải có nút nhỏ **↻ Xem lại**.

> **Thử trước buổi lễ:** tắt wifi, mở file trên đúng laptop sẽ dùng, rồi xem trọn một lượt có nhạc.

## Nhạc nền

- Đặt file nhạc tên **`music.mp3`** cạnh `index.html` khi chiếu (khi phát triển thì đặt ở `public/music.mp3`).
- Nhạc bắt đầu cùng lúc với phim và nhỏ dần trong 5 giây cuối.
- Thiếu file nhạc thì phim vẫn chạy bình thường, chỉ là không có tiếng.

## Sửa chữ (tên ký, lời thiệp, phụ đề…)

Mọi chữ hiện trên phim nằm trong **`src/content.ts`**:

- `card.signature`: tên ký cuối thiệp
- `card.kicker`, `card.title`, `card.wish`, `card.footer`: chữ trên tờ giấy của thiệp
- `card.teacher`, `card.students`: tên trên thẻ đeo của 6 nhân vật trong tranh
- `card.screen`: đoạn code tự gõ trên màn hình trong tranh
- `subtitles`: 2 câu phụ đề
- `cursors`: tên trên các con trỏ (Em, Thầy Tùng, Anh Tùng, Chị Trang)
- `branches`: tên các nhánh "cơ hội" ở cảnh 6
- `code`, `s5`, `s7`: những đoạn code được gõ trong phim

Sửa xong thì build lại:

```bash
npm install      # chỉ cần chạy lần đầu
npm run build    # tạo ra dist/index.html mới
```

## Quay video MP4 dự phòng

Phòng khi laptop ở buổi lễ có vấn đề, bạn nên quay sẵn một bản video:

- **Xbox Game Bar** (có sẵn trên Windows): mở phim, bấm Bắt đầu, nhấn `Win + Alt + R` để bắt đầu quay. Hết phim nhấn lại `Win + Alt + R`. Video lưu ở `Video\Captures`.
- **OBS Studio**: tạo nguồn *Display Capture* và bật *Desktop Audio*, bấm *Start Recording* trước khi bấm Bắt đầu.

## Dành cho người phát triển

```bash
npm run dev          # chạy thử; thêm ?scene=5 để nhảy tới cảnh 5, ?speed=4 để tua nhanh 4 lần (tắt nhạc)
npm test             # unit test (Vitest)
npm run e2e          # build rồi chạy bản dist/index.html qua file:// trên Edge (Playwright)
```

Cấu trúc thư mục:
- `src/engine/` chứa dòng thời gian (GSAP), trạng thái màn hình, nhạc và phím tắt
- `src/scenes/` chứa 7 cảnh phim
- `src/ui/` chứa giao diện trình soạn code, khung trình duyệt, tấm thiệp
- Thiết kế và kế hoạch nằm trong `docs/superpowers/`
