<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\JetEngine\JetEngineController;
use BitCode\FI\Core\Util\Route;

Route::post('jetEngine_authentication', [JetEngineController::class, 'authentication']);
Route::post('jetEngine_menu_positions', [JetEngineController::class, 'getMenuPosition']);
Route::post('jetEngine_menu_icons', [JetEngineController::class, 'getMenuIcons']);
Route::post('jetEngine_supports', [JetEngineController::class, 'getSupports']);
Route::post('jetEngine_tax_post_types', [JetEngineController::class, 'getTaxPostTypes']);