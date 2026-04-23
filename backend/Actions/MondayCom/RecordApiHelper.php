<?php

/**
 * MondayCom Record Api
 */

namespace BitApps\Integrations\Actions\MondayCom;

use BitApps\Integrations\Config;
use BitApps\Integrations\Core\Util\Common;
use BitApps\Integrations\Core\Util\HttpHelper;
use BitApps\Integrations\Core\Util\Hooks;
use BitApps\Integrations\Log\LogHandler;

class RecordApiHelper
{
    private const API_URL = 'https://api.monday.com/v2';

    private const API_VERSION = '2023-10';

    private $integrationDetails;

    private $integrationId;

    private $apiToken;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $apiToken)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apiToken = $apiToken;
    }

    public function handleFilterResponse($response)
    {
        if ($response) {
            return $response;
        }

        // translators: %s: Placeholder value
        return (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro')];
    }

    public function createItem($fieldData)
    {
        $boardId = $this->integrationDetails->selectedBoard ?? '';
        $groupId = $this->integrationDetails->selectedGroup ?? '';
        $itemName = $fieldData['item_name'] ?? '';

        if (empty($boardId) || empty($itemName) || empty($this->apiToken)) {
            return (object) ['error' => __('Required params are empty!', 'bit-integrations')];
        }

        $columnValues = $fieldData;
        unset($columnValues['item_name']);

        $query = <<<'GRAPHQL'
        mutation ($boardId: ID!, $groupId: String, $itemName: String!, $columnValues: JSON) {
            create_item (
                board_id: $boardId,
                group_id: $groupId,
                item_name: $itemName,
                column_values: $columnValues
            ) {
                id
                name
            }
        }
        GRAPHQL;

        return $this->request(
            $query,
            [
                'boardId'      => (string) $boardId,
                'groupId'      => $groupId ? (string) $groupId : null,
                'itemName'     => (string) $itemName,
                'columnValues' => wp_json_encode((object) $columnValues),
            ]
        );
    }

    public function generateReqDataFromFieldMap($fieldValues, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $item) {
            $triggerValue = $item->formField ?? '';
            $actionValue = $item->mondayComField ?? '';

            if (empty($actionValue)) {
                continue;
            }

            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($item->customValue ?? '', $fieldValues);
            } elseif (!empty($triggerValue)) {
                $dataFinal[$actionValue] = $fieldValues[$triggerValue] ?? '';
            }
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap)
    {
        $fieldData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $mainAction = $this->integrationDetails->mainAction ?? 'create_item';
        $this->type = 'item';
        $this->typeName = $mainAction;

        $default = (object) ['error' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations Pro')];

        switch ($mainAction) {
            case 'create_item':
                $this->type = 'item';
                $apiResponse = $this->createItem($fieldData);

                break;
            case 'update_item':
                $this->type = 'item';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_update_item'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'create_subitem':
                $this->type = 'subitem';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_create_subitem'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'move_item_to_group':
                $this->type = 'item';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_move_item_to_group'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'archive_item':
                $this->type = 'item';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_archive_item'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'delete_item':
                $this->type = 'item';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_delete_item'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'archive_board':
                $this->type = 'board';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_archive_board'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'archive_group':
                $this->type = 'group';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_archive_group'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'delete_group':
                $this->type = 'group';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_delete_group'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'create_group':
                $this->type = 'group';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_create_group'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'duplicate_group':
                $this->type = 'group';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_duplicate_group'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            case 'create_column':
                $this->type = 'column';
                $apiResponse = $this->handleFilterResponse(Hooks::apply(Config::withPrefix('mondayCom_create_column'), false, $fieldData, $this->integrationDetails, $this->apiToken));

                break;
            default:
                $apiResponse = $default;
        }

        $responseType = $this->hasErrors($apiResponse) || !isset($apiResponse->data) ? 'error' : 'success';
        LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), $responseType, wp_json_encode($apiResponse));

        return $apiResponse;
    }

    private function request($query, $variables = [])
    {
        $body = ['query' => $query];

        if (!empty($variables)) {
            $body['variables'] = $variables;
        }

        return HttpHelper::post(self::API_URL, wp_json_encode($body), $this->setHeaders());
    }

    private function hasErrors($response)
    {
        return is_wp_error($response) || !empty($response->errors) || !empty($response->error);
    }

    private function setHeaders()
    {
        return [
            'Authorization' => $this->apiToken,
            'Content-Type'  => 'application/json',
            'API-Version'   => self::API_VERSION,
        ];
    }
}
