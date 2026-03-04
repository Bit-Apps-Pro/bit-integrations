<?php

/**
 * NotificationX Record Api
 */

namespace BitApps\Integrations\Actions\NotificationX;

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Util\Common;
use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Log\LogHandler;

/**
 * Provide functionality for NotificationX record operations.
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

    public function execute($fieldValues, $fieldMap)
    {
        $mainAction = $this->_integrationDetails->mainAction ?? '';

        $fieldData = static::generateReqDataFromFieldMap($fieldMap, $fieldValues);

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro'),
        ];

        switch ($mainAction) {
            case 'delete_notification':
                $response = Hooks::apply(Config::withPrefix('notificationx_delete_notification'), $defaultResponse, $fieldData['notification_id'] ?? '');
                $type = 'notification';
                $actionType = 'delete_notification';

                break;

            case 'enable_notification':
                $response = Hooks::apply(Config::withPrefix('notificationx_enable_notification'), $defaultResponse, $fieldData['notification_id'] ?? '');
                $type = 'notification';
                $actionType = 'enable_notification';

                break;

            case 'disable_notification':
                $response = Hooks::apply(Config::withPrefix('notificationx_disable_notification'), $defaultResponse, $fieldData['notification_id'] ?? '');
                $type = 'notification';
                $actionType = 'disable_notification';

                break;

            case 'add_notification_entry':
                $entryMap = isset($this->_integrationDetails->entry_map)
                    ? $this->_integrationDetails->entry_map
                    : [];
                $entryData = static::generateEntryDataFromEntryMap($entryMap, $fieldValues);
                $payload = [
                    'notification_id' => $fieldData['notification_id'] ?? 0,
                    'entry_data'      => $entryData,
                ];
                $response = Hooks::apply(Config::withPrefix('notificationx_add_notification_entry'), $defaultResponse, $payload);
                $type = 'notification';
                $actionType = 'add_notification_entry';
                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations'),
                ];
                $type = 'NotificationX';
                $actionType = 'unknown';

                break;
        }

        $responseType = isset($response['success']) && $response['success'] ? 'success' : 'error';
        LogHandler::save($this->_integrationID, ['type' => $type, 'type_name' => $actionType], $responseType, $response);

        return $response;
    }

    private static function generateEntryDataFromEntryMap($entryMap, $fieldValues)
    {
        $entryData = [];
        foreach ($entryMap as $item) {
            $triggerValue = $item->formField ?? '';
            $entryKey = $item->entryKey ?? '';

            if (empty($entryKey)) {
                continue;
            }

            $entryData[$entryKey] = $triggerValue === 'custom' && isset($item->customValue)
                ? Common::replaceFieldWithValue($item->customValue, $fieldValues)
                : ($fieldValues[$triggerValue] ?? '');
        }

        return $entryData;
    }

    private static function generateReqDataFromFieldMap($fieldMap, $fieldValues)
    {
        $dataFinal = [];
        foreach ($fieldMap as $item) {
            $triggerValue = $item->formField;
            $actionValue = $item->notificationXField;

            $dataFinal[$actionValue] = $triggerValue === 'custom' && isset($item->customValue)
                ? Common::replaceFieldWithValue($item->customValue, $fieldValues)
                : ($fieldValues[$triggerValue] ?? '');
        }

        return $dataFinal;
    }
}
