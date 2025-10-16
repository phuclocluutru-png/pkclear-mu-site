<?php
declare(strict_types=1);
$pageTitle = 'Tin tức | PK CLEAR';
$pageDescription = 'Trung tâm tin tức PK CLEAR: sự kiện, cập nhật và hướng dẫn mới nhất.';
$bodyClass = 'bg-slate-950 text-slate-100';
$stylesheets = ['/css/news.css'];
require __DIR__ . '/../partials/head.php';

$activeNav = 'news';
$isHomePage = false;
require __DIR__ . '/../partials/header.php';
?>
<section data-hero data-hero-title="Tin tức" data-hero-accent="PK CLEAR"></section>
<main class="relative">
  <section class="news-page-wrapper py-16">
    <div class="mx-auto max-w-6xl px-4 space-y-12">
      <div class="news-page-head">
        <div>
          <p class="news-page-eyebrow">Trung tâm tin tức</p>
          <h2 class="news-page-title">Chọn danh mục để bắt kịp mọi thông tin</h2>
          <p class="news-page-desc">Bộ lọc giúp bạn truy cập nhanh các chủ đề: tin tức &amp; cập nhật, sự kiện, PK CLEAR, hướng dẫn cơ bản và nâng cao.</p>
        </div>
        <div id="news-page-filters"></div>
      </div>
      <div id="news-page-content" class="space-y-16"></div>
    </div>
  </section>
</main>
<?php
require __DIR__ . '/../partials/footer.php';
$additionalScripts = ['/js/news-slider.js'];
require __DIR__ . '/../partials/scripts.php';
?>
</body>
</html>
