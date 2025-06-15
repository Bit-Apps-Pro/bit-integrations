<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\WhatsApp\WhatsAppController;
use BitCode\FI\Core\Util\Route;

Route::post('whats_app_authorization', [WhatsAppController::class, 'Authorization']);
Route::post('whats_app_all_template', [WhatsAppController::class, 'getAllTemplate']);
