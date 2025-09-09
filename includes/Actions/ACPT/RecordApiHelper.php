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
        if (empty($this->integrationDetails->icon)) {
            return [
                'success' => false,
                'message' => __('Required field Icon is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        if ($error = ACPTHelper::cptValidateRequired($finalData)) {
            return $error;
        }

        $finalData['post_name'] = ACPTHelper::convertToSlug($finalData['post_name']);
        $finalData['icon'] = $this->integrationDetails->icon;

        $apiEndpoint = $this->apiUrl . '/cpt';
        $payload = ACPTHelper::prepareCPTData($finalData, $fieldValues, $this->integrationDetails);

        return HttpHelper::post($apiEndpoint, $payload, $this->defaultHeader);
    }

    public function updateCPT($finalData, $fieldValues)
    {
        if ($error = ACPTHelper::cptValidateRequired($finalData, true)) {
            return $error;
        }

        $slug = ACPTHelper::convertToSlug($finalData['slug']);

        unset($finalData['slug']);

        $finalData['icon'] = $this->integrationDetails->icon;

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

        $slug = ACPTHelper::convertToSlug($finalData['slug']);

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

        $finalData['slug'] = ACPTHelper::convertToSlug($finalData['slug']);

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

        $finalData['taxonomy_slug'] = ACPTHelper::convertToSlug($finalData['taxonomy_slug']);
        $finalData['cpt_slug'] = ACPTHelper::convertToSlug($finalData['cpt_slug']);

        $apiEndpoint = $this->apiUrl . '/taxonomy/assoc/' . $finalData['taxonomy_slug'] . '/' . $finalData['cpt_slug'];

        $response = apply_filters('btcbi_acpt_associate_taxonomy_to_cpt', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function createOrUpdateOptionPage($finalData, $isUpdate = false)
    {
        if (empty($this->integrationDetails->icon)) {
            return [
                'success' => false,
                'message' => __('Required field Icon is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        if (empty($this->integrationDetails->capability)) {
            return [
                'success' => false,
                'message' => __('Required field Capability is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        if ($error = ACPTHelper::optionPageValidateRequired($finalData)) {
            return $error;
        }

        $finalData['icon'] = $this->integrationDetails->icon;
        $finalData['capability'] = $this->integrationDetails->capability;

        $finalData['position'] = (integer) $finalData['position'];
        $finalData['menuSlug'] = ACPTHelper::convertToSlug($finalData['menuSlug']);

        $path = $isUpdate ? '/option-page/' . $finalData['menuSlug'] : '/option-page';
        $apiEndpoint = $this->apiUrl . $path;

        $hook = 'btcbi_acpt_' . ($isUpdate ? 'update' : 'create') . '_option_page';

        $response = apply_filters($hook, false, $apiEndpoint, $this->apikey, wp_json_encode($finalData));

        return ACPTHelper::validateResponse($response);
    }

    public function deleteOptionPage($finalData)
    {
        if (empty($finalData['slug'])) {
            return [
                'success' => false,
                'message' => __('Required field menu slug is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $finalData['slug'] = ACPTHelper::convertToSlug($finalData['slug']);

        $apiEndpoint = $this->apiUrl . '/option-page/' . $finalData['slug'];

        $response = apply_filters('btcbi_acpt_delete_option_page', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function deleteMetaGroup($finalData)
    {
        if (empty($finalData['id'])) {
            return [
                'success' => false,
                'message' => __('Required field meta group id is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $apiEndpoint = $this->apiUrl . '/meta/' . $finalData['id'];

        $response = apply_filters('btcbi_acpt_delete_meta_group', false, $apiEndpoint, $this->apikey);

        return ACPTHelper::validateResponse($response);
    }

    public function deleteDynamicBlock($finalData)
    {
        if (empty($finalData['id'])) {
            return [
                'success' => false,
                'message' => __('Required field dynamic block id is empty', 'bit-integrations'),
                'code'    => 422,
            ];
        }

        $apiEndpoint = $this->apiUrl . '/block/' . $finalData['id'];

        $response = apply_filters('btcbi_acpt_delete_dynamic_block', false, $apiEndpoint, $this->apikey);

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

                $apiResponse = $this->createOrUpdateOptionPage($finalData);

                break;
            case 'update_option_page':
                $type = 'Option Page';
                $typeName = 'Update Option Page';

                $apiResponse = $this->createOrUpdateOptionPage($finalData, true);

                break;
            case 'delete_option_page':
                $type = 'Option Page';
                $typeName = 'Delete Option Page';

                $apiResponse = $this->deleteOptionPage($finalData);

                break;
            case 'delete_meta_group':
                $type = 'Meta Field Group';
                $typeName = 'Delete Meta Field Group';

                $apiResponse = $this->deleteMetaGroup($finalData);

                break;
            case 'delete_dynamic_block':
                $type = 'Dynamic Block';
                $typeName = 'Delete Dynamic Block';

                $apiResponse = $this->deleteDynamicBlock($finalData);

                break;
        }

        $type = (!empty($apiResponse->id) || \in_array(HttpHelper::$responseCode, [201, 200])) ? 'success' : 'error';

        LogHandler::save($this->integrationId, wp_json_encode(['type' => $type, 'type_name' => $typeName]), $type, wp_json_encode($apiResponse));

        return $apiResponse;
    }
}
