<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Route;
use BitCode\FI\Triggers\FluentCrm\FluentCrmController;

Route::get('fluentcrm/get', [FluentCrmController::class, 'getAll']);
Route::post('fluentcrm/get/form', [FluentCrmController::class, 'get_a_form']);



Route::get('get_fluentCrm_tags', [FluentCrmController::class, 'getFluentCrmTags']);
Route::get('get_fluentCrm_lists', [FluentCrmController::class, 'getFluentCrmList']);
Route::get('get_fluentCrm_status', [FluentCrmController::class, 'getFluentCrmStatus']);
