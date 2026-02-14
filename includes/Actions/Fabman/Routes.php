<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\Fabman\FabmanController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('fabman_authorization', [FabmanController::class, 'authorization']);
Route::post('fabman_fetch_workspaces', [FabmanController::class, 'fetchWorkspaces']);
