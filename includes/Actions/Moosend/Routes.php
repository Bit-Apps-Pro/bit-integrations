<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Moosend\MoosendController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('moosend_handle_authorize', [MoosendController::class, 'handleAuthorize']);
