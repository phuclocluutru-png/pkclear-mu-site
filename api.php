<?php
/* ================== PROXY BXH TỪ VPS ==================
 * Dùng: /api.php?action=rankings&type=ranking|guild|boss
 * Token chỉ nằm ở server, không lộ ra browser.
 * Cấu hình đọc từ biến môi trường hoặc file config.local.php (không commit)
 * ===================================================== */

// Helper: load config ưu tiên ENV > config.local.php > defaults
function pkc_load_config(): array {
  $env = [
    'REMOTE_API_BASE' => getenv('https://api.pkclear.com') ?: null,
    'SECRET_TOKEN'    => getenv('pZ9rQ6xV-71gsJ4F_neAq2LzHf0TMbCY8uR5wK1SdEXvOGIhLBPt3yUjVNc7D') ?: null,
    'ALLOWED_HOST'    => getenv('api.pkclear.com') ?: null,
    'CACHE_TTL'       => getenv('5') ?: null,
  ];

  $file = __DIR__ . '/config.local.php';
  $fromFile = [];
  if (is_file($file)) {
    $tmp = include $file; // trả về mảng
    if (is_array($tmp)) $fromFile = $tmp;
  }

  $defaults = [
    'REMOTE_API_BASE' => '',
    'SECRET_TOKEN'    => '',
    'ALLOWED_HOST'    => '',
    'CACHE_TTL'       => 5,
  ];

  // Merge theo ưu tiên: defaults < file < env
  return array_merge($defaults, $fromFile, array_filter($env, fn($v) => $v !== null && $v !== ''));
}

// Helper: thư mục cache an toàn
function pkc_cache_dir(): string {
  $dir = __DIR__ . '/storage/cache';
  if (!is_dir($dir)) {
    @mkdir($dir, 0777, true);
  }
  if (is_dir($dir) && is_writable($dir)) return $dir;
  // fallback hệ thống
  $tmp = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'pkclear-cache';
  if (!is_dir($tmp)) @mkdir($tmp, 0777, true);
  return $tmp;
}

if (isset($_GET['action']) && $_GET['action'] === 'rankings') {
  // 1) cấu hình
  $cfg = pkc_load_config();
  $REMOTE_API_BASE = (string)($cfg['REMOTE_API_BASE'] ?? '');
  $SECRET_TOKEN    = (string)($cfg['SECRET_TOKEN'] ?? '');
  $allowedHost     = (string)($cfg['ALLOWED_HOST'] ?? '');
  $cacheTtl        = (int)($cfg['CACHE_TTL'] ?? 60);

  if ($REMOTE_API_BASE === '' || $SECRET_TOKEN === '' || $allowedHost === '') {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'server_not_configured']);
    exit;
  }

  // 2) kiểm tra host hợp lệ
  $host = parse_url($REMOTE_API_BASE, PHP_URL_HOST);
  if ($host !== $allowedHost) { http_response_code(400); exit; }

  // 3) tham số
  $type = $_GET['type'] ?? 'ranking';            // ranking|guild|boss
  $allowed = ['ranking','guild','boss'];
  if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error'=>'invalid_type']); exit;
  }

  // 4) cache: chuẩn hoá đường dẫn
  $cacheDir = pkc_cache_dir();
  $cacheKey = rtrim($cacheDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . "rank_{$type}.json";
  if (is_file($cacheKey) && (time() - filemtime($cacheKey) < $cacheTtl)) {
    header('Content-Type: application/json; charset=utf-8');
    readfile($cacheKey); exit;
  }

  // 5) gọi API VPS
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
  // 6) lưu cache an toàn (best-effort)
  @file_put_contents($cacheKey, $res, LOCK_EX);
  echo $res; exit;
}
