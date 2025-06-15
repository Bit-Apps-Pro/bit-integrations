<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\Voxel\VoxelController;
use BitCode\FI\Core\Util\Route;

Route::post('voxel_authentication', [VoxelController::class, 'authentication']);
Route::post('get_voxel_post_types', [VoxelController::class, 'getPostTypes']);
Route::post('get_voxel_post_fields', [VoxelController::class, 'getPostFields']);
Route::post('get_voxel_posts', [VoxelController::class, 'getPosts']);
