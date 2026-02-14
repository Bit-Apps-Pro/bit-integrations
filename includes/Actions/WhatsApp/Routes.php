<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WhatsApp\WhatsAppController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('whats_app_authorization', [WhatsAppController::class, 'authorization']);
Route::post('whats_app_all_template', [WhatsAppController::class, 'getAllTemplate']);
