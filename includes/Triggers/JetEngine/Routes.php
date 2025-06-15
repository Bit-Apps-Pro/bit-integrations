<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\JetEngine\JetEngineController;

Route::get('jetengine/get', [JetEngineController::class, 'getAll']);
Route::post('jetengine/get/form', [JetEngineController::class, 'get_a_form']);

// for edit

Route::get('get_all_post_Types_jet_engine', [JetEngineController::class, 'getAllPostTypes']);
// Route::get('get_all_post_posts', [JetEngineController::class, 'getAllPosts']);
