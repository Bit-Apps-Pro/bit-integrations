<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Fabman\FabmanController;
use BitCode\FI\Core\Util\Route;

Route::post('fabman_authorization', [FabmanController::class, 'authorization']);
Route::post('fabman_fetch_workspaces', [FabmanController::class, 'fetchWorkspaces']);
Route::post('fabman_fetch_members', [FabmanController::class, 'fetchMembers']);
