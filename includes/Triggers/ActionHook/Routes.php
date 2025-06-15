<?php


if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\ActionHook\ActionHookController;

Route::post('action_hook/test', [ActionHookController::class, 'getTestData']);
Route::post('action_hook/test/remove', [ActionHookController::class, 'removeTestData']);
