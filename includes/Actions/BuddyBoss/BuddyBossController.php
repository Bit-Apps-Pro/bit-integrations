<?php

/**
 * BuddyBoss Integration
 */

namespace BitCode\FI\Actions\BuddyBoss;

use WP_Error;

/**
 * Provide functionality for BuddyBoss integration
 */
class BuddyBossController
{
    public static function pluginActive($option = null)
    {
        return (bool) (class_exists('BuddyPress'));
    }

    public static function authorizeBuddyBoss()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'BuddyBoss'));
    }

    public static function getAllGroups()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (self::pluginActive()) {
            global $wpdb;
            $groups = $wpdb->get_results("select id,name from {$wpdb->prefix}bp_groups");

            wp_send_json_success($groups, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'BuddyBoss'));
    }

    public static function getAllUser()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (self::pluginActive()) {
            global $wpdb;
            $users = $wpdb->get_results("select ID,display_name from {$wpdb->prefix}users");
            wp_send_json_success($users, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'BuddyBoss'));
    }

    public static function getAllForums()
    {
        $forum_args = [
            'post_type'      => bbp_get_forum_post_type(),
            'posts_per_page' => 999,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'post_status'    => ['publish', 'private'],
        ];

        $forumList = get_posts($forum_args);

        foreach ($forumList as $key => $val) {
            $forums[] = [
                'forum_id'    => $val->ID,
                'forum_title' => $val->post_title,
            ];
        }

        return $forums;
    }

    public static function getAllTopics($requestParams)
    {
        $forum_id = $requestParams->forumID;

        $topic_args = [
            'post_type'      => bbp_get_topic_post_type(),
            'posts_per_page' => -1,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'post_parent'    => $forum_id,
            'post_status'    => 'publish',
        ];

        $topic_list = get_posts($topic_args);
        $topics = [];

        foreach ($topic_list as $key => $val) {
            $topics[] = [
                'topic_id'    => $val->ID,
                'topic_title' => $val->post_title,
            ];
        }

        wp_send_json_success($topics);
    }

    // for action 11 - BuddyBoss update started

    public static function registerComponents($component_names, $active_components)
    {
        $component_names = ! \is_array($component_names) ? [] : $component_names;
        $component_names[] = 'bit-integrations';

        return $component_names;
    }

    public static function notificationForUser($content, $item_id, $secondary_item_id, $action_item_count, $format, $component_action_name, $component_name, $id)
    {
        if ('bit_integrations_send_notification' === $component_action_name) {
            $notification_content = bp_notifications_get_meta($id, 'uo_notification_content');
            $notification_link = bp_notifications_get_meta($id, 'uo_notification_link');

            if ('string' === $format) {
                return $notification_content;
            } elseif ('object' === $format) {
                return [
                    'text' => $notification_content,
                    'link' => $notification_link,
                ];
            }
        }

        return $content;
    }

    // end action 11

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        $fieldMap = $integrationDetails->field_map;
        if (
            empty($integId)
            || empty($mainAction)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'BuddyBoss'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $buddyBossApiResponse = $recordApiHelper->execute(
            $mainAction,
            $fieldValues,
            $fieldMap,
            $integrationDetails
        );

        if (is_wp_error($buddyBossApiResponse)) {
            return $buddyBossApiResponse;
        }

        return $buddyBossApiResponse;
    }
}
