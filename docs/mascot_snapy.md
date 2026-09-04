# SnapVocab Mascot — Snapy (Character Design Spec)

Tài liệu này định nghĩa **Snapy** — mascot chính thức của SnapVocab — ở mức đủ chi tiết để designer vẽ lại, animator dựng chuyển động và developer tích hợp asset vào app mà không cần hỏi lại.

Tài liệu này là **source of truth cho mọi hình ảnh Snapy**. Các chỗ trong [phan_ra_man_hinh.md](../spec/phan_ra_man_hinh.md) đang ghi chung là "Mascot" (MH-ONBOARD-01, MH-MAIN-01 streak lost, MH-CAMERA-01 loading, MH-CAMERA-02 low confidence) phải dùng đúng biểu cảm ở §5 / pose ở §6 theo bảng mapping §10.

---

## 0. Master Reference (nguồn hình học)

| Slot | File | Trạng thái |
| --- | --- | --- |
| Front 0° | `snapy_master_front.png` | ⬜ chưa duyệt |
| Three-quarter 45° | `snapy_master_three_quarter.png` | ⬜ chưa duyệt |
| Side 90° | `snapy_master_side.png` | ⬜ chưa duyệt |

Ba file trên là **nguồn hình học duy nhất** của Snapy. Không render/vẽ asset production nào trước khi cả 3 được duyệt — đây là blocking deliverable, không phải nice-to-have.

Thứ tự ưu tiên khi Master Reference và tài liệu này xung đột:

1. **Hình học** (tỷ lệ, hình tai/mắt/mõm/đuôi, cắt may hoodie) → Master Reference thắng.
2. **Màu** (§3) → tài liệu này thắng; nếu master lệch token thì sửa master, không sửa §3.
3. **Pose, biểu cảm, animation, mapping** (§5–§6, §8, §10) → tài liệu này thắng.

Khi master đổi: bump version (`snapy_master_v2_front.png`), đo lại §2.3 từ master mới, và re-audit toàn bộ asset đã render từ master cũ. Không tồn tại 2 version master hợp lệ cùng lúc.

## 1. Character identity

| Thuộc tính | Giá trị |
| --- | --- |
| Tên | **Snapy** |
| Loài | Cáo cam (orange fox) |
| Giới tính | **Không xác định** — mọi copy tiếng Việt gọi là "Snapy", tiếng Anh dùng `they/them`, không dùng "cậu ấy/cô ấy" |
| Tuổi cảm nhận | ~8–10 tuổi (chibi, trẻ nhưng không sơ sinh) |
| Vai trò sản phẩm | Bạn học đồng hành: nhắc ôn tập, khen tiến bộ, giải thích khi AI đoán sai |
| Tagline nhân vật | "Xin chào! Mình là Snapy 🐾" |
| Self-intro (dùng ở MH-ONBOARD-01) | "Mình là cáo cam – linh hoạt, nhanh nhẹn và luôn sẵn sàng giúp bạn chụp lại những từ vựng quan trọng, biến việc học trở nên thú vị mỗi ngày!" |

### 1.1. Tính cách (4 trait cốt lõi)

| Trait | Ý nghĩa | Biểu hiện hình ảnh | Biểu hiện copy |
| --- | --- | --- | --- |
| **Linh hoạt, nhanh nhẹn** | Cáo = phản xạ nhanh, khớp hành vi "snap" | Pose động, tai dựng, đuôi vung | Câu ngắn, động từ mạnh: "Chụp ngay!" |
| **Ghi nhớ thông minh** | Đại diện SRS/FSRS | Sách, kính, ngón tay chỉ | Nhắc kèm lý do: "Đến hạn ôn 12 thẻ rồi nhé" |
| **Luôn tích cực, truyền cảm hứng** | Không phán xét khi sai | Mắt cong, miệng mở | Khen tiến bộ, không so sánh với người khác |
| **Thân thiện, đáng tin cậy** | Trẻ em/học sinh dùng được | Bo tròn, không góc nhọn, không răng nanh | Không hù dọa, không guilt-trip nặng |

### 1.2. Tone of voice

- Ngôi thứ nhất "**mình**", gọi người dùng là "**bạn**". Không dùng "tôi/quý khách/người dùng".
- Câu ≤ 12 từ trong bong bóng thoại; ≤ 2 câu trong popup.
- Được phép dùng emoji ở cuối câu (tối đa 1): 🎉 🐾 ✨ 🔥.
- **Không** dùng: mắng, đếm lỗi ("bạn sai 5 lần"), so sánh xếp hạng để chê, hoặc từ ngữ tạo áp lực mua hàng.
- Khi người dùng mất streak: đồng cảm rồi mời làm lại — **không** bán Streak Freeze (MVP không có tính năng này, xem MH-MAIN-01).

---

## 2. Construction & tỷ lệ

### 2.0. Visual rendering style

Style định nghĩa bằng đặc tính kỹ thuật, **không** bằng tên studio — mô tả kiểu "Pixar-lite" cho ra kết quả khác nhau giữa mỗi designer và mỗi lần generate.

**Bắt buộc có:**

