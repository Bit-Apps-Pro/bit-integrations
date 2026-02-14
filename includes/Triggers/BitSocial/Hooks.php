<?php

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\BTCBI_FI\Core\Util\Hooks;
use BitApps\BTCBI_FI\Triggers\BitSocial\BitSocialController;

Hooks::add('bit_social_facebook_post_publish', [BitSocialController::class, 'facebookPostPublish'], 10, 2);
Hooks::add('bit_social_linkedin_post_publish', [BitSocialController::class, 'linkedinPostPublish'], 10, 2);
Hooks::add('bit_social_discord_post_publish', [BitSocialController::class, 'discordPostPublish'], 10, 2);
Hooks::add('bit_social_instagram_post_publish', [BitSocialController::class, 'instagramPostPublish'], 10, 2);
Hooks::add('bit_social_pinterest_post_publish', [BitSocialController::class, 'pinterestPostPublish'], 10, 2);
Hooks::add('bit_social_threads_post_publish', [BitSocialController::class, 'threadsPostPublish'], 10, 2);
Hooks::add('bit_social_tumblr_post_publish', [BitSocialController::class, 'tumblrPostPublish'], 10, 2);
Hooks::add('bit_social_twitter_post_publish', [BitSocialController::class, 'twitterPostPublish'], 10, 2);
Hooks::add('bit_social_google_business_profile_post_publish', [BitSocialController::class, 'googleBusinessProfilePostPublish'], 10, 2);
Hooks::add('bit_social_tiktok_post_publish', [BitSocialController::class, 'tiktokPostPublish'], 10, 2);
Hooks::add('bit_social_bluesky_post_publish', [BitSocialController::class, 'blueskyPostPublish'], 10, 2);
Hooks::add('bit_social_telegram_post_publish', [BitSocialController::class, 'telegramPostPublish'], 10, 2);
Hooks::add('bit_social_line_post_publish', [BitSocialController::class, 'linePostPublish'], 10, 2);
Hooks::add('bit_social_all_platforms_post_publish', [BitSocialController::class, 'allPlatformsPostPublish'], 10, 1);
