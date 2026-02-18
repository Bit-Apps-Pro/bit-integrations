<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\ElasticEmail\ElasticEmailController;
use BitApps\Integrations\Core\Util\Route;

Route::post('elasticemail_authorize', [ElasticEmailController::class, 'elasticEmailAuthorize']);
Route::get('get_all_lists', [ElasticEmailController::class, 'getAllLists']);
