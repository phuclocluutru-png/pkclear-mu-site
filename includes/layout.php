<?php
declare(strict_types=1);

if (!function_exists('render_page')) {
    /**
     * Render a page inside the default layout.
     *
     * @param array<string, mixed> $options
     * @param callable():void $content
     */
    function render_page(array $options, callable $content): void
    {
        $pageTitle = (string)($options['title'] ?? 'PK CLEAR | Mu Online Private Server');
        $pageDescription = (string)($options['description'] ?? 'Máy chủ Mu Online PK CLEAR - PK mượt, sự kiện dày đặc, chống gian lận.');
        $pageLang = (string)($options['lang'] ?? 'vi');
        $bodyClass = (string)($options['bodyClass'] ?? 'bg-slate-950 text-slate-100');
        $stylesheets = (array)($options['styles'] ?? []);
        $inlineStyles = (string)($options['inlineStyles'] ?? '');

        $activeNav = (string)($options['activeNav'] ?? '');
        $isHomePage = (bool)($options['isHome'] ?? false);
        $navItems = require __DIR__ . '/../config/navigation.php';

        require __DIR__ . '/../partials/head.php';
        require __DIR__ . '/../partials/header.php';

        $content();

        require __DIR__ . '/../partials/footer.php';

        $additionalScripts = (array)($options['scripts'] ?? []);
        require __DIR__ . '/../partials/scripts.php';

        echo "</body>\n</html>\n";
    }
}
