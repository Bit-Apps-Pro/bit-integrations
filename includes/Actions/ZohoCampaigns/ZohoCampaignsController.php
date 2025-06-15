<?php

/**
 * ZohoCampaigns Integration
 */

namespace BitCode\FI\Actions\ZohoCampaigns;

use WP_Error;
use BitCode\FI\Log\LogHandler;

use BitCode\FI\Core\Util\IpTool;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\controller\ZohoAuthController;
use BitCode\FI\Actions\ZohoCampaigns\RecordApiHelper;
use BitCode\FI\Core\Util\ApiResponse as UtilApiResponse;

/**
 * Provide functionality for ZohoCrm integration
 */
class ZohoCampaignsController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
        //$this->_logResponse = new UtilApiResponse();
    }

    /**
     * Process ajax request for refresh crm modules
     *
     * @param Object $queryParams Params to fetch campaign list
     *
     * @return JSON crm module data
     */
    public static function refreshLists($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $listsMetaApiEndpoint = "https://campaigns.{$queryParams->dataCenter}/api/v1.1/getmailinglists?resfmt=JSON&range=100";

        $authorizationHeader["Authorization"] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $listsMetaResponse = HttpHelper::get($listsMetaApiEndpoint, null, $authorizationHeader);

        $allLists = [];
        if (!is_wp_error($listsMetaResponse)) {
            $lists = $listsMetaResponse->list_of_details;

            if (count($lists) > 0) {
                foreach ($lists as $list) {
                    $allLists[$list->listname] = (object) array(
                        'listkey' => $list->listkey,
                        'listname' => $list->listname
                    );
                }
            }
            uksort($allLists, 'strnatcasecmp');
            $response['lists'] = $allLists;
        } else {
            wp_send_json_error(
                empty($listsMetaResponse->data) ? 'Unknown' : $listsMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response['lists']);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh crm layouts
     *
     * @param Object $queryParams Params to fetch contact fields
     *
     * @return JSON crm layout data
     */
    public static function refreshContactFields($queryParams)
    {
        if (
            empty($queryParams->list)
            || empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $response = [];
        if ((intval($queryParams->tokenDetails->generates_on) + (55 * 60)) < time()) {
            $response['tokenDetails'] = ZohoAuthController::_refreshAccessToken($queryParams);
        }

        $contactFieldsMetaApiEndpoint = "https://campaigns.{$queryParams->dataCenter}/api/v1.1/contact/allfields?type=json";

        $authorizationHeader["Authorization"] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $contactFieldsMetaResponse = HttpHelper::get($contactFieldsMetaApiEndpoint, null, $authorizationHeader);


        if (!is_wp_error($contactFieldsMetaResponse)) {
            $allFields = [];
            $fields = $contactFieldsMetaResponse->response->fieldnames->fieldname;

            if (count($fields) > 0) {
                foreach ($fields as $field) {
                    $allFields[] = $field->DISPLAY_NAME;
                }
            }

            usort($allFields, 'strnatcasecmp');
            $response['fields'] = $allFields;

            $response['required'] = ['Contact Email'];
        } else {
            wp_send_json_error(
                $contactFieldsMetaResponse->status === 'error' ? $contactFieldsMetaResponse->message : 'Unknown',
                400
            );
        }
        if (!empty($response['tokenDetails']) && $response['tokenDetails'] && !empty($queryParams->id)) {
            $response["queryModule"] = $queryParams->module;
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response);
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $tokenDetails = $integrationDetails->tokenDetails;
        $list = $integrationDetails->list;
        $dataCenter = $integrationDetails->dataCenter;
        $fieldMap = $integrationDetails->field_map;
        $required = $integrationDetails->default->fields->{$list}->required;
        if (
            empty($tokenDetails)
            || empty($list)
            || empty($fieldMap)
        ) {
            $error = new WP_Error('REQ_FIELD_EMPTY', __('list are required for zoho campaigns api', 'bit-integrations'));
            LogHandler::save($this->_integrationID, 'record', 'validation', $error);
            return $error;
        }

        if ((intval($tokenDetails->generates_on) + (55 * 60)) < time()) {
            $requiredParams['clientId'] = $integrationDetails->clientId;
            $requiredParams['clientSecret'] = $integrationDetails->clientSecret;
            $requiredParams['dataCenter'] = $integrationDetails->dataCenter;
            $requiredParams['tokenDetails'] = $tokenDetails;
            $newTokenDetails = ZohoAuthController::_refreshAccessToken((object)$requiredParams);
            if ($newTokenDetails) {
                ZohoAuthController::_saveRefreshedToken($this->_integrationID, $newTokenDetails);
                $tokenDetails = $newTokenDetails;
            }
        }

        // $actions = $integrationDetails->actions;
        $recordApiHelper = new RecordApiHelper($tokenDetails, $this->_integrationID);

        $zcampaignsApiResponse = $recordApiHelper->execute(
            $list,
            $dataCenter,
            $fieldValues,
            $fieldMap,
            $required
        );

        if (is_wp_error($zcampaignsApiResponse)) {
            return $zcampaignsApiResponse;
        }
        return $zcampaignsApiResponse;
    }
}
