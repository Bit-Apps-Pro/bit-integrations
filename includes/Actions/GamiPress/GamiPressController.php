<?php

/**
 * LearnDesh Integration
 */

namespace BitCode\FI\Actions\GamiPress;

use WP_Error;

/**
 * Provide functionality for LearnDesh integration
 */
class GamiPressController
{
    // private $_integrationID;

    // public function __construct($integrationID)
    // {
    //     $this->_integrationID = $integrationID;
    // }

    public static function pluginActive($option = null)
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (is_plugin_active('gamipress/gamipress.php')) {
            return $option === 'get_name' ? 'gamipress/gamipress.php' : true;
        }

        return false;
    }

    public static function authorizeGamiPress()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'GamiPress'));
    }

    public static function getCourses()
    {
        $courses = [];

        $course_query_args = [
            'post_type'      => 'sfwd-courses',
            'post_status'    => 'publish',
            'orderby'        => 'post_title',
            'order'          => 'ASC',
            'posts_per_page' => -1,
        ];

        $courseList = get_posts($course_query_args);

        foreach ($courseList as $key => $val) {
            $courses[] = [
                'course_id'    => $val->ID,
                'course_title' => $val->post_title,
            ];
        }

        return $courses;
    }

    public static function fetchAllRankType()
    {
        global $wpdb;

        return $wpdb->get_results(
            "SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like 'rank_type' AND post_status = 'publish'"
        );
    }

    public static function fetchAllRankBYType($query_params)
    {
        $selectRankType = $query_params->domainName;

        global $wpdb;
        $ranks = $wpdb->get_results(
            $wpdb->prepare("SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like %s AND post_status = 'publish'", $selectRankType)
        );

        wp_send_json_success($ranks);
    }

    public static function fetchAllAchievementType()
    {
        global $wpdb;

        return $wpdb->get_results(
            $wpdb->prepare("SELECT ID, post_name, post_title, post_type FROM {$wpdb->posts} WHERE post_type LIKE 'achievement-type' AND post_status = 'publish' ORDER BY post_title ASC")
        );
    }

    public static function fetchAllAchievementBYType($query_params)
    {
        $selectAchievementType = $query_params->achievementType;

        global $wpdb;
        $awards = $wpdb->get_results(
            $wpdb->prepare("SELECT ID, post_name, post_title, post_type FROM wp_posts where post_type like %s AND post_status = 'publish'", $selectAchievementType)
        );
        array_unshift($awards, ['ID' => 'Any', 'post_name' => 'any_achievement', 'post_title' => 'Any Achievement']);
        wp_send_json_success($awards);
    }

    public static function fetchAllPointType()
    {
        global $wpdb;
        $points = $wpdb->get_results(
            $wpdb->prepare("SELECT ID, post_name, post_title, post_type FROM {$wpdb->posts} WHERE post_type LIKE 'points-type' AND post_status = 'publish' ORDER BY post_title ASC")
        );
        wp_send_json_success($points);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        $fieldMap = $integrationDetails->field_map;
        // $defaultDataConf = $integrationDetails->default;
        if (
            empty($integId)
            || empty($mainAction)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, select action are require for GamiPress api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $gamiPressApiResponse = $recordApiHelper->execute(
            $mainAction,
            $fieldValues,
            $integrationDetails,
            $integrationData,
            $fieldMap
        );

        if (is_wp_error($gamiPressApiResponse)) {
            return $gamiPressApiResponse;
        }

        return $gamiPressApiResponse;
    }
}
