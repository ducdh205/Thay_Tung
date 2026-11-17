# Phim cảm ơn thầy Tùng – Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Một trang web React chạy như thước phim 3–4 phút trong giao diện trình soạn code, kể hành trình được thầy Tùng dẫn dắt, kết bằng thiệp 20/11. Bản build là một file `index.html` duy nhất, mở đúp chạy offline.

**Architecture:** Một `FilmStore` nhỏ giữ toàn bộ trạng thái màn hình (file đang mở, số ký tự đã gõ, con trỏ, preview, terminal…). Một master timeline GSAP điều khiển store qua bộ "động từ đạo diễn" (`FilmApi`: `type`, `openFile`, `wait`…). Mỗi cảnh là một hàm `build(film)` dùng các động từ đó. React chỉ render từ store qua `useSyncExternalStore`, toàn bộ nhịp phim nằm trong timeline.

**Tech Stack:** Vite 5, React 18, TypeScript, GSAP 3, vite-plugin-singlefile, @fontsource/jetbrains-mono, Vitest + jsdom + @testing-library/react, Playwright (dùng Edge có sẵn trên máy, không tải trình duyệt).

**Spec:** [docs/superpowers/specs/2026-11-17-phim-cam-on-thay-design.md](../specs/2026-11-17-phim-cam-on-thay-design.md)

## Global Constraints

- Sân khấu cố định **1920×1080**, co giãn vừa màn hình, thừa chỗ thì viền đen (letterbox).
- `npm run build` → **một file** `dist/index.html`, mọi JS, CSS và font nằm inline. Không có URL ngoài (không CDN, không Google Fonts).
- Nhạc: `music.mp3` đặt **cạnh** `index.html` (khi dev thì để trong `public/`). Thiếu file thì phim vẫn chạy im lặng, không lỗi console.
- Không dùng ảnh. Chữ trên màn hình chỉ có ở tên file, nhãn con trỏ, nội dung code, tối đa **2** câu phụ đề, và tấm thiệp.
- Mọi chữ người dùng có thể muốn sửa đều nằm trong `src/content.ts`.
- Font code: JetBrains Mono, cỡ chữ code **≥ 28px** trên sân khấu 1920 (đọc được từ cuối lớp).
- Màu con trỏ: Em `#4FA3FF`, Thầy Tùng `#F5B841`, Anh Tùng `#4ADE80`, Chị Trang `#F472B6`. Nền editor `#1e1e2e`, chữ `#cdd6f4`.
- Phím: `Space` tạm dừng/tiếp tục (cả hình lẫn nhạc), `F` bật/tắt toàn màn hình. Ẩn con trỏ chuột khi phim chạy.
- Tổng thời lượng **180–240s**.
- Tham số URL chỉ dùng khi dev và test: `?scene=N` (bắt đầu từ cảnh N, đếm từ 1), `?speed=K` (timeScale K).
- Thư mục chưa phải git repo. Bước "Commit" chỉ làm nếu người dùng đã bật git, nếu chưa thì bỏ qua.
- Giao diện, lời thiệp và phụ đề viết bằng tiếng Việt có dấu.

## Review Focus

1. **Thiếu `music.mp3` hoặc `audio.play()` bị từ chối** → phim vẫn chạy hết, không có unhandled rejection. (Test ở Task 6 và Task 9.)
2. **Mở `dist/index.html` qua `file://` khi tắt mạng** → chạy đủ, font đúng, không request ra ngoài. (Test ở Task 9.)
3. **Tạm dừng bằng Space giữa lúc đang gõ rồi chạy tiếp, hoặc tab bị ẩn rồi hiện lại** → nhạc khớp lại với hình (`audio.currentTime` được đặt lại theo `master.time()`). (Test ở Task 6.)
4. **Bấm Esc thoát toàn màn hình hoặc đổi cỡ cửa sổ giữa phim** → phim vẫn chạy, sân khấu tự co giãn lại. (Test ở Task 1 và Task 6.)
5. **Bấm "Bắt đầu" hai lần, hoặc nhấn Space trước khi bắt đầu** → chỉ có một timeline và một luồng nhạc. Space trước khi bắt đầu không làm gì. (Test ở Task 6.)

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json, index.html, playwright.config.ts
public/                      # music.mp3 do người dùng thêm (không commit)
src/
  main.tsx                   # mount <App/>
  App.tsx                    # Start screen → Stage(Editor) → end/replay
  content.ts                 # MỌI chữ người dùng sửa được
  theme.ts                   # màu, font size, kích thước sân khấu
  engine/
    stage.ts                 # computeStageFit()
    params.ts                # parseParams()
    highlight.ts             # tokenize(), sliceTokens()
    store.ts                 # FilmState, createFilmStore()
    film.ts                  # FilmApi (động từ đạo diễn) trên GSAP timeline
    director.ts              # buildMaster(), sceneStarts
    audio.ts                 # createMusic()
    controls.ts              # attachControls()
  ui/
    Stage.tsx                # khung 1920×1080 co giãn
    Editor.tsx               # titlebar, explorer, tabs, layout tách preview/terminal
    CodePane.tsx             # số dòng, token, con trỏ cộng tác, gạch lỗi, comment review
    Terminal.tsx
    Preview.tsx              # khung "trình duyệt": blank|html|css|php|card
    CardPreview.tsx          # tấm thiệp 20/11
    GitGraph.tsx             # cảnh 6
    ContribGrid.tsx          # cảnh 6
    Subtitle.tsx
    StartScreen.tsx, EndOverlay.tsx
  scenes/
    index.ts                 # SCENES: SceneDef[] theo thứ tự
    s1-mong-lung.ts … s7-cam-on.ts
