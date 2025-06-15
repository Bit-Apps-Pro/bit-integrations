<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Telegram\TelegramController;
use BitCode\FI\Core\Util\Route;

Route::post('telegram_authorize', [TelegramController::class, 'telegramAuthorize']);
Route::post('refresh_get_updates', [TelegramController::class, 'refreshGetUpdates']);
