<?php

namespace BitCode\FI\Triggers\ThriveApprentice;

use BitCode\FI\Flow\Flow;

final class ThriveApprenticeController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'ThriveApprentice',
            'title' => 'ThriveApprentice',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'thriveapprentice/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'thriveapprentice/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive()
    {
        if (is_plugin_active('thrive-apprentice/thrive-apprentice.php')) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Thrive Apprentice is not installed or activated', 'bit-integrations'));
        }

        $types = [
            'User Complete a Course',
            'User Complete a Lesson',
            'User Complete a Module',
        ];

        $thriveapprentice_action = [];
        foreach ($types as $index => $type) {
            $thriveapprentice_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($thriveapprentice_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('Thrive Apprentice is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = ThriveApprenticeHelper::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;
        $id = $data->id;
        if ($id == 1) {
            $responseData['allCourse'] = array_merge([[
                'id' => 'any',
                'title' => 'Any Course'
            ]], ThriveApprenticeHelper::getAllCourse());
        } elseif ($id == 2) {
            $responseData['allLesson'] = array_merge([[
                'id' => 'any',
                'title' => 'Any Lesson'
            ]], ThriveApprenticeHelper::getAllLesson());
        } elseif ($id == 3) {
            $responseData['allModule'] = array_merge([[
                'id' => 'any',
                'title' => 'Any Module'
            ]], ThriveApprenticeHelper::getAllModule());
        }
        wp_send_json_success($responseData);
    }

    public static function handleCourseComplete($course_details, $user_details)
    {
        $flows = Flow::exists('ThriveApprentice', 1);
        if (!$flows) {
            return;
        }

        $userInfo = ThriveApprenticeHelper::getUserInfo($user_details['user_id']);

        $finalData = [
            'user_id' => $user_details['user_id'],
            'course_id' => $course_details['course_id'],
            'course_title' => $course_details['course_title'],
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCourse = !empty($flowDetails->selectedCourse) ? $flowDetails->selectedCourse : [];
        if ($course_details['course_id'] == $selectedCourse || $selectedCourse === 'any') {
            Flow::execute('ThriveApprentice', 1, $finalData, $flows);
        }
    }

    public static function handleCourseLesson($lesson_details, $user_details)
    {
        $flows = Flow::exists('ThriveApprentice', 2);
        if (!$flows) {
            return;
        }

        $userInfo = ThriveApprenticeHelper::getUserInfo($user_details['user_id']);

        $finalData = [
            'user_id' => $user_details['user_id'],
            'lesson_id' => $lesson_details['lesson_id'],
            'lesson_title' => $lesson_details['lesson_title'],
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedLesson = !empty($flowDetails->selectedLesson) ? $flowDetails->selectedLesson : [];
        if ($lesson_details['lesson_id'] == $selectedLesson || $selectedLesson === 'any') {
            Flow::execute('ThriveApprentice', 2, $finalData, $flows);
        }
    }

    public static function handleModuleComplete($module_details, $user_details)
    {
        $flows = Flow::exists('ThriveApprentice', 3);
        if (!$flows) {
            return;
        }

        $userInfo = ThriveApprenticeHelper::getUserInfo($user_details['user_id']);

        $finalData = [
            'user_id' => $user_details['user_id'],
            'module_id' => $module_details['module_id'],
            'module_title' => $module_details['module_title'],
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedModule = !empty($flowDetails->selectedModule) ? $flowDetails->selectedModule : [];
        if ($module_details['module_id'] == $selectedModule || $selectedModule === 'any') {
            Flow::execute('ThriveApprentice', 3, $finalData, $flows);
        }
    }

    public static function getAllCourseEdit()
    {
        $allCourse = array_merge([[
            'id' => 'any',
            'title' => 'Any Course'
        ]], ThriveApprenticeHelper::getAllCourse());
        wp_send_json_success($allCourse);
    }

    public static function getAllLessonEdit()
    {
        $allLesson = array_merge([[
            'id' => 'any',
            'title' => 'Any Lesson'
        ]], ThriveApprenticeHelper::getAllLesson());
        wp_send_json_success($allLesson);
    }

    public static function getAllModuleEdit()
    {
        $allModule = array_merge([[
            'id' => 'any',
            'title' => 'Any Module'
        ]], ThriveApprenticeHelper::getAllModule());
        wp_send_json_success($allModule);
    }
}
