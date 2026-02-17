<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Smaily\SmailyController;
use BitApps\Integrations\Core\Util\Route;

Route::post('smaily_authentication', [SmailyController::class, 'authentication']);
