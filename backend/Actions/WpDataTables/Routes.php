<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WpDataTables\WpDataTablesController;
use BitApps\Integrations\Core\Util\Route;

Route::post('wp_data_tables_authorize', [WpDataTablesController::class, 'wpDataTablesAuthorize']);
