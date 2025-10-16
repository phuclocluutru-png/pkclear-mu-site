<?php
declare(strict_types=1);
$pageTitle = 'Bảng xếp hạng | PK CLEAR';
$pageDescription = 'Theo dõi bảng xếp hạng nhân vật, guild và săn boss của PK CLEAR.';
$bodyClass = 'bg-slate-950 text-slate-100';
require __DIR__ . '/../partials/head.php';

$activeNav = 'rankings';
$isHomePage = false;
require __DIR__ . '/../partials/header.php';
?>
<main class="mx-auto max-w-6xl px-4 py-12 space-y-8">
  <header>
    <h1 class="font-display text-3xl md:text-4xl font-bold">Bảng xếp hạng</h1>
  </header>
  <div class="flex flex-wrap gap-2 items-center">
    <button data-type="ranking" class="tab px-4 py-2 rounded-xl border border-white/10 bg-white/5">Nhân vật</button>
    <button data-type="guild" class="tab px-4 py-2 rounded-xl border border-white/10">Guild</button>
    <button data-type="boss" class="tab px-4 py-2 rounded-xl border border-white/10">Boss</button>
    <span id="rank-status" class="text-slate-400 text-sm ml-auto"></span>
  </div>
  <div class="overflow-x-auto rounded-xl border border-white/10">
    <table class="min-w-full text-left text-sm">
      <thead id="rank-head" class="bg-white/5 text-slate-300"></thead>
      <tbody id="rank-body"></tbody>
    </table>
  </div>
</main>
<?php
require __DIR__ . '/../partials/footer.php';
$additionalScripts = ['/js/pages/rankings.js'];
require __DIR__ . '/../partials/scripts.php';
?>
</body>
</html>
