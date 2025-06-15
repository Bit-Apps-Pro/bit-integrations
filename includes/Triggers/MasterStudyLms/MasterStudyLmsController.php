<?php
namespace BitCode\FI\Triggers\MasterStudyLms;

use BitCode\FI\Flow\Flow;

final class MasterStudyLmsController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'MasterStudyLms',
            'title' => 'MasterStudyLms',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'masterstudylms/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'masterstudylms/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive()
    {
        if (is_plugin_active('masterstudy-lms-learning-management-system/masterstudy-lms-learning-management-system.php')) {
            return true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('MasterStudy Lms is not installed or activated', 'bit-integrations'));
        }

        $types = [
            'User Complete a Course',
            'User Complete a Lesson',
            'User Enrolled in a Course',
            'User Passed a Quiz',
            'User Failed a Quiz',
        ];

        $MasterStudyLms_action = [];
        foreach ($types as $index => $type) {
            $MasterStudyLms_action[] = (object)[
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        wp_send_json_success($MasterStudyLms_action);
    }

    public function get_a_form($data)
    {
        if (!self::pluginActive()) {
            wp_send_json_error(__('MasterStudy Lms is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            wp_send_json_error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = MasterStudyLmsHelper::fields($data->id);

        if (empty($fields)) {
            wp_send_json_error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        $id = $data->id;
        if ($id == 1 || $id == 3 || $id == 4 || $id == 5) {
            $responseData['allCourse'] = array_merge([[
                'id' => 'any',
                'title' => 'Any Course'
            ]], MasterStudyLmsHelper::getAllCourse());
        } elseif ($id == 2) {
            $responseData['allLesson'] = array_merge([[
                'id' => 'any',
                'title' => 'Any Lesson'
            ]], MasterStudyLmsHelper::getAllLesson());
        }
        wp_send_json_success($responseData);
    }

    public static function getAllQuizByCourse($data)
    {
        $quizzes = MasterStudyLmsHelper::getAllQuiz($data->course_id);
        if (empty($quizzes)) {
            wp_send_json_error(__('No quiz Found', 'bit-integrations'));
        }
        foreach ($quizzes as $key => $value) {
            $allQuiz[] = [
                'id' => $value->ID,
                'title' => $value->post_title,
            ];
        }
        $allQuiz = array_merge([['id' => 'any', 'title' => 'Any Quiz']], $allQuiz);
        wp_send_json_success($allQuiz);
    }

    public static function handleCourseComplete($course_id, $user_id, $progress)
    {
        $flows = Flow::exists('MasterStudyLms', 1);
        if (!$flows) {
            return;
        }

        $userInfo = MasterStudyLmsHelper::getUserInfo($user_id);
        $courseDetails = MasterStudyLmsHelper::getCourseDetail($course_id);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $course_id,
            'course_title' => $courseDetails[0]->post_title,
            'course_description' => $courseDetails[0]->post_content,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCourse = !empty($flowDetails->selectedCourse) ? $flowDetails->selectedCourse : [];
        if ($flows && ($course_id == $selectedCourse || $selectedCourse === 'any')) {
            Flow::execute('MasterStudyLms', 1, $finalData, $flows);
        }
    }

    public static function handleCourseEnroll($user_id, $course_id)
    {
        $flows = Flow::exists('MasterStudyLms', 3);
        if (!$flows) {
            return;
        }

        $userInfo = MasterStudyLmsHelper::getUserInfo($user_id);
        $courseDetails = MasterStudyLmsHelper::getCourseDetail($course_id);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $course_id,
            'course_title' => $courseDetails[0]->post_title,
            'course_description' => $courseDetails[0]->post_content,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCourse = !empty($flowDetails->selectedCourse) ? $flowDetails->selectedCourse : [];
        if ($flows && ($course_id == $selectedCourse || $selectedCourse === 'any')) {
            Flow::execute('MasterStudyLms', 3, $finalData, $flows);
        }
    }

    public static function handleLessonComplete($user_id, $lesson_id)
    {
        $flows = Flow::exists('MasterStudyLms', 2);
        if (!$flows) {
            return;
        }

        $userInfo = MasterStudyLmsHelper::getUserInfo($user_id);
        $lessonDetails = MasterStudyLmsHelper::getLessonDetail($lesson_id);

        $finalData = [
            'user_id' => $user_id,
            'lesson_id' => $lesson_id,
            'lesson_title' => $lessonDetails[0]->post_title,
            'lesson_description' => $lessonDetails[0]->post_content,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedLesson = !empty($flowDetails->selectedLesson) ? $flowDetails->selectedLesson : [];
        if ($flows && ($lesson_id == $selectedLesson || $selectedLesson === 'any')) {
            Flow::execute('MasterStudyLms', 2, $finalData, $flows);
        }
    }

    public static function handleQuizComplete($user_id, $quiz_id, $user_quiz_progress)
    {
        $flows = Flow::exists('MasterStudyLms', 4);
        if (!$flows) {
            return;
        }

        $userInfo = MasterStudyLmsHelper::getUserInfo($user_id);
        $quizDetails = MasterStudyLmsHelper::getQuizDetails($quiz_id);

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCourse = !empty($flowDetails->selectedCourse) ? $flowDetails->selectedCourse : [];
        $courseDetails = MasterStudyLmsHelper::getCourseDetail($selectedCourse);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $selectedCourse,
            'course_title' => $courseDetails[0]->post_title,
            'course_description' => $courseDetails[0]->post_content,
            'quiz_id' => $quiz_id,
            'quiz_title' => $quizDetails[0]->post_title,
            'quiz_description' => $quizDetails[0]->post_content,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $selectedQuiz = !empty($flowDetails->selectedQuiz) ? $flowDetails->selectedQuiz : [];

        if (($quiz_id == $selectedQuiz || $selectedQuiz === 'any')) {
            Flow::execute('MasterStudyLms', 4, $finalData, $flows);
        }
    }

    public static function handleQuizFailed($user_id, $quiz_id, $user_quiz_progress)
    {
        $flows = Flow::exists('MasterStudyLms', 5);
        if (!$flows) {
            return;
        }

        $userInfo = MasterStudyLmsHelper::getUserInfo($user_id);
        $quizDetails = MasterStudyLmsHelper::getQuizDetails($quiz_id);

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedCourse = !empty($flowDetails->selectedCourse) ? $flowDetails->selectedCourse : [];
        $courseDetails = MasterStudyLmsHelper::getCourseDetail($selectedCourse);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $selectedCourse,
            'course_title' => $courseDetails[0]->post_title,
            'course_description' => $courseDetails[0]->post_content,
            'quiz_id' => $quiz_id,
            'quiz_title' => $quizDetails[0]->post_title,
            'quiz_description' => $quizDetails[0]->post_content,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        $selectedQuiz = !empty($flowDetails->selectedQuiz) ? $flowDetails->selectedQuiz : [];

        if (($quiz_id == $selectedQuiz || $selectedQuiz === 'any')) {
            Flow::execute('MasterStudyLms', 5, $finalData, $flows);
        }
    }

    // when edit course

    public static function getAllCourseEdit()
    {
        $allCourse = MasterStudyLmsHelper::getAllCourse();
        $allCourse = array_merge([[
            'id' => 'any',
            'title' => 'Any Course'
        ]], $allCourse);
        wp_send_json_success($allCourse);
    }

    public static function getAllLessonEdit()
    {
        $allLesson = MasterStudyLmsHelper::getAllLesson();
        $allLesson = array_merge([[
            'id' => 'any',
            'title' => 'Any Lesson'
        ]], $allLesson);
        wp_send_json_success($allLesson);
    }
}
