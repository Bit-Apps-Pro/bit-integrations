<?php
namespace BitCode\FI\Actions\LifterLms;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;
use WP_Error;
use LLMS_Course;
use LLMS_Section;

class RecordApiHelper
{
    private $integrationID;
    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->integrationID = $integId;
    }

    public function complete_lesson($lessonId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_mark_complete')) {
            return false;
        }
        return llms_mark_complete($user_id, $lessonId, 'lesson');
    }

    public function complete_section($sectionId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_mark_complete')) {
            return false;
        }

        $section = new LLMS_Section($sectionId);
        $lessons = $section->get_lessons();
        if (!empty($lessons)) {
            foreach ($lessons as $lesson) {
                llms_mark_complete($user_id, $lesson->id, 'lesson');
            }
        }

        return llms_mark_complete($user_id, $sectionId, 'section');
    }

    public function enrollIntoCourse($courseId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_enroll_student')) {
            return false;
        }

        return llms_enroll_student($user_id, $courseId);
    }

    public function markCompleteCourse($courseId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_mark_complete')) {
            return false;
        }

        $course_id = $courseId;
        $course = new LLMS_Course($course_id);
        $sections = $course->get_sections();

        if (!empty($sections)) {
            foreach ($sections as $section) {
                $section = new LLMS_Section($section->id);
                $lessons = $section->get_lessons();
                if (!empty($lessons)) {
                    foreach ($lessons as $lesson) {
                        llms_mark_complete($user_id, $lesson->id, 'lesson');
                    }
                }
                llms_mark_complete($user_id, $section->id, 'section');
            }
        }
        return llms_mark_complete($user_id, $course_id, 'course');
    }

    public function unEnrollUserFromCourse($courseId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_unenroll_student')) {
            return false;
        }

        return llms_unenroll_student($user_id, $courseId);
    }

    public function enrollIntoMembership($membershipId)
    {
        $user_id = get_current_user_id();
        if (empty($user_id)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('User not logged in', 'bit-integrations'));
        }
        if (!function_exists('llms_enroll_student')) {
            return false;
        }

        return llms_enroll_student($user_id, $membershipId);
    } 

    public function unEnrollUserFromMembership($membershipId)
    {
        $user_id = 30;
        if ( ! function_exists( 'llms_unenroll_student' ) && empty( $user_id ) && empty($membershipId)) {
			return false;
		}

		if ( 'All' === intval( $membershipId ) ) {
			$student     = llms_get_student( $user_id );
			$memberships = $student->get_memberships( array( 'limit' => 999 ) );
			if ( isset( $memberships['results'] ) && ! empty( $memberships['results'] ) ) {
				foreach ( $memberships['results'] as $membership ) {
					llms_unenroll_student( $user_id, $membership, 'expired' );
				}
                return true;
			}
		} else {
		    return llms_unenroll_student( $user_id, $membershipId, 'expired' );
		}

    }

    public function execute(
        $mainAction,
        $fieldValues,
        $integrationDetails,
        $integrationData
    ) {
        $response = [];
        $fieldData = [];

        if ($mainAction == 1) {
            $lessonId = $integrationDetails->lessonId;
            $response = $this->complete_lesson($lessonId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'lesson-complete', 'type_name' => 'user-lesson-complete']), 'success', 'Lesson completed successfully');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'lesson-complete', 'type_name' => 'user-lesson-complete']), 'error', 'Failed to completed lesson');
            }
        } elseif ($mainAction == 2) {
            $sectionId = $integrationDetails->sectionId;
            $response = $this->complete_section($sectionId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'section-complete', 'type_name' => 'user-section-complete']), 'success', 'section completed successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'section-complete', 'type_name' => 'user-section-complete']), 'error', 'Failed to completed section.');
            }
        } elseif ($mainAction == 3) {
            $courseId = $integrationDetails->courseId;
            $response = $this->enrollIntoCourse($courseId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-enroll', 'type_name' => 'user-course-enroll']), 'success', 'User enrolled into course successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-enroll', 'type_name' => 'user-course-enroll']), 'error', 'Failed to enroll user into course.');
            }
        } elseif ($mainAction == 4) {
            $membershipId = $integrationDetails->membershipId;
            $response = $this->enrollIntoMembership($membershipId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'membership-enroll', 'type_name' => 'user-membership-enroll']), 'success', 'User enrolled into membership successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'membership-enroll', 'type_name' => 'user-membership-enroll']), 'error', 'Failed to enroll user into membership.');
            }
        } elseif ($mainAction == 5) {
            $courseId = $integrationDetails->courseId;
            $response = $this->markCompleteCourse($courseId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-complete', 'type_name' => 'user-course-complete']), 'success', 'User completed course successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-complete', 'type_name' => 'user-course-complete']), 'error', 'Failed to complete course.');
            }
        } elseif ($mainAction == 6) {
            $courseId = $integrationDetails->courseId;
            $response = $this->unEnrollUserFromCourse($courseId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-unenroll', 'type_name' => 'user-course-unenroll']), 'success', 'User unenrolled from course successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'course-unenroll', 'type_name' => 'user-course-unenroll']), 'error', 'Failed to unenroll user from course.');
            }
        } elseif ($mainAction == 7){
            $membershipId = $integrationDetails->membershipId;
            $response = $this->unEnrollUserFromMembership($membershipId);
            if ($response) {
                LogHandler::save($this->integrationID, json_encode(['type' => 'membership-unenroll', 'type_name' => 'user-membership-unenroll']), 'success', 'User unenrolled from membership successfully.');
            } else {
                LogHandler::save($this->integrationID, json_encode(['type' => 'membership-unenroll', 'type_name' => 'user-membership-unenroll']), 'error', 'Failed to unenroll user from membership.');
            }
        }

        return $response;
    }
}
