<?php

namespace BitCode\FI\Actions\PaidMembershipPro;

use WP_Error;

class PaidMembershipProController
{
    public static function pluginActive($option = null)
    {
        if (is_plugin_active('paid-memberships-pro/paid-memberships-pro.php')) {
            return $option === 'get_name' ? 'paid-memberships-pro/paid-memberships-pro.php' : true;
        }

        return false;
    }

    public static function authorizeMemberpress()
    {
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'Paid Membership'));
    }

    public static function getAllPaidMembershipProLevel()
    {
        global $wpdb;
        $levels = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->pmpro_membership_levels} ORDER BY id ASC"));
        $allLevels = [];
        if ($levels) {
            foreach ($levels as $level) {
                $allLevels[] = [
                    'membershipId'    => $level->id,
                    'membershipTitle' => $level->name,
                ];
            }
        }

        // $allLevels = array_merge($allLevels, [[
        //     'membershipId' => 'any',
        //     'membershipTitle' => 'Any Membership Level',
        // ]]);
        wp_send_json_success($allLevels);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        $selectedMembership = $integrationDetails->selectedMembership;
        if (
            empty($integId)
            || empty($mainAction) || empty($selectedMembership)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, There is an some error.', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $paidMemberpressApiResponse = $recordApiHelper->execute(
            $mainAction,
            $selectedMembership,
        );

        if (is_wp_error($paidMemberpressApiResponse)) {
            return $paidMemberpressApiResponse;
        }

        return $paidMemberpressApiResponse;
    }
}