- Stylized 3D character, hình khối bo tròn hoàn toàn
- Bề mặt soft-plastic toy: highlight bóng mềm diện rộng, không specular gắt
- Fur thể hiện bằng vệt/khối lông cách điệu ở khớp và chóp đuôi, không phải sợi lông render
- Mắt lớn, tròn, 2 highlight (§2.3)
- Key light trên-trái 45°, fill nhẹ bên phải, ambient occlusion mềm ở nếp gấp và chân
- Đổ bóng dưới chân: elip mềm, opacity ≤ 25%

**Không được có:**

- Viền stroke đen hoặc cel-shading bậc cứng
- Fur photorealistic, sợi lông rời
- Giải phẫu cáo thật (mõm dài, chân thanh, móng nhọn)
- Móng, răng nanh, hoặc bất kỳ chi tiết nhọn
- Texture noise/grain trên lông

Mood reference (chỉ để hiểu vibe, **không phải tiêu chuẩn duyệt**): nhân vật phim hoạt hình chiếu rạp, premium, thân thiện với trẻ em.

### 2.1. Hệ đơn vị & tỷ lệ

**Định nghĩa head-height:** đo từ **đáy hàm (chin) đến đỉnh hộp sọ**, **không tính tai**. Mọi con số dưới đây normalize theo `Total height = 400u`, tức `1 head = 100u`.

| Bộ phận | Đo từ → đến | Giá trị |
| --- | --- | --- |
| Head | chin → đỉnh sọ | 100u |
| Neck + torso | chin → hông | 120u |
| Legs | hông → mắt cá | 120u |
| Feet | mắt cá → đáy bàn chân | 60u |
| **Total** | đỉnh sọ → đáy bàn chân | **400u (4 heads)** |
| Ears | đỉnh sọ → chóp tai | +55u, **không** tính vào 400u |
| Tail | gốc đuôi → chóp | 150u dài, dày nhất 70u |
| Cream tip đuôi | chóp đuôi vào | 30% chiều dài đuôi (45u) |

Hoodie tính trong khối torso (không cộng thêm chiều cao). Balo không ảnh hưởng total height.

Tỷ lệ đầu : thân = 100 : 120. Chiều cao tổng vẫn 4 heads vì chân + bàn chân = 180u.

### 2.1. Silhouette test (bắt buộc pass)

Fill toàn bộ nhân vật thành 1 màu đen: phải nhận ra Snapy nhờ **3 dấu hiệu** — tai tam giác nhọn, đuôi dày chóp bo, và khối hoodie vuông ở thân. Nếu bỏ đuôi mà vẫn nhận ra thì pose đó **thiếu đặc trưng cáo** → vẽ lại.

### 2.2. Trang phục (bắt buộc, không đổi giữa các pose)

| Bộ phận | Mô tả |
| --- | --- |
| Hoodie | Navy `#1E2A44`, tay dài, mũ trùm nằm sau cổ, có dây rút cream 2 bên |
| Camera badge | Patch vuông bo góc màu cam `#FF8A00` trên ngực **bên phải người xem**, in icon camera trắng — **đây là dấu hiệu nhận diện thương hiệu, không được bỏ ở bất kỳ pose nào** |
| Balo | Navy đậm hơn hoodie, dây cam, chỉ hiện rõ ở góc Bên/Sau |
| Sách VOCAB | Bìa nâu `#A75C21`, chữ `VOCAB` khắc chìm — prop tùy chọn |

**Quy tắc bất biến (invariants):** ở mọi biểu cảm, pose, turnaround và ứng dụng, Snapy luôn giữ: (1) hoodie navy, (2) camera badge cam trên ngực, (3) chóp đuôi cream, (4) mõm/má/bụng cream, (5) 2 highlight trong mắt. Vi phạm bất kỳ điểm nào = asset không hợp lệ.

**Visibility rule cho invariant:** "không được bỏ" nghĩa là *phải tồn tại trên model*, không phải *phải luôn nhìn thấy*.

- Camera badge, đuôi, dây rút, các vùng cream **phải tồn tại trên model/source ở mọi pose**.
- View `front` và `three_quarter` (mọi expression bust, app icon, key art): camera badge **phải nhìn thấy trọn vẹn và đọc được**.
- View `side`, `back`, `three_quarter_back`, và các pose có prop che ngực (`reading`, `snap`, `scanning`): badge được che một phần hoặc toàn bộ **một cách tự nhiên**.
- **Không** dịch/quay/scale badge sai vị trí giải phẫu chỉ để nó lộ ra. Che tự nhiên hợp lệ; badge "trượt" sang vai thì không.
- Prop không bao giờ che đồng thời cả badge **và** chóp đuôi — mỗi asset phải còn ≥ 1 dấu hiệu nhận diện thương hiệu nhìn thấy được.

**Được phép thay đổi:** prop trên tay (sách, cúp, bản đồ, kính, mũ), hướng đuôi, độ mở miệng, hiệu ứng quanh nhân vật (confetti, dấu `?`/`!`).

### 2.3. Facial geometry

Normalize theo **head width = 100**. Head height = 95 (đầu hơi bè ngang).

