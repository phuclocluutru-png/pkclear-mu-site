<?php
declare(strict_types=1);

$additionalScripts = $additionalScripts ?? [];
$baseScripts = ['/js/config.js', '/js/main.js'];
$scriptsToLoad = [];
foreach (array_merge($baseScripts, $additionalScripts) as $script) {
    $script = trim((string) $script);
    if ($script === '') {
        continue;
    }
    if (!in_array($script, $scriptsToLoad, true)) {
        $scriptsToLoad[] = $script;
    }
}
?>
<?php foreach ($scriptsToLoad as $script): ?>
<script src="<?= htmlspecialchars($script, ENT_QUOTES, 'UTF-8'); ?>"></script>
<?php endforeach; ?>
