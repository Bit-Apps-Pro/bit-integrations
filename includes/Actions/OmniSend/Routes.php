<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\OmniSend\OmniSendController;
use BitCode\FI\Core\Util\Route;

Route::post('Omnisend_authorization', [OmniSendController::class, 'authorization']);
