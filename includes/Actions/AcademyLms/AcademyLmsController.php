<?php

namespace BitCode\FI\Actions\AcademyLms;

use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Academy Lms integration
 */
class AcademyLmsController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Process ajax request for generate_token
     *
     * @return JSON zoho crm api response and status
     */
    public static function Authorization()
    {
        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        if (is_plugin_active('academy/academy.php')) {
            wp_send_json_success(true, 200);
        }

        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'Academy Lms'));
    }

    public static function getAllLesson()
    {
        if (!class_exists('Academy')) {
            wp_send_json_error(wp_sprintf(__('%s is not installed or activated', 'bit-integrations'), 'Academy Lms'));
        }

        $lessons = [];

        $lessonList = \Academy\Traits\Lessons::get_lessons();

        foreach ($lessonList as $key => $val) {
            $lessons[] = [
                'lessonId'    => $val->ID,
                'lessonTitle' => $val->lesson_title,
            ];
        }
        wp_send_json_success($lessons, 200);
    }

    public static function getAllCourse($queryParams)
    {
        $action = $queryParams->type;
        if (!class_exists('Academy')) {
            wp_send_json_error(wp_sprintf(__('%s is not installed or activated', 'bit-integrations'), 'Academy Lms'));
        }

        $courseList = get_posts([
            'post_type'   => 'academy_courses',
            'post_status' => 'publish',
            'numberposts' => -1
        ]);

        if ($action !== 'complete-course' && $action !== 'reset-course' && $action !== 'complete-lesson') {
            $courses[] = [
                'courseId'    => 'all-course',
                'courseTitle' => __('All Course', 'bit-integrations')
            ];
        }

        foreach ($courseList as $key => $val) {
            $courses[] = [
                'courseId'    => $val->ID,
                'courseTitle' => $val->post_title,
            ];
        }
        wp_send_json_success($courses, 200);
    }

    public static function enrollCourse($selectedCourse, $selectedAllCourse, $type)
    {
        $course_ids = [];

        if (\count($selectedAllCourse)) {
            foreach ($selectedAllCourse as $course) {
                if ($course->courseId !== 'all-course') {
                    $course_ids[] = $course->courseId;
                }
            }
        } else {
            $course_ids = $selectedCourse;
        }

        $user_id = get_current_user_id();
        if (!\count($course_ids)) {
            return;
        }

        if ($type === 'enroll') {
            foreach ($course_ids as $course_id) {
                add_filter('is_course_purchasable', '__return_false', 10);
                \Academy\Helper::do_enroll($course_id, $user_id);
                remove_filter('is_course_purchasable', '__return_false', 10);
            }

            return 'course enrolled';
        }
        foreach ($course_ids as $course_id) {
            \Academy\Helper::cancel_course_enroll($course_id, $user_id);
        }

        return 'course unenrolled';
    }

    public static function completeLesson($selectedCourse, $selectedLesson)
    {
        $user_id = get_current_user_id();
        $topic_id = $selectedLesson[0];
        $course_id = $selectedCourse[0];
        $topic_type = 'lesson';

        do_action('academy/frontend/before_mark_topic_complete', $topic_type, $course_id, $topic_id, $user_id);

        $option_name = 'academy_course_' . $course_id . '_completed_topics';
        $saved_topics_lists = (array) json_decode(get_user_meta($user_id, $option_name, true), true);

        if (isset($saved_topics_lists[$topic_type][$topic_id])) {
            unset($saved_topics_lists[$topic_type][$topic_id]);
        } else {
            $saved_topics_lists[$topic_type][$topic_id] = \Academy\Helper::get_time();
        }
        $saved_topics_lists = wp_json_encode($saved_topics_lists);
        update_user_meta($user_id, $option_name, $saved_topics_lists);
        do_action('academy/frontend/after_mark_topic_complete', $topic_type, $course_id, $topic_id, $user_id);

        return 'Lesson Completed';
    }

    public static function completeCourse($selectedCourse)
    {
        $user_id = get_current_user_id();
        $course_id = $selectedCourse[0];

        global $wpdb;
        do_action('academy/admin/course_complete_before', $course_id);
        $date = gmdate('Y-m-d H:i:s', \Academy\Helper::get_time());

        // hash is unique.
        do {
            $hash = substr(md5(wp_generate_password(32) . $date . $course_id . $user_id), 0, 16);
            $hasHash = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(comment_ID) from {$wpdb->comments} 
				WHERE comment_agent = 'academy' AND comment_type = 'course_completed' AND comment_content = %s ",
                    $hash
                )
            );
        } while ($hasHash > 0);

        $data = [
            'comment_post_ID'  => $course_id,
            'comment_author'   => $user_id,
            'comment_date'     => $date,
            'comment_date_gmt' => get_gmt_from_date($date),
            'comment_content'  => $hash,
            'comment_approved' => 'approved',
            'comment_agent'    => 'academy',
            'comment_type'     => 'course_completed',
            'user_id'          => $user_id,
        ];
        $is_complete = $wpdb->insert($wpdb->comments, $data);

        do_action('academy/admin/course_complete_after', $course_id, $user_id);

        if ($is_complete) {
            return 'Course Completed.';
        }
    }

    public static function resetCourse($selectedCourse)
    {
        global $wpdb;
        $user_id = get_current_user_id();
        $course_id = $selectedCourse[0];
        $complete_topics = "academy_course_{$course_id}_completed_topics";

        $wpdb->query($wpdb->prepare("DELETE from {$wpdb->postmeta} WHERE post_id = %d AND meta_key = %s", $course_id, 'academy_course_curriculum'));
        $wpdb->query($wpdb->prepare("DELETE from {$wpdb->usermeta} WHERE user_id = %d AND meta_key = %s", $user_id, $complete_topics));
        $wpdb->query($wpdb->prepare("DELETE from {$wpdb->posts} WHERE post_author = %d AND post_parent = %d AND post_type = %s ", $user_id, $course_id, 'academy_enrolled'));

        $QuizIds = $wpdb->get_col($wpdb->prepare("select quiz_id from {$wpdb->prefix}academy_quiz_attempts where user_id = '14' AND course_id = %d ", $course_id));

        if (!empty($QuizIds)) {
            $QuizIds = "'" . implode("','", $QuizIds) . "'";
            $wpdb->query($wpdb->prepare("DELETE from {$wpdb->prefix}academy_quiz_attempts WHERE user_id = %d AND course_id = %d", $user_id, $course_id));
            $wpdb->query($wpdb->prepare("DELETE from {$wpdb->prefix}academy_quiz_attempt_answers WHERE user_id = %d AND quiz_id in (%s) ", $user_id, $QuizIds));
        }
        $wpdb->query($wpdb->prepare("DELETE from {$wpdb->comments} WHERE comment_agent = 'academy' AND comment_type = 'course_completed' AND comment_post_ID = %d AND user_id = %d", $course_id, $user_id));

        return 'Course progress reseted';
    }

    public function execute($integrationData, $fieldValues)
    {
        $integId = $integrationData->id;
        $actionName = $integrationData->flow_details->actionName;
        $response = [];
        switch ($actionName) {
            case 'enroll-course':
            case 'unenroll-course':
            case 'complete-course':
            case 'reset-course':
                $selectedCourse = $integrationData->flow_details->selectedCourse;
                $selectedAllCourse = [];
                if ($actionName !== 'complete-course' && property_exists($integrationData->flow_details, 'selectedAllCourse')) {
                    $selectedAllCourse = $integrationData->flow_details->selectedAllCourse;
                }
                if ($actionName === 'complete-course') {
                    $response = self::completeCourse($selectedCourse);
                } elseif ($actionName === 'reset-course') {
                    $response = self::resetCourse($selectedCourse);
                } elseif ($actionName === 'enroll-course') {
                    $response = self::enrollCourse($selectedCourse, $selectedAllCourse, 'enroll');
                } else {
                    $response = self::enrollCourse($selectedCourse, $selectedAllCourse, 'unenroll');
                }

                break;
            case 'complete-lesson':
                $selectedCourse = $integrationData->flow_details->selectedCourse;
                $selectedLesson = $integrationData->flow_details->selectedLesson;
                $response = self::completeLesson($selectedCourse, $selectedLesson);

                break;
        }

        if (!isset($response) && $response != []) {
            LogHandler::save($integId, wp_json_encode(['type' => $actionName, 'type_name' => $actionName]), 'error', wp_json_encode($response));
        } else {
            LogHandler::save($integId, wp_json_encode(['type' => $actionName, 'type_name' => $actionName]), 'success', wp_json_encode($response));
        }
    }
}
