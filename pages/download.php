<?php
declare(strict_types=1);

require __DIR__ . '/../includes/layout.php';

render_page([
    'title' => 'Tải game | PK CLEAR',
    'description' => 'Tải full client và launcher PK CLEAR dành cho người chơi đã được duyệt.',
    'bodyClass' => 'bg-slate-950 text-slate-100',
    'activeNav' => 'download',
], function (): void {
?>
<main class="mx-auto max-w-3xl px-4 py-12 space-y-8">
  <div>
    <h1 class="font-display text-3xl md:text-4xl font-bold">Tải game</h1>
    <p class="text-slate-400 mt-2">Dành cho người đã được Admin duyệt. Vui lòng kiểm tra MD5 trước khi chạy.</p>
  </div>
  <div class="grid md:grid-cols-2 gap-4">
    <a id="pkc-download-client" class="rounded-2xl border border-white/10 p-6 hover:border-white/20 transition" href="#">
      <div class="text-xl font-semibold">Full Client</div>
      <p class="text-slate-400 text-sm mt-1">Bản đầy đủ (ZIP)</p>
    </a>
    <a id="pkc-download-launcher" class="rounded-2xl border border-white/10 p-6 hover:border-white/20 transition" href="#">
      <div class="text-xl font-semibold">Launcher</div>
      <p class="text-slate-400 text-sm mt-1">Cập nhật tự động</p>
    </a>
  </div>
  <section>
    <h2 class="font-display text-2xl font-bold">Hướng dẫn</h2>
    <ol class="list-decimal ml-5 mt-3 text-slate-300 space-y-2">
      <li>Tải về và giải nén.</li>
      <li>Chạy <strong>Launcher</strong> để cập nhật.</li>
      <li>Liên hệ Admin để được cấp tài khoản.</li>
    </ol>
  </section>
</main>
<?php
});
