<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Actions\ZohoMarketingHub\ZohoMarketingHubController;

Route::post('zmarketingHub_refresh_lists', [ZohoMarketingHubController::class, 'refreshLists']);
Route::post('zmarketingHub_refresh_contact_fields', [ZohoMarketingHubController::class, 'refreshContactFields']);
