# Kiến trúc Write Score

## Phạm vi và căn cứ

Mô tả dưới đây được xác nhận từ mã nguồn hiện tại và từ change duy nhất `local-score-session-mvp`. Thư mục `openspec/specs/` chưa có spec chính; các phần chưa có trong mã nguồn được đặt riêng dưới mục **Kiến trúc đề xuất**.

## Kiến trúc hiện tại

Ứng dụng là một Next.js App Router đơn route, chạy client-side:

```text
src/app/layout.tsx
└── src/app/page.tsx (Client Component)
    ├── UI session list và các dialog
    ├── src/lib/domain.ts
    └── src/lib/storage.ts ── localStorage: write-score-store-v1
```

- `src/app/layout.tsx` cung cấp root layout và metadata; `src/app/page.tsx` cung cấp route `/`.
- `page.tsx` quản lý state giao diện, hydration, session đang mở, ngôn ngữ/theme và các thao tác tạo/sửa/xóa.
- `src/lib/domain.ts` định nghĩa `GameSession`, `Player`, `Round`, `Preferences`, `AppStore`, cùng các hàm tạo session, thêm/sửa/xóa vòng, tính tổng/xếp hạng, tạo series biểu đồ và nhân bản session.
- `src/lib/storage.ts` đọc/ghi payload version 1 trong `localStorage`, có fallback store rỗng khi chạy ngoài browser, JSON hỏng hoặc schema không hợp lệ.
- Ảnh bảng điểm được dựng phía client bằng `canvas`; tải ảnh dùng Blob/download và copy ảnh dùng Clipboard API khi có `ClipboardItem`.
- CSS nằm trong `src/app/globals.css` và `src/app/page.module.css`; cấu hình Next.js bật `cacheComponents` và `partialPrefetching`.

## Luồng dữ liệu

1. Sau hydration, trang đọc `AppStore` từ localStorage.
2. State React là nguồn hiển thị hiện tại; mọi thay đổi session hoặc preference được ghi lại vào localStorage.
3. Tổng điểm, thứ hạng và chart series được suy ra từ `rounds`, không lưu tổng riêng.
4. Các thao tác chia sẻ tạo ảnh từ session và standings hiện tại, không gọi server.

## Kiểm thử và trạng thái triển khai

`src/lib/domain.test.ts` và `src/lib/storage.test.ts` kiểm tra tổng/xếp hạng, cập nhật/xóa vòng, nhân bản session, player và storage version 1. `npm test`, `npm run build`, `npm run format:check` và `npm run lint` hiện đạt.

## Kiến trúc đề xuất

Theo change `local-score-session-mvp`, các hướng sau là mục tiêu hoặc phần còn lại, chưa nên xem là quyết định đã triển khai đầy đủ:

- Hoàn thiện adapter localStorage có kiểm thử reload/integration và xử lý lỗi ghi thân thiện hơn.
- Chốt giải pháp chart/image renderer nếu canvas hiện tại không đáp ứng các viewport hoặc yêu cầu phát hành; change chưa chọn thư viện chart.
- Bổ sung kiểm thử responsive/e2e cho mobile, tablet, desktop và các luồng edit/delete/reset/share.
- Hoàn thiện kiểm thử confirmation modal dùng chung cho xóa vòng, xóa người chơi có điểm, xóa session và reset toàn bộ dữ liệu.
- Chuỗi UI đã tách vào `src/lib/resources.ts`; icon dùng `lucide-react`; modal dùng chung nằm trong `src/components/ConfirmModal.tsx`.

## Quyết định chưa chốt

- Có cần thư viện chart riêng hay tiếp tục dùng phần chart hiện tại.
- Phạm vi và định dạng export/import dữ liệu local trong giai đoạn sau MVP.
- Cách xử lý dữ liệu local khi storage đầy, bị chặn hoặc schema thay đổi.
- Mức độ kiểm thử trình duyệt thực tế, đặc biệt Clipboard API trên Safari mobile.
