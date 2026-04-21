<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WordPress\WordPressController;
use BitApps\Integrations\Core\Util\Route;

Route::post('wordpress_authorize', [WordPressController::class, 'wordPressAuthorize']);
Route::post('get_wordpress_users', [WordPressController::class, 'getUsers']);
Route::post('get_wordpress_user_roles', [WordPressController::class, 'getUserRoles']);
Route::post('get_wordpress_post_types', [WordPressController::class, 'getPostTypes']);
Route::post('get_wordpress_posts', [WordPressController::class, 'getPosts']);
Route::post('get_wordpress_post_tags', [WordPressController::class, 'getPostTags']);
Route::post('get_wordpress_taxonomies', [WordPressController::class, 'getTaxonomies']);
Route::post('get_wordpress_post_categories', [WordPressController::class, 'getPostCategory']);
Route::post('get_wordpress_terms_by_taxonomy', [WordPressController::class, 'getTermsByTaxonomy']);
