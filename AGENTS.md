<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hướng dẫn cho Codex

## Đọc trước khi sửa code

1. Đọc `README.md` và cấu hình trong `package.json`, `next.config.ts`, `tsconfig.json` và `eslint.config.mjs`.
2. Đọc các tài liệu OpenSpec liên quan trong `openspec/changes/`; change hiện hành là `local-score-session-mvp`.
3. Đọc spec chính trong `openspec/specs/` nếu thư mục này đã được bổ sung. Hiện thư mục chỉ có `.gitkeep`.
4. Vì repo dùng Next.js 16.4.6 với quy ước riêng, đọc guide liên quan trong `node_modules/next/dist/docs/` trước khi sửa mã Next.js; tối thiểu xem guide về project structure và App Router.

## OpenSpec và kiểm tra

- Khi triển khai một change, bám theo `proposal.md`, `design.md`, các delta spec và `tasks.md` của change đó.
- Chỉ dùng `openspec-apply` khi người dùng yêu cầu triển khai; sau khi làm xong cần chạy các kiểm tra phù hợp và đối chiếu lại capability spec.
- Với thay đổi code, chạy `npm run format`; trước khi bàn giao chạy `npm test`, `npm run build`, `npm run format:check` và `npm run lint` khi phù hợp.
- Không coi change là hoàn tất chỉ vì build pass; các task chưa đánh dấu trong `tasks.md` vẫn cần được xem xét.

## Quy ước đã xác nhận trong repo

- Ứng dụng dùng Next.js App Router, TypeScript strict, mã ứng dụng nằm dưới `src/` và alias `@/*` trỏ tới `src/*`.
- Logic domain nằm trong `src/lib/domain.ts`; persistence trình duyệt nằm trong `src/lib/storage.ts`; UI route chính nằm trong `src/app/page.tsx`.
- Dữ liệu MVP là local-only, lưu theo payload có `version: 1` trong `localStorage`; không tự thêm backend, database hoặc authentication.
- Giữ `openspec/` trong phạm vi format. Không sửa hoặc archive change nếu người dùng chưa yêu cầu.

## Quy tắc code

- Dùng TypeScript strict; tránh `any`, ép kiểu không cần thiết và non-null assertion (`!`).
- Logic tính điểm, xếp hạng và biến đổi dữ liệu chỉ đặt trong `src/lib/domain.ts`, không viết lại trong component UI.
- Chỉ truy cập `window`, `localStorage`, `document`, Clipboard API hoặc canvas trong client-side code sau hydration.
- Mọi thay đổi dữ liệu session phải tạo state mới, không mutate trực tiếp mảng hoặc object hiện có.
- Dùng ID ổn định cho session, player và round; không dùng tên hiển thị làm khóa dữ liệu.
- Mọi thay đổi hành vi phải bổ sung hoặc cập nhật test tương ứng trong `src/lib/*.test.ts`.
- Các thao tác có nguy cơ mất dữ liệu phải yêu cầu xác nhận và phải giữ nguyên dữ liệu khi người dùng hủy.
- UI mới phải hỗ trợ keyboard, có accessible name cho button/icon và không phụ thuộc vào hover.
- Chuỗi hiển thị phải đi qua hệ thống translation hiện có; không hard-code text giao diện trong component.
- Không thêm dependency mới nếu chưa ghi rõ lý do, ảnh hưởng bundle và phương án thay thế.
- Khi bổ sung capability mới, tạo hoặc cập nhật spec chính sau khi change được duyệt và archive.

## Format code

- Dùng Prettier làm chuẩn format duy nhất cho các file được repo hỗ trợ.
- Sau khi thay đổi code, chạy `npm run format`.
- Trước khi bàn giao, chạy `npm run format:check` và xử lý mọi khác biệt format.
- Giữ `openspec/` trong phạm vi format; không loại trừ thư mục này khỏi Prettier trừ khi task yêu cầu rõ.
- Không đánh dấu task OpenSpec hoàn tất nếu implementation chưa được đối chiếu với spec và test phù hợp.
