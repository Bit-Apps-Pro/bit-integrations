<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Klaviyo\KlaviyoController;
use BitCode\FI\Core\Util\Route;

Route::post('klaviyo_handle_authorize', [klaviyoController::class, 'handleAuthorize']);
