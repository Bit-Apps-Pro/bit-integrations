<?php

namespace BitCode\FI\Actions\LifterLms;

use WP_Error;

class LifterLmsController
{
    public static function pluginActive($option = null)
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (is_plugin_active('lifterlms/lifterlms.php')) {
            return $option === 'get_name' ? 'lifterlms/lifterlms.php' : true;
        }

        return false;
    }

    public static function authorizeLifterLms()
    {
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'LifterLms'));
    }

    public static function getAllLesson()
    {
        $lessonParams = [
            'post_type'      => 'lesson',
            'posts_per_page' => 9999,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'post_status'    => 'publish',
        ];

        $lessonList = get_posts($lessonParams);

        foreach ($lessonList as $key => $val) {
            $allLesson[] = [
                'lesson_id'    => $val->ID,
                'lesson_title' => $val->post_title,
            ];
        }

        return $allLesson;
    }

    public static function getAllSection()
    {
        $sectionParams = [
            'post_type'      => 'section',
            'posts_per_page' => 9999,
            'orderby'        => 'title',
            'order'          => 'ASC',
            'post_status'    => 'publish',
        ];

        $sectionList = get_posts($sectionParams);

        foreach ($sectionList as $key => $val) {
            $allSection[] = [
                'section_id'    => $val->ID,
                'section_title' => $val->post_title,
            ];
        }

        return $allSection;
    }

    public static function getAllLifterLmsCourse()
    {
        global $wpdb;

        $allCourse = $wpdb->get_results($wpdb->prepare("SELECT ID, post_title FROM {$wpdb->posts}
        WHERE {$wpdb->posts}.post_status = 'publish' AND {$wpdb->posts}.post_type = 'course' ORDER BY post_title"));

        return $allCourse;
    }

    public static function getAllLifterLmsMembership()
    {
        global $wpdb;

        $allMembership = $wpdb->get_results($wpdb->prepare("SELECT ID, post_title FROM {$wpdb->posts}
        WHERE {$wpdb->posts}.post_status = 'publish' AND {$wpdb->posts}.post_type = 'llms_membership' ORDER BY post_title"));

        return $allMembership;
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        if (
            empty($integId)
            || empty($mainAction)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('Some important info are missing those are required for %s', 'bit-integrations'), 'LifterLms'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $lifterLmsApiResponse = $recordApiHelper->execute(
            $mainAction,
            $fieldValues,
            $integrationDetails,
            $integrationData
        );

        if (is_wp_error($lifterLmsApiResponse)) {
            return $lifterLmsApiResponse;
        }

        return $lifterLmsApiResponse;
    }
}
