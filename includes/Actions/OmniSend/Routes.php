<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\OmniSend\OmniSendController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('Omnisend_authorization', [OmniSendController::class, 'authorization']);
