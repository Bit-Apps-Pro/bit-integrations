<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI\Http\Services\Actions\ActiveCampaign\ActiveCampaignController;
use BTCBI\Deps\BitApps\WPKit\Http\Router\Route;

Route::post('aCampaign_authorize', [ActiveCampaignController::class, 'activeCampaignAuthorize']);
Route::post('aCampaign_headers', [ActiveCampaignController::class, 'activeCampaignHeaders']);
Route::post('aCampaign_lists', [ActiveCampaignController::class, 'activeCampaignLists']);
Route::post('aCampaign_accounts', [ActiveCampaignController::class, 'activeCampaignAccounts']);
Route::post('aCampaign_tags', [ActiveCampaignController::class, 'activeCampaignTags']);
