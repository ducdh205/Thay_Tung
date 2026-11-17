# Thiết kế: "Phim" cảm ơn thầy Tùng – 20/11

Ngày: 17/11/2026 · Hạn chiếu: 20/11/2026

## 1. Ý định và lý do

Một trang web chạy như một thước phim ngắn, được chiếu trước lớp hoặc tại buổi lễ 20/11 để cảm ơn thầy Tùng. Phim kể hành trình của một sinh viên:

- năm nhất còn mông lung về nghề và về code,
- được thầy dạy từng chút một (HTML, CSS, PHP) cho đến khi tự xây được một website hoàn chỉnh,
- được thầy đưa ra tiếp xúc công nghệ thực tế, gặp anh Tùng và chị Trang chỉ dẫn,
- được thầy mở ra nhiều cơ hội và những thành công về sau.

Phim kết thúc bằng một tấm thiệp cảm ơn thầy.

**Trọng tâm cảm xúc:** lòng biết ơn thầy. Phim kể **bằng hình ảnh, rất ít lời**.

## 2. Mục tiêu / Không phải mục tiêu / Phản mục tiêu

**Mục tiêu**
- Bấm "Bắt đầu" một lần, phim tự chạy liền mạch đến tấm thiệp cuối, có nhạc nền.
- Màn hình ngang 16:9, chiếu trên máy chiếu hoặc laptop, toàn màn hình.
- Chạy được khi không có mạng.
- Người xem hiểu câu chuyện qua hình ảnh mà gần như không cần đọc chữ.

**Không phải mục tiêu**
- Không dùng ảnh thật (người dùng đã quyết).
- Không cần dùng tốt trên điện thoại hay màn hình dọc.
- Không cần máy chủ, tài khoản hay lưu dữ liệu.
- Không cần tương tác trong lúc phim chạy, ngoài tạm dừng và tiếp tục.

**Phản mục tiêu** (chạy được nhưng vẫn là thất bại)
- Biến thành bài thuyết trình nhiều chữ, đọc như slide.
- Trông như tutorial lập trình khô khan, mất cảm xúc biết ơn.
- Giật, lag, nhạc lệch khỏi hình, hoặc có màn hình trắng, lỗi console ngay trước mặt thầy và cả lớp.
- Phụ thuộc mạng hoặc cần thao tác phức tạp mới mở được trên laptop ở buổi lễ.

## 3. Ràng buộc

- Hoàn thành và chạy thử ổn định trước ngày 20/11 (còn khoảng 3 ngày).
- Mở được bằng cách mở đúp một file trên laptop Windows, chạy trên Chrome hoặc Edge, không cần mạng.
  - Lưu ý kỹ thuật: Chrome chặn script dạng module khi mở qua `file://`. Vì vậy bản build phải gộp hết vào **một file `index.html` duy nhất**, dùng `vite-plugin-singlefile`. Nhạc là file `.mp3` đặt cạnh file đó (thẻ `<audio>` qua `file://` vẫn chạy).
- Font chữ phải nằm sẵn trong bản build, không tải từ Google Fonts.
- Trình duyệt chỉ cho phát nhạc sau một cú click, nên nút "Bắt đầu" vừa bật nhạc vừa vào toàn màn hình.

## 4. Các cách đã cân nhắc

| Cách | Ưu | Nhược |
|---|---|---|
| A. HTML/CSS/JS thuần, GSAP lưu sẵn | Đơn giản nhất, mở đúp là chạy | Code dài sẽ khó tổ chức |
| **B. React + Vite + GSAP** ✅ *người dùng chọn* | Mỗi cảnh là một component, code gọn, dễ sửa từng cảnh | Phải build, phải xử lý chuyện chạy qua `file://` (đã có lời giải ở mục 3) |
| C. Dựng thẳng thành video MP4 | Chiếu ở đâu cũng chạy | Mất chất "code thật chạy", sửa một chữ là xuất lại cả video |

**Đã chọn: B.** Bổ sung thêm phần dự phòng: làm xong thì quay màn hình phim thành MP4 để mang theo phòng khi có sự cố (người dùng tự quay bằng OBS hoặc Xbox Game Bar, mình sẽ hướng dẫn).

## 5. Những gì người dùng đã quyết

