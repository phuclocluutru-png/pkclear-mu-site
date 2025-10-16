<?php
declare(strict_types=1);
$pageTitle = 'Nạp & Ủng hộ | PK CLEAR';
$pageDescription = 'Tuỳ chọn nạp và ủng hộ PK CLEAR (mẫu tham khảo).';
$bodyClass = 'bg-slate-950 text-slate-100';
require __DIR__ . '/../partials/head.php';

$activeNav = '';
$isHomePage = false;
require __DIR__ . '/../partials/header.php';
?>
<main class="mx-auto max-w-3xl px-4 py-12 space-y-6">
  <header class="space-y-2">
    <h1 class="font-display text-3xl md:text-4xl font-bold">Nạp &amp; Ủng hộ</h1>
    <p class="text-slate-300">Tuỳ chọn (mẫu):</p>
  </header>
  <ul class="space-y-3 text-slate-300 list-disc ml-5">
    <li>QR Momo / Chuyển khoản ngân hàng</li>
    <li>Thẻ cào (Viettel/Mobi/Vina)</li>
    <li>PayPal/Stripe</li>
  </ul>
  <p class="text-slate-400 text-sm">* Tích hợp cổng thanh toán thực tế và xử lý callback để cộng Point tự động.</p>
</main>
<?php
require __DIR__ . '/../partials/footer.php';
require __DIR__ . '/../partials/scripts.php';
?>
</body>
</html>
