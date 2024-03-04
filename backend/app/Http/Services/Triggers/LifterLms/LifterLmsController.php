<?php

namespace BitApps\BTCBI\Http\Services\Triggers\LifterLms;

use BitApps\BTCBI\Model\Flow;
use BTCBI\Deps\BitApps\WPKit\Http\Request\Request;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

final class LifterLmsController
{
    public static function info()
    {
        $plugin_path = self::pluginActive('get_name');
        return [
            'name' => 'LifterLMS',
            'title' => 'It is lms platform',
            'slug' => $plugin_path,
            'pro' => $plugin_path,
            'type' => 'form',
            'is_active' => is_plugin_active($plugin_path),
            'activation_url' => wp_nonce_url(self_admin_url('plugins.php?action=activate&amp;plugin=' . $plugin_path . '&amp;plugin_status=all&amp;paged=1&amp;s'), 'activate-plugin_' . $plugin_path),
            'install_url' => wp_nonce_url(self_admin_url('update.php?action=install-plugin&plugin=' . $plugin_path), 'install-plugin_' . $plugin_path),
            'list' => [
                'action' => 'lifterlms/get',
                'method' => 'get',
            ],
            'fields' => [
                'action' => 'lifterlms/get/form',
                'method' => 'post',
                'data' => ['id']
            ],
        ];
    }

    public static function pluginActive($option = null)
    {
        if (is_plugin_active('lifterlms/lifterlms.php')) {
            return $option === 'get_name' ? 'lifterlms/lifterlms.php' : true;
        }
        return false;
    }