| Chỉ số | Giá trị |
| --- | --- |
| Eye width | 22 |
| Eye height | 26 |
| Eye center-to-center | 40 |
| Eye centerline (từ đỉnh sọ xuống) | 45% head height |
| Highlight lớn (trên-trái trong mắt) | 30% eye width |
| Highlight nhỏ (dưới-phải trong mắt) | 14% eye width |
| Nose width × height | 14 × 10 |
| Muzzle width × height | 42 × 30 |
| Muzzle protrusion (từ mặt phẳng má, đo ở view `side`) | 12 |
| Mouth width (lúc mở rộng nhất) | 34 |
| Ear base width | 26 |
| Ear height (trên đỉnh sọ) | 55 |
| Inner-ear inset (viền cam còn lại) | 6 mỗi bên |
| Cheek cream patch (đường kính) | 24 |

⚠️ **Provisional.** Bộ số này là điểm khởi đầu để dựng Master Reference. Sau khi master được duyệt ở §0, **đo lại từ master và thay số thật vào bảng này** — từ đó bảng trở thành bản ghi số đo của master, không phải một nguồn cạnh tranh.

---

## 3. Bảng màu nhân vật

Đây là palette **riêng của mascot**, tách khỏi UI palette trong [design.md](../design.md) (UI primary là xanh lá `#58cc02`). Snapy **không** đổi sang xanh lá; cam là màu nhận diện nhân vật, xanh lá vẫn là màu CTA của app.

| Token | Hex | Vai trò trên nhân vật |
| --- | --- | --- |
| `mascot-fur` | `#FF8A00` | Lông chính: đầu, thân, tay, chân, đuôi |
| `mascot-cream` | `#FFF3E0` | Mõm, má, bụng, chóp đuôi, dây rút hoodie |
| `mascot-brown` | `#A75C21` | Trong tai, gan bàn tay, bìa sách, shading lông |
| `mascot-navy` | `#1E2A44` | Hoodie, balo, đường viền mắt, mũi |
| `mascot-blue` | `#4DA3FF` | Accent phụ: dấu `?`, bong bóng suy nghĩ, hiệu ứng loading |
| `mascot-violet` | `#8B6CFF` | Accent phụ: confetti, hiệu ứng "ghi nhớ", badge trí tuệ |
| `mascot-bg` | `#FFF8EF` | Nền kem cho key art, sticker sheet, app store screenshot |

Quy tắc dùng màu:

- Tỉ lệ mục tiêu trên mỗi hình: **cam ~45% / navy ~25% / cream ~20% / nâu ~7% / accent ≤ 3%**.
- `mascot-blue` và `mascot-violet` chỉ dùng cho **hiệu ứng và prop**, không bao giờ tô lên lông hoặc hoodie.
- Nền tối (dark mode): giữ nguyên màu nhân vật, thêm rim light `#FFB65C` mỏng ở viền phải để tách khỏi nền `neutral-900`.
- Contrast: khi đặt Snapy cạnh text, text phải đạt WCAG AA trên `mascot-bg`; **không** đặt text trắng trực tiếp lên vùng lông cam.

---

## 4. Đặc điểm nổi bật (feature icons)

Dùng bộ 4 icon này khi giới thiệu Snapy (onboarding, about, store listing):

| Icon | Nhãn | Màu icon |
| --- | --- | --- |
| Camera | Linh hoạt, nhanh nhẹn | `#FF8A00` |
| Brain | Ghi nhớ thông minh | `#8B6CFF` |
| Star | Luôn tích cực, truyền cảm hứng | `#FFC42E` |
| Heart | Thân thiện, đáng tin cậy | `#FF5A4E` |

Bộ 4 pill năng lực dùng trên key art / onboarding: `Chụp nhanh` (cam), `Ghi nhớ` (violet), `Học mỗi ngày` (blue), `Tiến bộ` (green `#58cc02` — token UI primary, dùng để nối mascot với màu app).

---

## 5. Bộ biểu cảm (Expression set — 6 chuẩn)

Tất cả biểu cảm dựng ở **bust shot (nửa người, cắt ngang hông)**, chính diện hoặc lệch 3/4, dùng cho popup, toast, sticker và inline feedback. Asset naming: `snapy_expr_{slug}@{1x,2x,3x}.png` + `.json` nếu là Lottie.

| # | Biểu cảm | Slug | Mắt | Miệng | Tay / Prop | Hiệu ứng | Dùng khi |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Vui vẻ** | `happy` | Mở to, 2 highlight | Mở rộng cười, thấy lưỡi | Một tay khẽ nâng | Không | Trạng thái mặc định, empty state tích cực, chào mừng |
| 2 | **Nháy mắt** | `wink` | Mắt phải nhắm cong, mắt trái mở | Cười khép, một bên cao hơn | Tay phải chỉ ngón trỏ lên | Không | Gợi ý/tip, hint trong quiz, "biết một mẹo nhỏ" |
| 3 | **Tò mò** | `curious` | Mở to, nhìn lệch lên | Miệng nhỏ khép | Một tay đưa lên gần mõm | 2 dấu `?` xanh `#4DA3FF` lệch trên-phải | Chờ người dùng chọn, câu hỏi onboarding, tìm kiếm rỗng |
| 4 | **Tập trung** | `focus` | Sau kính tròn viền nâu, mắt hơi nheo | Khép, hơi mím | 2 tay giữ sách VOCAB mở | Không | Đang xử lý, đang học, quiz đang chạy, deep-work |
| 5 | **Bất ngờ** | `surprised` | Mở to nhất bộ (scale mắt 115%) | Chữ `O` tròn | 2 tay hơi nâng ngang vai | Dấu `!` cam lệch trên-phải | AI nhận diện được vật thể mới, đạt milestone lần đầu |
| 6 | **Tự hào** | `proud` | Nhắm cong lên (mắt cười) | Cười mở, đầu hơi ngửa | Tay nâng cúp vàng | Không (hoặc tia sáng nhỏ) | Level up, hoàn thành Daily Chest, hết SRS due |

