<?php

namespace BitCode\FI\Triggers\BitSocial;

class StaticData
{
    public static function tasks()
    {
        return [
            [
                'form_name'           => __('Facebook Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_facebook_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('LinkedIn Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_linkedin_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Discord Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_discord_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Instagram Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_instagram_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Pinterest Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_pinterest_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Threads Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_threads_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Tumblr Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_tumblr_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('X (Twitter) Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_twitter_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Google Business Profile Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_google_business_profile_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('TikTok Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_tiktok_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Bluesky Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_bluesky_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Telegram Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_telegram_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('Line Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_line_post_publish',
                'skipPrimaryKey'      => true,
            ],
            [
                'form_name'           => __('All Platforms Post Published', 'bit-integrations-pro'),
                'triggered_entity_id' => 'bit_social_all_platforms_post_publish',
                'skipPrimaryKey'      => true,
            ],
        ];
    }
}
