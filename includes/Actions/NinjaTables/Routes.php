<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\NinjaTables\NinjaTablesController;
use BitCode\FI\Core\Util\Route;

Route::post('ninja_tables_authorize', [NinjaTablesController::class, 'ninjaTablesAuthorize']);
Route::post('refresh_ninja_tables', [NinjaTablesController::class, 'refreshTables']);
Route::post('refresh_ninja_tables_rows', [NinjaTablesController::class, 'refreshRows']);
Route::post('refresh_ninja_tables_users', [NinjaTablesController::class, 'refreshUsers']);
Route::post('refresh_ninja_tables_columns', [NinjaTablesController::class, 'refreshColumns']);
