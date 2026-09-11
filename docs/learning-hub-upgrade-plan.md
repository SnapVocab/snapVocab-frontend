# Kế hoạch nâng cấp Learning Hub

Ngày: 11/09/2026. Trạng thái: đề xuất triển khai, chưa thay đổi giao diện ứng dụng.

## 1. Mục tiêu và cơ sở

Giúp người dùng nhận ra điểm riêng của SnapVocab — học từ thế giới quanh mình — và muốn bắt đầu một phiên học ngay trong Learning Hub.

Cơ sở: đã kiểm tra Android native qua Expo Go trên Pixel 8, 1080 × 2400, font scale 1.0. Ảnh đối chiếu: [đầu màn](../.artifacts/learning-hub-review/top.png), [giữa màn](../.artifacts/learning-hub-review/middle.png), [cuối màn](../.artifacts/learning-hub-review/bottom.png). Chưa xác nhận iOS và máy vật lý.

Các vấn đề chính:

- Chụp ảnh để học là đặc trưng sản phẩm, nhưng chưa được giải thích bằng nội dung ngay trong Hub.
- Thống kê SRS chiếm phần nổi bật nhất; flashcard, quiz và chủ đề nằm sâu dưới màn hình.
- Thẻ chủ yếu gồm icon và chữ, thiếu hình ảnh cho người học biết họ sắp học gì.
- Phần thưởng và lời khuyên còn chung chung; chưa tạo mối liên hệ rõ giữa hành động và thành quả.
- Render Android có lỗi màu icon, số đen trên nền tối, badge XP viền đen, sổ từ bị chật và tab bar sát vùng cử chỉ.

## 2. Phạm vi và vai trò

Learning Hub tập trung vào chọn và bắt đầu hoạt động học. Home giữ vai trò tổng quan tài khoản, nhiệm vụ, chuỗi ngày và các hoạt động khác. Hub chỉ dùng tiến độ và phần thưởng liên quan trực tiếp đến phiên học.

Phạm vi chính: màn Learn, các component hiển thị, token/font dùng chung và khoảng đệm thanh tab. Mở rộng tối thiểu sang route học, kết quả nhận diện và dữ liệu phiên để CTA mở đúng nội dung, quay về Hub thấy đúng tiến độ.

Chụp ảnh, flashcard, ba dạng quiz, chủ đề và bộ thẻ đều đã có màn hình trong dự án. Nhiều dữ liệu và bước xử lý còn mock; có route không đồng nghĩa luồng đã hoàn chỉnh. Chấm điểm phát âm, bản đồ khóa học và cơ chế thưởng mới không thuộc đợt nâng cấp này.

## 3. Bố cục đề xuất

Thứ tự đọc từ trên xuống:

| Vị trí | Khối | Nội dung và vai trò |
| --- | --- | --- |
| 1 | Tiêu đề gọn | “Học tập” và tiến độ mục tiêu ngày. Một dòng động viên theo trạng thái; bỏ nhãn Chính khóa và lời khuyên dài. |
| 2 | Phiên học được gợi ý | Một CTA chính, số thẻ của phiên, hình ảnh minh họa từ trong phiên và Snapy. Nội dung thay đổi theo trạng thái học. |
| 3 | “Bạn muốn học thế nào?” | Bốn thẻ 2 × 2: Chụp & học, Lật thẻ, Quiz nhanh, Học theo chủ đề. Mỗi thẻ có hình/biểu tượng rõ, tên và một dòng lợi ích. |
| 4 | Tiếp tục bộ thẻ | Một hàng gọn: ảnh bìa, tên bộ thẻ, tiến độ và hành động tiếp tục. Ẩn nếu chính bộ thẻ này đã là gợi ý chính. |
| 5 | “Từ vựng của bạn” | Một hàng ảnh từ đã lưu gần đây và đường dẫn vào các bộ thẻ. Có nhãn nguồn ảnh khi dữ liệu hỗ trợ. Người chưa có từ thấy hướng dẫn thêm từ. |

Mục tiêu bố cục: tại 360 × 800 dp, font mặc định, thấy đầy đủ CTA chính và cả bốn lối vào tính năng mà không cần cuộn. Các vùng chạm tối thiểu 48 dp. Không cố giữ mục tiêu này bằng cách thu nhỏ chữ khi người dùng bật cỡ chữ lớn; khi đó ưu tiên đọc rõ và cuộn tự nhiên.