tests/unit/*.test.ts(x)      # Vitest
tests/e2e/film.spec.ts       # Playwright trên dist/index.html qua file://
README.md                    # cách chiếu, sửa chữ, thêm nhạc, quay MP4 dự phòng
```

---

### Task 1: Khung dự án, sân khấu co giãn, build ra một file

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/theme.ts`, `src/engine/stage.ts`, `src/ui/Stage.tsx`
- Test: `tests/unit/stage.test.ts`

**Interfaces:**
- Produces: `computeStageFit(vw: number, vh: number): { scale: number; x: number; y: number }`. Giá trị dùng cho `transform: translate(x,y) scale(scale)` của khung 1920×1080.
- Produces: `<Stage>{children}</Stage>`. Lắng nghe `resize` và `fullscreenchange`, tính lại kích thước.
- Produces: `theme.ts` exports `STAGE_W = 1920`, `STAGE_H = 1080`, `COLORS`, `CODE_FONT_PX = 30`.

- [ ] **Step 1: Khởi tạo Vite React-TS** trong `e:\ThayTung` (thư mục đã có `docs/` và `.superpowers/`). Cài với version cố định: `react@18.3.1 react-dom@18.3.1 gsap@3.12.5 @fontsource/jetbrains-mono@5.1.1`, dev: `vite@5.4.11 @vitejs/plugin-react@4.3.4 typescript@5.6.3 vite-plugin-singlefile@2.0.3 vitest@2.1.8 jsdom@25.0.1 @testing-library/react@16.1.0 @playwright/test@1.49.1`. Cài với `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`. Scripts: `dev`, `build`, `test` (vitest run), `e2e` (playwright test). Thêm `.superpowers/`, `node_modules/`, `dist/`, `public/music.mp3` vào `.gitignore`.
- [ ] **Step 2: Cấu hình `vite.config.ts`**: `base: './'`, plugins `[react(), viteSingleFile()]`, `test: { environment: 'jsdom' }`.
- [ ] **Step 3: Viết test lỗi** `tests/unit/stage.test.ts`:

```ts
expect(computeStageFit(1920,1080)).toEqual({ scale: 1, x: 0, y: 0 });
expect(computeStageFit(1366,768).scale).toBeCloseTo(0.7111, 3);   // giới hạn theo chiều cao (1366/1920=0.7115 > 768/1080=0.7111)
const r = computeStageFit(1280,1024);                               // màn 5:4 → viền trên/dưới
expect(r.scale).toBeCloseTo(0.6667,3); expect(r.x).toBe(0); expect(r.y).toBeCloseTo(152,0);
const w = computeStageFit(2560,1080);                               // màn siêu rộng → viền trái/phải
expect(w.scale).toBe(1); expect(w.x).toBe(320); expect(w.y).toBe(0);
```

- [ ] **Step 4: Chạy `npm test`**, kỳ vọng FAIL (chưa có hàm).
- [ ] **Step 5: Viết `computeStageFit`** (`scale = min(vw/1920, vh/1080)`, căn giữa), cùng `Stage.tsx`. `App.tsx` tạm thời hiển thị chữ "Bắt đầu" trên nền đen. Body nền `#000`, `overflow:hidden`.
- [ ] **Step 6: Chạy `npm test`**, kỳ vọng PASS. Chạy `npm run build` và kiểm tra `dist/` **chỉ có** `index.html` (cùng nội dung `public/` nếu có). Mở đúp file đó trong Edge: chữ "Bắt đầu" hiện ra, không lỗi console.
- [ ] **Step 7: Commit** `feat: scaffold vite react singlefile + stage fit`.

### Task 2: Tô màu cú pháp

**Files:**
- Create: `src/engine/highlight.ts`
- Test: `tests/unit/highlight.test.ts`

**Interfaces:**
- Produces: `type Lang = 'html'|'css'|'php'|'shell'|'text'`; `type TokenKind = 'tag'|'attr'|'string'|'keyword'|'variable'|'comment'|'punct'|'prop'|'value'|'plain'`; `interface Token { text: string; kind: TokenKind }`.
- Produces: `tokenize(code: string, lang: Lang): Token[]`. Ghép `text` của mọi token phải ra đúng `code` ban đầu.
- Produces: `sliceTokens(tokens: Token[], n: number): Token[]`. Trả về n ký tự đầu, cắt ngang token nếu cần.

- [ ] **Step 1: Viết test lỗi**:

```ts
const t = tokenize('<h1 class="x">Hi</h1>', 'html');
expect(t.map(x=>x.text).join('')).toBe('<h1 class="x">Hi</h1>');
expect(t.find(x=>x.text==='class')?.kind).toBe('attr');
expect(t.find(x=>x.text==='"x"')?.kind).toBe('string');
expect(tokenize('<!-- a -->','html')[0].kind).toBe('comment');
expect(tokenize('color: #fff;','css').find(x=>x.text==='color')?.kind).toBe('prop');
expect(tokenize('<?php echo $name; ?>','php').find(x=>x.text==='$name')?.kind).toBe('variable');
expect(tokenize('<?php echo $name; ?>','php').find(x=>x.text==='echo')?.kind).toBe('keyword');
expect(sliceTokens(tokenize('<p>ab</p>','html'), 4).map(x=>x.text).join('')).toBe('<p>a');
expect(sliceTokens(t, 0)).toEqual([]);
expect(sliceTokens(t, 999).map(x=>x.text).join('')).toBe('<h1 class="x">Hi</h1>');
```

- [ ] **Step 2: Chạy**, kỳ vọng FAIL.
- [ ] **Step 3: Viết `tokenize`** bằng regex lần lượt theo từng ngôn ngữ (không dùng thư viện). Chỉ cần đủ cho các đoạn code trong phim, không cần đầy đủ cú pháp. Viết `sliceTokens`.
- [ ] **Step 4: Chạy**, kỳ vọng PASS.
- [ ] **Step 5: Commit** `feat: minimal syntax highlighter`.

### Task 3: Store, động từ đạo diễn, master timeline, tham số URL

**Files:**
- Create: `src/engine/store.ts`, `src/engine/film.ts`, `src/engine/director.ts`, `src/engine/params.ts`
- Test: `tests/unit/film.test.ts`, `tests/unit/params.test.ts`

**Interfaces:**
- Produces (`store.ts`):

```ts
type CursorId = 'em'|'thay'|'anhTung'|'chiTrang';
interface Doc { id: string; fileName: string; lang: Lang; text: string; typed: number; errorLines: number[] }
interface CursorState { id: CursorId; docId: string|null; visible: boolean }   // vị trí = cuối phần đã gõ của doc, trừ khi offset được đặt
interface ReviewComment { docId: string; line: number; author: CursorId; text: string; approved?: boolean }
type PreviewStage = 'blank'|'html'|'css'|'php'|'card';
type Overlay = 'none'|'gitGraph'|'contrib';
interface FilmState {
  docs: Record<string, Doc>; tabs: string[]; activeDoc: string|null;
  explorer: { visible: boolean; items: string[] };
  cursors: Record<CursorId, CursorState>;
  preview: { visible: boolean; stage: PreviewStage; phpRows: number; deployed: boolean; runPressed: boolean };
  terminal: { visible: boolean; lines: string[] };
  comments: ReviewComment[];
  overlay: Overlay; overlayProgress: number;          // 0..1 cho GitGraph/ContribGrid
  subtitle: string|null; fade: number;                // fade 0..1 phủ đen chuyển cảnh
}
createFilmStore(): { get(): FilmState; patch(fn: (s: FilmState)=>void): void; subscribe(cb: ()=>void): ()=>void; reset(): void }
initialState(): FilmState
```

- Produces (`film.ts`): `createFilm(store, tl: gsap.core.Timeline): FilmApi`. Mỗi động từ **nối tiếp vào cuối** timeline, trừ khi truyền `{ with: true }` (chạy song song với động từ trước đó, dùng label nội bộ).

```ts
interface FilmApi {
  openFile(doc: Omit<Doc,'typed'|'errorLines'>): void;      // thêm tab, đặt active
  type(docId: string, cursor: CursorId, text: string, o?: { cps?: number; with?: boolean }): void; // nối text vào doc.text, tween typed
  erase(docId: string, count: number, o?: { cps?: number }): void;
  showCursor(id: CursorId, docId: string|null, visible?: boolean): void;
  set(fn: (s: FilmState)=>void): void;                       // thay đổi rời rạc, xảy ra tại thời điểm hiện tại
  tween(fn: (s: FilmState, p: number)=>void, dur: number, o?: { with?: boolean }): void; // p 0→1 tuyến tính
  wait(sec: number): void;
  subtitle(text: string, holdSec: number): void;             // hiện, giữ, ẩn
  fadeOut(sec: number): void; fadeIn(sec: number): void;
  now(): number;
}
```

  Quy tắc gõ: `cps` mặc định 14. Thời lượng = `len/cps`. `typed` tween tuyến tính và làm tròn xuống. **Mọi thay đổi trạng thái phải tái lập đúng khi seek.** Dùng `tl.call` cho `set`, và khi seek luôn gọi `tl.seek(t, false)` để callback không bị bỏ qua. Riêng `type` cần cập nhật `doc.text` ngay khi bắt đầu đoạn gõ.
- Produces (`director.ts`): `interface SceneDef { id: string; build(film: FilmApi): void }`; `buildMaster(scenes: SceneDef[], store): { tl: gsap.core.Timeline; sceneStarts: number[]; duration: number }`. Timeline tạo ở trạng thái `paused`. Mỗi cảnh bắt đầu sau `fadeIn(0.6)` và kết thúc bằng `fadeOut(0.6)`, riêng cảnh cuối không fadeOut.
- Produces (`params.ts`): `parseParams(search: string): { scene: number; speed: number }`. Mặc định `{scene:1, speed:1}`. Giá trị không hợp lệ thì quay về mặc định, `scene` bị kẹp trong `[1, 7]`.

- [ ] **Step 1: Viết test lỗi** `params.test.ts`: `parseParams('')`→`{scene:1,speed:1}`; `'?scene=5&speed=20'`→`{scene:5,speed:20}`; `'?scene=abc'`→scene 1; `'?scene=99'`→scene 7; `'?speed=0'`→speed 1.
- [ ] **Step 2: Viết test lỗi** `film.test.ts` (môi trường node, GSAP chạy được trên object thường):

```ts
// openFile + type
const store = createFilmStore(); const tl = gsap.timeline({ paused: true }); const f = createFilm(store, tl);
f.openFile({ id:'a', fileName:'index.html', lang:'html', text:'' });
f.type('a','thay','<h1>Hi</h1>',{ cps:10 });            // 11 ký tự → 1.1s
expect(tl.duration()).toBeCloseTo(1.1, 2);
tl.seek(0.55,false); expect(store.get().docs.a.typed).toBe(5);
tl.seek(1.1,false);  expect(store.get().docs.a.typed).toBe(11);
expect(store.get().activeDoc).toBe('a'); expect(store.get().cursors.thay.docId).toBe('a');
// with: true chạy song song
f.type('a','em','x',{cps:1}); f.type('a','thay','y',{cps:1,with:true});
expect(tl.duration()).toBeCloseTo(2.1, 2);
// erase
f.erase('a', 3, { cps: 10 }); tl.seek(tl.duration(), false);
expect(store.get().docs.a.text).toBe('<h1>Hi</h1>xy'.slice(0, 10));   // 13 ký tự - 3
expect(store.get().docs.a.typed).toBe(10);
// subtitle
f.subtitle('Năm nhất', 2); const t0 = f.now() - 2; tl.seek(t0 + 1, false);
expect(store.get().subtitle).toBe('Năm nhất'); tl.seek(tl.duration(), false); expect(store.get().subtitle).toBeNull();
// buildMaster
const m = buildMaster([{id:'x',build:f=>f.wait(2)},{id:'y',build:f=>f.wait(3)}], createFilmStore());
expect(m.sceneStarts).toEqual([0, 3.2]);   // 0.6 + 2 + 0.6
expect(m.duration).toBeCloseTo(3.2 + 0.6 + 3, 2);
```

- [ ] **Step 3: Chạy**, kỳ vọng FAIL.
- [ ] **Step 4: Viết** `store.ts`, `film.ts`, `director.ts`, `params.ts` theo đúng interface ở trên.
- [ ] **Step 5: Chạy**, kỳ vọng PASS.
- [ ] **Step 6: Commit** `feat: film store, director verbs, master timeline`.

### Task 4: Giao diện trình soạn code

**Files:**
- Create: `src/ui/Editor.tsx`, `src/ui/CodePane.tsx`, `src/ui/Terminal.tsx`, `src/ui/Subtitle.tsx`, `src/ui/useFilm.ts` (hook `useFilmState(store)` dùng `useSyncExternalStore`)
- Test: `tests/unit/editor.test.tsx`

**Interfaces:**
- Consumes: `FilmState`, `createFilmStore`, `tokenize`, `sliceTokens`, `COLORS`, `CODE_FONT_PX`.
- Produces: `<Editor store={store} />`. Render toàn bộ màn hình phim (trừ Preview, GitGraph, ContribGrid, sẽ gắn ở Task 5 và Task 8 qua các slot `previewSlot` và `overlaySlot`).
  - Bố cục: thanh tiêu đề có 3 chấm, explorer bên trái (ẩn hoặc hiện), dãy tab, CodePane. Khi `preview.visible` thì CodePane chiếm 50% chiều rộng, preview chiếm 50%. Terminal nằm dưới, cao 30% khi `visible`.
  - CodePane: số dòng màu `#585b70`, token tô màu theo kind, `errorLines` có gạch sóng đỏ. Mỗi con trỏ hiển thị là một vạch dọc màu riêng nhấp nháy, phía trên có nhãn tên (lấy từ `content.cursors[id].label`) nền cùng màu. Comment review hiện như khung bên phải dòng tương ứng, có viền màu tác giả, nếu `approved` thì có dấu "✓ Approved".
  - Subtitle: chữ trắng 40px, đặt ở đáy sân khấu, có bóng chữ, hiện và ẩn bằng opacity.
  - Lớp `fade`: div đen phủ toàn sân khấu, `opacity = state.fade`.

- [ ] **Step 1: Viết test lỗi** bằng `@testing-library/react`: tạo store, patch một doc `text:'<h1>Hi</h1>', typed:4` và con trỏ `thay` hiển thị trên doc đó, render `<Editor>`. Kỳ vọng: trong code pane có đúng chuỗi `<h1>`, không có `Hi`; tìm thấy nhãn `Thầy Tùng`; tab `index.html` có mặt. Patch `errorLines:[1]`, kỳ vọng phần tử `[data-error-line="1"]` tồn tại. Patch `subtitle:'X'`, kỳ vọng tìm thấy `X`. Patch `comments:[{…approved:true}]`, kỳ vọng tìm thấy `✓ Approved`.
- [ ] **Step 2: Chạy**, kỳ vọng FAIL.
- [ ] **Step 3: Viết** các component. Có thể thêm `src/content.ts` sơ bộ với `cursors`, phần chữ khác sẽ hoàn thiện ở Task 9.
- [ ] **Step 4: Chạy**, kỳ vọng PASS. Chạy `npm run dev` với một cảnh tạm trong `App.tsx` (gõ 3 dòng HTML) để xem bằng mắt: chữ nét, con trỏ có nhãn, đọc được ở 50% zoom.
- [ ] **Step 5: Commit** `feat: editor ui`.

### Task 5: Khung trình duyệt xem trước và tấm thiệp

**Files:**
- Create: `src/ui/Preview.tsx`, `src/ui/CardPreview.tsx`
- Modify: `src/ui/Editor.tsx` (gắn Preview vào `previewSlot`)
- Test: `tests/unit/preview.test.tsx`

**Interfaces:**
- Consumes: `FilmState.preview`, `content.card`.
- Produces: `<Preview state={FilmState['preview']} />`. Khung trình duyệt có thanh địa chỉ `localhost/…`. Nội dung theo `stage`:
  - `blank`: trang trắng trống.
  - `html`: chữ đen mộc "Xin chào, thế giới của em" kiểu Times, chưa có style.
  - `css`: cùng nội dung nhưng có header màu, font đẹp, bố cục 2 cột. Chuyển cảnh mượt bằng CSS transition khoảng 1.2s.
  - `php`: thêm một form nhỏ và danh sách gồm `phpRows` dòng lấy từ `content.phpRows`. Khi `deployed` thì có badge xanh "✓ Deploy thành công".
  - `card`: `<CardPreview>` chiếm toàn bộ khung preview.
- Produces: `<CardPreview />`. Nền ấm (gradient `#2a1a10` → `#7a4a22`), viền vàng `#F5B841`, chữ có chân (Georgia hoặc serif hệ thống). Gồm `content.card.title`, các đoạn `content.card.body`, `content.card.wish`, `content.card.signature`. Chữ xuất hiện lần lượt bằng CSS animation (tổng khoảng 6s), có vài cánh hoa rơi chậm. Đây là chỗ duy nhất trong phim được phép "ấm".

- [ ] **Step 1: Viết test lỗi**: render `Preview` với từng stage. `blank` thì không có chữ "Xin chào". `html` thì có. `php` với `phpRows:2` thì có đúng 2 phần tử `[data-php-row]`. `deployed:true` thì có `✓ Deploy thành công`. `card` thì có `content.card.signature`.
- [ ] **Step 2: Chạy**, kỳ vọng FAIL.
- [ ] **Step 3: Viết** hai component.
- [ ] **Step 4: Chạy**, kỳ vọng PASS. Xem bằng mắt cả 5 stage trên dev server.
- [ ] **Step 5: Commit** `feat: preview + card`.

### Task 6: Phát phim: nút bắt đầu, nhạc, phím tắt, đoạn kết

**Files:**
- Create: `src/engine/audio.ts`, `src/engine/controls.ts`, `src/ui/StartScreen.tsx`, `src/ui/EndOverlay.tsx`
- Modify: `src/App.tsx`
- Test: `tests/unit/audio.test.ts`, `tests/unit/controls.test.ts`

**Interfaces:**
- Produces: `createMusic(src: string, audioFactory?: (src:string)=>HTMLAudioElement): { play(at: number): Promise<void>; pause(): void; syncTo(t: number): void; fadeOut(sec: number): void; available: boolean }`. Bắt lỗi `error` và mọi promise rejection từ `play()`, khi đó `available=false` và mọi hàm trở thành no-op. `syncTo(t)` chỉ đặt lại `currentTime` khi lệch quá 0.25s.
- Produces: `attachControls(target: Window, h: { started: () => boolean; toggle(): void; fullscreen(): void }): () => void`. Space thì gọi `toggle` (chỉ khi `started()`, và `preventDefault`). Phím F thì gọi `fullscreen`. Trả về hàm gỡ listener.
- `App.tsx`: trạng thái `'idle'|'playing'|'paused'|'ended'`. Bấm "Bắt đầu" (khoá ngay sau lần bấm đầu) thì `requestFullscreen()` (bỏ qua lỗi), `music.play(master.time())`, rồi `master.play()`. Nếu `?scene=N` thì `master.seek(sceneStarts[N-1], false)` trước khi play. Áp `master.timeScale(speed)`, và khi `speed≠1` thì tắt nhạc. Khi tạm dừng thì dừng cả hai. Khi tiếp tục thì `music.syncTo(master.time())` rồi play. Mỗi 2s, và khi `visibilitychange` sang hiện, gọi `music.syncTo(master.time())`. `gsap.ticker.lagSmoothing(0)` để hình không "đứng chờ" khi tab bị ẩn. Hết timeline thì sang `ended` và hiện EndOverlay: thiệp vẫn giữ, góc dưới có nút nhỏ "↻ Xem lại" (reset store, seek 0, play lại từ đầu cả hình lẫn nhạc). Khi `playing` thì `cursor:none`.
- StartScreen: nền đen, giữa màn hình là logo editor tối giản cùng nút "▶ Bắt đầu" và dòng nhỏ "Nhấn F để toàn màn hình · Space để tạm dừng".

- [ ] **Step 1: Viết test lỗi** `audio.test.ts` với audio giả: (a) `play` bị reject thì `await music.play(0)` không ném lỗi và `available===false`; (b) audio phát sự kiện `error` thì `available===false`, `syncTo` và `fadeOut` không ném lỗi; (c) `syncTo(10)` khi `currentTime=9.9` thì không đổi, khi `currentTime=9` thì thành 10.
- [ ] **Step 2: Viết test lỗi** `controls.test.ts`: Space khi `started()=false` thì `toggle` không được gọi; Space khi `started()=true` thì `toggle` được gọi đúng 1 lần và `defaultPrevented===true`; phím `f` thì `fullscreen` được gọi; sau khi gọi hàm gỡ, Space không gọi gì nữa.
- [ ] **Step 3: Chạy**, kỳ vọng FAIL.
- [ ] **Step 4: Viết** các module và nối vào `App.tsx`.
- [ ] **Step 5: Chạy**, kỳ vọng PASS. Thử bằng tay trên dev server: bấm Bắt đầu nhanh hai lần (chỉ một luồng nhạc), Space giữa lúc đang gõ, Esc thoát toàn màn hình (phim vẫn chạy và co lại vừa cửa sổ), xoá `public/music.mp3` (chạy im lặng, console sạch).
- [ ] **Step 6: Commit** `feat: playback, music, controls`.

### Task 7: Cảnh 1–4 (Mông lung → Thầy đến → CSS → PHP)

**Files:**
- Create: `src/scenes/s1-mong-lung.ts`, `s2-thay-den.ts`, `s3-css.ts`, `s4-php.ts`, `src/scenes/index.ts`
- Test: `tests/unit/scenes.test.ts`

**Interfaces:**
- Consumes: `SceneDef`, `FilmApi`, `content`.
- Produces: `SCENES: SceneDef[]`, ở task này mới có 4 cảnh. Mọi đoạn code trong cảnh lấy từ `content.code.*`, để người dùng sửa được.

Nội dung từng cảnh (thời lượng là mục tiêu, sai lệch ±20% được):
1. **s1 · ~20s**: một tab `nam-nhat.txt` trống, con trỏ "Em" nhấp nháy khoảng 4s. Gõ `Mình nên học gì?` rồi xoá. Gõ một dòng code sai (`<h1>Hello`, ``print("hi"`` …), `errorLines` đỏ lên. Xoá hết. Phụ đề **#1** (`content.subtitles[0]`) giữ khoảng 4s.
2. **s2 · ~30s**: con trỏ "Thầy Tùng" xuất hiện (fade-in, trễ hơn một chút để tạo khoảnh khắc). Mở `index.html`, thầy gõ khung HTML khoảng 6 dòng. Preview hiện ra ở stage `blank`, rồi sang `html` ngay khi dòng `<h1>` gõ xong. Em gõ thêm một dòng `<p>` theo thầy.
3. **s3 · ~30s**: mở `style.css`. Thầy một dòng, em một dòng, xen kẽ khoảng 6 dòng (gồm cả lúc dùng `{with:true}` cho cảm giác gõ cùng nhau). Preview sang stage `css` ở giữa cảnh.
4. **s4 · ~30s**: mở `website.php`, khoảng 6 dòng (`<?php`, `$name`, `foreach`, `echo`). Preview sang stage `php`, `phpRows` tăng 0→3 từng dòng. Terminal hiện `$ deploy website` rồi `✓ done`, `deployed=true`. Giữ 2s.

- [ ] **Step 1: Viết test lỗi** `scenes.test.ts`: `buildMaster(SCENES, store)` có `sceneStarts.length===4`. Seek tới cuối cảnh 1 thì `docs['nam-nhat'].text===''`. Seek tới cuối cảnh 2 thì `preview.stage==='html'` và `cursors.thay.visible===true`. Cuối cảnh 3 thì `'css'`. Cuối cảnh 4 thì `'php'`, `phpRows===3`, `deployed===true`. Thời lượng mỗi cảnh nằm trong khoảng [mục tiêu×0.8, mục tiêu×1.2].
- [ ] **Step 2: Chạy**, kỳ vọng FAIL.
- [ ] **Step 3: Viết 4 cảnh** và thêm phần `content.code.s1…s4` vào `content.ts`.
- [ ] **Step 4: Chạy**, kỳ vọng PASS. Xem bằng mắt với `?scene=1` … `?scene=4`: nhịp có đủ chậm để đọc không, con trỏ thầy có "cảm xúc" không (có khoảng lặng trước khi thầy xuất hiện).
- [ ] **Step 5: Commit** `feat: scenes 1-4`.

### Task 8: Cảnh 5–6 (Ra thực tế → Cơ hội), GitGraph, ContribGrid

**Files:**
- Create: `src/scenes/s5-thuc-te.ts`, `s6-co-hoi.ts`, `src/ui/GitGraph.tsx`, `src/ui/ContribGrid.tsx`
- Modify: `src/scenes/index.ts`, `src/ui/Editor.tsx` (gắn overlay vào `overlaySlot`)
- Test: `tests/unit/scenes.test.ts` (mở rộng), `tests/unit/overlays.test.tsx`

**Interfaces:**
- Produces: `<GitGraph progress={0..1} />`. Thân `main` màu vàng thầy chạy dọc, các nhánh mọc dần theo `progress`, nhãn nhánh lấy từ `content.branches` (ví dụ `thuc-tap`, `du-an-dau-tien`, `freelance`, `cong-viec-moi`…, để người dùng sửa). Vẽ bằng SVG.
- Produces: `<ContribGrid progress={0..1} />`. Lưới 53×7 ô kiểu GitHub, số ô xanh được tô = `round(progress × 371)` theo thứ tự cột. Có nhãn năm dưới lưới.

Nội dung cảnh:
5. **s5 · ~35s**: explorer hiện ra một cây thư mục dự án lớn (`content.explorerItems`). Terminal gõ `git clone …`, `npm install` với vài dòng tiến trình. Con trỏ "Anh Tùng" và "Chị Trang" xuất hiện. Em gõ một hàm, anh Tùng để comment review, em sửa, chị Trang để comment kèm `approved:true`. Con trỏ thầy vẫn hiện trong góc file.
6. **s6 · ~30s**: overlay `gitGraph` với `progress` tween 0→1 trong khoảng 12s. Sau đó chuyển sang `contrib` với `progress` 0→1 trong khoảng 10s. Phụ đề **#2** (`content.subtitles[1]`) xuất hiện trong khoảng 4s cuối.

- [ ] **Step 1: Viết test lỗi**: `ContribGrid progress=0.5` có `round(0.5*371)` ô `[data-on="true"]`. `GitGraph progress=1` có đủ `content.branches.length` nhãn. Cuối cảnh 5 thì `comments` có ít nhất một phần tử `approved`, và `cursors.anhTung.visible`, `cursors.chiTrang.visible` đều true. Cuối cảnh 6 thì `overlay==='contrib'`, `overlayProgress===1`, `subtitle` đã về `null`.
- [ ] **Step 2: Chạy**, kỳ vọng FAIL.
- [ ] **Step 3: Viết** các component, 2 cảnh, và nội dung tương ứng trong `content.ts`.
- [ ] **Step 4: Chạy**, kỳ vọng PASS. Xem bằng mắt với `?scene=5`, `?scene=6`.
- [ ] **Step 5: Commit** `feat: scenes 5-6 + overlays`.

### Task 9: Cảnh 7, lời thiệp, kiểm thử bản build offline, README

**Files:**
- Create: `src/scenes/s7-cam-on.ts`, `tests/e2e/film.spec.ts`, `playwright.config.ts`, `README.md`
- Modify: `src/scenes/index.ts`, `src/content.ts` (hoàn thiện)
- Test: `tests/unit/scenes.test.ts` (mở rộng), `tests/e2e/film.spec.ts`

**Interfaces:**
- Consumes: mọi thứ ở trên; `music.fadeOut` (App gọi khi master còn 8s là hết).

Nội dung cảnh:
7. **s7 · ~40s**: tắt overlay. Mở `cam-on-thay.html`. Cả 4 con trỏ cùng gõ (dùng `with:true`) một đoạn HTML ngắn khoảng 6 dòng, trong đó có `<h1>Cảm ơn thầy</h1>`. Con trỏ Em di tới nút **▶ Run** trên thanh tab, thêm thanh Run vào Editor khi `activeDoc==='cam-on-thay'`. Đặt `runPressed=true`, nút sáng lên. Preview mở ra, stage `card`. Code pane thu hẹp dần về 0%, thiệp chiếm toàn sân khấu. Giữ thiệp đến hết timeline (khoảng 15s sau khi chữ cuối hiện).

**Nội dung `content.ts`** (lời mẫu, người dùng sẽ sửa):

```ts
export const content = {
  cursors: { em:{label:'Em'}, thay:{label:'Thầy Tùng'}, anhTung:{label:'Anh Tùng'}, chiTrang:{label:'Chị Trang'} },
  subtitles: ['Năm nhất, em chỉ có một màn hình trống.', 'Mỗi nhánh em đi đều bắt đầu từ thầy.'],
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
  // code.s1…s7, phpRows, explorerItems, branches: đã thêm ở Task 7–8
};
```

- [ ] **Step 1: Viết test lỗi (unit)**: `SCENES.length===7`. Cuối timeline thì `preview.stage==='card'` và `runPressed===true`. Tổng `duration` nằm trong [180, 240]. Toàn bộ chuỗi trong `content` (trừ code) không chứa `TODO`.
- [ ] **Step 2: Viết test lỗi (e2e)** `film.spec.ts`. Cấu hình Playwright dùng `channel: 'msedge'` với `webServer` để trống, vì test mở trực tiếp `file://…/dist/index.html?speed=40`:
  - (a) Ghi lại mọi `console` loại error, `pageerror`, và **mọi request có scheme khác `file:`/`data:`/`blob:`**. Bấm "Bắt đầu" rồi chờ thấy `content.card.signature` (timeout 30s). Kỳ vọng: không có lỗi console, không có request ra ngoài.
  - (b) Chạy lại (a) sau khi copy `tests/e2e/fixtures/silence.mp3` (một file mp3 im lặng 1s, tạo bằng bất kỳ cách nào, commit kèm) vào `dist/music.mp3` với `?speed=1&scene=7` (chỉ cảnh cuối, khoảng 40s, timeout 60s). Kỳ vọng như trên: thiệp hiện ra, không lỗi console.
  - (c) `setViewportSize(1366,768)`: phần tử sân khấu có `getBoundingClientRect().width` ≈ 1365.3 (±2).
  - Script `e2e` = `npm run build && playwright test`.
- [ ] **Step 3: Chạy** `npm test` và `npm run e2e`, kỳ vọng FAIL.
- [ ] **Step 4: Viết** cảnh 7, thanh Run, hoàn thiện `content.ts`, và nối `music.fadeOut(8)` vào App.
- [ ] **Step 5: Chạy** `npm test` và `npm run e2e`, kỳ vọng PASS hết.
- [ ] **Step 6: Viết `README.md`** (tiếng Việt, ngắn), gồm:
  - **Chiếu:** copy `dist/index.html` và `music.mp3` vào cùng một thư mục, mở đúp bằng Edge hoặc Chrome, bấm Bắt đầu. Phím `F` để toàn màn hình, `Space` để tạm dừng.
  - **Sửa chữ:** sửa `src/content.ts` rồi chạy `npm run build`.
  - **Thêm nhạc:** đặt `public/music.mp3` (khi dev) hoặc để cạnh `index.html` (khi chiếu).
  - **Quay MP4 dự phòng:** mở toàn màn hình, nhấn `Win+Alt+R` (Xbox Game Bar) hoặc dùng OBS (Display Capture, Desktop Audio), quay từ lúc bấm Bắt đầu tới hết thiệp.
  - **Thử trước buổi lễ:** tắt wifi, mở file, xem trọn một lượt trên đúng laptop sẽ dùng.
- [ ] **Step 7: Xem trọn một lượt ở tốc độ thật**, có nhạc, toàn màn hình, trên Edge với `dist/index.html` khi tắt mạng. Ghi lại các chỗ nhịp còn dở để chỉnh.
- [ ] **Step 8: Commit** `feat: final scene, card copy, e2e, readme`.
