# Đánh giá chuẩn bị phát triển

Tài liệu này tổng hợp nhanh kiến trúc hiện tại của website và các đầu việc nên thực hiện trước khi mở rộng phát triển.

## 1. Kiến trúc hiện tại
- **HTML tĩnh**: Trang chủ [`index.html`](../index.html) và các trang phụ trong thư mục [`pages/`](../pages) sử dụng Tailwind CSS qua CDN.
- **Tài sản**: Logo duy nhất tại [`assets/logo.png`](../assets/logo.png), stylesheet tuỳ biến tại [`css/custom.css`](../css/custom.css).
- **JavaScript**: 
  - [`js/config.js`](../js/config.js) cung cấp cấu hình toàn cục (`window.PKC_CONFIG`).
  - [`js/main.js`](../js/main.js) xử lý menu mobile, cập nhật DOM theo cấu hình, gọi API nội bộ (`api.php`) và WordPress REST API.
- **Backend nhẹ**: [`api.php`](../api.php) đóng vai trò proxy/bộ test API, cần PHP để chạy.

## 2. Kiểm tra nhanh
| Hạng mục | Trạng thái | Ghi chú |
| --- | --- | --- |
| Cấu trúc thư mục | ✅ | Đơn giản, phân chia rõ ràng giữa HTML/CSS/JS.
| Quản lý cấu hình | ⚠️ | Sử dụng biến toàn cục trong browser; nên cân nhắc `.env` hoặc JSON tách biệt nếu mở rộng.
| Build CSS | ⚠️ | Tailwind CDN phù hợp demo, không tối ưu cho sản phẩm thật (không tree-shake, phụ thuộc mạng ngoài).
| Kiểm thử/tự động hoá | ❌ | Chưa có công cụ lint/test.
| Quản lý gói | ❌ | Không có `package.json`, khó thêm tool frontend hiện đại.
| Bảo mật API | ⚠️ | `api.php` hiện trả JSON giả lập, cần xác thực/khoá nguồn gọi khi triển khai thật.

## 3. Đề xuất chuẩn bị
1. **Thiết lập môi trường cục bộ**
   - Cài PHP 8+ và chạy `php -S localhost:8000` tại thư mục dự án để phục vụ cả file tĩnh lẫn `api.php`.
   - Xem xét thêm `serve` script (VD: thông qua `npm` hoặc `composer`) để thống nhất.

2. **Quản lý phụ thuộc và build**
   - Khởi tạo `package.json`, thêm Tailwind CLI hoặc Vite để build CSS tùy biến.
   - Thiết lập PostCSS hoặc bundler (Vite) để tối ưu CSS/JS, hỗ trợ module.

3. **Cấu hình & bí mật**
   - Tách cấu hình server (`season`, `exp`, links) vào file JSON hoặc `.env` + script load để tránh sửa mã nguồn.
   - Nếu cần đa môi trường (dev/prod), định nghĩa cơ chế override.

4. **API & dữ liệu**
  - Hoàn thiện `api.php` (hoặc dịch sang Node/Go tuỳ stack) để gọi tới máy chủ thật, thêm xác thực và cache.
  - Thiết lập kiểm soát lỗi và log khi gọi WordPress REST API trong [`js/main.js`](../js/main.js).

5. **Chất lượng mã**
   - Thêm ESLint/Prettier cho JS, Stylelint cho CSS.
   - Cân nhắc Jest hoặc testing library cho component nếu chuyển sang framework.

6. **Triển khai**
   - Xác định hạ tầng (VD: Nginx + PHP-FPM, hoặc static hosting + serverless cho API).
   - Thiết lập CI/CD (GitHub Actions) để tự động build và deploy.

## 4. Việc cần làm tiếp theo
- [ ] Khởi tạo toolchain frontend (Tailwind build, bundler).
- [ ] Thiết lập lint/test cơ bản.
- [ ] Chuẩn hoá cấu hình và secrets.
- [ ] Viết tài liệu deploy (docker hoặc hướng dẫn máy chủ).
- [ ] Kiểm tra SEO, analytics, tracking nếu cần.

Hoàn thành các bước trên sẽ giúp dự án sẵn sàng cho việc phát triển và mở rộng chức năng trong tương lai.
