<?php
declare(strict_types=1);
$pageTitle = 'Nội quy | PK CLEAR';
$pageDescription = 'Quy tắc hành xử dành cho người chơi PK CLEAR.';
$bodyClass = 'bg-slate-950 text-slate-100';
require __DIR__ . '/../partials/head.php';

$activeNav = 'rules';
$isHomePage = false;
require __DIR__ . '/../partials/header.php';
?>
<main class="mx-auto max-w-3xl px-4 py-12 space-y-6">
  <header class="space-y-2">
    <h1 class="font-display text-3xl md:text-4xl font-bold">Nội quy máy chủ</h1>
    <p class="text-slate-400">Tuân thủ để giữ môi trường PK CLEAR công bằng và bền vững.</p>
  </header>
  <ul class="space-y-3 text-slate-300 list-disc ml-5">
    <li>Không sử dụng phần mềm thứ ba, hack/cheat.</li>
    <li>Tôn trọng cộng đồng, không xúc phạm cá nhân/tập thể.</li>
    <li>Không buôn bán vật phẩm/zen ngoài kênh chính thức.</li>
    <li>Tuân thủ hướng dẫn của BQT. Vi phạm sẽ bị xử lý.</li>
  </ul>
</main>
<?php
require __DIR__ . '/../partials/footer.php';
require __DIR__ . '/../partials/scripts.php';
?>
</body>
</html>
