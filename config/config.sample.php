<?php
// Mẫu cấu hình cục bộ cho API proxy.
// Sao chép file này thành `config.local.php` trong cùng thư mục và điền giá trị thật.

return [
    // API của VPS cung cấp BXH
    'REMOTE_API_BASE' => 'https://api.example.com',
    // Token bí mật (KHÔNG commit lên git)
    'SECRET_TOKEN'    => 'REPLACE_ME',
    // Host được phép (để tránh gọi sang domain lạ)
    'ALLOWED_HOST'    => 'api.example.com',
    // TTL cache (giây)
    'CACHE_TTL'       => 60,
];

