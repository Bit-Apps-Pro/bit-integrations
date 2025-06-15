<?php
if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\FluentSupport\FluentSupportController;
use BitCode\FI\Core\Util\Route;

Route::post('fluentSupport_authorization', [FluentSupportController::class, 'checkAuthorization']);
Route::post('fluent_support_get_custom_fields', [FluentSupportController::class, 'getCustomFields']);
Route::post('fluent_support_get_all_support_staff', [FluentSupportController::class, 'getAllSupportStaff']);
Route::post('fluent_support_get_all_business_inboxes', [FluentSupportController::class, 'getAllBusinessInboxes']);
