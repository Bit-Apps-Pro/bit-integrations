<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\Telegram\TelegramController;
use BitApps\BTCBI\Util\Route;

Route::post('telegram_authorize', [ TelegramController::class, 'telegramAuthorize']);
Route::post('refresh_get_updates', [ TelegramController::class, 'refreshGetUpdates']);