    public function getAll()
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLMS is not installed or activated', 'bit-integrations'));
        }

        $types = [
            'A user attempts quiz',
            'A user passes a quiz',
            'A user fails a quiz',
            'A user completes a lesson',
            'A user completes a course',
            'A user enroll in a course',
            'A user is unenrolled a course',
            'A user cancels a membership',
        ];

        $lifterLms_action = [];
        foreach ($types as $index => $type) {
            $lifterLms_action[] = (object) [
                'id' => $index + 1,
                'title' => $type,
            ];
        }
        return Response::success($lifterLms_action);
    }

    public function get_a_form(Request $data)
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLms is not installed or activated', 'bit-integrations'));
        }
        if (empty($data->id)) {
            return Response::error(__('Trigger type doesn\'t exists', 'bit-integrations'));
        }
        $fields = LifterLmsHelper::fields($data->id);

        if (empty($fields)) {
            return Response::error(__('Trigger doesn\'t exists any field', 'bit-integrations'));
        }

        $responseData['fields'] = $fields;

        $id = $data->id;
        if ($id == 1 || $id == 2 || $id == 3) {
            $responseData['allQuiz'] = array_merge([[
                'ID' => 'any',
                'post_title' => 'Any Quiz'
            ]], LifterLmsHelper::getAllQuiz());
        } elseif ($id == 4) {
            $responseData['allLesson'] = array_merge([[
                'ID' => 'any',
                'post_title' => 'Any Lesson'
            ]], LifterLmsHelper::getAllLesson());
        } elseif ($id == 5 || $id == 6 || $id == 7) {
            $responseData['allCourse'] = array_merge([[
                'ID' => 'any',
                'post_title' => 'Any Course'
            ]], LifterLmsHelper::getAllCourse());
        } elseif ($id == 8) {
            $responseData['allMembership'] = array_merge([[
                'ID' => 'any',
                'post_title' => 'Any Membership'
            ]], LifterLmsHelper::getAllMembership());
        }

        return Response::success($responseData);
    }

    public static function getLifterLmsAllQuiz()
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLms is not installed or activated', 'bit-integrations'));
        }
        $allQuiz = array_merge([[
            'ID' => 'any',
            'post_title' => 'Any Quiz'
        ]], LifterLmsHelper::getAllQuiz());
        return Response::success($allQuiz);
    }

    public static function getLifterLmsAllLesson()
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLms is not installed or activated', 'bit-integrations'));
        }
        $allLesson = array_merge([[
            'ID' => 'any',
            'post_title' => 'Any Lesson'
        ]], LifterLmsHelper::getAllLesson());
        return Response::success($allLesson);
    }

    public static function getLifterLmsAllCourse()
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLms is not installed or activated', 'bit-integrations'));
        }
        $allCourse = array_merge([[
            'ID' => 'any',
            'post_title' => 'Any Course'
        ]], LifterLmsHelper::getAllCourse());
        return Response::success($allCourse);
    }

    public static function getLifterLmsAllMembership()
    {
        if (!self::pluginActive()) {
            return Response::error(__('LifterLms is not installed or activated', 'bit-integrations'));
        }
        $allMembership = array_merge([[
            'ID' => 'any',
            'post_title' => 'Any Membership'
        ]], LifterLmsHelper::getAllMembership());
        return Response::success($allMembership);
    }

    public static function handleAttemptQuiz($user_id, $quiz_id, $quiz_obj)
    {
        $flows = Flow::exists('LifterLms', 1);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $quizDetail = LifterLmsHelper::getQuizDetail($quiz_id);

        $finalData = [
            'user_id' => $user_id,
            'quiz_id' => $quiz_id,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
            'quiz_title' => $quizDetail[0]->post_title,
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedQuiz = !empty($flowDetails->selectedQuiz) ? $flowDetails->selectedQuiz : [];
        if ($flows && ($quiz_id == $selectedQuiz || $selectedQuiz === 'any')) {
            Flow::execute('LifterLms', 1, $finalData, $flows);
        }
    }

    public static function handleQuizPass($user_id, $quiz_id, $quiz_obj)
    {
        $flows = Flow::exists('LifterLms', 2);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $quizDetail = LifterLmsHelper::getQuizDetail($quiz_id);

        $finalData = [
            'user_id' => $user_id,
            'quiz_id' => $quiz_id,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
            'quiz_title' => $quizDetail[0]->post_title,
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedQuiz = !empty($flowDetails->selectedQuiz) ? $flowDetails->selectedQuiz : [];
        if ($flows && ($quiz_id == $selectedQuiz || $selectedQuiz === 'any')) {
            Flow::execute('LifterLms', 2, $finalData, $flows);
        }
    }

    public static function handleQuizFail($user_id, $quiz_id, $quiz_obj)
    {
        $flows = Flow::exists('LifterLms', 3);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $quizDetail = LifterLmsHelper::getQuizDetail($quiz_id);

        $finalData = [
            'user_id' => $user_id,
            'quiz_id' => $quiz_id,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
            'quiz_title' => $quizDetail[0]->post_title,
        ];

        $flowDetails = json_decode($flows[0]->flow_details);
        $selectedQuiz = !empty($flowDetails->selectedQuiz) ? $flowDetails->selectedQuiz : [];
        if ($flows && ($quiz_id == $selectedQuiz || $selectedQuiz === 'any')) {
            Flow::execute('LifterLms', 3, $finalData, $flows);
        }
    }

    public static function handleLessonComplete($user_id, $lesson_id)
    {
        $flows = Flow::exists('LifterLms', 4);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $lessonDetail = LifterLmsHelper::getLessonDetail($lesson_id);

        $finalData = [
            'user_id' => $user_id,
            'lesson_id' => $lesson_id,
            'lesson_title' => $lessonDetail[0]->post_title,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];

        Flow::execute('LifterLms', 4, $finalData, $flows);
    }

    public static function handleCourseComplete($user_id, $course_id)
    {
        $flows = Flow::exists('LifterLms', 5);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $courseDetail = LifterLmsHelper::getCourseDetail($course_id);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $course_id,
            'course_title' => $courseDetail[0]->post_title,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];
        Flow::execute('LifterLms', 5, $finalData, $flows);
    }

    public static function handleCourseEnroll($user_id, $product_id)
    {
        $flows = Flow::exists('LifterLms', 6);
        if (!$flows) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $courseDetail = LifterLmsHelper::getCourseDetail($product_id);

        $finalData = [
            'user_id' => $user_id,
            'course_id' => $product_id,
            'course_title' => $courseDetail[0]->post_title,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];
        Flow::execute('LifterLms', 6, $finalData, $flows);
    }

    public static function handleCourseUnEnroll($student_id, $course_id, $a, $status)
    {
        $flows = Flow::exists('LifterLms', 7);

        if (!$flows || empty($course_id) || $status != 'cancelled') {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($student_id);
        $courseDetail = LifterLmsHelper::getCourseDetail($course_id);

        $finalData = [
            'user_id' => $student_id,
            'course_id' => $course_id,
            'course_title' => $courseDetail[0]->post_title,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];
        Flow::execute('LifterLms', 7, $finalData, $flows);
    }

    public static function handleMembershipCancel($data, $user_id, $a, $b)
    {
        $flows = Flow::exists('LifterLms', 8);
        $product_id = $data->get('product_id');

        if (!$flows || !$user_id || !$product_id) {
            return;
        }

        $userInfo = LifterLmsHelper::getUserInfo($user_id);
        $membershipDetail = LifterLmsHelper::getMembershipDetail($product_id);

        $finalData = [
            'user_id' => $user_id,
            'membership_title' => $product_id,
            'membership_id' => $membershipDetail[0]->post_title,
            'first_name' => $userInfo['first_name'],
            'last_name' => $userInfo['last_name'],
            'nickname' => $userInfo['nickname'],
            'avatar_url' => $userInfo['avatar_url'],
            'user_email' => $userInfo['user_email'],
        ];
        Flow::execute('LifterLms', 8, $finalData, $flows);
    }
}