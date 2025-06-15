<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\SureMembers\SureMembersController;
use BitCode\FI\Core\Util\Route;

Route::post('sureMembers_authentication', [SureMembersController::class, 'authentication']);
Route::post('sureMembers_fetch_groups', [SureMembersController::class, 'getGroups']);