### 5.1. Biểu cảm bổ sung (không có trong key art, cần cho spec app)

| # | Biểu cảm | Slug | Mô tả | Dùng khi |
| --- | --- | --- | --- | --- |
| 7 | **Tiếc nuối** | `sad` | Tai cụp về sau, mắt mở nhưng mí trên hạ, miệng khép hơi trễ, một tay chạm nhẹ ngực. **Không nước mắt, không khóc.** | Streak về 0 (MH-MAIN-01 popup 1 lần/ngày) |
| 8 | **Ngập ngừng** | `unsure` | Một tay gãi sau đầu, mắt lệch sang một bên, miệng méo nhẹ, 1 giọt mồ hôi nhỏ | AI confidence thấp (MH-CAMERA-02): "Hình như đây là..." |
| 9 | **Ngủ / nghỉ** | `sleepy` | Mắt nhắm 2 vạch, bong bóng `z` nhỏ, ngồi tựa | Không có nhiệm vụ, offline lâu, "chưa có gì để ôn" |
| 10 | **Động viên** | `encourage` | Mắt mở, mí thả lỏng (không nheo, không nhắm), cười khép ấm, một tay thumbs-up hoặc ngửa lòng bàn tay về phía người dùng. Ánh sáng ấm nhẹ quanh nhân vật, không confetti. | Quiz điểm thấp, người dùng bỏ giữa session, session dài, retry sau lỗi |

### 5.2. Quy tắc dựng biểu cảm

- **Chỉ thay mắt + miệng + tay + hiệu ứng.** Khối đầu, tai, hoodie, camera badge giữ nguyên hình học giữa các biểu cảm để rig có thể swap layer.
- Mí mắt hạ tối đa 40% chiều cao mắt — hạ sâu hơn khiến Snapy trông buồn/thiếu tin cậy.
- Không bao giờ vẽ mắt X, mắt xoáy, hoặc biểu cảm tức giận/gằn giọng. Snapy **không có trạng thái tiêu cực hướng vào người dùng**.
- `sad` là biểu cảm âm duy nhất được phép, và luôn kèm CTA phục hồi trong cùng popup.
- Phân biệt `wink` và `encourage`: `wink` = "mình biết một mẹo" (thông tin, hint). `encourage` = "không sao, cố lên" (cảm xúc, phục hồi). Không dùng lẫn — `wink` ở tình huống người dùng vừa làm sai sẽ đọc thành trêu đùa.

---

## 6. Bộ hành động (Poses — 6 chuẩn)

Full-body, dùng cho illustration lớn: onboarding slide, empty state, result screen, banner. Asset naming: `snapy_pose_{slug}@{1x,2x,3x}.png`.

| # | Pose | Slug | Mô tả tư thế | Prop / Hiệu ứng | Dùng ở màn hình |
| --- | --- | --- | --- | --- | --- |
| 1 | **Chào mừng** | `welcome` | Đứng thẳng, chân hơi mở, một tay giơ ngang vai vẫy, đuôi cong sang phải | Không | MH-ONBOARD-01 welcome slide, first-run Home |
| 2 | **Đọc sách** | `reading` | Ngồi bệt, 2 tay mở sách VOCAB trên lòng, đầu hơi cúi, đuôi cuộn quanh | Sách VOCAB mở | MH-LEARN-01 (flashcard), MH-DICT-02, loading nhẹ |
| 3 | **Nhảy lên** | `jump` | Bật khỏi mặt đất, 2 tay giơ cao, 2 chân co, mắt nhắm cười | Bóng mờ elip + 2 vạch tốc độ dưới chân | MH-LEARN-04 quiz pass, streak tăng |
| 4 | **Ăn mừng** | `celebrate` | Đứng, 2 tay giơ lệch (một cao một ngang), thân xoay 3/4 | Confetti cam/violet/blue rơi quanh | Daily Chest mở (F-GAME-04), Level up (MH-STATS-02) |
| 5 | **Suy nghĩ** | `thinking` | Đứng, một tay chống hông, tay kia chạm mõm, mắt nhìn chéo lên | 1 dấu `?` xanh to lệch trên-phải | MH-LEARN-03 (quiz đang chờ chọn), empty search |
| 6 | **Khám phá** | `explore` | Bước một chân về trước, 2 tay mở bản đồ, mũ phiêu lưu vành rộng | Mũ da cam nhạt + bản đồ giấy cũ | MH-TOPIC-01 collections, MH-CAMERA-01 pre-scan tip |

### 6.1. Pose bổ sung cho luồng scan (SnapVocab-specific)

