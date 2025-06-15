<?php



namespace BitCode\FI\Actions\WishList;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\DateTimeHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,upsert
 */
class RecordApiHelper
{
    protected $action, $api;
    public function __construct($integrationDetails, $baseUrl, $apiKey)
    {
        $this->integrationDetails = $integrationDetails;
        $this->baseUrl = $baseUrl;
        $this->apiKey = $apiKey;
        $this->action = $integrationDetails->actionName;
        $this->api = new wlmapiclass($baseUrl, $apiKey);
        $this->api->return_format = 'json';
    }

    public function searchMember($data)
    {
        $email = $data['user_email'];
        $apiResponse = $this->api->get('/members');
        $memberInfo = false;
        $apiResponse = json_decode($apiResponse)->members->member;
        foreach ($apiResponse as $key => $val) {
            if ($val->user_email == $email) {
                $memberInfo = $val;
                break;
            }
        }
        return $memberInfo;
    }

    public function insertMember($data)
    {
        $levelId = $this->integrationDetails->level_id;
        $isExistMember = $this->searchMember($data);
        if ($isExistMember) {
            $memberId = $isExistMember->id;
            $users = ['Users' => (int)$memberId];
            $response = $this->api->post("/levels/$levelId/members", $users);
        } else {
            $data['Levels'] = [$levelId];
            $apiResponse = $this->api->post('/members', $data);
            if ($apiResponse) $response = json_decode($apiResponse);
        }
        return $response;
    }

    public function searchLevel($level)
    {
        $apiResponse = $this->api->get('/levels');
        $levelInfo = false;
        $apiResponse = json_decode($apiResponse)->levels->level;
        foreach ($apiResponse as $key => $val) {
            if ($val->name == $level) {
                $levelInfo = $val;
                break;
            }
        }
        return $levelInfo;
    }

    public function insertLevel($data)
    {
        $member = $this->integrationDetails->member_id;
        $users = ['Users' => (int)$member];
        $isExist = $this->searchLevel($data['name']);
        if (!$isExist) {
            $apiResponse = $this->api->post('/levels', $data);
            if ($apiResponse) $isExist = json_decode($apiResponse)->level;
        }
        $levelId = $isExist->id;
        $response = $this->api->post("/levels/$levelId/members", $users);
        return $response;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->wishlistField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } else if (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }
    public function executeRecordApi($integId, $defaultConf, $levelLists, $fieldValues, $fieldMap, $actions, $isRelated = false)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if ($this->action == 'level-member') {
            $apiResponse = $this->insertMember($finalData);
            $type = 'level-member';
            $type_name = 'Add Member Under Level';
        } else {
            $apiResponse = $this->insertLevel($finalData);
            $type = 'member-level';
            $type_name = 'Add Level Under Member';
        }

        if (!isset($apiResponse->success) || !$apiResponse->success) {
            LogHandler::save($integId, wp_json_encode(['type' => $type, 'type_name' => $type_name]), 'error', wp_json_encode($apiResponse));
        } else {
            LogHandler::save($integId, wp_json_encode(['type' => $type, 'type_name' => $type_name]), 'success', wp_json_encode($apiResponse));
        }
        return $apiResponse;
    }
}
