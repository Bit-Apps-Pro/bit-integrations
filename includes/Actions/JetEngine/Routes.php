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
Route::post('jetEngine_relation_types', [JetEngineController::class, 'getRelationTypes']);
Route::post('jetEngine_cpt_list', [JetEngineController::class, 'getCPTList']);
Route::post('jetEngine_cct_list', [JetEngineController::class, 'getCCTList']);
Route::post('jetEngine_tax_list', [JetEngineController::class, 'getTaxList']);
Route::post('jetEngine_relation_list', [JetEngineController::class, 'getRelationList']);
