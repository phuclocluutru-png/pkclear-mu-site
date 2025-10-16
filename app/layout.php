<?php
declare(strict_types=1);

if (!defined('PKC_BASE_PATH')) {
    define('PKC_BASE_PATH', dirname(__DIR__));
}

if (!defined('PKC_APP_PATH')) {
    define('PKC_APP_PATH', __DIR__);
}

if (!defined('PKC_CONFIG_PATH')) {
    define('PKC_CONFIG_PATH', PKC_BASE_PATH . '/config');
}

if (!defined('PKC_PARTIALS_PATH')) {
    define('PKC_PARTIALS_PATH', PKC_APP_PATH . '/partials');
}

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
        $navItems = require PKC_CONFIG_PATH . '/navigation.php';

        require PKC_PARTIALS_PATH . '/head.php';
        require PKC_PARTIALS_PATH . '/header.php';

        $content();

        require PKC_PARTIALS_PATH . '/footer.php';

        $additionalScripts = (array)($options['scripts'] ?? []);
        require PKC_PARTIALS_PATH . '/scripts.php';

        echo "</body>\n</html>\n";
    }
}
