<?php

/**
 * ACPT Record Api
 */

namespace BitCode\FI\Actions\ACPT;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\HttpHelper;

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
        if ($error = ACPTHelper::cptValidateRequired($finalData)) {
            return $error;
        }

        $apiEndpoint = $this->apiUrl . '/cpt';
        $payload = ACPTHelper::prepareCPTData($finalData, $fieldValues, $this->integrationDetails);

        return HttpHelper::post($apiEndpoint, $payload, $this->defaultHeader);
    }

    public function updateCPT($finalData, $fieldValues)
    {
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

    public function deleteCPT($finalData)
    {
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

    public function createOrUpdateTaxonomy($finalData, $fieldValues, $isUpdate = false)
    {
        if ($error = ACPTHelper::taxonomyValidateRequired($finalData)) {
            return $error;
        }

        $slug = $finalData['slug'];
        $finalData = ACPTHelper::prepareTaxonomyData($finalData, $fieldValues, $this->integrationDetails);

        $path = $isUpdate ? '/taxonomy/' . $slug : '/taxonomy';
        $apiEndpoint = $this->apiUrl . $path;

        $hook = 'btcbi_acpt_' . ($isUpdate ? 'update' : 'create') . '_taxonomy';

        $response = apply_filters($hook, false, $apiEndpoint, $this->apikey, $finalData);

        return ACPTHelper::validateResponse($response);
    }

    public function deleteTaxonomy($finalData)
    {
        if (empty($finalData['slug'])) {
            return [
                'success' => false,
                'message' => __('Required field slug is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $apiEndpoint = $this->apiUrl . '/taxonomy/' . $finalData['slug'];

        $response = apply_filters('btcbi_acpt_delete_taxonomy', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function associateTaxonomyToCPT($finalData)
    {
        if (empty($finalData['taxonomy_slug'])) {
            return [
                'success' => false,
                'message' => __('Required field taxonomy slug is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }
        if (empty($finalData['cpt_slug'])) {
            return [
                'success' => false,
                'message' => __('Required field cpt slug is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $apiEndpoint = $this->apiUrl . '/taxonomy/assoc/' . $finalData['taxonomy_slug'] . '/' . $finalData['cpt_slug'];

        $response = apply_filters('btcbi_acpt_associate_taxonomy_to_cpt', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function createOptionPage($finalData)
    {
        if ($error = ACPTHelper::optionPageValidateRequired($finalData)) {
            return $error;
        }

        $finalData['position'] = (integer) $finalData['position'];

        $apiEndpoint = $this->apiUrl . '/option-page';

        $response = apply_filters('btcbi_acpt_create_option_page', false, $apiEndpoint, $this->apikey, wp_json_encode($finalData));

        return ACPTHelper::validateResponse($response);
    }

    public function execute($fieldValues, $fieldMap, $module)
    {
        $type = '';
        $typeName = '';

        $finalData = ACPTHelper::generateReqDataFromFieldMap($fieldValues, $fieldMap);

        switch ($module) {
            case 'create_cpt':
                $type = 'CPT';
                $typeName = 'Create CPT';

                $apiResponse = $this->createCPT($finalData, $fieldValues);

                break;
            case 'update_cpt':
                $type = 'CPT';
                $typeName = 'Update CPT';

                $apiResponse = $this->updateCPT($finalData, $fieldValues);

                break;
            case 'delete_cpt':
                $type = 'CPT';
                $typeName = 'Delete CPT';

                $apiResponse = $this->deleteCPT($finalData);

                break;
            case 'create_taxonomy':
                $type = 'Taxonomy';
                $typeName = 'Create Taxonomy';

                $apiResponse = $this->createOrUpdateTaxonomy($finalData, $fieldValues);

                break;
            case 'update_taxonomy':
                $type = 'Taxonomy';
                $typeName = 'Create Taxonomy';

                $apiResponse = $this->createOrUpdateTaxonomy($finalData, $fieldValues, true);

                break;
            case 'delete_taxonomy':
                $type = 'Taxonomy';
                $typeName = 'Delete Taxonomy';

                $apiResponse = $this->deleteTaxonomy($finalData);

                break;
            case 'associate_taxonomy_to_cpt':
                $type = 'Associate';
                $typeName = 'Associate a Registered Taxonomy to a CPT';

                $apiResponse = $this->associateTaxonomyToCPT($finalData);

                break;
            case 'create_option_page':
                $type = 'Option Page';
                $typeName = 'Create Option Page';

                $apiResponse = $this->createOptionPage($finalData);

                break;
        }

        $type = (!empty($apiResponse->id) || \in_array(HttpHelper::$responseCode, [201, 200])) ? 'success' : 'error';

        LogHandler::save($this->integrationId, wp_json_encode(['type' => $type, 'type_name' => $typeName]), $type, wp_json_encode($apiResponse));

        return $apiResponse;
    }
}
