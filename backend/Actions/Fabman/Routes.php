<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\Fabman\FabmanController;
use BitApps\Integrations\Core\Util\Route;

Route::post('fabman_authorization', [FabmanController::class, 'authorization']);
Route::post('fabman_fetch_workspaces', [FabmanController::class, 'fetchWorkspaces']);
