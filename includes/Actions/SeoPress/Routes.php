<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SeoPress\SeoPressController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('seopress_authorize', [SeoPressController::class, 'seoPressAuthorize']);
