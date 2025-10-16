<?php
declare(strict_types=1);

$activeNav = $activeNav ?? '';
$isHomePage = $isHomePage ?? false;
$navItems = isset($navItems) && is_array($navItems) ? $navItems : [];

$navLink = static function (array $item) use ($isHomePage) {
    if ($isHomePage && isset($item['homeHref'])) {
        return $item['homeHref'];
    }
    return $item['href'] ?? '#';
};

$navClasses = static function (string $id) use ($activeNav): string {
    $classes = ['hover:text-cyan-300'];
    if ($id === $activeNav) {
        $classes[] = 'text-cyan-300';
        $classes[] = 'font-semibold';
    }
    return implode(' ', $classes);
};
?>
<header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-white/5">
  <div class="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3">
      <img src="/assets/logo.png" class="h-10 w-auto" alt="PK CLEAR logo"/>
      <span class="font-display text-xl">PK CLEAR</span>
    </a>
    <nav class="hidden md:flex items-center gap-6 text-sm">
<?php foreach ($navItems as $item): ?>
      <a href="<?= htmlspecialchars($navLink($item), ENT_QUOTES, 'UTF-8'); ?>" class="<?= htmlspecialchars($navClasses($item['id'] ?? ''), ENT_QUOTES, 'UTF-8'); ?>">
        <?= htmlspecialchars($item['label'] ?? '', ENT_QUOTES, 'UTF-8'); ?>
      </a>
<?php endforeach; ?>
    </nav>
    <a href="/pages/contact.php" class="hidden md:inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 text-slate-900 font-semibold">Liên hệ Admin</a>
    <button id="menu-btn" class="md:hidden px-3 py-2 rounded-lg border border-white/10">Menu</button>
  </div>
  <div id="menu" class="md:hidden hidden border-t border-white/5">
    <div class="px-4 py-3 flex flex-col gap-2 text-sm">
<?php foreach ($navItems as $item): ?>
      <a href="<?= htmlspecialchars($navLink($item), ENT_QUOTES, 'UTF-8'); ?>" class="<?= htmlspecialchars($navClasses($item['id'] ?? ''), ENT_QUOTES, 'UTF-8'); ?>">
        <?= htmlspecialchars($item['label'] ?? '', ENT_QUOTES, 'UTF-8'); ?>
      </a>
<?php endforeach; ?>
      <a href="/pages/contact.php" class="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-400 text-slate-900 font-semibold text-center">Liên hệ Admin</a>
    </div>
  </div>
</header>
