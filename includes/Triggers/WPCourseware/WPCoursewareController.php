<?php

namespace BitCode\FI\Triggers\WPCourseware;

use BitCode\FI\Flow\Flow;

final class WPCoursewareController
{
    protected static $actions = [
        [
            "id" => 'userEnrolledCourse',
            "title" => "User Enrolled in Course",
        ], [
            "id" => 'courseCompleted',
            "title" => "User Completed Course",
        ], [
            "id" => 'moduleCompleted',
            "title" => "User Completed Module",
        ], [
            "id" => 'unitCompleted',
            "title" => "User Completed Unit",
        ]
    ];

    public static function info()
    {
        $plugin_path = 'wp-courseware/wp-courseware.php';
        return [
            'name'           => 'WP Courseware',
            'title'          => 'The first and most widely-trusted course creation plugin for WordPress, WP Courseware makes course creation simple and fast with an intuitive, drag-and-drop course builder and all the features you need to create world-class courses.',
            'slug'           => $plugin_path,
            'pro'            => 'wp-courseware/wp-courseware.php',
            'type'           => 'form',
            'is_active'      => is_plugin_active('wp-courseware/wp-courseware.php'),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url'    => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list'           => [
                'action' => 'wpcourseware/get',
                'method' => 'get',
            ],
            'fields'         => [
                'action' => 'wpcourseware/get/form',
                'method' => 'post',
                'data'   => ['id']
            ],
        ];
    }

    public static function userEnrolledCourse($userId, $courses)
    {
        $user = get_user_by('id', $userId);
        $flows = Flow::exists('WPCourseware', 'userEnrolledCourse');

        if (!$flows || !$user || !function_exists('WPCW_courses_getCourseDetails')) {
            return;
        }

        foreach ($courses as $courseId) {
            $course = WPCW_courses_getCourseDetails($courseId);

            if (!$course) {
                continue;
            }

            $data = [
                'enroll_user_id' => $userId,
                'enroll_user_name' => $user->display_name,
                'enroll_user_email' => $user->user_email,
                'course_id' => $courseId,
                'course_title' => $course->course_title,
            ];

            Flow::execute('WPCourseware', 'userEnrolledCourse', $data, $flows);
        }
    }

    public static function courseCompleted($userId, $unitId, $course)
    {
        $flows = Flow::exists('WPCourseware', 'courseCompleted');
        $flows = self::flowFilter($flows, 'selectedCourse', $course->course_id);
        if (!$flows) {
            return;
        }
        
        $user = get_user_by('id', $userId);
        if (!$user) {
            return;
        }

        $data = [
            'enroll_user_id' => $userId,
            'enroll_user_name' => $user->display_name,
            'enroll_user_email' => $user->user_email,
            'course_id' => $course->course_id,
            'course_title' => $course->course_title,
        ];

        Flow::execute('WPCourseware', 'courseCompleted', $data, $flows);
    }

    public static function moduleCompleted($userId, $unitId, $module)
    {
        $flows = Flow::exists('WPCourseware', 'moduleCompleted');
        $flows = self::flowFilter($flows, 'selectedModule', $module->module_id);
        if (!$flows) {
            return;
        }

        $user = get_user_by('id', $userId);
        if (!$user) {
            return;
        }

        $data = [
            'enroll_user_id' => $userId,
            'enroll_user_name' => $user->display_name,
            'enroll_user_email' => $user->user_email,
            'module_id' => $module->module_id,
            'module_title' => $module->module_title,
            'course_title' => $module->course_title,
        ];

        Flow::execute('WPCourseware', 'moduleCompleted', $data, $flows);
    }

    public static function unitCompleted($userId, $unitId, $unitData)
    {
        $flows = Flow::exists('WPCourseware', 'unitCompleted');
        $flows = self::flowFilter($flows, 'selectedUnit', $unitId);
        if (!$flows) {
            return;
        }

        $unit = get_post($unitId);
        $user = get_user_by('id', $userId);
        if (!$unit || !$user) {
            return;
        }

        $data = [
            'enroll_user_id' => $userId,
            'enroll_user_name' => $user->display_name,
            'enroll_user_email' => $user->user_email,
            'unit_id' => $unitId,
            'unit_title' => $unit->post_title,
            'module_title' => $unitData->module_title,
            'course_title' => $unitData->course_title,
        ];

        Flow::execute('WPCourseware', 'unitCompleted', $data, $flows);
    }

    protected static function flowFilter($flows, $key, $value)
    {
        $filteredFlows = [];
        foreach ($flows as $flow) {
            if (is_string($flow->flow_details)) {
                $flow->flow_details = json_decode($flow->flow_details);
            }
            if (!isset($flow->flow_details->$key) || $flow->flow_details->$key === 'any' || $flow->flow_details->$key == $value || $flow->flow_details->$key === '') {
                $filteredFlows[] = $flow;
            }
        }
        return $filteredFlows;
    }

