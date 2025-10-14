<?php
/* ================== PROXY BXH TỪ VPS ==================
 * Dùng: /api.php?action=rankings&type=ranking|guild|boss
 * Token chỉ nằm ở server, không lộ ra browser.
 * Cấu hình đọc từ biến môi trường hoặc file config.local.php (không commit)
 * ===================================================== */

// Helper: load config ưu tiên ENV > config.local.php > defaults
function pkc_load_config(): array {
  $env = [
    'REMOTE_API_BASE' => getenv('PKC_REMOTE_API_BASE') ?: null,
    'SECRET_TOKEN'    => getenv('PKC_API_TOKEN') ?: null,
    'ALLOWED_HOST'    => getenv('PKC_ALLOWED_HOST') ?: null,
    'CACHE_TTL'       => getenv('PKC_CACHE_TTL') ?: null,
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
    'CACHE_TTL'       => 60,
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

// Demo data cho môi trường local khi chưa cấu hình
function pkc_demo_rank_data(string $type): array {
  if ($type === 'guild') {
    return [
      ['ranking'=>1,'guild_name'=>'Alpha','master'=>'Admin','TotalDevote'=>1200,'MemberCount'=>15,'G_Score'=>3200],
      ['ranking'=>2,'guild_name'=>'Beta','master'=>'Mod','TotalDevote'=>800,'MemberCount'=>10,'G_Score'=>2400],
    ];
  }
  if ($type === 'boss') {
    return [
      ['CharacterName'=>'DemoOne','KillCount'=>25,'TotalPoint'=>250],
      ['CharacterName'=>'DemoTwo','KillCount'=>18,'TotalPoint'=>180],
    ];
  }
  return [
    ['ranking'=>1,'name'=>'WarDemo','level'=>400,'reset'=>10,'master_reset'=>1,'guild'=>'Alpha','status'=>'Online'],
    ['ranking'=>2,'name'=>'ElfDemo','level'=>380,'reset'=>9,'master_reset'=>1,'guild'=>'Beta','status'=>'Offline'],
  ];
}

if (isset($_GET['action']) && $_GET['action'] === 'rankings') {
  // 1) cấu hình
  $cfg = pkc_load_config();
  $REMOTE_API_BASE = (string)($cfg['REMOTE_API_BASE'] ?? '');
  $SECRET_TOKEN    = (string)($cfg['SECRET_TOKEN'] ?? '');
  $allowedHost     = (string)($cfg['ALLOWED_HOST'] ?? '');
  $cacheTtl        = (int)($cfg['CACHE_TTL'] ?? 60);

  if ($REMOTE_API_BASE === '' || $SECRET_TOKEN === '' || $allowedHost === '') {
    $isLocal = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1','::1']);
    $allowStub = $isLocal || getenv('PKC_DEV_ALLOW_STUB') === '0';
    header('Content-Type: application/json; charset=utf-8');
    if ($allowStub) {
      echo json_encode(pkc_demo_rank_data($_GET['type'] ?? 'ranking'));
    } else {
      http_response_code(500);
      echo json_encode(['error' => 'server_not_configured']);
    }
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
