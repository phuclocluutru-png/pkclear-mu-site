<?php
header('Content-Type: application/json; charset=utf-8');
if (!isset($_GET['action'])) {
  echo json_encode(["status"=>"ok","message"=>"API PK CLEAR"]); exit;
}

/**
 * Simple proxy: ?action=wp_posts&site=https://pkclear.com&per_page=10
 */
if ($_GET['action'] === 'wp_posts') {
  $site = isset($_GET['site']) ? $_GET['site'] : '';
  $per = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
  $allowed = ['pkclear.com','www.pkclear.com'];
  $host = parse_url($site, PHP_URL_HOST);
  if (!$host || !in_array($host, $allowed)) { http_response_code(400); echo json_encode(['error'=>'Site not allowed']); exit; }
  $url = rtrim($site,'/') . '/wp-json/wp/v2/posts?per_page=' . $per . '&_embed=1';
  $ch = curl_init($url); curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); curl_setopt($ch, CURLOPT_TIMEOUT, 10); curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
  $res = curl_exec($ch); $err = curl_error($ch); curl_close($ch);
  if ($err) echo json_encode(['error'=>'fetch_failed','detail'=>$err]); else echo $res; exit;
}
echo json_encode(["error"=>"unknown_action"]);
