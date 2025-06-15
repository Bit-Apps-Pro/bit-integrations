<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ElasticEmail\ElasticEmailController;
use BitCode\FI\Core\Util\Route;

Route::post('elasticemail_authorize', [ElasticEmailController::class, 'elasticEmailAuthorize']);
Route::get('get_all_lists', [ElasticEmailController::class, 'getAllLists']);
