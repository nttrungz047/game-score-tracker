# Write Score

Write Score là ứng dụng Next.js chạy phía client để ghi điểm cho các session chơi game. Người dùng có thể tạo session, quản lý người chơi, nhập điểm theo vòng, xem bảng xếp hạng/lịch sử/biểu đồ, lưu dữ liệu trong trình duyệt và tạo ảnh bảng điểm.

## Trạng thái hiện tại

Ứng dụng đã được khởi tạo và route `/` chạy được trong môi trường local. Phần đã có trong mã nguồn gồm:

- Tạo, mở, nhân bản và xóa session; cấu hình tên game, đơn vị điểm và người chơi.
- Thêm/sửa/xóa vòng điểm, tính tổng và xếp hạng từ lịch sử vòng.
- Lưu/khôi phục dữ liệu và tùy chọn ngôn ngữ/theme bằng `localStorage`.
- Giao diện tiếng Việt/English và theme light/dark/system.
- Hiển thị lịch sử, biểu đồ tiến trình và tạo ảnh bảng điểm bằng canvas; có tải ảnh và copy ảnh khi trình duyệt hỗ trợ.

Đây vẫn là MVP local-only: chưa có tài khoản, backend, database, đồng bộ nhiều thiết bị hay Web Share API. Các luồng còn lại cần kiểm thử browser đầy đủ được theo dõi trong task OpenSpec.

## Yêu cầu

- Node.js có hỗ trợ `node --test --experimental-strip-types`.
- npm.

Cài dependency:

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Bản production local:

```bash
npm run build
npm run start
```

## Kiểm tra

```bash
npm test
npm run format:check
npm run lint
```

Hiện `npm test`, `npm run build`, `npm run format:check` và `npm run lint` đều đạt. Unit tests gồm logic điểm, player và storage version 1.

## Căn cứ OpenSpec

Tài liệu này dùng change duy nhất `openspec/changes/local-score-session-mvp/`, gồm các capability `score-sessions`, `score-sharing` và `app-preferences`. `openspec/specs/` hiện chưa có spec chính ngoài `.gitkeep`, vì vậy các nội dung dự kiến được đánh dấu rõ trong `docs/architecture.md`.
