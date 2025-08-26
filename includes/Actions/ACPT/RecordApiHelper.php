<?php

/**
 * ACPT Record Api
 */

namespace BitCode\FI\Actions\ACPT;

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

    private $apikey;

    private $defaultHeader;

    private $type;

    private $typeName;

    public function __construct($integrationDetails, $integId, $apiKey, $baseUrl)
    {
        $this->integrationDetails = $integrationDetails;
        $this->integrationId = $integId;
        $this->apikey = $apiKey;

        $this->apiUrl = "{$baseUrl}/wp-json/acpt/v1";

        $this->defaultHeader = [
            'acpt-api-key' => $apiKey,
            'Content-Type' => 'application/json',
            'accept'       => 'application/json',
        ];
    }

    public function createCPT($finalData, $fieldValues)
    {
        $this->type = 'CPT';
        $this->typeName = 'Create CPT';

        if ($error = ACPTHelper::cptValidateRequired($finalData)) {
            return $error;
        }

        $apiEndpoint = $this->apiUrl . '/cpt';
        $payload = ACPTHelper::prepareCPTData($finalData, $fieldValues, $this->integrationDetails);

        return HttpHelper::post($apiEndpoint, $payload, $this->defaultHeader);
    }

    public function updateCPT($finalData, $fieldValues)
    {
        $this->type = 'CPT';
        $this->typeName = 'Update CPT';

        if ($error = ACPTHelper::cptValidateRequired($finalData, true)) {
            return $error;
        }

        $slug = $finalData['slug'];

        unset($finalData['slug']);

        $apiEndpoint = $this->apiUrl . '/cpt/' . $slug;
        $finalData = ACPTHelper::prepareCPTData($finalData, $fieldValues, $this->integrationDetails);

        $response = apply_filters('btcbi_acpt_update_cpt', false, $apiEndpoint, $this->apikey, $finalData);

        return ACPTHelper::validateResponse($response);
    }

    public function deleteCPT($finalData, $fieldValues)
    {
        $this->type = 'CPT';
        $this->typeName = 'Delete CPT';

        if (empty($finalData['slug'])) {
            return [
                'success' => false,
                'message' => __('Required field slug is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $apiEndpoint = $this->apiUrl . '/cpt/' . $finalData['slug'];

        $response = apply_filters('btcbi_acpt_delete_cpt', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function execute($fieldValues, $fieldMap, $module)
    {
        $finalData = ACPTHelper::generateReqDataFromFieldMap($fieldValues, $fieldMap);

        switch ($module) {
            case 'create_cpt':
                $apiResponse = $this->createCPT($finalData, $fieldValues);

                break;
            case 'update_cpt':
                $apiResponse = $this->updateCPT($finalData, $fieldValues);

                break;
            case 'delete_cpt':
                $apiResponse = $this->deleteCPT($finalData, $fieldValues);

                break;
        }

        $type = (!empty($apiResponse->id) || \in_array(HttpHelper::$responseCode, [201, 200])) ? 'success' : 'error';

        LogHandler::save($this->integrationId, wp_json_encode(['type' => $this->type, 'type_name' => $this->typeName]), $type, wp_json_encode($apiResponse));

        return $apiResponse;
    }
}
