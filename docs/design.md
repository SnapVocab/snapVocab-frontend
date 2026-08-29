# SnapVocab — DESIGN.md

> **Vai trò:** Đây là **source of truth duy nhất** cho design token của SnapVocab. Mọi giá trị màu, typography, spacing, radius, motion trong code phải dẫn xuất từ tài liệu này.
>
> **Thứ tự ưu tiên khi có xung đột:**
> ```text
> design.md  (tài liệu này — token gốc)
>     ↓
> src/global.css + src/components/ui/colors.js  (implement token)
>     ↓
> UI components
> ```
> `design/mascot_snapy.md` là source of truth cho **hình ảnh nhân vật Snapy**; tài liệu này là source of truth cho **UI**. Hai palette tách biệt và không được trộn (xem §03.4).
>
> **Nguồn tham khảo:** Nền tảng foundation tham khảo từ 3 design system MIT trên [designmd.ai](https://designmd.ai): [Owl Green](https://designmd.ai/chef/owl-green) (shape, elevation, gamification), [Skylearn](https://designmd.ai/duanhdan/skylearn) (accessibility, voice & tone), [QuizForge](https://designmd.ai/chef/quizforge) (quy tắc quiz/flashcard). Toàn bộ token đã được đổi sang tên semantic của SnapVocab — **không tồn tại khái niệm "Duo Green/Duo Gold/Duo Red" trong tài liệu này**.

---

## 01. Design Principles

Sáu nguyên tắc dưới đây quyết định mọi tranh luận về UI. Khi hai nguyên tắc xung đột, số nhỏ hơn thắng.

| # | Nguyên tắc | Nghĩa cụ thể | Hệ quả kiểm được |
| --- | --- | --- | --- |
| 1 | **Accessible trước playful** | Không có ngoại lệ nào cho contrast, tap target, hoặc "màu là tín hiệu duy nhất". | Mọi cặp foreground/background phải có số đo ở §12.1 |
| 2 | **Chunky và bấm được** | Mọi thứ tương tác được phải dày, bo tròn, có chiều sâu vật lý. Không có element mảnh, mờ, hay "tinh tế". | Button ≥ 48px cao, border-bottom ≥ 4px, radius ≥ 12px |
| 3 | **Phản hồi tức thì** | Mọi tương tác trả về tín hiệu thị giác trong ≤ 200ms. Không có trạng thái "im lặng". | Không có `onPress` nào thiếu pressed state |
| 4 | **Khen cụ thể, sai không phạt** | Mừng thành công lớn tiếng; báo sai thì kèm lý do và đường ra, không kèm sắc đỏ gắt. | Mọi trạng thái sai phải có explanation + CTA (§07.4, §07.5) |
| 5 | **Gold chỉ dành cho phần thưởng** | `reward-500` không bao giờ xuất hiện ở CTA, link, hay trạng thái hệ thống. | Grep `reward-` chỉ thấy trong XP/Coin/Chest/Badge/Mastered |
| 6 | **Tối đa 3 accent một khung** | Trong một screen state, không hiện đồng thời hơn 3 trong 6 accent ở §03. | Review từng screen state, không phải từng component |

### 1.1. Ba thứ SnapVocab từ chối làm

- **Không sterile.** Không phải form nhập liệu doanh nghiệp; đây là app học có nhân vật đồng hành.
- **Không hạ tuổi người dùng.** Learner là học sinh–sinh viên–người đi làm, không phải trẻ 5 tuổi. Không dùng pastel cartoon, không "Oopsie!", không emoji rải rác (§13).
- **Không gây áp lực.** Không countdown gây lo, không guilt-trip khi mất streak, không bán vật phẩm cứu chuỗi (§10.3).

---

## 02. Brand & Visual Identity

| Thuộc tính | Giá trị |
| --- | --- |
| Tên sản phẩm | **SnapVocab** |
| Một câu định vị | Học từ vựng tiếng Anh bằng cách chụp lại thế giới quanh bạn |
| Mascot | **Snapy** — cáo cam. Spec đầy đủ: [design/mascot_snapy.md](./design/mascot_snapy.md) |
| Màu thương hiệu app | `primary-500` `#58CC02` (xanh lá) — dùng cho CTA, tiến độ, trả lời đúng |
| Màu thương hiệu nhân vật | `mascot-500` `#FF8A00` (cam) — dùng cho Snapy, streak, tag SCAN |
| Đại từ chỉ Snapy | Tiếng Việt: "Snapy"/"mình". Tiếng Anh: `they/them`. **Không** "cậu ấy/cô ấy" |
| Cách gọi người dùng | "bạn". **Không** "tôi/quý khách/người dùng" |

### 2.1. Vì sao hai màu thương hiệu

Xanh lá là màu **hành động của app** (bấm, đúng, tiến bộ). Cam là màu **nhận diện nhân vật** (Snapy, chuỗi ngày, nguồn scan). Tách hai vai trò để một screen có cả Snapy và CTA mà không đánh nhau về thị giác. Snapy **không bao giờ** đổi sang xanh lá; CTA **không bao giờ** đổi sang cam.

### 2.2. App icon & splash

| Asset | Giá trị | Ghi chú |
| --- | --- | --- |
| App icon | Snapy `expr_wink` bust trên gradient `#FFB65C → #FF8A00` | Camera badge phải đọc được ở 48px ([mascot_snapy.md §9](./design/mascot_snapy.md)) |
| Splash background | `#FF8A00` | Đồng bộ với gradient icon; đã sửa từ `#FF6C00` |
| Android adaptive icon bg | `#FF8A00` | Cùng giá trị với splash |

---

## 03. Color System

### 3.1. Sáu accent — mỗi màu một vai trò duy nhất

| Token | Hex | Vai trò **duy nhất** | Không bao giờ dùng cho |
| --- | --- | --- | --- |
| `primary-500` | `#58CC02` | CTA chính, trả lời đúng, progress fill, trạng thái Mastered-ring | Phần thưởng, streak, Snapy |
| `reward-500` | `#FFC42E` | XP, Coin, Chest, Badge, ngôi sao, huy hiệu Mastered | CTA, link, warning hệ thống |
| `mascot-500` | `#FF8A00` | Snapy, streak flame, tag `SCAN` | CTA, trạng thái đúng/sai |
| `info-500` | `#1CB0F6` | Link, tag `DICT`, hint, nút phụ, nút 🔊 | Trạng thái đúng/sai |
| `warning-500` | `#F59E0B` | Cảnh báo hệ thống: quota, hết lượt scan, độ tin cậy thấp | Phần thưởng (dùng `reward-500`) |
| `danger-500` | `#EF4444` | Lỗi hệ thống, hành động phá hủy (xoá deck) | **Trả lời sai** (dùng `error-soft`, §07.4) |

> **Kiểm tra §01.5:** `reward-*` chỉ được phép xuất hiện trong component XP / Coin / Chest / Badge / Mastered. Nếu grep thấy ở chỗ khác thì là bug.
>
> **Kiểm tra §01.6:** tối đa 3 trong 6 accent trên một screen state. Ví dụ Home hợp lệ: `primary` (CTA Học ngay) + `reward` (XP bar) + `mascot` (streak). Thêm `info` cho link "Xem tất cả" là **vi phạm** — link ở Home dùng `neutral-600`.

### 3.2. Primary scale (xanh lá — hành động)

| Token | Hex | Dùng ở |
| --- | --- | --- |
| `primary-50` | `#F0FCE4` | Nền tint nhẹ (row đang chọn, toast đúng) |
| `primary-100` | `#DEF7C4` | Nền tint đậm hơn, chip skill |
| `primary-200` | `#C2EE96` | Track progress dạng nhạt |
| `primary-300` | `#A0E063` | Text primary trên nền tối (dark mode) |
| `primary-400` | `#7DD634` | Hover trên dark mode |
| `primary-500` | `#58CC02` | **Base** — CTA, progress fill, đúng |
| `primary-600` | `#4CAD02` | Hover / pressed fill |
| `primary-700` | `#3C8C00` | **Bottom border** của button primary (§05.4) |
| `primary-800` | `#2F6E00` | Text trên nền `primary-100` |
| `primary-900` | `#1F4A00` | Text contrast cao nhất trên tint |

### 3.3. Reward scale (vàng — phần thưởng)

| Token | Hex | Dùng ở |
| --- | --- | --- |
| `reward-50` | `#FFF9E6` | Nền badge/chest chưa mở |
| `reward-100` | `#FFEFB8` | Nền chip XP |
| `reward-300` | `#FFDA6B` | Glow ngoài của chest, sparkle |
| `reward-500` | `#FFC42E` | **Base** — icon XP/Coin/Star, fill badge |
| `reward-600` | `#E5A800` | Hover, viền icon |
| `reward-700` | `#B37F00` | **Text** trên nền `reward-100` (đủ contrast, §12.1) |

> `reward-500` là màu **lấy từ ngôi sao trong [mascot_snapy.md §4](./design/mascot_snapy.md)**, không phải màu vàng của Owl Green (`#FFC800`). Chọn `#FFC42E` để tách khỏi `mascot-500 #FF8A00` rõ hơn trên màn hình có cả streak và XP.

### 3.4. Mascot palette — **chỉ dùng cho Snapy**

Bảng này là **bản sao chỉ-đọc** từ [mascot_snapy.md §3](./design/mascot_snapy.md). Không được dùng các token này cho UI chrome, và không được sửa ở đây — sửa ở `mascot_snapy.md` rồi đồng bộ về.

| Token | Hex | Vai trò |
| --- | --- | --- |
| `mascot-fur` / `mascot-500` | `#FF8A00` | Lông chính của Snapy; đồng thời là accent streak & tag SCAN |
| `mascot-cream` | `#FFF3E0` | Bụng, chóp tai, chóp đuôi |
| `mascot-brown` | `#A75C21` | Đường viền / bóng đổ trên lông |
| `mascot-navy` | `#1E2A44` | Mắt, mũi |
| `mascot-blue` | `#4DA3FF` | Khăn/phụ kiện |
| `mascot-violet` | `#8B6CFF` | Phụ kiện thứ cấp |
| `mascot-bg` | `#FFF8EF` | Nền illustration khi Snapy đứng một mình |
| `mascot-rim` | `#FFB65C` | **Rim light ở dark mode**, trên nền `neutral-800`/`neutral-900` |

> Ranh giới: `mascot-500` là token **duy nhất** được dùng ở cả hai bên (Snapy + streak/tag SCAN). Bảy token còn lại chỉ tồn tại trong asset của Snapy.

### 3.5. Neutral scale (chrome, text, border)

Giữ nguyên thang `neutral` hiện có trong `colors.js` — 78 call-site đang phụ thuộc, đổi là vỡ layout.

| Token | Hex | Dùng ở |
| --- | --- | --- |
> ⚠️ **Thang này đi từ sáng → tối** (`50` sáng nhất, `900` tối nhất). Đây là thang đang tồn tại trong `colors.js`, giữ nguyên giá trị.

| Token | Hex | Dùng ở |
| --- | --- | --- |
| `neutral-50` | `#EEEFF3` | Nền muted, skeleton, nền trang phụ |
| `neutral-100` | `#D4D5DF` | Border card, divider, input border |
| `neutral-200` | `#B6B7C7` | Border nhấn, icon disabled, bottom border button secondary |
| `neutral-300` | `#9597AD` | Placeholder, icon inactive |
| `neutral-400` | `#757793` | Text rất phụ, metadata mờ |
| `neutral-500` | `#565879` | Text phụ, caption |
| `neutral-600` | `#3D3F5E` | Text phụ đậm, link ở Home · **border ở dark mode** |
| `neutral-700` | `#2A2C47` | Text trên nền `muted` · **nền muted / sheet ở dark mode** |
| `neutral-800` | `#171A2F` | **Text chính (light)** · nền card (dark) |
| `neutral-900` | `#0D0E1A` | Nền trang (dark) |

Nền trang ở light mode là `#FFFFFF` thuần (không có bậc neutral nào cho nó).

### 3.6. Semantic token — cấp mà component thực sự dùng

Component **không** đọc trực tiếp `primary-500`; component đọc semantic token. Đây là lớp cho phép dark mode đổi giá trị mà không sửa component (§14).

| Semantic | Light | Dark |
| --- | --- | --- |
| `background` | `#FFFFFF` | `#0D0E1A` |
| `foreground` | `#171A2F` | `#EEEFF3` |
| `card` | `#FFFFFF` | `#171A2F` |
| `card-foreground` | `#171A2F` | `#EEEFF3` |
| `muted` | `#EEEFF3` | `#2A2C47` |
| `muted-foreground` | `#5C5E6E` | `#9497A8` |
| `border` | `#D4D5DF` | `#3D3F5E` |
| `input` | `#D4D5DF` | `#3D3F5E` |
| `ring` | `#58CC02` | `#7DD634` |
| `destructive` | `#EF4444` | `#F87171` |

---

## 04. Typography

### 4.1. Hai họ chữ, hai vai trò

| Họ | Package | Vai trò | Vì sao |
| --- | --- | --- | --- |
| **Nunito** | `@expo-google-fonts/nunito` | Heading H1–H4, số XP/Streak/Score, nhãn button | Terminal bo tròn → khớp nguyên tắc §01.2 "chunky", số ở weight 800 rất chắc |
| **Inter** | `@expo-google-fonts/inter` (đã có) | Body, label, caption, input, mono-ish số nhỏ | Đã dùng trong toàn bộ screen đã build; x-height cao, đọc tốt ở 14–16px |

> **Quyết định:** không thay Inter bằng Nunito toàn bộ. Nunito chỉ vào lớp display để không thay đổi metric của các screen đã hoàn thiện. Weight cần load: Nunito 700/800; Inter 400/500/600/700.

### 4.2. Type scale

| Style | Font | Size / Line-height | Weight | Dùng ở |
| --- | --- | --- | --- | --- |
| `display` | Nunito | 36 / 44 | 800 | Số lớn ở màn hình kết quả, Level-up |
| `h1` | Nunito | 28 / 36 | 700 | Tiêu đề screen |
| `h2` | Nunito | 22 / 30 | 700 | Tiêu đề section |
| `h3` | Nunito | 18 / 26 | 700 | Tiêu đề card |
| `h4` | Nunito | 16 / 24 | 700 | Nhãn nhóm, tiêu đề row |
| `body` | Inter | 16 / 24 | 400 | Nội dung, nghĩa từ, câu hỏi quiz |
| `body-medium` | Inter | 16 / 24 | 500 | Nội dung cần nhấn |
| `label` | Inter | 14 / 20 | 600 | Nhãn form, đáp án quiz |
| `small` | Inter | 14 / 20 | 400 | Text phụ, mô tả |
| `caption` | Inter | 12 / 16 | 600 | Badge, tag, metadata |
| `button` | Nunito | 15 / 20 | 700 | Nhãn button — **uppercase**, letter-spacing `0.04em` |
| `numeral` | Nunito | 24 / 28 | 800 | XP, Coin, Streak, Score — **tabular** |
| `word-front` | Nunito | 32 / 40 | 800 | Từ tiếng Anh ở mặt trước Flashcard |
| `ipa` | Inter | 14 / 20 | 400 | Phiên âm IPA — luôn kèm nút 🔊 |

### 4.3. Quy tắc bắt buộc

- **Sàn 14px.** Không có text nào < 14px trong UI learner-facing, kể cả caption trong badge. Ngoại lệ duy nhất: chỉ số nhỏ trên icon tab, và chỉ khi đã có nhãn text kèm theo.
- **Tabular cho mọi số biến động.** XP, Coin, Streak, đếm ngược, số câu đúng — dùng `numeral` với `fontVariant: ['tabular-nums']` để số không nhảy layout khi tăng.
- **Letter-spacing 0** ở mọi style trừ `button` (`0.04em`).
- **Không uppercase** ngoài `button`. Tiêu đề tiếng Việt viết hoa chữ đầu, không viết hoa toàn bộ (dấu tiếng Việt ở chữ hoa khó đọc).
- **Không italic** cho tiếng Việt. Nghĩa từ và ví dụ dùng weight/màu để phân biệt, không dùng nghiêng.
- **Line-height không dưới 1.4** cho mọi text nhiều dòng.

---

## 05. Spacing & Shape

### 5.1. Spacing — base 4px

| Token | px | Dùng ở |
| --- | --- | --- |
| `sp-1` | 4 | Khoảng cách icon–text, padding trong badge |
| `sp-2` | 8 | Gap giữa chip, padding dọc chip |
| `sp-3` | 12 | Padding dọc input, gap trong row |
| `sp-4` | 16 | Padding ngang chuẩn, gap giữa card trong grid |
| `sp-5` | 20 | Padding trong card |
| `sp-6` | 24 | Gap giữa nhóm liên quan |
| `sp-8` | 32 | Padding ngang screen ở tablet |
| `sp-10` | 40 | Khoảng cách giữa section lớn |
| `sp-12` | 48 | Breathing room trước CTA cuối screen |
| `sp-16` | 64 | Padding dọc empty state |
| `sp-20` | 80 | Padding dọc màn hình celebration |

- **Screen padding ngang:** 16px (mobile), 24px (tablet).
- **Giữa section lớn:** 40px. **Giữa element liên quan:** 20px.
- **Container max-width:** 600px (màn hình học/quiz), 1024px (dashboard/thống kê).
- **Gap grid:** 16px (grid từ vựng), 24px (thẻ nhiệm vụ).

### 5.2. Radius

| Token | px | Dùng ở |
| --- | --- | --- |
| `radius-sm` | 8 | Tag, badge nhỏ, checkbox |
| `radius-md` | 12 | Input, chip, bounding-box label |
| `radius-lg` | 16 | **Button, card** — mặc định |
| `radius-xl` | 24 | Hero card, panel onboarding, bottom sheet, Flashcard |
| `radius-full` | 9999 | Avatar, pill, progress track, node lộ trình |

Không có góc vuông (`radius-0`) ở bất kỳ surface nào. Nếu cần cạnh thẳng, dùng divider 1px chứ không dùng góc vuông.

### 5.3. Tap target

- **Tối thiểu 48×48px** cho mọi element bấm được. Nếu vùng nhìn thấy nhỏ hơn (ví dụ icon 🔊 24px), mở rộng bằng `hitSlop` để đạt 48px.
- **Khoảng cách giữa hai target** ≥ 8px.
- Nút xoá / hành động phá hủy không được đặt cạnh nút chính trong bán kính 16px.

### 5.4. Elevation — bottom border, không phải shadow

Chiều sâu của SnapVocab đến từ **viền dưới màu đậm hơn**, tạo cảm giác vật lý bấm được (§01.2). Shadow chỉ là lớp phụ.

| Level | Định nghĩa | Dùng ở |
| --- | --- | --- |
| `elev-0` | Phẳng, không viền dưới | Text inline, list row |
| `elev-1` | **Bottom border 4px** màu đậm hơn 2 bậc của chính element | Button, chip bấm được, checkbox |
| `elev-2` | Bottom border 3px `border` + `0 2px 6px rgba(23,26,47,0.10)` | Card, vocabulary card, answer tile |
| `elev-3` | `0 4px 12px rgba(23,26,47,0.15)` + bottom border 3px | Modal, bottom sheet, popup Snapy |
| `elev-focus` | Ring 3px `ring` @ 35% | Focus ring (§12.3) |
| `elev-correct` | Glow 16px `primary-500` @ 30% | Trả lời đúng |
| `elev-reward` | Glow 24px `reward-300` @ 40%, tắt sau 2s | Badge/Chest vừa nhận |

**Cặp màu bottom border:**

| Element | Fill | Bottom border |
| --- | --- | --- |
| Button primary | `primary-500` | `primary-700` `#3C8C00` |
| Button secondary | `#FFFFFF` | `neutral-200` `#B6B7C7` |
| Button danger | `danger-500` | `#CC3C3C` |
| Card | `card` | `border` |
| Chip reward | `reward-100` | `reward-500` |

**Pressed state (bắt buộc, §01.3):** bottom border co từ 4px → 2px **và** element dịch xuống 2px. Tổng chiều cao không đổi → không giật layout.

---

## 06. Components

### 6.1. Button

Cao **50px** (`md`), padding ngang 24px, `radius-lg` 16px, nhãn `button` (Nunito 700, 15px, uppercase, `0.04em`).

| Variant | Fill | Text | Bottom border |
| --- | --- | --- | --- |
| `primary` | `primary-500` | `#FFFFFF` | 4px `primary-700` |
| `secondary` | `#FFFFFF` | `info-500` | 2px `border` + 4px `neutral-200` |
| `ghost` | trong suốt | `info-500` | không |
| `danger` | `danger-500` | `#FFFFFF` | 4px `#CC3C3C` |
| `reward` | `reward-500` | `neutral-800` | 4px `reward-600` |

| Size | Cao | Padding ngang | Font |
| --- | --- | --- | --- |
| `sm` | 40 | 16 | 14 |
| `md` | 50 | 24 | 15 |
| `lg` | 56 | 32 | 17 |

- **Pressed:** `translateY(2px)`, bottom border → 2px, fill → bậc `-600`.
- **Disabled:** opacity 0.4, không hover/focus effect, bỏ bottom border. **Kèm lý do** — nếu button bị disable thì phải có text giải thích cạnh nó (§13.4).
- **Loading:** giữ nguyên chiều rộng, thay nhãn bằng spinner, `accessibilityState.busy = true`.
- `reward` variant chỉ dùng cho nút "Nhận thưởng"/"Mở rương" (§01.5).

### 6.2. Card

`card` fill, border 2px `border`, `radius-lg` 16px, padding 20px, `elev-2`. Hover/press: `elev-3`, transition 200ms.

Biến thể: **Vocabulary Card** (§07.1), **Flashcard** (§07.2), **Detected Item Card** (§08.5), **Mission Card** (§10.5), **Chest Card** (§10.6), **Stat Card** (số `numeral` căn giữa + nhãn `caption`).

### 6.3. Input

Cao 48px, padding 12px/16px, `radius-md` 12px, border 2px, text `body` 16px (không nhỏ hơn — iOS sẽ tự zoom).

| State | Border | Fill | Phụ |
| --- | --- | --- | --- |
| Default | `input` | `background` | — |
| Focus | `ring` | `background` | `elev-focus` |
| Correct | `primary-500` | `primary-50` | icon ✓ bên phải |
| Error | `danger-500` | `#FEF2F2` | icon ⚠ + message inline dưới |
| Disabled | `border` | `muted` | — |

Error message không bao giờ chặn việc gõ tiếp, và không bao giờ thay thế label.

### 6.4. Progress Bar

Cao 12px, `radius-full`, track `primary-100` (light) / `neutral-700` (dark), fill `primary-500`. Fill animate 480ms ease-out khi giá trị tăng.

- Luôn kèm **nhãn text** dạng `7/12 từ` — thanh không được là tín hiệu duy nhất (§12.2).
- Progress ring cho từng deck: đường kính 40px, stroke 5px, cùng cặp màu.
- Khi đạt 100%: một nhịp sparkle `reward-300` 320ms, không confetti (confetti chỉ dành cho hoàn thành phiên — §11.4).

### 6.5. XP Badge

Chip `radius-full`, cao 32px, padding ngang 14px, fill `reward-100`, viền dưới 2px `reward-500`, icon tia sét `reward-500` 16px, số `numeral` màu `reward-700`.

Khi nhận XP: số count-up 600ms + chip scale 1.0→1.12→1.0 (spring). Nếu đang có XP Booster, hiện hậu tố `×2` trong cùng chip và **không** đổi màu chip.

### 6.6. Coin Badge

Giống XP Badge, icon xu tròn `reward-500` có viền `reward-600`. Coin **luôn** đứng cạnh XP nếu cả hai hiện cùng lúc, thứ tự XP trước Coin. Coin giảm (khi mua) dùng count-down 400ms, không dùng màu đỏ.

### 6.7. Streak Flame

Icon ngọn lửa `mascot-500` + số `numeral` màu `mascot-500`. Ở top navigation, luôn hiện trong phiên học (§15.1).

| State | Hiển thị |
| --- | --- |
| Chưa học hôm nay | Lửa outline `neutral-400`, số màu `neutral-500` |
| Đã học hôm nay | Lửa fill `mascot-500`, số `mascot-500`, glow nhẹ |
| Mốc 7/30/100 ngày | Lửa fill + vành `reward-500`, một nhịp bounce khi mở app |
| Vừa mất streak | Lửa outline `neutral-400`, **không** dùng `danger-500` (§01.4) |

Popup mất streak: tối đa **1 lần/ngày**, nội dung theo §13.3, không bán vật phẩm cứu chuỗi.

### 6.8. Level Badge

Hình lục giác `radius-sm`, fill `primary-100`, viền 2px `primary-500`, số level `numeral` màu `primary-800`. Level-up: modal `elev-3` + Snapy `pose_celebrate` + `jump_celebrate` (§11.3), badge scale-in 480ms overshoot.

### 6.9. Booster Chip

Pill `radius-full`, fill `info-500` @ 12%, viền 2px `info-500`, icon đồng hồ + text `caption` `1:00:00` (tabular, đếm ngược). Đếm ngược **không** đổi sang đỏ khi gần hết — chuyển sang `neutral-500` (§15.1 "timer không gây lo").

### 6.10. Cosmetic Item

Ô vuông 96×96, `radius-lg`, fill `muted`, ảnh item căn giữa 64px. Trạng thái: **Đang dùng** (viền 3px `primary-500` + tick góc trên phải), **Đã sở hữu** (viền 2px `border`), **Chưa mở** (opacity 0.5 + giá Coin ở footer). Khung avatar và huy hiệu đặc biệt từ Rương Vàng gắn tag `reward-500` "Đặc biệt".

### 6.11. Avatar

Tròn `radius-full`, vành trong 3px `#FFFFFF` + vành ngoài 2px `primary-500`. Size 32 (row) / 48 (list) / 96 (profile). Nếu đang dùng khung cosmetic, khung thay vành ngoài. Không có avatar → chữ cái đầu tên trên nền `primary-100`, text `primary-800`.

---

## 07. Learning Components

### 7.1. Vocabulary Card

Đơn vị hiển thị một từ trong danh sách, kết quả scan, và kết quả tìm kiếm.

```text
┌─────────────────────────────────────────┐
│ ┌──────┐  bicycle              [SCAN]   │  ← từ: h3 Nunito 700 · tag §08.6
│ │ crop │  /ˈbaɪsɪkəl/  🔊               │  ← ipa + nút loa (48px hitSlop)
│ │ 64px │  xe đạp                        │  ← body Inter 400
│ └──────┘  ●●○ Đang học                  │  ← learning state §09
└─────────────────────────────────────────┘
```

- Layout: ảnh crop 64×64 `radius-md` bên trái (nếu nguồn `SCAN`), nội dung bên phải.
- **Bốn thứ luôn có:** từ tiếng Anh, IPA + nút 🔊, nghĩa tiếng Việt, learning state.
- Card có `elev-2`. Bấm vào mở chi tiết; nút 🔊 là target riêng, không kích hoạt navigation.
- Không nguồn `SCAN` → bỏ ô ảnh, không để placeholder xám trống.

### 7.2. Flashcard

`radius-xl` 24px, tối thiểu 220px cao, `elev-2`.

| Mặt | Nội dung |
| --- | --- |
| **Trước** | Ảnh crop (nếu có) + từ tiếng Anh `word-front` (Nunito 800, 32px) + IPA + 🔊. **Không** hiện nghĩa. |
| **Sau** | Nghĩa tiếng Việt `h3` + 1 câu ví dụ `body` + word class `caption` + nút 🔊 |

- **Flip:** rotateY 3D, 320ms, easing `cubic-bezier(0.34, 1.56, 0.64, 1)`. Chỉ flip bằng tap — không bắt buộc swipe/hover (§15.2).
- Sau khi flip mới hiện 4 nút đánh giá FSRS: `Lại` / `Khó` / `Tốt` / `Dễ`. Bốn nút này dùng **cùng một variant** `secondary` — không nhuộm màu theo độ khó, vì đó là lựa chọn của người học, không phải phán xét đúng/sai.
- Đếm số thẻ còn lại dạng `4/12` ở đầu, **không** dùng đồng hồ đếm ngược.

### 7.3. Quiz

- Câu hỏi: `body` 16px, tối đa 3 dòng, luôn nằm trên fold.
- **Answer Tile:** cao tối thiểu 72px, `radius-lg`, fill `card`, viền 2px `border`, `elev-2`, text `label` 14px canh trái. Bấm → `elev-3` + viền `ring`.
- Xếp dọc 1 cột trên mobile, gap 12px. Không xếp 2×2 (đáp án tiếng Việt dài dễ bị cắt).
- Thứ tự đáp án shuffle mỗi lần render; đáp án đúng không được cố định vị trí.
- **Tiến độ:** dạng `3/10` + progress bar `primary-500` ở đầu screen. Không có timer ở chế độ học thường; nếu bật chế độ tính giờ thì phải gắn nhãn rõ trước khi bắt đầu (§15.1).
- Thiếu từ để tạo quiz → empty state có CTA "Học thêm từ mới" (không hiện quiz rỗng).

### 7.4. Answer Feedback

Phản hồi phải xuất hiện trong **≤ 200ms** kể từ khi chọn (§01.3), và **luôn gồm 3 tín hiệu**: màu + icon + chữ (§12.2).

| | Đúng | Sai |
| --- | --- | --- |
| Viền tile | 3px `primary-500` | 3px `warning-500` |
| Fill tile | `primary-50` | `#FEF3C7` |
| Icon | ✓ trong tròn `primary-500` | ✕ trong tròn `warning-500` |
| Text | "Chính xác!" | "Chưa đúng" |
| Hiệu ứng | `elev-correct` glow 320ms + 3–4 hạt sparkle | Shake ngang 4px × 2 nhịp, 240ms |
| Snapy | `expr_proud` / `pose_celebrate` | `expr_unsure`, **không** `expr_sad` |
| Haptic | `notificationSuccess` | `impactLight` |

- **Trả lời sai không dùng `danger-500`.** Đỏ gắt dành cho lỗi hệ thống và hành động phá hủy, không dành cho người học (§01.4, §15.1).
- Tile đúng luôn được highlight kể cả khi người học chọn sai — để họ thấy đáp án đúng nằm đâu.
- **Không auto-advance ngay.** Chờ tối thiểu 1.2s hoặc chờ người học bấm "Tiếp tục" (§15.2).

### 7.5. Explanation

Bắt buộc xuất hiện sau **mọi** câu sai, và có thể mở được sau câu đúng.

```text
┌─────────────────────────────────────────┐
│ 💡 Vì sao                               │  ← h4 Nunito 700
│ "bicycle" là xe đạp — xe có hai bánh    │  ← body
│ đạp bằng chân. "motorbike" là xe máy.   │
│                                          │
│ [ Xem lại từ này ]   [ Tiếp tục → ]     │  ← ghost + primary
└─────────────────────────────────────────┘
```

- Panel `elev-2`, fill `info-500` @ 8%, viền trái 4px `info-500`, `radius-lg`.
- **Luôn có đường ra:** ít nhất một CTA. Mặc định là "Tiếp tục"; kèm "Xem lại từ này" khi trả lời sai.
- Nội dung giải thích ngắn: 1–2 câu, có nêu điểm khác biệt với đáp án mà người học đã chọn.
- Không bao giờ ẩn explanation sau khi trả lời sai (§15.2).

---

## 08. SnapVocab Scan UI

Đây là bề mặt riêng của SnapVocab — không design system tham khảo nào có sẵn. Nguồn yêu cầu: `spec/phan_ra_man_hinh.md` MH-CAMERA-01 / MH-CAMERA-02.

### 8.1. Camera Screen (MH-CAMERA-01)

```text
┌─────────────────────────────────────────┐
│ ✕                          ⚡ Flash     │  ← icon trắng, drop-shadow, 48px target
│                                          │
│           (full-screen preview)          │
│                                          │
│         ┌──────────────────┐             │
│         │  khung ngắm 4 góc │            │  ← 4 góc L, stroke 3px trắng 80%
│         └──────────────────┘             │
│                                          │
│         Còn 8 lượt scan hôm nay          │  ← caption trắng trên nền đen 40%
│         Làm mới lúc 00:00                │
│  🖼        ( ◉ 72px )                    │  ← gallery · shutter
└─────────────────────────────────────────┘
```

- **Chrome trên nền camera luôn là trắng** + drop-shadow `rgba(0,0,0,0.4)`, không dùng token màu — preview có thể sáng hoặc tối bất kỳ.
- Shutter: tròn 72px, viền ngoài 4px trắng, lõi trắng. Pressed: lõi co còn 64px, 120ms.
- **Quota** luôn hiện kèm giờ reset. Khi còn ≤ 2 lượt, số đổi sang `warning-500`; khi hết, shutter disabled + CTA "Xem gói nâng cấp".
- Chưa cấp quyền camera → không hiện preview đen, hiện empty state có Snapy `expr_curious` + nút "Mở cài đặt".

### 8.2. Scan Overlay (trạng thái đang xử lý)

Overlay `rgba(13,14,26,0.72)` phủ toàn màn hình, nội dung căn giữa:

1. Snapy `pose_scanning` + animation `scan_pulse` (1200ms, lặp vô hạn — [mascot_snapy.md §8](./design/mascot_snapy.md)).
2. Dòng chính: **"Mắt thần đang nhìn... Đợi chút nhé!"** — `h3`, trắng.
3. Vị trí hàng đợi nếu có: "Đang xếp thứ 2" — `caption`, `neutral-100`.
4. Nút **"Huỷ"** variant `ghost` chữ trắng — luôn có, không bao giờ khoá người dùng trong overlay.

Timeout AI → thay overlay bằng error state có Snapy `expr_unsure` + "Mình chưa nhìn kịp. Thử lại nhé?" + nút "Thử lại" / "Chụp lại".

### 8.3. Bounding Box

Vẽ trên ảnh đã chụp ở nửa trên MH-CAMERA-02.

| Thuộc tính | Giá trị |
| --- | --- |
| Stroke | 3px, `radius-sm` 8px |
| Màu theo độ tin cậy | Cao → `primary-500` · Trung bình → `info-500` · Thấp → `warning-500` |
| Nhãn | Chip `radius-md` gắn góc trên-trái box, fill = màu stroke, text trắng `caption`, tên tiếng Anh |
| Box đang chọn | Stroke 4px + fill trong 12% cùng màu |
| Box không chọn | Stroke 2px opacity 0.6 |

- Nhãn tự lật xuống dưới box nếu box sát mép trên.
- Box chồng nhau: nhãn stagger theo trục dọc 4px để không che nhau; box nhỏ hơn vẽ trên.
- Bấm box → cuộn tới Detected Item Card tương ứng, và ngược lại.
- **Màu box không phải tín hiệu duy nhất** về độ tin cậy — Confidence Badge ở §8.4 luôn hiện trên card.

### 8.4. Confidence Badge

Suy ra từ `detectionSource` + `clipScore`. Ba mức, mỗi mức có màu + icon + chữ (§12.2).

| Mức | Nguồn phát hiện | Badge |
| --- | --- | --- |
| **Cao** | `OD`, `GROUNDING` | fill `primary-100`, text `primary-800`, icon ✓✓, chữ "Đáng tin" |
| **Trung bình** | `SELF`, `DENSE` | fill `info-500` @ 12%, text `#0B6E9C`, icon ✓, chữ "Khá chắc" |
| **Thấp** | `BASE`, hoặc `clipScore` dưới ngưỡng | fill `#FEF3C7`, text `#92400E`, icon ?, chữ "Chưa chắc" |

Mức **Thấp** kèm Snapy `expr_unsure` + câu dẫn **"Hình như đây là..."** đặt ngay trên tên từ, và checkbox lưu **mặc định bỏ chọn**. Người học phải chủ động tick — không lưu ngầm dữ liệu mà AI không chắc.

Nếu **toàn bộ** vật thể ở mức Thấp: hiện banner `warning-500` @ 12% "Mình chưa nhìn rõ lắm. Bạn thử chụp gần hơn nhé?" + nút "Chụp lại" nổi bật hơn "Lưu".

### 8.5. Detected Item Card (MH-CAMERA-02)

`radius-xl` 24px, `elev-2`, padding 20px — to hơn Vocabulary Card thường vì đây là khoảnh khắc chính của app.

```text
┌─────────────────────────────────────────┐
│ ┌────────┐  bicycle          [Đáng tin] │  ← từ: word-front 32px Nunito 800
│ │ crop   │  /ˈbaɪsɪkəl/  🔊             │
│ │ 88px   │  xe đạp · noun               │
│ └────────┘                              │
│  ☑ Lưu vào deck này                     │
└─────────────────────────────────────────┘
```

- **Tra từ điển không có kết quả** → card vẫn hiện với tên tiếng Anh, nghĩa thay bằng "Chưa có nghĩa — bạn tự thêm nhé?" + nút "Thêm nghĩa". Không loại từ khỏi danh sách.
- **Kết quả một phần** (một số vật thể lỗi) → hiện các card thành công + banner `info` đếm số vật thể chưa xử lý được, kèm "Thử lại phần còn lại".
- **Đã lưu trước đó** → card gắn chip `neutral` "Đã có trong deck", checkbox off, không tính vào "Lưu tất cả".

**Bottom bar** (`elev-3`, dính đáy):

| Thành phần | Chi tiết |
| --- | --- |
| Deck đích | Tên deck hiện tại + nút `ghost` "Đổi deck" |
| CTA chính | **"Lưu tất cả"** — button `primary` `lg`, bottom border 4px `primary-700`, press-down 2px rõ rệt |
| CTA phụ | "Chụp lại" — `secondary` |
| Báo lỗi | Icon ⚠️ `ghost` 48px — "Nhận diện sai?" |

Sau khi lưu: button đổi thành `muted` fill, text `muted-foreground`, nhãn **"Đã lưu ✓"**, disabled — trạng thái đã-xong phải nhìn thấy được, không chỉ là toast rồi mất.

### 8.6. Source Tag — SCAN / DICT / TOPIC

Chip `radius-full`, cao 24px, padding ngang 10px, `caption` 12px weight 600. Mỗi tag có **icon riêng** để không phụ thuộc màu (§12.2).

| Tag | Nghĩa | Fill | Text | Icon |
| --- | --- | --- | --- | --- |
| `SCAN` | Từ do người học tự chụp | `mascot-500` @ 14% | `#B35F00` | 📷 camera |
| `DICT` | Thêm từ tra từ điển | `info-500` @ 14% | `#0B6E9C` | 🔍 kính lúp |
| `TOPIC` | Thêm từ bộ chủ đề có sẵn | `muted` | `neutral-700` | ▦ lưới |

`SCAN` là tag duy nhất dùng màu mascot trong UI chrome — vì scan là hành vi định danh sản phẩm (§02.1). Không tạo thêm tag nguồn mới mà không cập nhật bảng này.

---

## 09. Learning State

Bốn trạng thái UI **suy ra** từ FSRS, không lưu riêng. Quy tắc dẫn xuất là source of truth ở `spec/specs.md`; bảng dưới là hợp đồng hiển thị.

| State UI | Điều kiện FSRS | Nhãn VN | Fill | Text | Icon / hình |
| --- | --- | --- | --- | --- | --- |
| **New** | `state = NEW` | Từ mới | `muted` | `neutral-700` | ○ tròn rỗng |
| **Learning** | `state = LEARNING` hoặc `RELEARNING` | Đang học | `info-500` @ 14% | `#0B6E9C` | ◐ tròn nửa |
| **Reviewing** | `state = REVIEW` và `interval < 21 ngày` | Đang ôn | `primary-100` | `primary-800` | ◕ tròn gần đầy |
| **Mastered** | `state = REVIEW` và `interval ≥ 21 ngày` | Đã thuộc | `reward-100` | `reward-700` | ★ ngôi sao `reward-500` |

### 9.1. Quy tắc bắt buộc

- **Badge luôn có chữ.** Không có phiên bản chỉ-icon hay chỉ-màu của learning state (§12.2). Ở không gian rất hẹp, giữ chữ và bỏ icon — không làm ngược lại.
- **Mastered là trạng thái duy nhất dùng màu reward** (§01.5). Đây là ngoại lệ được cấp phép: "đã thuộc" là phần thưởng học tập.
- **Ngưỡng 21 ngày là config, không hardcode.** Mọi query đếm (`learnedCount`, `masteredCount`), mọi list filter, mọi progress, mọi mission phải đọc cùng một hằng số. Nếu ngưỡng đổi, không được có chỗ nào lệch.
- `learnedCount` = Learning + Reviewing + Mastered. `dueCount` = số từ có `dueAt <= now`. `masteredCount` = số từ ở state Mastered.
- **Chuyển state có animation.** Khi một từ lên Mastered lần đầu: badge morph 320ms + một nhịp sparkle `reward-300`. Các chuyển state khác: cross-fade 200ms, không hiệu ứng.
- **Không dùng learning state làm thước đo con người.** Copy không so sánh người học với người khác qua số từ đã thuộc (§13.2).

### 9.2. Bộ lọc theo state

Chip filter dùng đúng cặp màu ở bảng trên khi được chọn (viền 2px + fill), và `muted` + `neutral-600` khi không chọn. Thêm chip `Đến hạn` (fill `warning-500` @ 12%, text `#92400E`) — đây là bộ lọc theo `dueAt`, không phải learning state, nên đặt tách khỏi 4 chip kia bằng divider dọc.

---

## 10. Gamification

### 10.1. XP

- Hiển thị: XP Badge (§6.5) ở top navigation + XP bar tiến độ level.
- **Số XP luôn kèm nguồn.** Toast dạng "+10 XP · Học 5 từ mới", không phải "+10 XP" trống.
- XP không bao giờ bị trừ. Không có cơ chế mất XP.
- Có XP Booster đang chạy → hậu tố `×2` trong badge + Booster Chip (§6.9) ở cạnh. Không nhuộm cả thanh XP sang màu khác.

### 10.2. Coins

- Kiếm từ nhiệm vụ và rương; tiêu cho Booster và Cosmetic.
- Số Coin không đủ → nút mua vẫn **hiện** nhưng disabled + text "Cần thêm 15 Coin" cạnh nút (§13.4). Không ẩn nút, không mở popup bán hàng.
- **Không có mua Coin bằng tiền thật trong UI hiện tại.** Nếu sau này có, không được đặt ở luồng cứu streak (§10.3).

### 10.3. Streak

- Hiển thị: Streak Flame (§6.7), luôn thấy trong phiên học.
- **Mất streak:** popup tối đa 1 lần/ngày, tối đa 1 lần/phiên. Copy theo §13.3. Snapy dùng `expr_sad` + `ear_droop` — nhưng **một lần duy nhất**, không lặp animation.
- **Không** countdown "còn 3 giờ để giữ chuỗi". **Không** guilt-trip. **Không** bán vật phẩm cứu chuỗi.
- Mốc 7/30/100 ngày: badge `reward-500` + confetti 1000ms (§11.4).

### 10.4. Leaderboard

Chỉ có **bảng xếp hạng cá nhân theo XP tuần**. Không có nhóm học, không có cộng đồng, không có tab Community.

**Leaderboard Row:** cao 64px, padding 12px/16px, divider 1px `border`.

| Vùng | Nội dung |
| --- | --- |
| Rank | Số `numeral` 24px. Top 1–3 dùng `reward-500`; còn lại `neutral-500` |
| Avatar | 32px (§6.11) |
| Tên | `body-medium`, 1 dòng, ellipsis |
| XP tuần | `numeral` tabular, canh phải, màu `reward-700` |
| Trend | ▲ `primary-500` / ▼ `neutral-400` / — `neutral-300` |

- **Hàng của chính người dùng:** fill `primary-50`, viền trái 3px `primary-500`, luôn dính (sticky) trong viewport khi cuộn.
- Trend đi xuống dùng `neutral-400`, **không** dùng `danger-500` (§01.4).
- Snippet ở Home hiện 3 hàng + hàng của người dùng nếu ngoài top 3.

### 10.5. Achievement & Daily Mission

**Mission Card:** `radius-lg`, `elev-2`, gồm icon nhiệm vụ 40px, tiêu đề `h4`, progress bar mảnh 8px + nhãn `3/5`, và phần thưởng dạng chip XP/Coin bên phải.

| State | Hiển thị |
| --- | --- |
| Đang làm | Progress bar `primary-500`, chip thưởng opacity 0.6 |
| Hoàn thành, chưa nhận | Viền 2px `reward-500`, nút `reward` "Nhận" + glow `elev-reward` |
| Đã nhận | Fill `muted`, tick ✓ `primary-500`, chip thưởng gạch mờ |

- Nhiệm vụ **bắt buộc** và **bonus** phân biệt bằng nhãn chữ ("Bonus"), không chỉ bằng màu.
- **Achievement Badge:** tròn 64px, fill `reward-500`, icon trắng. Chưa đạt → fill `muted`, icon `neutral-400`, **vẫn hiện** tên và điều kiện đạt (không dùng dấu ? bí ẩn).
- Lần đầu nhận badge: scale-in 480ms overshoot + `elev-reward` glow tắt sau 2s.

### 10.6. Chest & Activity Stamp

**Activity Stamp:** ô 40×40 `radius-md`. Chưa có → viền 2px dashed `border` + số ngày `caption`. Đã có → fill `primary-100` + tick `primary-600`. Tối đa 1 stamp/ngày, chỉ đóng sau khi nhận Daily Chest, và **không backfill** — ngày đã qua giữ nguyên trạng thái rỗng, không có UI "mua bù".

**Weekly Chest:** 3 thẻ ngang, mỗi thẻ ghi rõ mốc và phần thưởng.

| Rương | Mốc | Thưởng | Màu |
| --- | --- | --- | --- |
| Đồng | 3 stamp | 50 Coin | `#B87333` |
| Bạc | 5 stamp | 100 Coin + XP Booster 1h | `#A8B0BC` |
| Vàng | 7 stamp | 200 Coin + badge/khung avatar đặc biệt | `reward-500` |

- Chưa đạt mốc: thẻ opacity 0.5 + nhãn "Còn 2 ngày nữa".
- Đạt mốc, chưa nhận: viền 2px `reward-500` + nút `reward` "Mở rương" + nhịp bounce nhẹ 2 lần rồi dừng.
- Đã nhận: fill `muted` + "Đã nhận ✓". Mỗi tier nhận 1 lần/tuần, **hết tuần là mất**, **không auto-claim** → phải có badge số trên tab để người dùng biết còn rương chưa mở.
- Mở rương: confetti 1000ms + Snapy `pose_celebrate` (§11.4).

---

## 11. Motion

### 11.1. Token thời lượng & easing

| Token | Thời lượng | Easing | Dùng ở |
| --- | --- | --- | --- |
| `motion-instant` | 120ms | `ease-out` | Pressed state, ripple |
| `motion-fast` | 200ms | `ease-out` | Hover, cross-fade, đổi màu |
| `motion-base` | 240ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Chuyển state component, lift card |
| `motion-emphasis` | 320ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Flip flashcard, feedback đúng/sai, morph badge |
| `motion-progress` | 480ms | `ease-out` | Fill progress bar, scale-in badge |
| `motion-celebrate` | 1000ms | — | Confetti |
| `motion-nav` | 280ms | `ease-in-out` | Chuyển screen |

**Easing chuẩn là spring có overshoot** `cubic-bezier(0.34, 1.56, 0.64, 1)`. Không dùng `linear` cho bất kỳ chuyển động hình học nào; `linear` chỉ dành cho spinner quay và progress đang tải vô định.

### 11.2. Micro interaction

| Tương tác | Hiệu ứng | Thời lượng |
| --- | --- | --- |
| Bấm button | `translateY(2px)` + bottom border 4→2px | 120ms |
| Bấm card | Scale 0.98 + `elev-2`→`elev-3` | 120ms |
| Focus input | Ring 3px xuất hiện | 200ms |
| Toggle checkbox | Scale 0.8→1.15→1.0 (spring) | 240ms |
| Chip filter chọn | Fill cross-fade + viền dày lên | 200ms |
| XP tăng | Count-up số + chip scale 1.0→1.12→1.0 | 600ms |
| Progress tăng | Fill width | 480ms |
| Badge lên Mastered | Morph badge + sparkle 3 hạt | 320ms |
| Trả lời đúng | Glow `elev-correct` + sparkle 3–4 hạt | 320ms |
| Trả lời sai | Shake ngang 4px, 2 nhịp | 240ms |
| Flip flashcard | rotateY 180° | 320ms |
| Bottom sheet mở | Slide-up + backdrop fade | 280ms |

**Không có tương tác nào im lặng.** Mọi `onPress` phải có ít nhất một trong: đổi màu, dịch chuyển, scale, haptic.

### 11.3. Snapy animation

Định nghĩa đầy đủ ở [mascot_snapy.md §8](./design/mascot_snapy.md). Bảng dưới là hợp đồng sử dụng — **không được sửa thông số ở đây**.

| Animation | Thời lượng | Kiểu | Dùng khi |
| --- | --- | --- | --- |
| `idle` | 2400ms ∞ | sine | Snapy đứng yên trên screen |
| `wave` | 900ms | spring damping 12 | Onboarding, chào mừng |
| `bounce_in` | 450ms | spring overshoot 1.15 | Snapy vào màn hình |
| `scan_pulse` | 1200ms ∞ | — | **Scan Overlay (§8.2)** |
| `jump_celebrate` | 800ms | spring + squash/stretch | Level-up, mở rương, hoàn thành phiên |
| `ear_droop` | 600ms | — | Mất streak (1 lần, không lặp) |
| `head_tilt` | 500ms | — | Độ tin cậy thấp, empty state |
| `confetti` | 1000ms | — | Kèm `jump_celebrate` |

**Nguyên tắc:** squash/stretch ≤ 10%; anticipation ≥ 80ms trước mọi chuyển động lớn; đuôi là secondary motion trễ 80–120ms sau thân; blink mỗi 3–6s trong 120ms.

**Giới hạn tần suất:** tối đa **1 popup Snapy nói chuyện / phiên học**; tối đa **1 popup mất streak / ngày**. Snapy không được che nội dung đang đọc.

### 11.4. Confetti — chỉ dành cho hoàn thành

Confetti (1000ms, hạt màu `primary-500` / `reward-500` / `mascot-500` / `info-500`) chỉ dùng cho **5 sự kiện**:

1. Hoàn thành phiên học/ôn tập
2. Level-up
3. Mở Weekly Chest
4. Mốc streak 7/30/100 ngày
5. Đạt achievement mới

**Không** dùng confetti cho từng câu trả lời đúng — câu đúng chỉ có sparkle 3–4 hạt (§7.4). Confetti mất giá trị nếu bắn liên tục.

### 11.5. Reduced motion

Khi `prefers-reduced-motion` bật (hoặc toggle trong Cài đặt):

| Bình thường | Reduced |
| --- | --- |
| Confetti 1000ms | Một star burst tĩnh, hiện 600ms |
| Spring overshoot | Ease-out, không overshoot |
| Mọi transition | Rút về 120ms |
| Animation lặp `idle` / `scan_pulse` | **Dừng** — Snapy giữ pose tĩnh |
| Shake khi sai | Không shake; giữ viền + icon + chữ |
| Count-up số | Nhảy thẳng tới giá trị cuối |
| Flip flashcard | Cross-fade 120ms, không rotate 3D |

**Mọi thông tin phải còn nguyên khi tắt animation.** Nếu một trạng thái chỉ nhận biết được nhờ chuyển động, đó là bug accessibility.

---

## 12. Accessibility

Accessibility là nguyên tắc số 1 (§01.1) — không có ngoại lệ, không có "để sau".

### 12.1. Contrast — số đo bắt buộc

Mục tiêu: **WCAG AA 4.5:1** cho body text, **AAA 7:1** cho text chính trên nền chính, **3:1** cho text lớn (≥ 18px bold) và cho ranh giới của UI component.

| Cặp | Tỉ lệ | Đạt |
| --- | --- | --- |
| `neutral-800` `#171A2F` trên `#FFFFFF` | ~15.8:1 | AAA |
| `neutral-500` `#565879` trên `#FFFFFF` | ~6.6:1 | AA (dùng cho text phụ, không dùng cho body chính) |
| `#FFFFFF` trên `primary-500` `#58CC02` | ~2.2:1 | ❌ **không đạt** — xem quy tắc dưới |
| `neutral-800` trên `primary-500` | ~7.4:1 | AAA |
| `primary-800` `#2F6E00` trên `primary-100` | ~7.1:1 | AAA |
| `reward-700` `#B37F00` trên `reward-100` | ~5.0:1 | AA |
| `#92400E` trên `#FEF3C7` | ~7.3:1 | AAA |
| `neutral-50` `#EEEFF3` trên `neutral-900` `#0D0E1A` | ~15.2:1 | AAA |
| `primary-300` `#A0E063` trên `neutral-900` | ~11.4:1 | AAA |

> **Quy tắc bắt buộc từ hàng ❌:** chữ trắng trên `primary-500` **không đạt AA cho text thường**. Vì vậy:
> - Nhãn button primary dùng Nunito **700, ≥ 15px, uppercase** → tính là large text, ngưỡng 3:1 → vẫn chưa đạt 3:1 (2.2:1). **Bắt buộc thêm** `textShadow` `0 1px 0 rgba(0,0,0,0.25)` cho nhãn button primary, hoặc dùng `neutral-800` làm màu chữ.
> - **Quyết định:** nhãn button primary dùng `#FFFFFF` + textShadow như trên (giữ nhận diện), nhưng **mọi text thường trên nền xanh** (banner, badge có câu dài) phải dùng `neutral-800` hoặc đổi nền sang `primary-100`.
> - Không bao giờ đặt `body` 16px màu trắng lên `primary-500`.

Mọi cặp màu mới đưa vào code phải được thêm một hàng vào bảng này kèm số đo. Không có cặp màu nào "chắc là ổn".

### 12.2. Màu không bao giờ là tín hiệu duy nhất

Mỗi trạng thái phải mang **ít nhất 2 trong 3** tín hiệu: màu, icon/hình, chữ. Danh sách kiểm:

| Trạng thái | Màu | Icon | Chữ |
| --- | --- | --- | --- |
| Đúng / Sai (§7.4) | ✓ | ✓ ✓/✕ | ✓ "Chính xác!"/"Chưa đúng" |
| Learning state (§09) | ✓ | ✓ ○◐◕★ | ✓ nhãn VN |
| Confidence (§8.4) | ✓ | ✓ ✓✓/✓/? | ✓ "Đáng tin"/"Khá chắc"/"Chưa chắc" |
| Source tag (§8.6) | ✓ | ✓ 📷/🔍/▦ | ✓ SCAN/DICT/TOPIC |
| Progress (§6.4) | ✓ | — | ✓ `7/12 từ` |
| Streak (§6.7) | ✓ | ✓ lửa fill/outline | ✓ số ngày |
| Mission state (§10.5) | ✓ | ✓ tick | ✓ `3/5` + "Bonus" |
| Trend leaderboard | ✓ | ✓ ▲▼— | — (icon + màu là đủ 2/3) |

### 12.3. Focus & keyboard

- **Focus ring 3px** `ring` @ 35% (`elev-focus`), offset 2px, hiện trên **mọi** element focus được — kể cả trên nền camera (đổi ring sang trắng).
- Thứ tự focus theo thứ tự đọc. Modal/bottom sheet **bẫy focus** bên trong và trả focus về trigger khi đóng.
- Không có control quan trọng nào chỉ hoạt động khi hover — thiết bị cảm ứng không có hover.

### 12.4. Screen reader

- **`alt` mô tả trạng thái, không mô tả nhân vật.** Đúng: "Đang xử lý ảnh". Sai: "Snapy con cáo đang cầm kính lúp". (Quy tắc từ [mascot_snapy.md §11.3](./design/mascot_snapy.md).)
- Thoại của Snapy phải là **text i18n thật**, không phải chữ nằm trong ảnh — screen reader và dịch thuật đều cần đọc được.
- Từ vựng: label đọc đủ "bicycle, xe đạp, đang học". Không đọc rời từng badge.
- Nút 🔊 có `accessibilityLabel` "Phát âm bicycle", không phải "loa".
- Số đang đổi (XP, Coin) dùng `accessibilityLiveRegion="polite"`; overlay xử lý dùng `"assertive"`.
- Bounding box là ảnh trang trí (`accessibilityElementsHidden`) — thông tin thật nằm ở Detected Item Card.

### 12.5. Tap target & touch

- Tối thiểu **48×48px**, khoảng cách giữa target ≥ 8px (§5.3).
- Không có thao tác nào **chỉ** làm được bằng swipe/long-press — luôn có đường tap tương đương.
- Không autoplay âm thanh. Phát âm từ luôn cần một cú tap.

### 12.6. High contrast mode

Khi bật (Cài đặt → Hiển thị):

- Nền chuyển thuần `#FFFFFF` / `#000000`; text `neutral-800` / `#FFFFFF`.
- Mọi border dày lên 2px và đổi sang `neutral-800` / `#FFFFFF`.
- Bỏ mọi illustration trang trí, giữ Snapy chỉ ở các screen mà Snapy mang thông tin (scan overlay, empty state).
- Fill tint (`primary-50`, `reward-100`, …) chuyển thành viền + nhãn chữ.

### 12.7. Kích thước chữ hệ thống

UI phải chịu được `fontScale` tới **200%**: mọi container cao theo nội dung, không cố định `height` cho vùng có text; nhãn button được wrap 2 dòng; badge có `minHeight` thay vì `height`.

---

## 13. Voice & Tone

### 13.1. Bốn thuộc tính giọng

| Thuộc tính | Nghĩa | Đúng | Sai |
| --- | --- | --- | --- |
| **Thân thiện, không trẻ con** | Ấm áp nhưng tôn trọng | "Chưa đúng — thử lại nhé" | "Oopsie! Sai rồi hihi" |
| **Tò mò, khuyến khích** | Đặt câu hỏi thay vì ra lệnh | "Bạn nhận ra gì ở từ này?" | "Học đi!" |
| **Khen cụ thể** | Nêu đúng điều người học làm được | "Bạn nhớ đúng 'bicycle' — từ này dễ lẫn với 'motorbike'" | "Tuyệt vời!" |
| **Sai là học, không phải thất bại** | Kèm lý do và bước tiếp theo | "Chưa đúng — 'motorbike' là xe máy. Xem lại nhé?" | "SAI" |

### 13.2. Người & đại từ

- Gọi người học là **"bạn"**. Không "tôi", không "quý khách", không "người dùng".
- Snapy tự gọi mình là **"mình"**. Trong tiếng Anh, Snapy dùng **they/them**. Không "cậu ấy"/"cô ấy".
- Không so sánh người học với người khác. Leaderboard hiển thị số, nhưng copy không phán xét ("Bạn đang thứ 5" — không "Bạn đang tụt lại").

### 13.3. Copy chuẩn cho các trạng thái

| Trạng thái | Copy |
| --- | --- |
| Trả lời đúng | "Chính xác!" |
| Trả lời sai | "Chưa đúng" + explanation (§7.5) |
| Đang scan | "Mắt thần đang nhìn... Đợi chút nhé!" |
| Độ tin cậy thấp | "Hình như đây là..." |
| Không nhận ra vật thể | "Mình chưa nhận ra gì trong ảnh này. Thử chụp gần hơn nhé?" |
| Toàn bộ tin cậy thấp | "Mình chưa nhìn rõ lắm. Bạn thử chụp gần hơn nhé?" |
| Từ điển không có nghĩa | "Chưa có nghĩa — bạn tự thêm nhé?" |
| Hết lượt scan | "Bạn đã dùng hết 10 lượt scan hôm nay. Làm mới lúc 00:00." |
| Lỗi mạng | "Không kết nối được. Kiểm tra mạng rồi thử lại nhé." |
| AI timeout | "Mình chưa nhìn kịp. Thử lại nhé?" |
| Hết phiên đăng nhập | "Bạn cần đăng nhập lại để tiếp tục." |
| Từ chối quyền camera | "SnapVocab cần camera để chụp và nhận diện từ vựng." + "Mở cài đặt" |
| Ôn xong hôm nay | "Bạn đã ôn xong hôm nay! 🎉" |
| Chưa có từ nào | "Chưa có từ nào ở đây — chụp một tấm để bắt đầu nhé!" |
| Tìm không ra | "Không tìm thấy từ nào khớp. Thử từ khoá khác?" |
| Thiếu từ để tạo quiz | "Cần ít nhất 4 từ để làm quiz. Học thêm vài từ nữa nhé!" |
| Mất streak | "Chuỗi của bạn dừng ở 12 ngày. Hôm nay bắt đầu chuỗi mới nhé!" |
| Level-up | "Bạn lên Level 7!" |
| Mở rương | "Rương Bạc: 100 Coin + Tăng tốc 1 giờ" |

### 13.4. Quy tắc viết

- **Empty state luôn mời gọi, luôn có CTA.** Không có empty state nào chỉ nói "Không có dữ liệu".
- **Lỗi luôn có ba phần:** chuyện gì xảy ra, vì sao (nếu biết), làm gì tiếp. Không hiện mã lỗi kỹ thuật cho người học.
- **Disabled luôn kèm lý do** đặt cạnh control, không nằm trong tooltip hover-only.
- **Emoji:** tối đa **1 emoji / message**, và chỉ ở thông báo ăn mừng hoặc phần thưởng. Không rải emoji trong nhãn UI, không dùng emoji thay icon trong component (ngoại lệ đã chốt: 🔊 phát âm, và bộ icon tag ở §8.6).
- **Không dấu chấm than kép.** Một "!" là đủ.
- **Câu ngắn.** Tối đa 2 câu cho một thông báo; explanation tối đa 2 câu.
- **Không viết hoa toàn bộ** (trừ nhãn button, §04.3).
- **Tất cả copy nằm trong i18n**, không hardcode chuỗi tiếng Việt trong component.

---

## 14. Dark Mode

Dark mode là bề mặt SnapVocab tự định nghĩa — không kit tham khảo nào có sẵn.

### 14.1. Nguyên tắc

1. **Không đảo màu.** Dark mode là một bộ giá trị semantic riêng (§3.6), không phải filter invert.
2. **Nền không thuần đen.** `#0D0E1A` — đen thuần làm viền và shadow biến mất, phá `elev-*`.
3. **Surface sáng dần theo độ cao.** Nền `neutral-900` → card `neutral-800` → sheet/modal `neutral-700`. Không dùng shadow để phân tầng ở dark mode (shadow không nhìn thấy) — dùng chênh lệch surface + border.
4. **Accent phải sáng lên.** Màu bão hoà mạnh trên nền tối bị "rung"; mỗi accent dịch lên 2 bậc.
5. **Bottom-border elevation vẫn giữ** (§5.4) nhưng đổi sang bậc **sáng hơn** thân element, không phải tối hơn — vì tối hơn sẽ trùng nền.

### 14.2. Bảng giá trị dark

| Vai trò | Light | Dark |
| --- | --- | --- |
| Nền trang | `#FFFFFF` | `#0D0E1A` |
| Card | `#FFFFFF` | `#171A2F` |
| Sheet / modal | `#FFFFFF` | `#2A2C47` |
| Text chính | `#171A2F` | `#EEEFF3` |
| Text phụ | `#5C5E6E` | `#9497A8` |
| Border / input | `#D4D5DF` | `#3D3F5E` |
| Accent hành động | `primary-500` `#58CC02` | `primary-400` `#7DD634` |
| Fill CTA | `primary-500` | `primary-500` (giữ, vì text trên nó không đổi) |
| Bottom border CTA | `primary-700` `#3C8C00` | `primary-700` `#3C8C00` |
| Text accent trên nền | `primary-800` | `primary-300` `#A0E063` |
| Tint nền accent | `primary-50` | `primary-900` @ 40% |
| Reward | `reward-500` | `reward-500` (giữ nguyên, đã đủ sáng) |
| Text reward | `reward-700` | `reward-300` `#FFDA6B` |
| Mascot / streak | `mascot-500` `#FF8A00` | `mascot-rim` `#FFB65C` |
| Info | `info-500` `#1CB0F6` | `#5CC4F8` |
| Warning | `warning-500` `#F59E0B` | `#FBBF24` |
| Destructive | `#EF4444` | `#F87171` |
| Ring focus | `#58CC02` | `#7DD634` |

### 14.3. Snapy ở dark mode

- Snapy **giữ nguyên** palette mascot — không làm tối lông cáo.
- Bắt buộc thêm **rim light `mascot-rim` `#FFB65C`** viền ngoài silhouette khi Snapy đứng trên `neutral-800`/`neutral-900`, theo [mascot_snapy.md](./design/mascot_snapy.md).
- Nền illustration `mascot-bg` `#FFF8EF` **không dùng ở dark mode** — Snapy đứng trực tiếp trên `background`.

### 14.4. Ba chỗ dễ vỡ, phải kiểm riêng

| Chỗ | Rủi ro | Xử lý |
| --- | --- | --- |
| **Camera / Scan UI (§08)** | Chrome đã là trắng-trên-preview, không theo theme | Camera screen **không có dark variant** — luôn dùng chrome trắng + drop-shadow. Overlay giữ `rgba(13,14,26,0.72)` ở cả hai theme |
| **Ảnh crop từ vựng** | Ảnh sáng trên card tối tạo viền chói | Thêm viền 1px `border` quanh mọi ảnh crop ở dark mode |
| **Bounding box `warning-500`** | Vàng-cam trên ảnh tối khó tách khỏi nội dung | Giữ nguyên màu box nhưng nhãn chip đổi text sang `neutral-900` để không mất tương phản |

### 14.5. Chuyển theme

Theo hệ thống mặc định, có override 3 lựa chọn trong Cài đặt: Sáng / Tối / Theo hệ thống. Chuyển theme cross-fade 200ms toàn màn hình, không animate từng element.

---

## 15. Do / Don't

### 15.1. Quiz

**Do**

1. **Phản hồi đáp án trong ≤ 200ms.** Chọn xong là thấy ngay glow đúng / shake sai. Phản hồi trễ giết hứng học (§7.4).
2. **Cho thấy tiến độ và thành tích rõ.** Số câu `3/10`, XP kiếm được, streak — đặt ở đầu screen bằng `numeral` (Nunito 800, tabular).
3. **Streak luôn thấy trong phiên.** Streak Flame ở top navigation, không ẩn khi vào quiz.
4. **Nếu có timer, timer phải thông tin chứ không gây sợ.** Chuyển màu theo gradient `info → warning`, dừng ở `warning-500`. **Không** nhảy sang `danger-500`, không âm báo dồn dập, không rung liên tục.
5. **Ăn mừng mốc thật.** Hoàn thành phiên, level-up, achievement — confetti + Snapy `jump_celebrate`.
6. **Ghép icon với màu ở mọi trạng thái đúng/sai** (§12.2) — người mù màu phải phân biệt được.

**Don't**

1. **Không trừng phạt câu sai.** Không màn hình đỏ, không chữ "SAI" to, không âm thanh buzz. Câu sai dùng `warning-500` + explanation (§7.4).
2. **Không ẩn explanation.** Mọi câu sai đều phải có lý do và đáp án đúng (§7.5).
3. **Không lấy timer làm trọng tâm.** Chế độ tính giờ là tuỳ chọn, phải gắn nhãn trước khi bắt đầu.
4. **Không auto-advance dưới 1.2s.** Người học cần đọc kịp phản hồi (§7.4).
5. **Không nhồi Home.** Home có đúng một CTA chính ("Học ngay" / "Tiếp tục"); thống kê và cài đặt để tab khác.
6. **Không dùng `danger-500` cho việc học.** Đỏ chỉ dành cho lỗi hệ thống và hành động phá hủy (§03.1).

### 15.2. Flashcard

**Do**

1. **Mặt trước chỉ có từ + IPA + 🔊.** Không hé nghĩa, không gợi ý — che nghĩa là toàn bộ giá trị của flashcard.
2. **Flip bằng tap, animation 320ms.** Tap là thao tác duy nhất cần thiết; swipe (nếu có) chỉ là lối tắt bổ sung.
3. **Chỉ hiện 4 nút đánh giá FSRS sau khi đã flip.** Trước khi thấy đáp án thì không có gì để tự đánh giá.
4. **Bốn nút cùng một variant.** `Lại`/`Khó`/`Tốt`/`Dễ` là tự đánh giá của người học, không phải phán xét — không nhuộm màu theo độ khó.
5. **Đếm số thẻ còn lại dạng `4/12`.** Người học cần biết còn bao xa.
6. **Ảnh crop từ scan đặt ở mặt trước.** Đó là điểm mạnh riêng của SnapVocab: từ gắn với hình thật người học đã chụp.

**Don't**

1. **Không auto-flip.** Người học tự quyết định khi nào mình đã nhớ xong.
2. **Không dùng đồng hồ đếm ngược trên flashcard.** Ôn tập spaced-repetition không phải bài kiểm tra tốc độ.
3. **Không bắt buộc swipe.** Cử chỉ swipe không phát hiện được bằng screen reader và khó với người hạn chế vận động (§12.5).
4. **Không hiện thẻ rỗng.** Hết thẻ đến hạn → empty state "Bạn đã ôn xong hôm nay! 🎉" + CTA học từ mới.
5. **Không đổi thứ tự thẻ theo cảm tính UI.** Thứ tự do FSRS quyết định; UI không được sort lại.

### 15.3. Token & hệ thống

**Do**

1. **Sửa token ở tài liệu này trước, rồi mới sửa `global.css` + `colors.js`.** Đây là source of truth (đầu tài liệu).
2. **Component đọc semantic token** (`background`, `foreground`, `border`, `ring`…), không đọc trực tiếp `primary-500`.
3. **Mọi cặp màu mới phải có một hàng trong §12.1** kèm số đo contrast.
4. **Giữ thang `neutral` nguyên vẹn** — có ~78 call-site đang phụ thuộc.
5. **Sửa palette Snapy ở `mascot_snapy.md`**, rồi đồng bộ về §3.4 — không sửa ngược chiều.

**Don't**

1. **Không dùng `reward-*` ngoài XP/Coin/Chest/Badge/Mastered** (§01.5).
2. **Không dùng màu mascot cho UI chrome**, trừ `mascot-500` ở streak và tag `SCAN` (§03.4).
3. **Không hardcode hex trong component.** Nếu cần một màu chưa có token, thêm token vào tài liệu này trước.
4. **Không có element mảnh, mờ, "tinh tế".** Không border 1px cho thứ bấm được, không shadow thay cho bottom border, không text < 14px (§01.2, §04.3).
5. **Không dùng góc vuông** ở bất kỳ surface nào (§05.2).
6. **Không quá 3 accent trong một screen state** (§01.6).
7. **Không hardcode ngưỡng 21 ngày** của trạng thái Mastered — đọc từ config dùng chung (§09.1).
8. **Không dùng thuật ngữ của design system tham khảo** trong code hay tài liệu. Chỉ tồn tại tên token của SnapVocab: `primary`, `reward`, `mascot`, `info`, `warning`, `danger`, `neutral`.

---

## Phụ lục — Bản đồ triển khai

| Nội dung tài liệu | File code |
| --- | --- |
| §03 Color System | `src/global.css` (`@theme --color-*`), `src/components/ui/colors.js` |
| §3.6 Semantic token | `src/global.css` (`--color-background`, `--color-ring`, …) |
| §04 Typography | `app.config.ts` (`expo-font` plugin: Inter + Nunito), `src/global.css` (`--font-family-*`) |
| §05 Spacing & Shape | `src/global.css` (`--spacing-*`, `--radius-*`) |
| §06 Components | `src/components/ui/` |
| §07 Learning Components | `src/components/` (flashcard, quiz, vocabulary card) |
| §08 Scan UI | `src/components/` (camera, scan overlay, detected-item-card) |
| §09 Learning State | Dẫn xuất FSRS — hằng số ngưỡng dùng chung |
| §11 Motion | `src/components/mascot.tsx` + animation token |
| §14 Dark Mode | `src/global.css` block `@media (prefers-color-scheme: dark)` |
| §2.2 Icon & splash | `app.config.ts` (`expo-splash-screen`, `android.adaptiveIcon`) |
