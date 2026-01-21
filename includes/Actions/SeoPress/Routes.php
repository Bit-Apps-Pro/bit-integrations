<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SeoPress\SeoPressController;
use BitCode\FI\Core\Util\Route;

Route::post('seopress_authorize', [SeoPressController::class, 'seoPressAuthorize']);
