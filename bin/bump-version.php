<?php

if ($argc < 2) {
    echo "Usage: composer bump-version [new-version]\n";
    exit(1);
}

$newVersion = $argv[1];
$pluginFile = 'bitwpfi.php';
$configFile = 'includes/Config.php';
$readmeFile = 'readme.txt';

if (!file_exists($pluginFile) || !file_exists($readmeFile) || !file_exists($configFile)) {
    echo "Required files not found.\n";
    exit(1);
}

$pluginContent = file_get_contents($pluginFile);
$configContent = file_get_contents($configFile);
$readmeContent = file_get_contents($readmeFile);

$pluginContent = preg_replace_callback(
    '/^(\s*\*\s*Version:\s*)([\d\.]+)/m',
    function ($matches) use ($newVersion) {
        return $matches[1] . $newVersion;
    },
    $pluginContent
);

$pluginContent = preg_replace_callback(
    "/(define\s*\(\s*'BTCBI_VERSION'\s*,\s*')[\d\.]+('\s*\);)/",
    function ($matches) use ($newVersion) {
        return $matches[1] . $newVersion . $matches[2];
    },
    $pluginContent
);

$configContent = preg_replace_callback(
    "/(public\s+const\s+VERSION\s*=\s*')([\d\.]+)(';)/",
    function ($matches) use ($newVersion) {
        return $matches[1] . $newVersion . $matches[3];
    },
    $configContent
);

$readmeContent = preg_replace_callback(
    '/^(Stable tag:\s*)([\d\.]+)/m',
    function ($matches) use ($newVersion) {
        return $matches[1] . $newVersion;
    },
    $readmeContent
);

file_put_contents($pluginFile, $pluginContent);
file_put_contents($configFile, $configContent);
file_put_contents($readmeFile, $readmeContent);

echo esc_html("Updated Version v{$newVersion}") . "\n";
