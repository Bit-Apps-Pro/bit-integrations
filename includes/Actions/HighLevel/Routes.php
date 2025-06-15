<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\HighLevel\HighLevelController;
use BitCode\FI\Core\Util\Route;

Route::post('highLevel_authorization', [HighLevelController::class, 'highLevelAuthorization']);
Route::post('get_highLevel_contact_custom_fields', [HighLevelController::class, 'getCustomFields']);
Route::post('high_level_contact_tags', [HighLevelController::class, 'getAllTags']);
Route::post('get_highLevel_contacts', [HighLevelController::class, 'getContacts']);
Route::post('get_highLevel_users', [HighLevelController::class, 'getUsers']);
Route::post('get_highLevel_tasks', [HighLevelController::class, 'getHLTasks']);
Route::post('get_highLevel_pipelines', [HighLevelController::class, 'getPipelines']);
Route::post('get_highLevel_opportunities', [HighLevelController::class, 'getOpportunities']);
