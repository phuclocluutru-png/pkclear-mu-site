<?php
declare(strict_types=1);

$pageTitle = $pageTitle ?? 'PK CLEAR | Mu Online Private Server';
$pageDescription = $pageDescription ?? 'Máy chủ Mu Online PK CLEAR - PK mượt, sự kiện dày đặc, chống gian lận.';
$pageLang = $pageLang ?? 'vi';
$bodyClass = $bodyClass ?? 'bg-slate-950 text-slate-100';
$stylesheets = $stylesheets ?? [];
$inlineStyles = $inlineStyles ?? '';

$baseStyles = ['/css/custom.css'];
$mergedStyles = [];
foreach (array_merge($baseStyles, $stylesheets) as $href) {
    $href = trim((string) $href);
    if ($href === '') {
        continue;
    }
    if (!in_array($href, $mergedStyles, true)) {
        $mergedStyles[] = $href;
    }
}
?>
<!DOCTYPE html>
<html lang="<?= htmlspecialchars($pageLang, ENT_QUOTES, 'UTF-8'); ?>">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8'); ?>"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.tailwindcss.com"></script>
<?php foreach ($mergedStyles as $href): ?>
  <link rel="stylesheet" href="<?= htmlspecialchars($href, ENT_QUOTES, 'UTF-8'); ?>"/>
<?php endforeach; ?>
  <style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}h1,.font-display{font-family:Oxanium,Inter,sans-serif;letter-spacing:.5px}</style>
  <?= $inlineStyles ?>
</head>
<body class="<?= htmlspecialchars($bodyClass, ENT_QUOTES, 'UTF-8'); ?>">
