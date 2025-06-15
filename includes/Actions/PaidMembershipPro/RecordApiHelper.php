<?php

namespace BitCode\FI\Actions\PaidMembershipPro;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;

class RecordApiHelper
{
    private static $integrationID;

    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        self::$integrationID = $integId;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->memberpressFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function addUserMembershipLevel($membership_level)
    {
        $user_id = get_current_user_id();
        $current_level = pmpro_getMembershipLevelForUser($user_id);

        if (!empty($current_level) && absint($current_level->ID) == absint($membership_level)) {
            LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', wp_json_encode(__('User is already a member of the specified level.', 'bit-integrations')));

            return;
        }
        global $wpdb;
        $pmpro_membership_level = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->pmpro_membership_levels} WHERE id = %d", $membership_level));

        if (null === $pmpro_membership_level) {
            LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', wp_json_encode(__('There is no membership level with the specified ID.', 'bit-integrations')));

            return;
        }

        $isAssigned = null;
        if (!empty($pmpro_membership_level->expiration_number)) {
            $data = [
                'user_id'         => $user_id,
                'membership_id'   => $pmpro_membership_level->id,
                'code_id'         => 0,
                'initial_payment' => 0,
                'billing_amount'  => 0,
                'cycle_number'    => 0,
                'cycle_period'    => 0,
                'billing_limit'   => 0,
                'trial_amount'    => 0,
                'trial_limit'     => 0,
            ];

            $isAssigned = pmpro_changeMembershipLevel($data, absint($user_id));
        } else {
            $isAssigned = pmpro_changeMembershipLevel(absint($membership_level), absint($user_id));
        }

        if ($isAssigned === true) {
            LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'success', wp_json_encode(__('User membership level added successfully', 'bit-integrations')));

            return;
        }
        LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', wp_json_encode(__('Failed to add membership level', 'bit-integrations')));
    }

    public function removeUserFromMembershipLevel($membership_level)
    {
        $user_id = get_current_user_id();
        $user_membership_levels = $this->get_user_membership_levels($user_id);

        if ('any' === $membership_level) {
            if (empty($user_membership_levels)) {
                LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to all membership level']), 'error', wp_json_encode(__('User does not belong to any membership levels', 'bit-integrations')));

                return;
            }

            foreach ($user_membership_levels as $membership_level) {
                $cancel_level = pmpro_cancelMembershipLevel(absint($membership_level), absint($user_id));
                LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to a membership level']), 'success', wp_json_encode(__('User removed from all membership level successfully', 'bit-integrations')));
            }
        }

        if (!\in_array($membership_level, $user_membership_levels, true)) {
            LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to all membership level']), 'error', wp_json_encode(__('User was not a member of the specified level', 'bit-integrations')));

            return;
        }

        if (pmpro_cancelMembershipLevel(absint($membership_level), absint($user_id))) {
            LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to a membership level']), 'success', wp_json_encode(__('User removed from membership level successfully', 'bit-integrations')));

            return;
        }
    }

    public function execute(
        $mainAction,
        $selectedMembership
    ) {
        $apiResponse = true;
        if ($mainAction === '1') {
            $this->addUserMembershipLevel($selectedMembership);
        } elseif ($mainAction === '2') {
            $this->removeUserFromMembershipLevel($selectedMembership);
        }

        return $apiResponse;
    }

    protected function get_user_membership_levels($user_id = 0)
    {
        if (!\function_exists('pmpro_getMembershipLevelsForUser')) {
            return [];
        }
        $user_membership_levels = pmpro_getMembershipLevelsForUser($user_id);

        return array_map(
            function ($membership_level) {
                return $membership_level->ID;
            },
            $user_membership_levels
        );
    }
}
