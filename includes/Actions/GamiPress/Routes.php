<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\GamiPress\GamiPressController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('gamiPress_authorize', [GamiPressController::class, 'authorizeGamiPress']);
Route::post('gamiPress_fetch_all_rank_type', [GamiPressController::class, 'fetchAllRankType']);
Route::post('gamiPress_fetch_all_rank_by_type', [GamiPressController::class, 'fetchAllRankBYType']);
Route::post('gamiPress_fetch_all_achievement_type', [GamiPressController::class, 'fetchAllAchievementType']);
Route::post('gamiPress_fetch_all_achievement_by_type', [GamiPressController::class, 'fetchAllAchievementBYType']);
Route::post('gamiPress_fetch_all_point_type', [GamiPressController::class, 'fetchAllPointType']);
