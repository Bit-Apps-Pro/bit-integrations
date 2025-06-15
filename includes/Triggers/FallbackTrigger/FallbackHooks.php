<?php

namespace BitCode\FI\Triggers\FallbackTrigger;

final class FallbackHooks
{
    public static $triggerHookList = [
        'academy/course/after_enroll'                     => ['entity' => 'AcademyLms', 'hook' => 'academy/course/after_enroll', 'function' => 'academyHandleCourseEnroll', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'academy_quizzes/api/after_quiz_attempt_finished' => ['entity' => 'AcademyLms', 'hook' => 'academy_quizzes/api/after_quiz_attempt_finished', 'function' => 'academyHandleQuizAttempt', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'academy/frontend/after_mark_topic_complete'      => ['entity' => 'AcademyLms', 'hook' => 'academy/frontend/after_mark_topic_complete', 'function' => 'academyHandleLessonComplete', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'academy/admin/course_complete_after'             => ['entity' => 'AcademyLms', 'hook' => 'academy/admin/course_complete_after', 'function' => 'academyHandleCourseComplete', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'academy_quizzes/api/after_quiz_attempt_finished' => ['entity' => 'AcademyLms', 'hook' => 'academy_quizzes/api/after_quiz_attempt_finished', 'function' => 'academyHandleQuizTarget', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'affwp_set_affiliate_status' => ['entity' => 'Affiliate', 'hook' => 'affwp_set_affiliate_status', 'function' => 'affwpNewAffiliateApproved', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'affwp_set_affiliate_status' => ['entity' => 'Affiliate', 'hook' => 'affwp_set_affiliate_status', 'function' => 'affwpUserBecomesAffiliate', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'affwp_insert_referral'      => ['entity' => 'Affiliate', 'hook' => 'affwp_insert_referral', 'function' => 'affwpAffiliateMakesReferral', 'priority' => 20, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'affwp_set_referral_status'  => ['entity' => 'Affiliate', 'hook' => 'affwp_set_referral_status', 'function' => 'affwpAffiliatesReferralSpecificTypeRejected', 'priority' => 99, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'affwp_set_referral_status'  => ['entity' => 'Affiliate', 'hook' => 'affwp_set_referral_status', 'function' => 'affwpAffiliatesReferralSpecificTypePaid', 'priority' => 99, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'arfliteentryexecute' => ['entity' => 'ARForm', 'hook' => 'arfliteentryexecute', 'function' => 'handleArFormSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'arfentryexecute'     => ['entity' => 'ARForm', 'hook' => 'arfentryexecute', 'function' => 'handleArFormSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'arm_after_add_new_user'              => ['entity' => 'ARMember', 'hook' => 'arm_after_add_new_user', 'function' => 'ARMemberHandleRegisterForm', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'arm_member_update_meta'              => ['entity' => 'ARMember', 'hook' => 'arm_member_update_meta', 'function' => 'ARMemberHandleUpdateUserByForm', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'arm_after_add_new_user'              => ['entity' => 'ARMember', 'hook' => 'arm_after_add_new_user', 'function' => 'ARMemberHandleMemberAddByAdmin', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'arm_cancel_subscription'             => ['entity' => 'ARMember', 'hook' => 'arm_cancel_subscription', 'function' => 'ARMemberHandleCancelSubscription', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'arm_after_user_plan_change_by_admin' => ['entity' => 'ARMember', 'hook' => 'arm_after_user_plan_change_by_admin', 'function' => 'ARMemberHandlePlanChangeAdmin', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'arm_after_user_plan_renew'           => ['entity' => 'ARMember', 'hook' => 'arm_after_user_plan_renew', 'function' => 'ARMemberHandleRenewSubscriptionPlan', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'fl_module_contact_form_after_send'             => ['entity' => 'Beaver', 'hook' => 'fl_module_contact_form_after_send', 'function' => 'beaverContactFormSubmitted', 'priority' => 10, 'acceptedArgs' => 6, 'isFilterHook' => false],
        'fl_builder_login_form_submission_complete'     => ['entity' => 'Beaver', 'hook' => 'fl_builder_login_form_submission_complete', 'function' => 'beaverLoginFormSubmitted', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'fl_builder_subscribe_form_submission_complete' => ['entity' => 'Beaver', 'hook' => 'fl_builder_subscribe_form_submission_complete', 'function' => 'beaverSubscribeFormSubmitted', 'priority' => 10, 'acceptedArgs' => 6, 'isFilterHook' => false],

        'bricks/form/custom_action' => ['entity' => 'Bricks', 'hook' => 'bricks/form/custom_action', 'function' => 'handleBricksSubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'brizy_form_submit_data' => ['entity' => 'Brizy', 'hook' => 'brizy_form_submit_data', 'function' => 'handleBrizySubmit', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => true],

        'friends_friendship_accepted'                 => ['entity' => 'BuddyBoss', 'hook' => 'friends_friendship_accepted', 'function' => 'buddyBossHandleAcceptFriendRequest', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'friends_friendship_requested'                => ['entity' => 'BuddyBoss', 'hook' => 'friends_friendship_requested', 'function' => 'buddyBossHandleSendsFriendRequest', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'bbp_new_topic'                               => ['entity' => 'BuddyBoss', 'hook' => 'bbp_new_topic', 'function' => 'buddyBossHandleCreateTopic', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'groups_join_group'                           => ['entity' => 'BuddyBoss', 'hook' => 'groups_join_group', 'function' => 'buddyBossHandleJoinPublicGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'groups_membership_accepted'                  => ['entity' => 'BuddyBoss', 'hook' => 'groups_membership_accepted', 'function' => 'buddyBossHandleJoinPrivateGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'groups_accept_invite'                        => ['entity' => 'BuddyBoss', 'hook' => 'groups_accept_invite', 'function' => 'buddyBossHandleJoinPrivateGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'groups_leave_group'                          => ['entity' => 'BuddyBoss', 'hook' => 'groups_leave_group', 'function' => 'buddyBossHandleLeavesGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'groups_remove_member'                        => ['entity' => 'BuddyBoss', 'hook' => 'groups_remove_member', 'function' => 'buddyBossHandleLeavesGroup', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'bp_groups_posted_update'                     => ['entity' => 'BuddyBoss', 'hook' => 'bp_groups_posted_update', 'function' => 'buddyBossHandlePostGroupActivity', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'bbp_new_reply'                               => ['entity' => 'BuddyBoss', 'hook' => 'bbp_new_reply', 'function' => 'buddyBossHandleRepliesTopic', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'groups_membership_requested'                 => ['entity' => 'BuddyBoss', 'hook' => 'groups_membership_requested', 'function' => 'buddyBossHandleRequestPrivateGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'bp_member_invite_submit'                     => ['entity' => 'BuddyBoss', 'hook' => 'bp_member_invite_submit', 'function' => 'buddyBossHandleSendEmailInvites', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'xprofile_avatar_uploaded'                    => ['entity' => 'BuddyBoss', 'hook' => 'xprofile_avatar_uploaded', 'function' => 'buddyBossHandleUpdateAvatar', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'xprofile_updated_profile'                    => ['entity' => 'BuddyBoss', 'hook' => 'xprofile_updated_profile', 'function' => 'buddyBossHandleUpdateProfile', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'bp_core_activated_user'                      => ['entity' => 'BuddyBoss', 'hook' => 'bp_core_activated_user', 'function' => 'buddyBossHandleAccountActive', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'bp_invites_member_invite_activate_user'      => ['entity' => 'BuddyBoss', 'hook' => 'bp_invites_member_invite_activate_user', 'function' => 'buddyBossHandleInviteeActiveAccount', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'bp_invites_member_invite_mark_register_user' => ['entity' => 'BuddyBoss', 'hook' => 'bp_invites_member_invite_mark_register_user', 'function' => 'buddyBossHandleInviteeRegisterAccount', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'woocommerce_checkout_order_processed' => ['entity' => 'CartFlow', 'hook' => 'woocommerce_checkout_order_processed', 'function' => 'CartFlowHandleOrderCreateWc', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'et_pb_contact_form_submit' => ['entity' => 'Divi', 'hook' => 'et_pb_contact_form_submit', 'function' => 'handleDiviSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'edd_complete_purchase' => ['entity' => 'EDD', 'hook' => 'edd_complete_purchase', 'function' => 'eddHandlePurchaseProduct', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'edd_complete_purchase' => ['entity' => 'EDD', 'hook' => 'edd_complete_purchase', 'function' => 'eddHandlePurchaseProductDiscountCode', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'edds_payment_refunded' => ['entity' => 'EDD', 'hook' => 'edds_payment_refunded', 'function' => 'eddHandleOrderRefunded', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'eb_form_submit_before_email' => ['entity' => 'EssentialBlocks', 'hook' => 'eb_form_submit_before_email', 'function' => 'essentialBlocksHandler', 'priority' => 10, 'acceptedArgs' => PHP_INT_MAX, 'isFilterHook' => false],

        'everest_forms_complete_entry_save' => ['entity' => 'EVF', 'hook' => 'everest_forms_complete_entry_save', 'function' => 'evfHandleSubmission', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],

        'fluentform_submission_inserted' => ['entity' => 'FF', 'hook' => 'fluentform_submission_inserted', 'function' => 'ffHandleSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'fluentcrm_contact_added_to_tags'             => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_contact_added_to_tags', 'function' => 'fluentcrmHandleAddTag', 'priority' => 20, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_contact_removed_from_tags'         => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_contact_removed_from_tags', 'function' => 'fluentcrmHandleRemoveTag', 'priority' => 20, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_contact_added_to_lists'            => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_contact_added_to_lists', 'function' => 'fluentcrmHandleAddList', 'priority' => 20, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_contact_removed_from_lists'        => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_contact_removed_from_lists', 'function' => 'fluentcrmHandleRemoveList', 'priority' => 20, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_contact_created'                   => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_contact_created', 'function' => 'fluentcrmHandleContactCreate', 'priority' => 20, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'fluentcrm_subscriber_status_to_subscribed'   => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_subscriber_status_to_subscribed', 'function' => 'fluentcrmHandleChangeStatus', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_subscriber_status_to_pending'      => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_subscriber_status_to_pending', 'function' => 'fluentcrmHandleChangeStatus', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_subscriber_status_to_unsubscribed' => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_subscriber_status_to_unsubscribed', 'function' => 'fluentcrmHandleChangeStatus', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_subscriber_status_to_bounced'      => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_subscriber_status_to_bounced', 'function' => 'fluentcrmHandleChangeStatus', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'fluentcrm_subscriber_status_to_complained'   => ['entity' => 'FluentCrm', 'hook' => 'fluentcrm_subscriber_status_to_complained', 'function' => 'fluentcrmHandleChangeStatus', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'formcraft_after_save' => ['entity' => 'FormCraft', 'hook' => 'formcraft_after_save', 'function' => 'handleFormcraftSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'frm_success_action' => ['entity' => 'Formidable', 'hook' => 'frm_success_action', 'function' => 'handleFormidableSubmit', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],

        'forminator_custom_form_submit_before_set_fields' => ['entity' => 'Forminator', 'hook' => 'forminator_custom_form_submit_before_set_fields', 'function' => 'handleForminatorSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'gamipress_update_user_rank'           => ['entity' => 'GamiPress', 'hook' => 'gamipress_update_user_rank', 'function' => 'gamipressHandleUserEarnRank', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'gamipress_award_achievement'          => ['entity' => 'GamiPress', 'hook' => 'gamipress_award_achievement', 'function' => 'gamipressHandleAwardAchievement', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'gamipress_award_achievement'          => ['entity' => 'GamiPress', 'hook' => 'gamipress_award_achievement', 'function' => 'gamipressHandleGainAchievementType', 'priority' => 10, 'acceptedArgs' => 5, 'isFilterHook' => false],
        'gamipress_revoke_achievement_to_user' => ['entity' => 'GamiPress', 'hook' => 'gamipress_revoke_achievement_to_user', 'function' => 'gamipressHandleRevokeAchieve', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'gamipress_update_user_points'         => ['entity' => 'GamiPress', 'hook' => 'gamipress_update_user_points', 'function' => 'gamipressHandleEarnPoints', 'priority' => 10, 'acceptedArgs' => 8, 'isFilterHook' => false],

        'gform_after_submission' => ['entity' => 'GF', 'hook' => 'gform_after_submission', 'function' => 'gformAfterSubmission', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'give_update_payment_status'  => ['entity' => 'GiveWp', 'hook' => 'give_update_payment_status', 'function' => 'giveHandleUserDonation', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'give_subscription_cancelled' => ['entity' => 'GiveWp', 'hook' => 'give_subscription_cancelled', 'function' => 'giveHandleSubscriptionDonationCancel', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'give_subscription_updated'   => ['entity' => 'GiveWp', 'hook' => 'give_subscription_updated', 'function' => 'giveHandleRecurringDonation', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'groundhogg/contact/post_create' => ['entity' => 'Groundhogg', 'hook' => 'groundhogg/contact/post_create', 'function' => 'groundhoggHandleSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'groundhogg/contact/tag_applied' => ['entity' => 'Groundhogg', 'hook' => 'groundhogg/contact/tag_applied', 'function' => 'groundhoggTagApplied', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'groundhogg/contact/tag_removed' => ['entity' => 'Groundhogg', 'hook' => 'groundhogg/contact/tag_removed', 'function' => 'groundhoggTagRemove', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'happyforms_submission_success' => ['entity' => 'Happy', 'hook' => 'happyforms_submission_success', 'function' => 'handleHappySubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'updated_post_meta' => ['entity' => 'JetEngine', 'hook' => 'updated_post_meta', 'function' => 'jetEnginePostMetaData', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'updated_post_meta' => ['entity' => 'JetEngine', 'hook' => 'updated_post_meta', 'function' => 'jetEnginePostMetaValueCheck', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'kadence_blocks_form_submission'          => ['entity' => 'Kadence', 'hook' => 'kadence_blocks_form_submission', 'function' => 'handleKadenceFormSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'kadence_blocks_advanced_form_submission' => ['entity' => 'Kadence', 'hook' => 'kadence_blocks_advanced_form_submission', 'function' => 'handleKadenceFormSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'learndash_update_course_access' => ['entity' => 'LearnDash', 'hook' => 'learndash_update_course_access', 'function' => 'learndashHandleCourseEnroll', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'learndash_course_completed'     => ['entity' => 'LearnDash', 'hook' => 'learndash_course_completed', 'function' => 'learndashHandleCourseCompleted', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'learndash_lesson_completed'     => ['entity' => 'LearnDash', 'hook' => 'learndash_lesson_completed', 'function' => 'learndashHandleLessonCompleted', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'learndash_topic_completed'      => ['entity' => 'LearnDash', 'hook' => 'learndash_topic_completed', 'function' => 'learndashHandleTopicCompleted', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'learndash_quiz_submitted'       => ['entity' => 'LearnDash', 'hook' => 'learndash_quiz_submitted', 'function' => 'learndashHandleQuizAttempt', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'ld_added_group_access'          => ['entity' => 'LearnDash', 'hook' => 'ld_added_group_access', 'function' => 'learndashHandleAddedGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'ld_removed_group_access'        => ['entity' => 'LearnDash', 'hook' => 'ld_removed_group_access', 'function' => 'learndashHandleRemovedGroup', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'learndash_assignment_uploaded'  => ['entity' => 'LearnDash', 'hook' => 'learndash_assignment_uploaded', 'function' => 'learndashHandleAssignmentSubmit', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'lifterlms_quiz_completed'               => ['entity' => 'LifterLms', 'hook' => 'lifterlms_quiz_completed', 'function' => 'lifterLmsHandleAttemptQuiz', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'lifterlms_quiz_passed'                  => ['entity' => 'LifterLms', 'hook' => 'lifterlms_quiz_passed', 'function' => 'lifterLmsHandleQuizPass', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'lifterlms_quiz_failed'                  => ['entity' => 'LifterLms', 'hook' => 'lifterlms_quiz_failed', 'function' => 'lifterLmsHandleQuizFail', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'lifterlms_lesson_completed'             => ['entity' => 'LifterLms', 'hook' => 'lifterlms_lesson_completed', 'function' => 'lifterLmsHandleLessonComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'lifterlms_course_completed'             => ['entity' => 'LifterLms', 'hook' => 'lifterlms_course_completed', 'function' => 'lifterLmsHandleCourseComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'llms_user_enrolled_in_course'           => ['entity' => 'LifterLms', 'hook' => 'llms_user_enrolled_in_course', 'function' => 'lifterLmsHandleCourseEnroll', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'llms_user_removed_from_course'          => ['entity' => 'LifterLms', 'hook' => 'llms_user_removed_from_course', 'function' => 'lifterLmsHandleCourseUnEnroll', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'llms_subscription_cancelled_by_student' => ['entity' => 'LifterLms', 'hook' => 'llms_subscription_cancelled_by_student', 'function' => 'lifterLmsHandleMembershipCancel', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'mailpoet_subscription_before_subscribe' => ['entity' => 'MailPoet', 'hook' => 'mailpoet_subscription_before_subscribe', 'function' => 'handleMailpoetSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'stm_lms_progress_updated' => ['entity' => 'MasterStudyLms', 'hook' => 'stm_lms_progress_updated', 'function' => 'stmLmsHandleCourseComplete', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'course_enrolled'          => ['entity' => 'MasterStudyLms', 'hook' => 'course_enrolled', 'function' => 'stmLmsHandleCourseEnroll', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'lesson_completed'         => ['entity' => 'MasterStudyLms', 'hook' => 'lesson_completed', 'function' => 'stmLmsHandleLessonComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'stm_lms_quiz_passed'      => ['entity' => 'MasterStudyLms', 'hook' => 'stm_lms_quiz_passed', 'function' => 'stmLmsHandleQuizComplete', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'stm_lms_quiz_failed'      => ['entity' => 'MasterStudyLms', 'hook' => 'stm_lms_quiz_failed', 'function' => 'stmLmsHandleQuizFailed', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'mepr-event-transaction-completed'    => ['entity' => 'Memberpress', 'hook' => 'mepr-event-transaction-completed', 'function' => 'meprOneTimeMembershipSubscribe', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'mepr-event-transaction-completed'    => ['entity' => 'Memberpress', 'hook' => 'mepr-event-transaction-completed', 'function' => 'meprRecurringMembershipSubscribe', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'mepr_subscription_transition_status' => ['entity' => 'Memberpress', 'hook' => 'mepr_subscription_transition_status', 'function' => 'meprMembershipSubscribeCancel', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'mepr-event-transaction-expired'      => ['entity' => 'Memberpress', 'hook' => 'mepr-event-transaction-expired', 'function' => 'meprMembershipSubscribeExpire', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'mepr_subscription_transition_status' => ['entity' => 'Memberpress', 'hook' => 'mepr_subscription_transition_status', 'function' => 'meprMembershipSubscribePaused', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'metform_pro_form_data_for_pro_integrations' => ['entity' => 'Met', 'hook' => 'metform_pro_form_data_for_pro_integrations', 'function' => 'handleMetformProSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'metform_after_store_form_data'              => ['entity' => 'Met', 'hook' => 'metform_after_store_form_data', 'function' => 'handleMetformSubmit', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'rwmb_frontend_after_save_post' => ['entity' => 'MetaBox', 'hook' => 'rwmb_frontend_after_save_post', 'function' => 'handleMetaboxSubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'pmpro_after_change_membership_level'     => ['entity' => 'PaidMembershipPro', 'hook' => 'pmpro_after_change_membership_level', 'function' => 'perchesMembershhipLevelByAdministator', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'pmpro_after_change_membership_level'     => ['entity' => 'PaidMembershipPro', 'hook' => 'pmpro_after_change_membership_level', 'function' => 'cancelMembershhipLevel', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'pmpro_after_checkout'                    => ['entity' => 'PaidMembershipPro', 'hook' => 'pmpro_after_checkout', 'function' => 'perchesMembershipLevel', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'pmpro_membership_post_membership_expiry' => ['entity' => 'PaidMembershipPro', 'hook' => 'pmpro_membership_post_membership_expiry', 'function' => 'expiryMembershipLevel', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'pafe/form_builder/new_record_v2' => ['entity' => 'PiotnetAddon', 'hook' => 'pafe/form_builder/new_record_v2', 'function' => 'handlePiotnetAddonSubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'pafe/form_builder/new_record_v2' => ['entity' => 'PiotnetAddonForm', 'hook' => 'pafe/form_builder/new_record_v2', 'function' => 'handlePiotnetAddonFormSubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'piotnetforms/form_builder/new_record' => ['entity' => 'PiotnetForms', 'hook' => 'piotnetforms/form_builder/new_record', 'function' => 'handlePiotnetSubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'wp_after_insert_post'   => ['entity' => 'Post', 'hook' => 'wp_after_insert_post', 'function' => 'createPost', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],
        'comment_post'           => ['entity' => 'Post', 'hook' => 'comment_post', 'function' => 'postComment', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'post_updated'           => ['entity' => 'Post', 'hook' => 'post_updated', 'function' => 'postUpdated', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'the_content'            => ['entity' => 'Post', 'hook' => 'the_content', 'function' => 'viewPost', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => true],
        'delete_post'            => ['entity' => 'Post', 'hook' => 'delete_post', 'function' => 'deletePost', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'transition_post_status' => ['entity' => 'Post', 'hook' => 'transition_post_status', 'function' => 'changePostStatus', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'trash_comment'          => ['entity' => 'Post', 'hook' => 'trash_comment', 'function' => 'trashComment', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'edit_comment'           => ['entity' => 'Post', 'hook' => 'edit_comment', 'function' => 'updateComment', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'wp_trash_post'          => ['entity' => 'Post', 'hook' => 'wp_trash_post', 'function' => 'trashPost', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'user_register'  => ['entity' => 'Registration', 'hook' => 'user_register', 'function' => 'userCreate', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'profile_update' => ['entity' => 'Registration', 'hook' => 'profile_update', 'function' => 'profileUpdate', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'wp_login'       => ['entity' => 'Registration', 'hook' => 'wp_login', 'function' => 'wpLogin', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'password_reset' => ['entity' => 'Registration', 'hook' => 'password_reset', 'function' => 'wpResetPassword', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'delete_user'    => ['entity' => 'Registration', 'hook' => 'delete_user', 'function' => 'wpUserDeleted', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'rcp_membership_post_activate'               => ['entity' => 'RestrictContent', 'hook' => 'rcp_membership_post_activate', 'function' => 'rcpPurchasesMembershipLevel', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'rcp_transition_membership_status_cancelled' => ['entity' => 'RestrictContent', 'hook' => 'rcp_transition_membership_status_cancelled', 'function' => 'rcpMembershipStatusCancelled', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'rcp_transition_membership_status_expired'   => ['entity' => 'RestrictContent', 'hook' => 'rcp_transition_membership_status_expired', 'function' => 'rcpMembershipStatusExpired', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'slicewp_insert_affiliate'  => ['entity' => 'SliceWp', 'hook' => 'slicewp_insert_affiliate', 'function' => 'slicewpNewAffiliateCreated', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'slicewp_insert_commission' => ['entity' => 'SliceWp', 'hook' => 'slicewp_insert_commission', 'function' => 'slicewpUserEarnCommission', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'data_model_solid_affiliate_affiliates_save' => ['entity' => 'SolidAffiliate', 'hook' => 'data_model_solid_affiliate_affiliates_save', 'function' => 'newSolidAffiliateCreated', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'data_model_solid_affiliate_referrals_save'  => ['entity' => 'SolidAffiliate', 'hook' => 'data_model_solid_affiliate_referrals_save', 'function' => 'newSolidAffiliateReferralCreated', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'uagb_form_success' => ['entity' => 'Spectra', 'hook' => 'uagb_form_success', 'function' => 'spectraHandler', 'priority' => 10, 'acceptedArgs' => PHP_INT_MAX, 'isFilterHook' => false],

        'sc_order_complete' => ['entity' => 'StudioCart', 'hook' => 'sc_order_complete', 'function' => 'studiocartNewOrderCreated', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'surecart/purchase_created' => ['entity' => 'SureCart', 'hook' => 'surecart/purchase_created', 'function' => 'surecartPurchaseProduct', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'surecart/purchase_revoked' => ['entity' => 'SureCart', 'hook' => 'surecart/purchase_revoked', 'function' => 'surecartPurchaseRevoked', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'surecart/purchase_invoked' => ['entity' => 'SureCart', 'hook' => 'surecart/purchase_invoked', 'function' => 'surecartPurchaseUnrevoked', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'themify_builder_after_template_content_render' => ['entity' => 'Themify', 'hook' => 'themify_builder_after_template_content_render', 'function' => 'handleThemifySubmit', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'thrive_apprentice_course_finish'   => ['entity' => 'ThriveApprentice', 'hook' => 'thrive_apprentice_course_finish', 'function' => 'thriveApprenticeHandleCourseComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'thrive_apprentice_lesson_complete' => ['entity' => 'ThriveApprentice', 'hook' => 'thrive_apprentice_lesson_complete', 'function' => 'thriveApprenticeHandleLessonComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'thrive_apprentice_module_finish'   => ['entity' => 'ThriveApprentice', 'hook' => 'thrive_apprentice_module_finish', 'function' => 'thriveApprenticeHandleModuleComplete', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],

        'tutor_after_enroll'           => ['entity' => 'TutorLms', 'hook' => 'tutor_after_enroll', 'function' => 'TutorLmsHandleCourseEnroll', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'tutor_quiz/attempt_ended'     => ['entity' => 'TutorLms', 'hook' => 'tutor_quiz/attempt_ended', 'function' => 'TutorLmsHandleQuizAttempt', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'tutor_lesson_completed_after' => ['entity' => 'TutorLms', 'hook' => 'tutor_lesson_completed_after', 'function' => 'TutorLmsHandleLessonComplete', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'tutor_course_complete_after'  => ['entity' => 'TutorLms', 'hook' => 'tutor_course_complete_after', 'function' => 'TutorLmsHandleCourseComplete', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'tutor_quiz/attempt_ended'     => ['entity' => 'TutorLms', 'hook' => 'tutor_quiz/attempt_ended', 'function' => 'TutorLmsHandleQuizTarget', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'um_user_login'            => ['entity' => 'UltimateMember', 'hook' => 'um_user_login', 'function' => 'ultimateMemberHandleUserLogViaForm', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],
        'um_registration_complete' => ['entity' => 'UltimateMember', 'hook' => 'um_registration_complete', 'function' => 'ultimateMemberHandleUserRegisViaForm', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'set_user_role'            => ['entity' => 'UltimateMember', 'hook' => 'set_user_role', 'function' => 'ultimateMemberHandleUserRoleChange', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'set_user_role'            => ['entity' => 'UltimateMember', 'hook' => 'set_user_role', 'function' => 'ultimateMemberHandleUserSpecificRoleChange', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'weforms_entry_submission' => ['entity' => 'WeForms', 'hook' => 'weforms_entry_submission', 'function' => 'handleWeformsSubmit', 'priority' => 10, 'acceptedArgs' => 4, 'isFilterHook' => false],

        'wpcw_enroll_user'           => ['entity' => 'WPCourseware', 'hook' => 'wpcw_enroll_user', 'function' => 'wpcwUserEnrolledCourse', 'priority' => 10, 'acceptedArgs' => 2, 'isFilterHook' => false],
        'wpcw_user_completed_course' => ['entity' => 'WPCourseware', 'hook' => 'wpcw_user_completed_course', 'function' => 'wpcwCourseCompleted', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'wpcw_user_completed_module' => ['entity' => 'WPCourseware', 'hook' => 'wpcw_user_completed_module', 'function' => 'wpcwModuleCompleted', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],
        'wpcw_user_completed_unit'   => ['entity' => 'WPCourseware', 'hook' => 'wpcw_user_completed_unit', 'function' => 'wpcwUnitCompleted', 'priority' => 10, 'acceptedArgs' => 3, 'isFilterHook' => false],

        'ipt_fsqm_hook_save_success' => ['entity' => 'WPEF', 'hook' => 'ipt_fsqm_hook_save_success', 'function' => 'wpefHandleSubmission', 'priority' => 10, 'acceptedArgs' => 1, 'isFilterHook' => false],

        'ws_form_action_for_bi' => ['entity' => 'WSForm', 'hook' => 'ws_form_action_for_bi', 'function' => 'handleWsFormSubmit', 'priority' => 9999, 'acceptedArgs' => 4, 'isFilterHook' => false],
    ];
}
