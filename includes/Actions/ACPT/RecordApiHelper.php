<?php

/**
 * ACPT Record Api
 */

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $integrationDetails;

    private $integrationId;

    private $apiUrl;

    private $defaultHeader;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $apiKey, $baseUrl)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apiUrl = "{$baseUrl}/wp-json/acpt/v1";
        $this->defaultHeader = [
            'acpt-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'accept'       => 'application/json',
        ];
    }

    public function createCPT(array $finalData, array $fieldValues)
    {
        $this->type = 'CPT';
        $this->typeName = 'Create CPT';

        if ($error = ACPTHelper::cptValidateRequired($finalData)) {
            return $error;
        }

        $finalData['labels'] = ACPTHelper::buildLabels($fieldValues, $this->integrationDetails->label_field_map ?? []);
        $finalData['settings'] = ACPTHelper::buildSettings($finalData, $this->integrationDetails->utilities ?? []);
        $finalData['supports'] = Helper::convertStringToArray($this->integrationDetails->supports ?? []);

        $apiEndpoint = $this->apiUrl . '/cpt';
        $payload = wp_json_encode($finalData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return HttpHelper::post($apiEndpoint, $payload, $this->defaultHeader);
    }

    public function execute($fieldValues, $fieldMap, $module)
    {
        $finalData = ACPTHelper::generateReqDataFromFieldMap($fieldValues, $fieldMap);

        switch ($module) {
            case 'create_cpt':
                $apiResponse = $this->createCPT($finalData, $fieldValues);

                break;
        }

        $type = (!empty($apiResponse->id) || HttpHelper::$responseCode === 201) ? 'success' : 'error';

        LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), $type, wp_json_encode($apiResponse));

        return $apiResponse;
    }
}
