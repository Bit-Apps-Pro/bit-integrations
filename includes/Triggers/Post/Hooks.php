<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitCode\FI\Core\Util\Hooks;
use BitCode\FI\Triggers\Post\PostController;

// Hooks::add('save_post', [PostController::class, 'createPost'], 10, 3);
Hooks::add('wp_after_insert_post', [PostController::class, 'createPost'], 10, 4);
Hooks::add('comment_post', [PostController::class, 'postComment'], 10, 3);
Hooks::add('post_updated', [PostController::class, 'postUpdated'], 10, 2);
Hooks::filter('the_content', [PostController::class, 'viewPost'], 10, 1);
Hooks::add('delete_post', [PostController::class, 'deletePost'], 10, 2);
Hooks::add('transition_post_status', [PostController::class, 'changePostStatus'], 10, 3);
Hooks::add('trash_comment', [PostController::class, 'trashComment'], 10, 2);
Hooks::add('edit_comment', [PostController::class, 'updateComment'], 10, 2);
Hooks::add('wp_trash_post', [PostController::class, 'trashPost'], 10, 1);