| # | Pose | Slug | Mô tả | Dùng ở |
| --- | --- | --- | --- | --- |
| 7 | **Chụp ảnh** | `snap` | Giữ camera 2 tay ngang mắt, một mắt nheo qua ống ngắm, người hơi khuỵu | MH-ONBOARD-01 soft prompt camera, MH-CAMERA-01 hướng dẫn |
| 8 | **Quét vật thể** | `scanning` | Đứng nghiêng, tay nâng camera hướng vào vật thể (quả táo), tia quét ngang | MH-CAMERA-01 loading — "Mắt thần đang nhìn... Đợi chút nhé!" |
| 9 | **Chỉ bảng** | `pointing` | Đứng cạnh, một tay chỉ vào khoảng trống bên phải (chỗ đặt nội dung/UI) | Tooltip, coach-mark, tutorial overlay |

---

## 7. Turnaround (model sheet)

Bắt buộc dựng **5 view** để đảm bảo nhân vật nhất quán khi rig 2.5D hoặc render 3D. Tất cả cùng chiều cao, cùng ánh sáng (key light trên-trái 45°, fill nhẹ phải), chân đứng trên cùng baseline.

| View | Slug | Mô tả | Kiểm tra bắt buộc |
| --- | --- | --- | --- |
| **Trước** (0°) | `front` | Chính diện, đứng nghỉ, một tay khẽ vẫy | Camera badge nhìn thấy đầy đủ; 2 tai cân đối; đuôi lộ 1 bên |
| **Bên** (90°) | `side` | Nhìn ngang, thấy rõ độ nhô của mõm và độ dày đuôi | Mõm nhô đúng tỷ lệ ngắn; balo lộ ở lưng; hoodie không dán phẳng |
| **Sau** (180°) | `back` | Nhìn từ sau, thấy balo navy + dây cam, mũ hoodie | Đuôi che một phần balo; tai thấy mặt sau nâu nhạt |
| **Chéo trước** (45°) | `three_quarter` | 3/4 chuẩn — **view mặc định cho hầu hết asset app** | Đây là view tham chiếu chính; expression set dựng từ view này |
| **Chéo sau** (135°) | `three_quarter_back` | Nửa lưng, đầu quay lại nhìn người xem | Cổ không xoay quá 45° so với vai |

### 7.1. Detail sheet (tách khỏi turnaround)

`tail_detail` không phải một góc quay — nó là detail sheet, deliverable riêng.

| Slug | Nội dung | Kiểm tra |
| --- | --- | --- |
| `snapy_detail_tail` | Cận đuôi 2 hướng | Chóp cream = 30% chiều dài (§2.1) |
| `snapy_detail_hands` | Gan bàn tay, 4 ngón | Gan tay nâu, vệt lông cam ở khớp |
| `snapy_detail_ears` | Trong tai, mặt sau tai | Inner-ear inset 6 (§2.3) |
| `snapy_detail_hoodie` | Camera badge, dây rút, mũ trùm | Badge đọc được ở 48px |

Model sheet chính vẫn đúng **5 view**: `front`, `side`, `back`, `three_quarter`, `three_quarter_back`.

Deliverable turnaround: 1 file PNG 4096px chứa 5 view + 1 file source (`.blend` / `.c4d` / `.psd` layered), cùng file `snapy_model_sheet.pdf` có ghi số đo tỷ lệ.

---

## 8. Motion & animation

Bám nguyên tắc chuyển động trong [design.md §1](../design.md) — ưu tiên **spring/bouncy**, tránh fade tuyến tính.

| Animation | Slug | Thời lượng | Easing | Loop | Dùng khi |
| --- | --- | --- | --- | --- | --- |
| Idle breathing | `idle` | 2400ms | sine in-out | ∞ | Snapy đứng yên trên Home/onboarding; scale Y 1.0→1.02 |
| Wave | `wave` | 900ms | spring (damping 12) | 2 lần rồi về idle | Chào mừng lần đầu vào app |
| Bounce in | `bounce_in` | 450ms | spring (overshoot 1.15) | 1 | Popup/modal xuất hiện |
| Scan pulse | `scan_pulse` | 1200ms | ease in-out | ∞ | Loading AI recognition (MH-CAMERA-01) |
| Jump celebrate | `jump_celebrate` | 800ms | spring + squash/stretch | 1 | Quiz pass, level up, chest mở |
| Ear droop | `ear_droop` | 600ms | ease out | 1 | Streak mất — tai cụp, thân hạ 4px |
| Head tilt | `head_tilt` | 500ms | ease in-out | ∞ (chậm) | Trạng thái chờ/tò mò |
| Confetti burst | `confetti` | 1000ms | ease out | 1 | Kèm `jump_celebrate`, particle không che mặt |

Quy tắc animation:

- **Squash & stretch tối đa 10%** — vượt mức này Snapy trông cao su, mất cảm giác nhân vật 3D.
- Anticipation ≥ 80ms trước mọi động tác lớn (nhảy, vẫy).
- Đuôi luôn có secondary motion trễ 80–120ms so với thân.
- Mắt nhấp nháy (blink) tự nhiên mỗi 3–6s trong `idle`, thời lượng 120ms.
- Respect `prefers-reduced-motion` / setting "Giảm chuyển động": thay Lottie bằng ảnh tĩnh cùng slug, không animation loop.
- Không có animation nào chặn tương tác của người dùng.

---

## 9. Ứng dụng (Applications)

