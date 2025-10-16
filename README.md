# PK CLEAR Website (Subdomain)

Website tĩnh giới thiệu máy chủ Mu Online PK CLEAR, sử dụng Tailwind CDN và một số script JavaScript đơn giản để tải cấu hình, trạng thái máy chủ và bài viết WordPress.

## Tính năng chính
- Không đăng ký/đăng nhập web; liên hệ Admin.
- Cấu hình nhanh trong [`js/config.js`](js/config.js).
- Tin tức tự lấy từ WordPress (REST API hoặc proxy qua [`api.php`](api.php)).


## Cấu trúc & chỉnh sửa nhanh
- Layout dùng chung khai báo trong [`includes/layout.php`](includes/layout.php) với hàm `render_page()`. Mỗi trang chỉ cần truyền tham số và nội dung HTML trong callback.
- Header/Footer được tái sử dụng qua các partial trong [`partials/`](partials). Điều chỉnh menu tại [`config/navigation.php`](config/navigation.php).
- Thêm trang mới bằng cách tạo file trong `pages/` (hoặc thư mục khác) và gọi `render_page([...], function () { /* nội dung */ });`.

## Chuẩn bị môi trường phát triển
- Sử dụng máy chủ tĩnh (VD: `php -S localhost:8000`) để chạy do có endpoint PHP proxy.
- Tailwind được nhúng qua CDN, cân nhắc thiết lập build pipeline nếu cần tuỳ biến sâu.
- Tham khảo tài liệu [`docs/DEVELOPMENT_READINESS.md`](docs/DEVELOPMENT_READINESS.md) để biết đánh giá và đề xuất nâng cấp chi tiết.

## Cấu hình server-side (ẩn secret và cache)
`api.php` không còn chứa token cứng trong mã. Có 2 cách cấu hình:

- Biến môi trường (ưu tiên):
  - `PKC_REMOTE_API_BASE` — Base URL API VPS (ví dụ: `https://api.pkclear.com`).
  - `PKC_API_TOKEN` — Token bí mật để gọi API.
  - `PKC_ALLOWED_HOST` — Host được phép (ví dụ: `api.pkclear.com`).
  - `PKC_CACHE_TTL` — Thời gian cache (giây), mặc định `60`.

- File cục bộ (không commit): sao chép `config.sample.php` thành `config.local.php` và điền giá trị thật.

Cache BXH được lưu tại `storage/cache/` (tự tạo khi chạy). Nếu thư mục không ghi được, hệ thống sẽ fallback thư mục tạm của OS. Khuyến nghị chặn truy cập trực tiếp thư mục `storage/` trên web server (Nginx/Apache).

Repo đã bổ sung `.gitignore` để bỏ qua `config.local.php`, `storage/` và các artifact build.

### Khắc phục lỗi “Lỗi dữ liệu” ở trang BXH
- Nguyên nhân phổ biến: server chưa cấu hình `api.php` sau khi ẩn secret, nên endpoint trả `{ error: "server_not_configured" }`.
- Cách xử lý:
  1) Với môi trường thật, cấu hình biến môi trường hoặc `config.local.php` như mục trên.
  2) Với môi trường local, có sẵn dữ liệu mô phỏng khi truy cập từ `localhost` hoặc khi đặt `PKC_DEV_ALLOW_STUB=1` trong môi trường. Dùng để test giao diện nhanh.
