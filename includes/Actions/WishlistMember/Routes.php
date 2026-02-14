<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Actions\WishlistMember\WishlistMemberController;
use BitApps\BTCBI_FI\Core\Util\Route;

Route::post('wishlist_authorization', [WishlistMemberController::class, 'authorization']);
Route::post('get_wishlist_levels', [WishlistMemberController::class, 'getLevels']);
