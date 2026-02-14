<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\GiveWp\GiveWpController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('giveWp_authorize', [GiveWpController::class, 'authorizeGiveWp']);
