# Proposal

## Why

Nhóm người chơi cần một cách nhanh để ghi điểm qua nhiều vòng trên trình duyệt mobile, nhưng MVP không cần tài khoản, backend hay đồng bộ nhiều thiết bị. Một ứng dụng lưu local giúp người ghi điểm bắt đầu ngay, theo dõi lịch sử và chia sẻ kết quả cuối dưới dạng hình ảnh.

## What Changes

- Tách resources dịch và dùng modal xác nhận chung cho các thao tác có nguy cơ mất dữ liệu.
- Dùng icon library thay cho Unicode glyphs trong các hành động chính.

- Xây ứng dụng quản lý các session chơi game trong trình duyệt, ưu tiên mobile nhưng responsive trên tablet và desktop.
- Cho phép tạo session với tên session, tên trò chơi, đơn vị điểm tùy chỉnh và danh sách người chơi.
- Ghi, sửa và xóa điểm theo từng vòng; tự tính tổng điểm, thứ hạng, metric và biểu đồ.
- Lưu và khôi phục dữ liệu bằng `localStorage`; không sử dụng database, tài khoản hay API backend.
- Cho phép duplicate session để giữ người chơi và cấu hình nhưng luôn bắt đầu với lịch sử điểm rỗng.
- Cho phép tạo ảnh bảng điểm để lưu về máy hoặc copy ảnh; không dùng Web Share API trong MVP.
- Hỗ trợ tiếng Việt/English và light/dark/system theme.
- Có reset toàn bộ dữ liệu và xác nhận cho các thao tác có nguy cơ mất dữ liệu.

## Capabilities

### New Capabilities

- `score-sessions`: Quản lý session, người chơi, vòng chơi, điểm tổng hợp, lịch sử, duplicate và reset dữ liệu.
- `score-sharing`: Tạo ảnh bảng điểm và cung cấp thao tác lưu ảnh hoặc copy ảnh.
- `app-preferences`: Quản lý ngôn ngữ, theme và các tùy chọn trải nghiệm cục bộ.

### Modified Capabilities

- Không có.

## Impact

- Ứng dụng Next.js mới trong repository hiện chưa có mã nguồn.
- Dữ liệu chỉ nằm trong localStorage của trình duyệt hiện tại và có thể mất khi người dùng xóa dữ liệu trình duyệt.
- Cần thư viện biểu đồ và giải pháp render bảng điểm thành ảnh ở phía client.
- Cần kiểm thử khác biệt giữa mobile browser, tablet và desktop, đặc biệt với thao tác copy ảnh.
