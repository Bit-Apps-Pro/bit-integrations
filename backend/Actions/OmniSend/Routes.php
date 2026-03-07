<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\OmniSend\OmniSendController;
use BitApps\Integrations\Core\Util\Route;

Route::post('Omnisend_authorization', [OmniSendController::class, 'authorization']);
