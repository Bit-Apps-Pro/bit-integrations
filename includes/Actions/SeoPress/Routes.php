<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\SeoPress\SeoPressController;
use BitApps\Integrations\Core\Util\Route;

Route::post('seopress_authorize', [SeoPressController::class, 'seoPressAuthorize']);
