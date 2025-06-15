<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Actions\ZohoCreator\ZohoCreatorController;
use BitCode\FI\Core\Util\Route;

Route::post('zcreator_generate_token', [ZohoCreatorController::class, 'generateTokens']);
Route::post('zcreator_refresh_applications', [ZohoCreatorController::class, 'refreshApplicationsAjaxHelper']);
Route::post('zcreator_refresh_forms', [ZohoCreatorController::class, 'refreshFormsAjaxHelper']);
Route::post('zcreator_refresh_fields', [ZohoCreatorController::class, 'refreshFieldsAjaxHelper']);
Route::post('zcreator_refresh_owners', [ZohoCreatorController::class, 'refreshTicketOwnersAjaxHelper']);
Route::post('zcreator_refresh_products', [ZohoCreatorController::class, 'refreshProductsAjaxHelper']);

// public static function registerAjax()
//     {
//         add_action('wp_ajax_zcreator_generate_token', array(__CLASS__, 'generateTokens'));
//         add_action('wp_ajax_zcreator_refresh_applications', array(__CLASS__, 'refreshApplicationsAjaxHelper'));
//         add_action('wp_ajax_zcreator_refresh_forms', array(__CLASS__, 'refreshFormsAjaxHelper'));
//         add_action('wp_ajax_zcreator_refresh_fields', array(__CLASS__, 'refreshFieldsAjaxHelper'));
//         add_action('wp_ajax_zcreator_refresh_owners', array(__CLASS__, 'refreshTicketOwnersAjaxHelper'));
//         add_action('wp_ajax_zcreator_refresh_products', array(__CLASS__, 'refreshProductsAjaxHelper'));
//     }
