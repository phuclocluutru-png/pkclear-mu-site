/**
 * Proxy BXH từ VPS: /api.php?action=rankings&type=ranking|guild|boss
 * KHÔNG để token ở phía client. Sửa 2 dòng $REMOTE_API_BASE và $SECRET_TOKEN bên dưới.
 */
if (isset($_GET['action']) && $_GET['action'] === 'rankings') {
  $type = $_GET['type'] ?? 'ranking';                 // ranking|guild|boss
  $allowed = ['ranking','guild','boss'];
  if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error'=>'invalid_type']); exit;
  }

  // TODO: thay đúng domain VPS và token của bạn
  $REMOTE_API_BASE = 'http://api.pkclear.com/index.php'; // hoặc 'https://api.pkclear.com'
  $SECRET_TOKEN    = 'pZ9rQ6xV-71gsJ4F_neAq2LzHf0TMbCY8uR5wK1SdEXvOGIhLBPt3yUjVNc7D';

  $url = $REMOTE_API_BASE . '?endpoint=' . urlencode($type) . '&token=' . urlencode($SECRET_TOKEN);

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
  $res = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);

  header('Content-Type: application/json; charset=utf-8');
  echo $err ? json_encode(['error'=>'fetch_failed','detail'=>$err]) : $res;
  exit;
}