| Ứng dụng | Asset | Spec |
| --- | --- | --- |
| **App icon** | `snapy_icon_master` (asset thiết kế riêng, **không** crop từ expression set) | Xem §9.2 |
| **Sticker / Toast** | `happy`, `proud`, `wink` + bong bóng thoại | Bong bóng nền cream `#FFF3E0`, chữ navy bold, đuôi bong bóng chỉ về Snapy. VD: "Good job!" |
| **Loading** | `snapy_pose_scanning` hoặc `snapy_anim_scan_pulse` | Nền gradient trời xanh, Snapy trên tên lửa/đang quét + progress bar dưới; kèm text "Mắt thần đang nhìn..." |
| **Thông báo (push/in-app)** | `happy` bust nhỏ 64px + card cream | Copy 2 dòng, VD: "Tuyệt quá! Bạn vừa học 20 từ mới!" |
| **Empty state** | `thinking`, `sleepy`, `reading` | Full-body 160–200px, luôn kèm CTA (xem MH-SYSTEM-02) |
| **Streak lost popup** | `sad` | Bust 120px + copy đồng cảm + CTA "Học lại hôm nay"; **không** CTA mua Streak Freeze |
| **Onboarding** | `welcome`, `snap`, `reading` | Full-body ~40% chiều cao viewport, đặt trên nền `mascot-bg` |
| **Achievement / Badge** | `proud` | Có thể lồng trong khung badge tròn; giữ nguyên tỷ lệ đầu |
| **Key art / Store listing** | `welcome` full-body 3/4 + logo SnapVocab | Nền `#FFF8EF`, 4 pill năng lực, self-intro card |

### 9.2. App icon variant

App icon là asset độc lập vì ở 48px mọi chi tiết của một bust expression đều biến mất.

- Đầu + phần trên thân, view 3/4 nhẹ
- Camera badge **phóng to ~140%** so với tỷ lệ chuẩn, đặt lệch để không bị bo góc OS cắt
- Chi tiết mặt tối giản: bỏ vệt lông má, giữ đúng 1 highlight lớn trong mắt
- Biểu cảm cười khép (gần `happy`), **không** dùng `wink` — mắt nhắm 1 bên đọc thành lỗi render ở size nhỏ
- Không prop, không hiệu ứng, không text
- Nền gradient cam `#FFB65C → #FF8A00` đầy khung
- Nhân vật chiếm 78% khung, safe area 12% mỗi cạnh cho OS mask
- **Test bắt buộc:** 1024 / 512 / 192 / 48px — ở 48px vẫn phải nhận ra tai cáo + badge

### 9.1. Không được làm (misuse)

- Không đổi màu lông (hồng, xanh, xám...) — kể cả cho event/holiday, trừ khi có bản mở rộng được duyệt.
- Không xoay/nghiêng nhân vật > 15° so với trục dọc (ngoài pose `jump` đã được thiết kế sẵn).
- Không kéo giãn không đồng tỷ lệ (non-uniform scale).
- Không đặt Snapy lên ảnh chụp thật có nhiều chi tiết — cần nền phẳng hoặc gradient.
- Không bỏ camera badge, không thay logo khác lên hoodie.
- Không dùng Snapy cho copy quảng cáo gây áp lực ("Mua ngay không thì mất chuỗi!"), cho nội dung xin đánh giá 5 sao có điều kiện, hoặc cho thông báo lỗi hệ thống nghiêm trọng (dùng illustration trung tính).
- Không viết Snapy nói về người dùng khác theo hướng so sánh chê ("Bạn thua 3 người rồi").

---

## 10. Mapping màn hình → asset (bắt buộc tuân thủ)

Mọi chỗ spec ghi "Mascot" phải resolve về đúng một dòng dưới đây. Nếu cần một trạng thái chưa có trong bảng, bổ sung vào tài liệu này trước khi vẽ.

