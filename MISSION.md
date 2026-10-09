# Mission: Làm chủ Tech Stack Hiện Đại và Xây dựng Portfolio Cá nhân

## Why
Hiểu sâu sắc tư duy kiến trúc web hiện đại (Astro 7, Modern Native CSS, Zero-JS) để tự tin tự tay xây dựng, tối ưu hóa và xuất bản một trang portfolio cá nhân đạt chuẩn hiệu năng cao (Core Web Vitals) và chuẩn tiếp cận (WCAG 2.2 AA) mà không phụ thuộc vào các thư viện cồng kềnh.

## Success looks like
- Giải thích được rành mạch tại sao chọn Astro và Modern CSS thay vì Next.js hay Tailwind cho một content-driven site.
- Tự tay khởi tạo, cấu trúc và viết các component `.astro` kết hợp content collections với schema Zod.
- Áp dụng thành thạo các tính năng CSS hiện đại (CSS nesting, `light-dark()`, `@starting-style`, `@view-transition`, `animation-timeline: view()`) theo mô hình progressive enhancement.
- Triển khai thành công portfolio lên Cloudflare Workers/Pages với Core Web Vitals tối ưu (LCP ≤ 2.5s, CLS ≤ 0.1) và ship 0 KB JS mặc định xuống trình duyệt.

## Constraints
- Tôn trọng nguyên lý tối giản (Ponytail Ultra): ưu tiên chuẩn native của trình duyệt, không thêm thư viện ngoài (zero unnecessary dependencies).
- Bắt đầu từ nền tảng HTML/CSS/JS cơ bản của học viên, từng bước mở rộng sang kiến trúc SSG và Astro components.

## Out of scope
- Full-stack SSR phức tạp, cơ sở dữ liệu động (PostgreSQL/Prisma), hoặc hệ thống xác thực người dùng (Auth).
- Các thư viện animation JS nặng (GSAP, Framer Motion) ở giai đoạn khởi đầu.