Giới hạn chiều cao ban đầu để dựng bản mẫu: header khoảng 56–72 dp, khối phiên học 180–220 dp, lưới tính năng 176–208 dp. Đây là ngân sách thiết kế, không khóa chiều cao các vùng chứa chữ.

## 4. Làm nổi bật tính năng bằng hình ảnh và ngôn ngữ

| Tính năng | Cách thể hiện | Nội dung gợi ý | Điểm đến |
| --- | --- | --- | --- |
| Chụp & học | Máy ảnh cùng ví dụ vật thể và nhãn từ; tag nguồn SCAN dùng màu cam | “Biến ảnh thành từ vựng” | `/(tabs)/scan` |
| Lật thẻ | Hai mặt thẻ hoặc ảnh vật thể cùng từ tiếng Anh | “Nhìn ảnh, nhớ từ” | `/study/flashcard`, có ngữ cảnh bộ thẻ/phiên |
| Quiz nhanh | Một ví dụ câu hỏi ngắn hoặc biểu tượng đáp án/ghép cặp | “Thử sức với từ đã học” | `/study/quiz-setup`; ba dạng quiz tiếp tục được chọn tại đây |
| Học theo chủ đề | Ảnh bìa của chủ đề thực có trong dữ liệu | “Du lịch, công việc, đời sống” | `/topics` |

Tái sử dụng Snapy và các hình/icon hiện có sau khi kiểm tra màu, tỷ lệ, kích thước và hiệu năng. Giữ nhất quán độ dày nét và mức độ chi tiết của cả bốn thẻ. Không dùng mỗi thẻ một phong cách minh họa.

Ảnh của người học chỉ được lấy từ dữ liệu thực của họ. Bản mẫu dùng dữ liệu minh họa được ghi rõ trong tài liệu kiểm thử. Khi chưa có ảnh, dùng minh họa chung hoặc placeholder có chủ đích; không gán ảnh minh họa thành “ảnh bạn đã chụp”.

## 5. Gợi ý học theo trạng thái

Thứ tự quyết định gợi ý chính: chưa có từ → có thẻ đến hạn → có phiên dở → có từ chưa học → đã hoàn thành. Ngoại tuyến/lỗi là điều kiện bổ sung ảnh hưởng khả năng thực hiện hành động.

| Trạng thái | Thông điệp chính | Hành động |
| --- | --- | --- |
| Chưa có từ | “Biến đồ vật quanh bạn thành từ tiếng Anh” | “Chụp từ đầu tiên”; lựa chọn phụ học chủ đề có sẵn |
| Có thẻ đến hạn | “Ôn lại những từ bạn đã học” và số thẻ của phiên | “Ôn ngay” |
| Có phiên dở, không có thẻ đến hạn | Tên bộ thẻ, vị trí đang học và số thẻ còn lại thực tế | “Tiếp tục học” |
| Có từ mới, không có phiên dở | Xem trước một vài từ mới đã lưu | “Học từ mới” |
| Đã hoàn thành | Lời khen cụ thể dựa trên kết quả đã lưu | “Khám phá chủ đề”; vẫn cho tự chọn hoạt động khác |
| Ngoại tuyến | Mô tả nội dung nào có thể học từ dữ liệu đã tải | Chỉ cung cấp phiên thực sự có dữ liệu; chụp/nhận diện cần mạng có giải thích ngắn |
| Lỗi tải | Thông báo gọn, không dùng số liệu ngẫu nhiên thay dữ liệu lỗi | “Thử lại”; giữ dữ liệu cũ nếu có và thể hiện chưa cập nhật |

Due count của FSRS dùng đơn vị “thẻ”; số từ đã lưu dùng số Note. Không coi hai đại lượng luôn bằng nhau. Mục tiêu ngày cần có định nghĩa rõ về từ mới hay lượt ôn trước khi nối dữ liệu.

## 6. Tạo hứng thú bằng phản hồi có ý nghĩa

