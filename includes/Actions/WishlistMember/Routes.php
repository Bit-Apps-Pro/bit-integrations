<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Actions\WishlistMember\WishlistMemberController;
use BitApps\Integrations\Core\Util\Route;

Route::post('wishlist_authorization', [WishlistMemberController::class, 'authorization']);
Route::post('get_wishlist_levels', [WishlistMemberController::class, 'getLevels']);
