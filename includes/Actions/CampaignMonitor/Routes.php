<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\CampaignMonitor\CampaignMonitorController;
use BitCode\FI\Core\Util\Route;

Route::post('campaign_monitor_authorize', [CampaignMonitorController::class, 'authorization']);
Route::post('campaign_monitor_lists', [CampaignMonitorController::class, 'getAllLists']);
Route::post('campaign_monitor_custom_fields', [CampaignMonitorController::class, 'getCustomFields']);
