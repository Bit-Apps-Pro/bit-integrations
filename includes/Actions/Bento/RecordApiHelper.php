<?php

/**
 * Bento Record Api
 */

namespace BitCode\FI\Actions\Bento;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationDetails;

    private $integrationId;

    private $apiUrl;

    private $defaultHeader;

    private $siteUUID;

    private $publishableKey;

    private $secretKey;

    private $type;

    private $typeName;

    public function __construct(
        $integrationDetails,
        $integId,
        $publishableKey,
        $secretKey,
        $siteUUID
    ) {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->siteUUID = $siteUUID;
        $this->publishableKey = $publishableKey;
        $this->secretKey = $secretKey;
        $this->apiUrl = 'https://app.bentonow.com/api/v1/fetch/';

        $this->defaultHeader = [
            'Authorization' => 'Basic ' . base64_encode("{$publishableKey}:{$secretKey}"),
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json'
        ];
    }

    public function addPeople($finalData)
    {
        $this->type = 'User';
        $this->typeName = 'Create User';

        if (empty($finalData['email'])) {
            return ['success' => false, 'message' => __('Required field Email is empty', 'bit-integrations'), 'code' => 400];
        }

        $email = $finalData['email'];
        unset($finalData['email']);

        $apiEndpoint = "{$this->apiUrl}subscribers?site_uuid={$this->siteUUID}";
        $response = HttpHelper::post($apiEndpoint, wp_json_encode(['email' => $email]), $this->defaultHeader);

        if (!$this->checkResponseCode()) {
            return $response;
        }

        $integration = $this->integrationDetails;
        $utilities = [
            'tags'      => $integration->selected_tags ?? [],
            'EventTags' => $integration->selected_tags_via_event ?? [],
            'subscribe' => $integration->subscribe ?? false,
        ];

        $reqParams = (object) [
            'site_uuid'       => $this->siteUUID,
            'publishable_key' => $this->publishableKey,
            'secret_key'      => $this->secretKey,
        ];

        do_action('btcbi_bento_update_user_data', false, $reqParams, $email, $finalData, $utilities);

        return $response;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];
        foreach ($fieldMap as $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->bentoFormField;
            $dataFinal[$actionValue] = ($triggerValue === 'custom' && !empty($value->customValue)) ? Common::replaceFieldWithValue($value->customValue, $data) : $data[$triggerValue];
        }

        return $dataFinal;
    }

    public function execute($fieldValues, $fieldMap, $action)
    {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = $this->addPeople($finalData);
        $logStatus = (!$this->checkResponseCode() || empty($apiResponse->data)) ? 'error' : 'success';

        LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), $logStatus, wp_json_encode($apiResponse));

        return $apiResponse;
    }

    private function checkResponseCode()
    {
        return empty(HttpHelper::$responseCode) ? false : substr(HttpHelper::$responseCode, 0, 2) == 20;
    }
}
