<?php
/* ================== PROXY BXH TỪ VPS ==================
 * Dùng: /api.php?action=rankings&type=ranking|guild|boss
 * Token chỉ nằm ở server, không lộ ra browser.
 * ===================================================== */
if (isset($_GET['action']) && $_GET['action'] === 'rankings') {
  // 1) cấu hình
  $REMOTE_API_BASE = 'http://api.pkclear.com';   // Đang HTTP; nếu đã có SSL thì đổi sang https://
  $SECRET_TOKEN    = 'pZ9rQ6xV-71gsJ4F_neAq2LzHf0TMbCY8uR5wK1SdEXvOGIhLBPt3yUjVNc7D';        // <-- dán token API của bạn
  $allowedHost     = 'api.pkclear.com';          // khoá host

  // 2) kiểm tra & build url
  $host = parse_url($REMOTE_API_BASE, PHP_URL_HOST);
  if ($host !== $allowedHost) { http_response_code(400); exit; }

  $type = $_GET['type'] ?? 'ranking';            // ranking|guild|boss
  $allowed = ['ranking','guild','boss'];
  if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error'=>'invalid_type']); exit;
  }

  // 3) cache 60 giây để giảm tải VPS
  $cacheKey  = __DIR__ . "/cache_rank_{$type}.json";
  $cacheTtl  = 60; // seconds
  if (is_file($cacheKey) && (time() - filemtime($cacheKey) < $cacheTtl)) {
    header('Content-Type: application/json; charset=utf-8');
    readfile($cacheKey); exit;
  }

  // 4) gọi API VPS
  $url = rtrim($REMOTE_API_BASE,'/') . '/index.php?endpoint=' . urlencode($type) . '&token=' . urlencode($SECRET_TOKEN);

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  // nếu đã cài SSL hợp lệ (https) giữ verify = true
  if (stripos($REMOTE_API_BASE,'https://') === 0) {
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
  }
  $res = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);

  header('Content-Type: application/json; charset=utf-8');
  if ($err || !$res) {
    echo json_encode(['error'=>'fetch_failed','detail'=>$err]); exit;
  }
  // lưu cache
  @file_put_contents($cacheKey, $res, LOCK_EX);
  echo $res; exit;
}