- **Cách xem:** chiếu ngang 16:9, bấm "Bắt đầu" rồi tự chạy, có nhạc.
- **Không dùng ảnh.**
- **Phong cách hình ảnh: "A. Trình soạn code"**, dùng xuyên suốt. Giao diện giống VS Code (theme tối, code có tô màu, chữ được gõ ra từng ký tự), có khung xem trước bên phải khi cần. Người dùng đã xem bản phác và chọn kiểu này thay vì kiểu terminal hay kiểu điện ảnh ấm áp.
- **Kể bằng hình ảnh, rất ít lời, nhấn mạnh lòng biết ơn thầy.**
- **Kịch bản 7 cảnh** (người dùng đã đồng ý), với hình ảnh chủ đạo là **con trỏ cộng tác mang tên "Thầy Tùng"** (giống Live Share), xuất hiện và gõ cùng "em":
  1. **Mông lung**: trình soạn code trống, con trỏ nhấp nháy lâu, gõ rồi xoá, lỗi đỏ.
  2. **Thầy đến**: con trỏ "Thầy Tùng" (màu vàng ấm) xuất hiện, gõ khung HTML đầu tiên, khung xem trước hiện trang trắng mộc.
  3. **CSS**: thầy một dòng, em một dòng, khung xem trước nở ra màu sắc và bố cục.
  4. **PHP**: trang chạy thật, form gửi đi, dữ liệu hiện ra, ✓ Deploy thành công.
  5. **Ra thực tế**: thư mục dự án lớn mở ra, terminal chạy `git clone`, cài thư viện. Hai con trỏ "Anh Tùng" và "Chị Trang" tham gia, để lại bình luận review và ✓ Approved.
  6. **Cơ hội**: cây nhánh git mọc ra nhiều nhánh, các ô đóng góp xanh lấp đầy dần qua năm tháng. Con trỏ của thầy vẫn luôn ở đó.
  7. **Cảm ơn**: các con trỏ cùng gõ `cam-on-thay.html`, bấm ▶ Run, khung trình duyệt mở ra tấm thiệp 20/11.
- **Tấm thiệp** được phép ấm và đẹp hơn phần còn lại của phim, làm điểm nhấn cảm xúc, nhưng vẫn hiện ra như kết quả của đoạn code vừa chạy.
- **Chữ trên màn hình** chỉ còn ở tên file, nhãn con trỏ, nội dung code và tấm thiệp. Tối đa khoảng 1–2 câu phụ đề ngắn ở những chỗ cần lắng lại.

## 6. Quyết định của mình (người dùng có thể sửa)

- **Độ dài:** khoảng 3–4 phút.
- **Tên ký và lời thiệp:** để chữ mẫu, gom vào **một file cấu hình** (ví dụ `src/content.ts`) gồm tên người ký, lời cảm ơn, tên các con trỏ và câu phụ đề, để người dùng sửa mà không phải đụng vào code cảnh. Mình viết sẵn một lời cảm ơn ngắn, chân thành.
- **Nhạc:** người dùng tự chọn bài, đặt file `music.mp3` cạnh `index.html`. Thiếu file thì phim vẫn chạy bình thường, không báo lỗi. Cảnh cuối nhạc nhỏ dần.
- **Điều khiển khi chiếu:** `Space` để tạm dừng hoặc tiếp tục (cả nhạc lẫn hình), `F` để vào hoặc ra toàn màn hình. Hết phim thì giữ tấm thiệp trên màn hình và có nút nhỏ "Xem lại".
- **Con trỏ chuột** ẩn khi phim chạy.
- **Khung hình:** dựng trên kích thước cố định 1920×1080 rồi co giãn cho vừa màn hình, thừa chỗ thì thêm viền đen. Máy chiếu độ phân giải nào cũng giữ đúng bố cục.
- **Màu nhận diện con trỏ:** "Em" màu xanh dương, "Thầy Tùng" màu vàng ấm (màu của sự dẫn dắt, dùng lại ở tấm thiệp), "Anh Tùng" và "Chị Trang" mỗi người một màu riêng, dễ phân biệt.

## 7. Để lại cho người làm

- Cấu trúc thư mục, cách chia component và cách tổ chức timeline GSAP (gợi ý: một master timeline, mỗi cảnh trả về một timeline con).
- Hiệu ứng gõ phím, tô màu cú pháp (tự viết đơn giản hoặc dùng thư viện nhẹ), và hiệu ứng chuyển cảnh.
- Thời lượng chính xác của từng cảnh, nằm trong tổng 3–4 phút. Nhịp phải đủ chậm để người ngồi xa màn chiếu kịp nhìn.
- Font monospace (gợi ý: JetBrains Mono qua `@fontsource`, gộp sẵn vào bản build).
- Thiết kế cụ thể của tấm thiệp, trong khuôn khổ mục 5 và 6.
- Một cách tua nhanh hoặc nhảy thẳng tới một cảnh khi phát triển (ví dụ `?scene=5`), để thử từng cảnh mà không phải xem lại từ đầu.

## 8. Tiêu chí hoàn thành

- `npm run build` ra một file `dist/index.html`. Mở đúp file đó trên Chrome hoặc Edge, khi đã tắt mạng, phim chạy từ đầu đến cuối không lỗi console.
- Có và không có `music.mp3` đều chạy được.
- Ở 1920×1080 và 1366×768, phim không giật thấy rõ và bố cục giữ đúng.
- Người dùng xem trọn một lượt và duyệt.
