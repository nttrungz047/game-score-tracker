# Design

## Context

Repository hiện chỉ có cấu hình OpenSpec, chưa có application code. Theo proposal, MVP chạy hoàn toàn phía client, ưu tiên mobile browser, lưu dữ liệu trong localStorage và không có server-side state.

## Goals / Non-Goals

**Goals:**

- Có mô hình dữ liệu rõ ràng cho session, player, round và score.
- Đảm bảo reload không làm mất session đã lưu trong cùng trình duyệt.
- Tính tổng điểm từ lịch sử vòng để sửa/xóa dữ liệu an toàn.
- Tách phần tạo ảnh khỏi UI hiển thị để ảnh ổn định theo light/dark theme.
- Cung cấp fallback khi clipboard image không được trình duyệt hỗ trợ.

**Non-Goals:**

- Không đồng bộ giữa thiết bị hoặc nhiều người dùng.
- Không có authentication, API, database hay Web Share API.
- Không tự động áp dụng luật tính điểm theo từng trò chơi.

## Decisions

### Local persistence

Dùng một storage adapter phía client với versioned JSON payload trong localStorage. Adapter chịu trách nhiệm đọc, ghi, migrate phiên bản và xử lý dữ liệu hỏng bằng cách báo lỗi thân thiện thay vì làm crash toàn ứng dụng.

Mô hình logic:

```text
AppStore
  sessions[]
  preferences

Session
  id, name, gameName, unitName
  players[]
  rounds[]

Round
  id, number, createdAt, updatedAt, note
  scores: { playerId: number }
```

Totals, ranking và chart series là dữ liệu dẫn xuất, được tính từ rounds khi cần. Không lưu tổng điểm riêng để tránh lệch dữ liệu sau khi edit/delete.

### Session duplication

Duplicate tạo id và timestamps mới, sao chép session configuration và players, nhưng đặt rounds về mảng rỗng. Tên session được thêm hậu tố `(Copy)` và không yêu cầu xác nhận vì không phá dữ liệu hiện có.

### Client-only rendering

Các component truy cập localStorage, clipboard hoặc media query chỉ chạy sau hydration. UI cần có trạng thái loading ngắn hoặc initial state ổn định để tránh hydration mismatch trong Next.js.

### Score image

Tạo một score-image view model từ session hiện tại, sau đó render vào một vùng canvas hoặc image renderer ở client. Ảnh dùng theme chia sẻ cố định, có tên game/session, ranking, tổng điểm, unit name và số vòng.

- Save image: tạo Blob và tải xuống với tên file an toàn.
- Copy image: dùng Clipboard API với MIME image phù hợp khi có thể.
- Unsupported copy: hiển thị lý do và giữ nút save image làm fallback.

Không dùng Web Share API để tránh phụ thuộc vào hành vi khác nhau của mobile browser.

### Preferences and responsive UI

Preferences gồm `locale` (`vi` hoặc `en`) và `theme` (`light`, `dark`, `system`). Translation keys được tách khỏi component; user-entered names không được dịch. Layout dùng mobile-first CSS, không dựa vào hover, và tránh bảng quá rộng trên viewport nhỏ.

### Confirmation policy

The UI SHALL use one accessible confirmation modal for destructive actions instead of `window.confirm`. The modal must provide explicit cancel and confirm actions; cancel must leave storage unchanged.

### Shared UI resources and icons

Translated UI strings live in `src/lib/resources.ts`. UI icons use `lucide-react` instead of Unicode glyphs so size, color, and accessible naming remain consistent across browsers.

Dùng một confirmation component thống nhất cho xóa round, xóa player có dữ liệu, xóa session và reset all data. Reset all data cần copy cảnh báo rõ ràng về phạm vi xóa; cancel không được thay đổi storage.

## Risks / Trade-offs

- [localStorage bị xóa hoặc đầy] -> Hiển thị cảnh báo khi ghi thất bại và bổ sung export/import ở giai đoạn sau.
- [Clipboard API không hỗ trợ copy ảnh trên một số browser] -> Luôn cung cấp save image fallback và thông báo rõ ràng.
- [Dữ liệu local không có backup tự động] -> Không tuyên bố dữ liệu là cloud-synced; cân nhắc export/import sau MVP.
- [Hydration mismatch do theme/localStorage] -> Chỉ khởi tạo preference-dependent UI sau khi client hydration hoàn tất.
- [Tên người chơi trùng nhau] -> Dùng id riêng cho player và chỉ chặn tên rỗng; có thể cảnh báo tên trùng để tránh nhầm lẫn.

## Migration Plan

Không có dữ liệu production cần migrate. Bản đầu tiên tạo storage key và schema version mới. Nếu schema thay đổi trong tương lai, adapter sẽ migrate từ version cũ hoặc yêu cầu export/import thủ công.

## Open Questions

- Chưa cần quyết định thư viện chart hay image renderer trong design; có thể chọn trong task setup dựa trên khả năng bundle và hỗ trợ mobile.