| Màn hình / trạng thái | Nguồn spec | Asset | Animation | Copy của Snapy |
| --- | --- | --- | --- | --- |
| MH-ONBOARD-01 welcome slide | phan_ra_man_hinh §5 | `pose_welcome` | `wave` | "Xin chào! Mình là Snapy 🐾" |
| MH-ONBOARD-01 xin quyền Camera | phan_ra_man_hinh L206 | `pose_snap` (soi quả táo) | `bounce_in` | "Cho mình dùng camera để quét từ vựng nhé!" |
| MH-ONBOARD-01 xin quyền Notification | phan_ra_man_hinh L209 | `pose_reading` + đồng hồ | `idle` | "Mình sẽ nhắc bạn ôn đúng lúc!" |
| MH-MAIN-01 first-run / chưa có Deck | phan_ra_man_hinh §6 | `pose_pointing` | `idle` | "Scan hoặc tra cứu để thêm từ đầu tiên!" |
| MH-MAIN-01 streak = 0 popup | phan_ra_man_hinh L378, L471 | `expr_sad` | `ear_droop` | "Chuỗi của bạn dừng lại rồi. Bắt đầu lại hôm nay nhé?" |
| MH-MAIN-01 SRS due = 0 | phan_ra_man_hinh §6 khối 4 | `expr_proud` | `bounce_in` | "Bạn đã ôn xong hôm nay! 🎉" |
| Daily Chest 5/5 mở | daily_mission §2.1, F-GAME-04 | `pose_celebrate` | `jump_celebrate` + `confetti` | "Đủ 5 nhiệm vụ! Mở rương thôi!" |
| MH-CAMERA-01 loading scan | phan_ra_man_hinh L539 | `pose_scanning` | `scan_pulse` | "Mắt thần đang nhìn... Đợi chút nhé!" |
| MH-CAMERA-02 confidence thấp | phan_ra_man_hinh L564 | `expr_unsure` | `head_tilt` | "Hình như đây là..." |
| MH-CAMERA-02 không nhận diện được | MH-SYSTEM-02 No object | `expr_curious` | `head_tilt` | "Mình chưa nhìn rõ. Thử ảnh khác nhé?" |
| MH-LEARN-01 flashcard session | §6 pose 2 | `pose_reading` | `idle` | — (không chen vào lúc học) |
| MH-LEARN-03 quiz đang chờ chọn | §6 pose 5 | `pose_thinking` | `head_tilt` | — |
| MH-LEARN-04 quiz pass | §6 pose 3 | `pose_jump` | `jump_celebrate` | "Chính xác! Ghi nhớ tốt lắm!" |
| MH-LEARN-04 quiz điểm thấp | — | `expr_encourage` | `bounce_in` | "Không sao, ôn lại là nhớ ngay." |
| MH-STATS-02 level up | F-GAME-01 | `expr_proud` | `jump_celebrate` | "Lên Level {level} rồi!" |
| MH-DICT-01 empty search | MH-SYSTEM-02 Empty search | `expr_curious` | `head_tilt` | "Không tìm thấy từ này. Kiểm tra chính tả nhé?" |
| MH-TOPIC-01 collections | §6 pose 6 | `pose_explore` | `idle` | "Chọn chủ đề để khám phá!" |
| Network error toàn app | MH-SYSTEM-02 Network error | `expr_unsure` | tĩnh | "Mất kết nối rồi. Thử lại nhé?" |
| Không có mission / offline lâu | §5.1 | `expr_sleepy` | `idle` | "Chưa có gì để ôn. Nghỉ một chút nào." |
| App icon | §9 | `expr_wink` crop | tĩnh | — |
| Push notification | §9 | `expr_happy` 64px | tĩnh | "Tuyệt quá! Bạn vừa học 20 từ mới!" |

**i18n:** cột "Copy của Snapy" là *nội dung tham chiếu*, không phải string để hardcode. Mỗi dòng phải có key `mascot.{screen}.{state}` (ví dụ `mascot.onboard.welcome`, `mascot.main.streak_lost`, `mascot.camera.scanning`) trong [en.json](SnapVocab/src/translations/en.json) và [vi.json](SnapVocab/src/translations/vi.json). Thêm dòng mới vào bảng này = phải thêm key cùng lúc.

Nguyên tắc tần suất: Snapy **tối đa 1 popup có thoại mỗi phiên học** cho nhóm thông báo động viên, và tối đa 1 popup streak-lost mỗi ngày. Illustration tĩnh trong empty state không tính vào hạn mức này.

---

## 11. Asset delivery

### 11.0. Asset pipeline

Blender master scene (.blend)   ← single source of truth cho hình học
↓
Rig + pose/expression library
↓
┌────────────────┬────────────────────┐
↓                ↓                    ↓
Render PNG      Render sequence      Vector re-draw
(@1x/2x/3x)          ↓                   ↓
Lottie JSON        Lottie JSON
(raster-free path chỉ khi cần)



| Loại | Master | Quy tắc |
| --- | --- | --- |
| Hình học nhân vật | `snapy_master.blend` | Mọi thay đổi tai/mắt/mõm/hoodie **chỉ** sửa ở đây |
| PNG expression/pose | render từ `.blend` | Post chỉ được crop, resize, tối ưu nén. **Không** repaint/reshape làm lệch hình học |
| Lottie | rig đã duyệt | Không nhúng raster; nếu buộc phải thì dùng WebP và ghi rõ trong PR |
| App icon | `.blend` + comp riêng | §9.2 |

Khi `.blend` bump version, mọi PNG/Lottie render từ version cũ bị đánh dấu stale và phải re-render trước release kế tiếp. Cấm để PNG v1 + Lottie v2 + icon v3 cùng tồn tại trong bundle.

### 11.1. Naming convention

```
snapy_expr_{slug}@{1x|2x|3x}.png      # bust, nền trong suốt
snapy_pose_{slug}@{1x|2x|3x}.png      # full-body, nền trong suốt
snapy_anim_{slug}.json                # Lottie
snapy_turn_{slug}.png                 # model sheet view
snapy_app_icon_{size}.png             # 1024 / 512 / 192 / 48
```

`{slug}` lấy nguyên văn từ §5/§6/§7/§8 — code hiện dùng `read`, slug chính thức là `reading`; đổi ở code, không đổi ở spec.

### 11.2. Định dạng & kích thước

