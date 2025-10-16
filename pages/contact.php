<?php
declare(strict_types=1);

require __DIR__ . '/../includes/layout.php';

render_page([
    'title' => 'Liên hệ Admin | PK CLEAR',
    'description' => 'Liên hệ Admin PK CLEAR để đăng ký tham gia máy chủ kiểm duyệt.',
    'bodyClass' => 'bg-slate-950 text-slate-100',
    'activeNav' => '',
], function (): void {
?>
<main class="mx-auto max-w-4xl px-4 py-12 space-y-10">
  <header class="space-y-3">
    <h1 class="font-display text-3xl md:text-4xl font-bold">Đăng ký tham gia (Kiểm duyệt)</h1>
    <p class="text-slate-300">Máy chủ <strong>PK CLEAR</strong> kiểm duyệt người chơi để chống clone/ảo hoá và gian lận. Vui lòng liên hệ Admin theo kênh dưới đây.</p>
  </header>
  <div class="grid md:grid-cols-2 gap-6">
    <section class="rounded-2xl border border-white/10 p-6 space-y-3">
      <h2 class="text-xl font-semibold">Kênh liên hệ</h2>
      <ul class="space-y-2 text-slate-300">
        <li><span class="text-slate-400">Facebook:</span> <a id="pkc-contact-facebook" href="#" target="_blank" rel="noopener">facebook.com/yourpage</a></li>
        <li><span class="text-slate-400">Zalo:</span> <a id="pkc-contact-zalo" href="#" target="_blank" rel="noopener">zalo.me/yourid</a></li>
        <li><span class="text-slate-400">Discord:</span> <a id="pkc-contact-discord" href="#" target="_blank" rel="noopener">discord.gg/yourinvite</a></li>
        <li><span class="text-slate-400">Email:</span> <a id="pkc-contact-email" href="#">admin@pkclear.vn</a></li>
        <li><span class="text-slate-400">Điện thoại:</span> <a id="pkc-contact-phone" href="#">0123 456 789</a></li>
      </ul>
      <p class="text-xs text-slate-400">* Chỉnh link/số ở <code>/js/config.js</code>.</p>
    </section>
    <section class="rounded-2xl border border-white/10 p-6 space-y-3">
      <h2 class="text-xl font-semibold">Thông tin cần cung cấp</h2>
      <ul class="list-disc ml-5 space-y-1 text-slate-300">
        <li>Tên hiển thị mong muốn (ingame)</li>
        <li>ID Discord / Facebook</li>
        <li>Kinh nghiệm chơi MU &amp; khung giờ</li>
        <li>Cam kết không dùng ảo hoá/VM/cheat, tuân thủ nội quy</li>
      </ul>
      <p class="text-slate-400 text-sm">* Sau khi duyệt, Admin sẽ cấp tài khoản.</p>
    </section>
  </div>
  <section class="rounded-2xl border border-white/10 p-6 space-y-3">
    <h2 class="text-xl font-semibold">Lý do kiểm duyệt</h2>
    <p class="text-slate-300">Ưu tiên công bằng &amp; trải nghiệm PK chất lượng; hạn chế clone, tool và hành vi tiêu cực.</p>
  </section>
</main>
<?php
});