- Khối chính cho xem trước ảnh/từ để gợi sự tò mò và cảm giác nội dung thuộc về mình.
- Snapy có vai trò theo tình huống: chào đón người mới, đọc sách lúc gợi ý ôn, ăn mừng sau khi hoàn thành. Chỉ một vùng chuyển động nhẹ trên màn.
- Tiến độ thay đổi khi có kết quả học đã ghi nhận; lời khen mô tả đúng thành quả, ví dụ “Bạn vừa hoàn thành phiên ôn”.
- Sau phiên học, Hub cập nhật gợi ý kế tiếp và tiến độ; không cộng thưởng lần nữa chỉ vì người dùng quay lại màn hình.
- Chỉ hiển thị số XP nếu quy tắc thưởng của hoạt động đã xác định. Không giữ các nhãn +25/+30/+50 XP rời rạc nếu kết quả thực tế không khớp.
- Chỉ hiển thị thời lượng ước tính khi có cách tính theo số thẻ và dữ liệu phiên. Trước đó dùng số thẻ để mô tả quy mô phiên.
- Chuyển động khi nhấn, lật thẻ hoặc đạt mục tiêu ngắn và có thể giảm theo cài đặt giảm chuyển động; không chạy confetti khi vừa mở Hub.
- Bỏ thông điệp gây áp lực về lãng quên và khẳng định “nhớ lâu gấp 5 lần” chưa có ngữ cảnh chứng minh trong giao diện.

## 7. Hướng màu sắc, typography và hình khối

- Nền sáng trung tính; khối phiên học dùng nền trung tính đậm hoặc tint nhẹ sau khi so sánh bản render. Dùng token UI thay cho token mắt/lông của mascot.
- Xanh lá dành cho hành động chính và tiến độ; cam dành cho Snapy/nguồn SCAN; vàng dành cho phần thưởng. Tối đa ba accent trên một trạng thái màn hình theo `design.md`.
- Làm rõ màu foreground cho icon trên native. Bổ sung token còn thiếu và kiểm tra kết quả thực tế, không chỉ kiểm tra tên class.
- Đổi cặp màu CTA: thử xanh đậm + chữ trắng và xanh thương hiệu + chữ tối; chọn cặp đạt mục tiêu tương phản 4.5:1 cho chữ thông thường. Ghi lại số đo của cặp màu cuối cùng.
- Nạp và đăng ký font thực tế trước khi tinh chỉnh: tiêu đề dùng Nunito, nội dung dùng Inter nếu giữ hướng typography hiện tại. Rà lại độ đậm, tránh gần như mọi dòng đều bold.
- Hạn chế chữ in hoa ở CTA và nhãn; tên tính năng và lợi ích phải đọc nhanh.
- Card bo tròn, bóng nhẹ, có phản hồi nhấn; không phủ viền đáy dày lên mọi khối thông tin. Giữ chiều sâu rõ cho nút chính.
- Thẻ sổ từ phải cho vùng chữ co lại/xuống dòng và dành khoảng cách cố định cho nút bên phải. Tab bar lấy bottom inset thực của thiết bị.
- Mọi thay đổi token dùng chung phải được đồng bộ với `design.md` và kiểm tra ảnh hưởng đến các màn đang dùng token đó.

## 8. Các bước triển khai và đầu ra

### Bước 1 — Chốt nội dung và dựng bản mẫu

- Dựng bố cục mới cho người quay lại và người mới, dùng dữ liệu mẫu nhất quán.
- Chuẩn bị hình xem trước và nhãn tính năng; xác định rõ phần nào cần dữ liệu chưa có.
- Render Android ở 360 dp và Pixel 8 để kiểm tra vùng nhìn đầu tiên.
- Đầu ra: hai trạng thái có thể xem trực tiếp và bộ ảnh trước/sau.

### Bước 2 — Hoàn thiện nền tảng hiển thị

- Sửa token/font/icon, màu chữ và nút, tab bar, card co giãn.
- Tách thành component có trách nhiệm rõ: header, gợi ý phiên, thẻ tính năng, bộ thẻ tiếp tục, từ mới lưu.
- Dùng lại thành phần hiện có khi phù hợp; kiểm tra Home và một màn học đại diện sau thay đổi dùng chung.
- Đầu ra: bố cục mới ổn định trên native, hình ảnh đồng bộ.

### Bước 3 — Nối ngữ cảnh và phản hồi học

