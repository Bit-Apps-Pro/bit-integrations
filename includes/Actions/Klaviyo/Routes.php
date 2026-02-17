<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Klaviyo\KlaviyoController;
use BitApps\Integrations\Core\Util\Route;

Route::post('klaviyo_handle_authorize', [klaviyoController::class, 'handleAuthorize']);
