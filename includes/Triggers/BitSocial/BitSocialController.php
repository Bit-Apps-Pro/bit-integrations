<?php

namespace BitCode\FI\Triggers\BitSocial;

use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Flow\Flow;

final class BitSocialController
{
    public static function info()
    {
        return [
            'name'              => 'Bit Social',
            'type'              => 'custom_form_submission',
            'is_active'         => self::isPluginInstalled(),
            'documentation_url' => 'https://bit-integrations.com/wp-docs/trigger/bit-social-integrations/',
            'tutorial_url'      => '#',
            'tasks'             => [
                'action' => 'bit-social/get',
                'method' => 'get',
            ],
            'fetch' => [
                'action' => 'trigger/test',
                'method' => 'post',
            ],
            'fetch_remove' => [
                'action' => 'trigger/test/remove',
                'method' => 'post',
            ],
            'isPro' => false
        ];
    }

    public function getAllTasks()
    {
        if (!self::isPluginInstalled()) {
            wp_send_json_error(\sprintf(__('%s is not installed or activated', 'bit-integrations'), 'Bit Social'));
        }

        wp_send_json_success(StaticData::tasks());
    }

    public static function facebookPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_facebook_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function linkedinPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_linkedin_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function discordPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_discord_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function instagramPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_instagram_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function pinterestPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_pinterest_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function threadsPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_threads_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function tumblrPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_tumblr_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function twitterPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_twitter_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function googleBusinessProfilePostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_google_business_profile_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function tiktokPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_tiktok_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function blueskyPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_bluesky_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function telegramPostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_telegram_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function linePostPublish($postData, $response)
    {
        return self::flowExecute('bit_social_line_post_publish', ['post_data' => $postData, 'response' => $response]);
    }

    public static function allPlatformsPostPublish($postData)
    {
        return self::flowExecute('bit_social_all_platforms_post_publish', ['post_data' => $postData]);
    }

    private static function flowExecute($entityId, $data)
    {
        $formData = Helper::prepareFetchFormatFields($data);

        if (empty($formData) || !\is_array($formData)) {
            return;
        }

        Helper::setTestData("btcbi_{$entityId}_test", array_values($formData));

        $flows = Flow::exists('BitSocial', $entityId);

        if (!$flows) {
            return;
        }

        $data = array_column($formData, 'value', 'name');

        Flow::execute('BitSocial', $entityId, $data, $flows);

        return ['type' => 'success'];
    }

    private static function isPluginInstalled()
    {
        return class_exists('BitApps\Social\Plugin');
    }
}
