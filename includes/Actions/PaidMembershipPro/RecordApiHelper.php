<?php
namespace BitCode\FI\Actions\PaidMembershipPro;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

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
            } elseif (!is_null($data[$triggerValue])) {
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
            LogHandler::save(self::$integrationID, json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', json_encode('User is already a member of the specified level.'));
            return;
        }
        global $wpdb;
        $pmpro_membership_level = $wpdb->get_row($wpdb->prepare("SELECT * FROM $wpdb->pmpro_membership_levels WHERE id = %d", $membership_level));

        if (null === $pmpro_membership_level) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', json_encode('There is no membership level with the specified ID.'));
            return;
        }

        $isAssigned = null;
        if (!empty($pmpro_membership_level->expiration_number)) {
            $data = [
                'user_id' => $user_id,
                'membership_id' => $pmpro_membership_level->id,
                'code_id' => 0,
                'initial_payment' => 0,
                'billing_amount' => 0,
                'cycle_number' => 0,
                'cycle_period' => 0,
                'billing_limit' => 0,
                'trial_amount' => 0,
                'trial_limit' => 0,
            ];

            $isAssigned = pmpro_changeMembershipLevel($data, absint($user_id));
        } else {
            $isAssigned = pmpro_changeMembershipLevel(absint($membership_level), absint($user_id));
        }

        if ($isAssigned === true) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'success', json_encode('User membership level added successfully.'));
            return;
        } else {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'add user', 'type_name' => 'Add the user to a membership level']), 'error', json_encode('Failed to add membership level.'));
            return;
        }
    }

    public function removeUserFromMembershipLevel($membership_level)
    {
        $user_id = get_current_user_id();
        $user_membership_levels = $this->get_user_membership_levels($user_id);

        if ('any' === $membership_level) {
            if (empty($user_membership_levels)) {
                LogHandler::save(self::$integrationID, json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to all membership level']), 'error', json_encode('User does not belong to any membership levels.'));
                return;
            }

            foreach ($user_membership_levels as $membership_level) {
                $cancel_level = pmpro_cancelMembershipLevel(absint($membership_level), absint($user_id));
                LogHandler::save(self::$integrationID, json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to a membership level']), 'success', json_encode('User removed from all membership level successfully.'));
            }
        }

        if (!in_array($membership_level, $user_membership_levels, true)) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to all membership level']), 'error', json_encode('User was not a member of the specified level.'));
            return;
        }

        if (pmpro_cancelMembershipLevel(absint($membership_level), absint($user_id))) {
            LogHandler::save(self::$integrationID, json_encode(['type' => 'remove user', 'type_name' => 'Remove the user to a membership level']), 'success', json_encode('User removed from membership level successfully.'));
            return;
        }
    }

    protected function get_user_membership_levels($user_id = 0)
    {
        if (!function_exists('pmpro_getMembershipLevelsForUser')) {
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
}