| Loại | Format | Kích thước gốc | Ghi chú |
| --- | --- | --- | --- |
| Bust expression | PNG-24 alpha | 512×512 @1x | Nhân vật chiếm ~90% khung, padding 5% |
| Full-body pose | PNG-24 alpha | 768×1024 @1x | Chân cách đáy khung 40px cho bóng đổ |
| Animation — micro (`idle`, `blink`, `head_tilt`, `ear_droop`) | Lottie JSON | ≤ 60KB | Không nhúng raster; nếu buộc phải, dùng WebP |
| Animation — transition (`bounce_in`, `wave`, `scan_pulse`) | Lottie JSON | ≤ 120KB | Không nhúng raster; nếu buộc phải, dùng WebP |
| Animation — celebration (`jump_celebrate`, `confetti`) | Lottie JSON | ≤ 250KB, lazy-load | Không nhúng raster; nếu buộc phải, dùng WebP |
| App icon | PNG-24 không alpha | 1024×1024 | Nền gradient đầy khung |
| Model sheet | PNG + source | 4096px chiều dài | Kèm PDF ghi tỷ lệ |

Ngân sách dung lượng: ≤ 2.5MB cho asset bundle (M1/M2), celebration + chest + leaderboard tải remote nên không tính vào 2.5MB.

### 11.3. Accessibility

- Mọi ảnh Snapy phải có `alt` mang **ý nghĩa trạng thái**, không mô tả nhân vật: `alt="Đã ôn xong hôm nay"` thay vì `alt="Con cáo đang cười"`. Nếu Snapy chỉ là trang trí cạnh text đã đủ nghĩa → `alt=""` / `accessibilityElementsHidden`.
- Bong bóng thoại phải là **text thật** (i18n key), không render chữ vào ảnh — trừ sticker share ngoài app.
- Không truyền tải thông tin **chỉ** bằng biểu cảm mascot: mọi trạng thái phải có text hoặc icon đi kèm.
- Animation tôn trọng setting giảm chuyển động (§8).

---

## 12. Khoảng cách với code hiện tại

Component có sẵn ở [mascot.tsx](../../SnapVocab/src/components/ui/mascot.tsx) và asset ở [SnapVocab/assets/](../../SnapVocab/assets/) chưa khớp spec này:

| Hiện tại | Theo spec |
| --- | --- |
| `alt` mặc định `'Vivi the fox mascot'` | Tên chính thức là **Snapy**; `alt` phải mô tả trạng thái, không mô tả nhân vật (§11.3) |
| 4 pose: `wave`, `celebrate`, `sad`, `read` | Cần đủ 9 expression (§5) + 9 pose (§6); tối thiểu cho M1/M2: `welcome`, `snap`, `scanning`, `reading`, `curious`, `unsure`, `sad`, `happy` |
| File `fox-*.png` | Đổi sang `snapy_{expr|pose}_{slug}.png` (§11.1) |
| Chỉ có `float` (translateY 2s, linear) | Bổ sung preset `idle` (spring, có blink), `bounce_in`, `scan_pulse`, `ear_droop`, `jump_celebrate` (§8) |
| Không respect reduced-motion | Tắt loop khi người dùng bật giảm chuyển động |
| Chưa có bong bóng thoại | Thêm `MascotBubble` dùng i18n key, không hardcode chữ vào ảnh |
| Copy mascot chưa có trong i18n | Thêm namespace `mascot.*` vào [en.json](../../SnapVocab/src/translations/en.json) và [vi.json](../../SnapVocab/src/translations/vi.json) theo cột "Copy của Snapy" ở §10 |

---

## 13. Checklist duyệt asset (3 tầng)

Fail **bất kỳ** item Tier A → reject, không review tiếp.

### Tier A — Identity (blocking)

- [ ] Khớp hình học Master Reference §0 (đặt cạnh master để so)
- [ ] Pass silhouette test §2.1 — nhận ra qua tai + đuôi + khối hoodie
- [ ] Tỷ lệ 4 head-height, head:torso = 100:120 (§2.1)
- [ ] Facial geometry trong ±5% bảng §2.3
- [ ] Tai: base width, height, inner inset đúng
- [ ] Đuôi: dài 150u, cream tip 30%
- [ ] Hoodie navy đúng form, dây rút cream 2 bên
- [ ] Camera badge tồn tại trên model; visible theo rule §2.2

### Tier B — Visual

- [ ] Chỉ dùng token §3, tỉ lệ màu trong ngưỡng (cam ~45 / navy ~25 / cream ~20 / nâu ~7 / accent ≤3)
- [ ] Material soft-plastic, không photorealistic fur (§2.0)
- [ ] Key light trên-trái 45°, AO mềm, bóng đổ elip ≤25% opacity
- [ ] Đúng 2 highlight mắt, tỷ lệ 30% / 14% eye width
- [ ] Không stroke đen, không cel-shading bậc cứng
- [ ] Không thuộc misuse §9.1
- [ ] Dark mode: có rim light `#FFB65C` nếu asset dùng trên nền tối

### Tier C — Product

- [ ] Tên file đúng §11.1, đủ @1x/@2x/@3x
- [ ] Đúng canvas size, alpha, padding (§11.2)
- [ ] Trong ngân sách dung lượng theo loại (§11.2)
- [ ] Đọc được ở size nhỏ nhất dự kiến (48px icon / 64px bust)
- [ ] Có dòng mapping ở §10
- [ ] Có i18n key `mascot.*` cho copy kèm theo
- [ ] `alt` mô tả **trạng thái**, không mô tả nhân vật (§11.3)
- [ ] Có fallback tĩnh cho reduced-motion nếu là animation




