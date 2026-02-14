<?php

/**
 * WPCafe Record Api
 */

namespace BitApps\BTCBI_FI\Actions\WPCafe;

use BitApps\BTCBI_FI\Core\Util\Common;
use BitApps\BTCBI_FI\Log\LogHandler;

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
     * @param array $fieldValues Field values from form
     * @param array $fieldMap    Field mapping
     * @param array $utilities   Actions to perform
     *
     * @return array
     */
    public function execute($fieldValues, $fieldMap)
    {
        if (!class_exists('WpCafe\Init')) {
            return [
                'success' => false,
                'message' => __('WPCafe is not installed or activated', 'bit-integrations')
            ];
        }

        $fieldData = static::generateReqDataFromFieldMap($fieldMap, $fieldValues);

        $mainAction = $this->_integrationDetails->mainAction ?? 'create_reservation';

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro')
        ];

        // Route to appropriate action method
        switch ($mainAction) {
            case 'create_reservation':
                $response = apply_filters('btcbi_wpcafe_create_reservation', $defaultResponse, $fieldData);
                $type = 'reservation';
                $actionType = 'create_reservation';

                break;

            case 'update_reservation':
                $response = apply_filters('btcbi_wpcafe_update_reservation', $defaultResponse, $fieldData);
                $type = 'reservation';
                $actionType = 'update_reservation';

                break;

            case 'delete_reservation':
                $response = apply_filters('btcbi_wpcafe_delete_reservation', $defaultResponse, $fieldData['reservation_id'] ?? 0);
                $type = 'reservation';
                $actionType = 'delete_reservation';

                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
                $type = 'WPCafe';
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
            $actionValue = $item->wpcafeField;

            $dataFinal[$actionValue] = $triggerValue === 'custom' && isset($item->customValue)
                ? Common::replaceFieldWithValue($item->customValue, $fieldValues)
                : $fieldValues[$triggerValue] ?? '';
        }

        return $dataFinal;
    }
}
