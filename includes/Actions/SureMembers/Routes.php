<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\SureMembers\SureMembersController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('sureMembers_authentication', [SureMembersController::class, 'authentication']);
Route::post('sureMembers_fetch_groups', [SureMembersController::class, 'getGroups']);