    public function getAll()
    {
        if (!is_plugin_active('wp-courseware/wp-courseware.php')) {
            wp_send_json_error(__('WP Courseware is not installed or activated', 'bit-integrations'));
        }

        $wpcw_actions = [];
        foreach (self::$actions as $action) {
            $wpcw_actions[] = (object)[
                'id' => $action['id'],
                'title' => $action['title'],
            ];
        }
        wp_send_json_success($wpcw_actions);
    }

    public function get_a_form($data)
    {
        if (!is_plugin_active('wp-courseware/wp-courseware.php')) {
            wp_send_json_error(__('WP Courseware is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Form doesn\'t exists', 'bit-integrations'));
        }
        $fields = self::fields($data->id);
        if (empty($fields)) {
            wp_send_json_error(__('Form doesn\'t exists any field', 'bit-integrations'));
        }

        if ($data->id == 'userEnrolledCourse' || $data->id == 'courseCompleted') {
            $responseData['courses'] = $this->getWPCWCourses();
        } else if ($data->id === 'moduleCompleted') {
            $responseData['modules'] = $this->getWPCWModules();
        } else if ($data->id === 'unitCompleted') {
            $responseData['units'] = $this->getWPCWUnits();
        }

        $responseData['fields'] = $fields;
        wp_send_json_success($responseData);
    }

    public static function fields($selectedAction)
    {
        $fieldDetails = [];
        if ($selectedAction == 'userEnrolledCourse' || $selectedAction == 'courseCompleted') {
            $fieldDetails = self::courseFields();
        } else if ($selectedAction === 'moduleCompleted') {
            $fieldDetails = self::moduleCompletedFields();
        } else if ($selectedAction === 'unitCompleted') {
            $fieldDetails = self::unitCompletedFields();
        }

        $fields = [];
        foreach ($fieldDetails as $field) {
            $fields[] = [
                'name'  => $field['key'],
                'label' => $field['label'],
                'type'  => isset($field['type']) ? $field['type'] : 'text',
            ];
        }
        return $fields;
    }

    protected static function courseFields()
    {
        $fields = [[
            'key' => 'enroll_user_id',
            'label' => 'Enroll User ID',
        ], [
            'key' => 'enroll_user_name',
            'label' => 'Enroll User Name',
        ], [
            'key' => 'enroll_user_email',
            'label' => 'Enroll User Email',
            'type' => 'email',
        ], [
            'key' => 'course_id',
            'label' => 'Course ID',
        ], [
            'key' => 'course_title',
            'label' => 'Course Title',
        ]];
        return $fields;
    }

    protected static function moduleCompletedFields()
    {
        $fields = [[
            'key' => 'enroll_user_id',
            'label' => 'Enroll User ID',
        ], [
            'key' => 'enroll_user_name',
            'label' => 'Enroll User Name',
        ], [
            'key' => 'enroll_user_email',
            'label' => 'Enroll User Email',
            'type' => 'email',
        ], [
            'key' => 'module_id',
            'label' => 'Module ID',
        ], [
            'key' => 'module_title',
            'label' => 'Module Title',
        ]];
        return $fields;
    }

    protected static function unitCompletedFields()
    {
        $fields = [[
            'key' => 'enroll_user_id',
            'label' => 'Enroll User ID',
        ], [
            'key' => 'enroll_user_name',
            'label' => 'Enroll User Name',
        ], [
            'key' => 'enroll_user_email',
            'label' => 'Enroll User Email',
            'type' => 'email',
        ], [
            'key' => 'unit_id',
            'label' => 'Unit ID',
        ], [
            'key' => 'unit_title',
            'label' => 'Unit Title',
        ], [
            'key' => 'module_title',
            'label' => 'Module Title',
        ], [
            'key' => 'course_title',
            'label' => 'Course Title',
        ]];
        return $fields;
    }

    protected function getWPCWCourses()
    {
        $wpcwCourses = function_exists('wpcw_get_courses') ? wpcw_get_courses() : [];
        $courses = [(object)[
            'label' => 'Any Course',
            'value' => 'any',
        ]];
        foreach ($wpcwCourses as $course) {
            $courses[] = (object)[
                'label' => $course->course_title,
                'value' => $course->course_id,
            ];
        }
        return $courses;
    }

    protected function getWPCWModules()
    {
        $wpcwModules = function_exists('wpcw_get_modules') ? wpcw_get_modules() : [];
        $modules = [(object)[
            'label' => 'Any Module',
            'value' => 'any',
        ]];
        foreach ($wpcwModules as $module) {
            $modules[] = (object)[
                'label' => $module->module_title,
                'value' => $module->module_id,
            ];
        }
        return $modules;
    }

    protected function getWPCWUnits()
    {
        $wpcwUnits = function_exists('wpcw_get_units') ? wpcw_get_units() : [];
        $units = [(object)[
            'label' => 'Any Unit',
            'value' => 'any',
        ]];
        foreach ($wpcwUnits as $unit) {
            $postData = $unit->get_post_data();
            $units[] = (object)[
                'label' => $postData['post_title'],
                'value' => $unit->unit_id,
            ];
        }
        return $units;
    }
}
