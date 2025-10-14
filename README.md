# PK CLEAR Website (Subdomain)

Website tĩnh giới thiệu máy chủ Mu Online PK CLEAR, sử dụng Tailwind CDN và một số script JavaScript đơn giản để tải cấu hình, trạng thái máy chủ và bài viết WordPress.

## Tính năng chính
- Không đăng ký/đăng nhập web; liên hệ Admin.
- Cấu hình nhanh trong [`js/config.js`](js/config.js).
- Tin tức tự lấy từ WordPress (REST API hoặc proxy qua [`api.php`](api.php)).

## Chuẩn bị môi trường phát triển
- Sử dụng máy chủ tĩnh (VD: `php -S localhost:8000`) để chạy do có endpoint PHP proxy.
- Tailwind được nhúng qua CDN, cân nhắc thiết lập build pipeline nếu cần tuỳ biến sâu.
- Tham khảo tài liệu [`docs/DEVELOPMENT_READINESS.md`](docs/DEVELOPMENT_READINESS.md) để biết đánh giá và đề xuất nâng cấp chi tiết.