- Tạo nguồn dữ liệu Hub thống nhất; loại bỏ refresh sinh số ngẫu nhiên.
- “Tiếp tục” truyền đúng deck/session và khôi phục đúng vị trí. Ôn tập mở đúng hàng đợi; số đếm Hub khớp phiên.
- Nối từ nhận diện đã lưu vào bộ thẻ và phần xem trước khi chức năng lưu sẵn sàng.
- Kết quả học cập nhật Hub; XP và mục tiêu lấy từ cùng dữ liệu kết quả, xử lý quay lại/lặp điều hướng không thưởng trùng.
- Nếu backend chưa có, adapter mẫu phải cho phép chạy xuyên suốt cùng dữ liệu và có ranh giới rõ để thay thế; không coi mock là đã hoàn tất tích hợp sản phẩm.
- Đầu ra: một vòng học có thể kiểm thử từ chọn nội dung đến hoàn thành và quay lại Hub.

### Bước 4 — Trạng thái, chuyển động và nghiệm thu

- Hoàn thiện các trạng thái ở mục 5; skeleton khớp cấu trúc cuối, không thêm thời gian tải giả.
- Bổ sung phản hồi nhấn, chuyển tiến độ và Snapy có điều kiện.
- Kiểm tra Android native, web responsive; kiểm tra iOS khi có thiết bị/runner, ghi rõ nếu chưa thực hiện.
- Đầu ra: ảnh render, checklist kiểm thử, danh sách giới hạn còn tồn tại.

## 9. Tiêu chí nghiệm thu

- Trong thử nghiệm ngắn đề xuất với 5 người học, ít nhất 4 người nhận ra tính năng chụp ảnh học từ và chỉ ra cách bắt đầu học sau khi xem Hub 5 giây. Đây là mục tiêu kiểm chứng, chưa phải kết quả đo.
- Ở 360 × 800 dp và font mặc định, thấy CTA chính và bốn tính năng. Ở font scale 1.3 trở lên, không cắt chữ/chồng nút; cho phép tăng chiều cao và cuộn.
- Không còn số/icon tối trên nền tối, badge viền đen ngoài ý định hay tab chạm thanh cử chỉ.
- Người mới không có số từ đã thuộc giả; đã ôn xong không bị nhắc còn thẻ đến hạn cũ.
- Tên bộ thẻ, số thẻ và vị trí học khớp giữa Hub và phiên được mở. Hoàn thành/quay lại cập nhật đúng một lần.
- Không hiển thị khả năng học offline nếu nội dung chưa có sẵn trên thiết bị.
- Ảnh thiếu/tải lỗi có fallback; loading/error không nhảy bố cục lớn hoặc che toàn bộ điều hướng không cần thiết.
- Kiểm tra tương phản các cặp chữ/nền, nhãn trợ năng, thứ tự đọc và vùng chạm của các CTA. Chuyển động tuân theo lựa chọn giảm chuyển động.
- Test tự động tập trung vào chọn gợi ý theo trạng thái, hợp đồng điều hướng và cập nhật kết quả; đánh giá bố cục bằng ảnh render, không viết test chỉ lặp lại class/style.

Sau khi có dữ liệu sử dụng thực, đo thời gian từ mở Hub đến bắt đầu phiên, tỷ lệ bắt đầu/hoàn thành phiên, tỷ lệ đi từ scan đến học từ đã lưu. So sánh với baseline trước nâng cấp; không dùng tăng lượt bấm đơn thuần làm bằng chứng học hiệu quả hơn.

## 10. Các file liên quan

- `app/(tabs)/learn.tsx`: bố cục và gợi ý học.
- `app/(tabs)/_layout.tsx`: vùng an toàn thanh tab.
- `components/Snapy.tsx`, `components/snapvocab/`, `components/ui/icon.tsx`: hình ảnh và icon.
- `tailwind.config.js`, `global.css`, `app/_layout.tsx`, `docs/design.md`: token, font và quy tắc hiển thị.
- `app/study/flashcard.tsx`, `app/study/srs-review.tsx`, `app/study/quiz-setup.tsx`, `app/study/quiz-result.tsx`: dữ liệu/điều hướng học và phản hồi kết quả.
- `app/result.tsx`, `app/decks/`, `app/topics/`: liên kết nguồn từ và thư viện.

Tài liệu này là kế hoạch cho Learning Hub; không thay thế đặc tả hệ thống hay tự động mở rộng thành thiết kế lại toàn ứng dụng.
