<?php
declare(strict_types=1);

require __DIR__ . '/includes/layout.php';

render_page([
    'title' => 'PK CLEAR | Mu Online Private Server',
    'description' => 'Máy chủ PK tốc độ mượt, cân bằng class, sự kiện dày đặc, anti-cheat mạnh.',
    'bodyClass' => 'bg-slate-950 text-slate-100',
    'styles' => ['/css/news.css'],
    'activeNav' => 'home',
    'isHome' => true,
    'scripts' => ['/js/news-slider.js'],
], function (): void {
?>
<section id="home" class="relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-b from-purple-800/30 via-transparent to-slate-950"></div>
  <div class="absolute inset-0 bg-grid"></div>
  <div class="mx-auto max-w-7xl px-4 pt-16 pb-20 relative">
    <div class="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 class="font-display text-4xl md:text-6xl font-extrabold leading-tight">Mu Online <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">PK CLEAR</span></h1>
        <div class="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">Server kiểm duyệt • Không mở đăng ký công khai</div>
        <p class="mt-4 text-slate-300 text-lg max-w-xl">Máy chủ PK tốc độ mượt, cân bằng class, sự kiện dày đặc, anti-cheat mạnh. Tham gia ngay để khẳng định đẳng cấp chiến binh!</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="/pages/download.php" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-400 text-slate-900 font-semibold glow">Tải Game</a>
          <a href="/pages/contact.php" class="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20">Liên hệ Admin</a>
          <a href="/pages/news.php" class="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20">Tin tức</a>
        </div>
        <div class="mt-6 text-sm text-slate-400">Trạng thái máy chủ: <span id="server-status" class="text-slate-200">Đang tải...</span></div>
      </div>
      <div class="relative">
        <div class="absolute -inset-1 rounded-full blur-3xl bg-gradient-to-r from-purple-600/20 to-cyan-400/20"></div>
        <img src="/assets/logo.png" alt="PK CLEAR logo" class="relative mx-auto h-56 md:h-72 w-auto"/>
        <div class="mt-6 grid grid-cols-3 gap-4 text-center">
          <div class="rounded-2xl border border-white/10 p-4"><div class="text-2xl font-bold">Season</div><div id="pkc-season" class="text-slate-400">Sx.x</div></div>
          <div class="rounded-2xl border border-white/10 p-4"><div class="text-2xl font-bold">Exp</div><div id="pkc-exp" class="text-slate-400">xXXX</div></div>
          <div class="rounded-2xl border border-white/10 p-4"><div class="text-2xl font-bold">Drop</div><div id="pkc-drop" class="text-slate-400">xXX%</div></div>
        </div>
      </div>
    </div>
  </div>
 </section>

<section id="news" class="news-section">
  <div class="news-grid" id="home-news-root">
    <div class="news-left">
      <div id="news-slider" class="news-slider">
        <div class="news-slider-stage">
          <div class="news-slider-backdrop">
            <div class="news-slider-glow"></div>
            <div class="news-slider-blur"></div>
          </div>
          <div class="news-slider-layer">
            <div id="news-prev-card" class="news-card news-card--ghost"></div>
            <div class="news-card news-card--main">
              <img id="news-featured-img" src="" alt="" class="news-card-img" loading="lazy"/>
            </div>
            <div id="news-next-card" class="news-card news-card--ghost"></div>
          </div>
        </div>
        <div class="news-slider-meta">
          <span class="news-slider-label">Bài viết nổi bật</span>
          <div id="news-featured-meta" class="news-slider-subtitle"></div>
          <a id="news-featured-title" href="#" target="_blank" rel="noopener" class="news-slider-title">&nbsp;</a>
          <p id="news-featured-excerpt" class="news-slider-excerpt"></p>
          <div class="news-slider-actions">
            <div class="news-slider-nav">
              <button id="news-prev" class="news-arrow prev" aria-label="Bài trước">&lsaquo;</button>
              <div id="news-featured-dots" class="news-dots"></div>
              <button id="news-next" class="news-arrow next" aria-label="Bài kế tiếp">&rsaquo;</button>
            </div>
            <a id="news-featured-view" href="#" target="_blank" rel="noopener" class="news-cta">Xem ngay</a>
          </div>
        </div>
      </div>
    </div>
    <div class="news-right">
      <div class="news-header">
        <div class="tabs cluster">
          <button class="news-tab" data-tab="featured">Nổi bật</button>
          <button class="news-tab" data-tab="events">Sự kiện</button>
          <button class="news-tab" data-tab="pkclear">PK CLEAR</button>
          <button class="news-tab" data-tab="updates">Tin tức &amp; Cập nhật</button>
          <button class="news-tab" data-tab="guides">Hướng dẫn</button>
        </div>
        <div class="logo">PK CLEAR</div>
      </div>
      <div class="glass-panel">
        <ul id="news-items" class="news-list"></ul>
        <div class="news-more">
          <span class="line"></span>
          <a class="more-btn" href="/pages/news.php">Xem nhiều hơn</a>
          <span class="line"></span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="mx-auto max-w-7xl px-4 pb-16">
  <div class="rounded-2xl border border-white/10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
    <div>
      <h3 class="font-display text-2xl md:text-3xl font-bold">Sẵn sàng chinh phục PK CLEAR?</h3>
      <p class="text-slate-400 mt-2">Tải game và liên hệ Admin để được duyệt.</p>
    </div>
    <div class="flex gap-3">
      <a href="/pages/download.php" class="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 text-slate-900 font-semibold">Tải ngay</a>
      <a href="/pages/contact.php" class="px-5 py-3 rounded-xl border border-white/10 hover:border-white/20">Liên hệ Admin</a>
    </div>
  </div>
</section>

<section id="features" class="mx-auto max-w-7xl px-4 pb-20">
  <h2 class="font-display text-3xl md:text-4xl font-bold mb-8">Điểm nổi bật</h2>
  <div class="grid md:grid-cols-3 gap-6">
    <div class="rounded-2xl border border-white/10 p-6">
      <div class="text-xl font-semibold">Cân bằng class</div>
      <p class="mt-2 text-slate-400">Build đa dạng, meta ổn định cho PK và cày cuốc.</p>
    </div>
    <div class="rounded-2xl border border-white/10 p-6">
      <div class="text-xl font-semibold">Sự kiện dày đặc</div>
      <p class="mt-2 text-slate-400">BC/CC/DS, Boss giờ cố định, event cuối tuần có thưởng.</p>
    </div>
    <div class="rounded-2xl border border-white/10 p-6">
      <div class="text-xl font-semibold">Anti-cheat</div>
      <p class="mt-2 text-slate-400">Chống speed/auto, log và xử lý nhanh.</p>
    </div>
  </div>
</section>
<?php
});
