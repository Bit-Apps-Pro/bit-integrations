<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\GiveWp\GiveWpController;
use BitApps\Integrations\Core\Util\Route;

Route::post('giveWp_authorize', [GiveWpController::class, 'authorizeGiveWp']);
