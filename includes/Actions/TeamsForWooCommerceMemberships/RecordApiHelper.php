<?php

/**
 * Teams for WooCommerce Memberships Record Api
 */

namespace BitCode\FI\Actions\TeamsForWooCommerceMemberships;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, update
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    /**
     * Execute the integration
     *
     * @param array  $fieldValues Field values from form
     * @param array  $fieldMap    Field mapping
     * @param string $mainAction  Action to perform
     *
     * @return array
     */
    public function execute($fieldValues, $fieldMap, $mainAction)
    {
        if (!\function_exists('wc_memberships_for_teams')) {
            return [
                'success' => false,
                'message' => __('Teams for WooCommerce Memberships is not installed or activated', 'bit-integrations')
            ];
        }

        $fieldData = static::generateReqDataFromFieldMap($fieldMap, $fieldValues);

        if (!empty($this->_integrationDetails->selectedTeam)) {
            $fieldData['team_id'] = $this->_integrationDetails->selectedTeam;
        }
        if (!empty($this->_integrationDetails->selectedMemberRole)) {
            $fieldData['member_role'] = $this->_integrationDetails->selectedMemberRole;
        }

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro')
        ];

        // Route to appropriate action method
        switch ($mainAction) {
            case 'add_member_to_team':
                $response = apply_filters('btcbi_teams_for_wc_memberships_add_member', $defaultResponse, $fieldData, $this->_integrationDetails);
                $type = 'team_member';
                $actionType = 'add_member_to_team';

                break;

            case 'remove_member_from_team':
                $response = apply_filters('btcbi_teams_for_wc_memberships_remove_member', $defaultResponse, $fieldData, $this->_integrationDetails);
                $type = 'team_member';
                $actionType = 'remove_member_from_team';

                break;

            case 'invite_user_to_team':
                $response = apply_filters('btcbi_teams_for_wc_memberships_invite_user', $defaultResponse, $fieldData, $this->_integrationDetails);
                $type = 'team_invitation';
                $actionType = 'invite_user_to_team';

                break;

            case 'update_member_role':
                $response = apply_filters('btcbi_teams_for_wc_memberships_update_role', $defaultResponse, $fieldData, $this->_integrationDetails);
                $type = 'team_member';
                $actionType = 'update_member_role';

                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
                $type = 'TeamsForWooCommerceMemberships';
                $actionType = 'unknown';

                break;
        }

        $responseType = isset($response['success']) && $response['success'] ? 'success' : 'error';
        LogHandler::save($this->_integrationID, ['type' => $type, 'type_name' => $actionType], $responseType, $response);

        return $response;
    }

    private function generateReqDataFromFieldMap($fieldMap, $fieldValues)
    {
        $dataFinal = [];
        foreach ($fieldMap as $item) {
            $triggerValue = $item->formField;
            $actionValue = $item->teamsForWooCommerceMembershipsField;

            $dataFinal[$actionValue] = $triggerValue === 'custom' && isset($item->customValue) ? Common::replaceFieldWithValue($item->customValue, $fieldValues) : $fieldValues[$triggerValue] ?? '';
        }

        return $dataFinal;
    }
}
