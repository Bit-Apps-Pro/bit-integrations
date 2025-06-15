<?php

/**
 * Active Campaign Integration
 */

namespace BitCode\FI\Actions\ActiveCampaign;

use WP_Error;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Actions\ActiveCampaign\RecordApiHelper;

/**
 * Provide functionality for ZohoCrm integration
 */
class ActiveCampaignController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    public static function _apiEndpoint($api_url, $method)
    {
        return "{$api_url}/api/3/{$method}/";
    }

    /**
     * Process ajax request
     *
     * @param $requestsParams Params to authorize
     *
     * @return JSON Active Campaign api response and status
     */
    public static function activeCampaignAuthorize($requestsParams)
    {
        if (
            empty($requestsParams->api_key)
            || empty($requestsParams->api_url)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::_apiEndpoint($requestsParams->api_url, 'accounts');
        $authorizationHeader['Api-Token'] = $requestsParams->api_key;
        $apiResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        if (is_wp_error($apiResponse) || empty($apiResponse)) {
            wp_send_json_error(
                empty($apiResponse) ? 'Unknown' : $apiResponse,
                400
            );
        }

        wp_send_json_success(true);
    }

    /**
     * Process ajax request for refresh lists
     *
     * @param $queryParams Params to fetch list
     *
     * @return JSON active campaign list data
     */
    public static function activeCampaignLists($queryParams)
    {
        if (
            empty($queryParams->api_key)
            || empty($queryParams->api_url)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::_apiEndpoint($queryParams->api_url, 'lists');
        $authorizationHeader['Api-Token'] = $queryParams->api_key;
        $requestParams = [
            'limit' => 1000,
        ];
        $aCampaignResponse = HttpHelper::get($apiEndpoint, $requestParams, $authorizationHeader);

        $lists = [];
        if (!is_wp_error($aCampaignResponse)) {
            $allLists = $aCampaignResponse->lists;

            foreach ($allLists as $list) {
                $lists[$list->name] = (object) [
                    'listId' => $list->id,
                    'listName' => $list->name,
                ];
            }
            $response['activeCampaignLists'] = $lists;
            wp_send_json_success($response);
        }
    }

    /**
     * Process ajax request for refresh lists
     *
     * @param $queryParams Params to fetch list
     *
     * @return JSON active campaign list data
     */
    public static function activeCampaignAccounts($queryParams)
    {
        if (
            empty($queryParams->api_key)
            || empty($queryParams->api_url)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = self::_apiEndpoint($queryParams->api_url, 'accounts');
        $authorizationHeader['Api-Token'] = $queryParams->api_key;
        $aCampaignResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $lists = [];
        if (!is_wp_error($aCampaignResponse) && isset($aCampaignResponse->accounts)) {
            // $allLists = $aCampaignResponse->lists;

            // foreach ($allLists as $list) {
            //     $lists[$list->name] = (object) [
            //         'listId' => $list->id,
            //         'listName' => $list->name,
            //     ];
            // }
            // $response['activeCampaignLists'] = $lists;
            wp_send_json_success($aCampaignResponse->accounts);
        }
    }

    public static function activeCampaignTags($queryParams)
    {
        if (
            empty($queryParams->api_key)
            || empty($queryParams->api_url)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }


        $offset         = 0;
        $limit          = 100;
        $has_items      = true;
        $available_tags = array();
        while ($has_items) {

            $tagResponse = wp_safe_remote_get(
                $queryParams->api_url . '/api/3/tags?limit=' . $limit . '&offset=' . $offset,
                array(
                    'headers' => array(
                        'Api-token' => $queryParams->api_key,
                    ),
                )
            );

            $tagResponse = json_decode(wp_remote_retrieve_body($tagResponse));

            if (isset($tagResponse->tags)) {

                foreach ($tagResponse->tags as $tag) {
                    $available_tags[$tag->id] = $tag->tag;
                }
            }

            if (empty($tagResponse->tags) || count($tagResponse->tags) < $limit) {
                $has_items = false;
            }

            $offset += $limit;
        }

        asort($available_tags);
        $tag_items = array();

        foreach ($available_tags as $key => $value) {
            $tag_items[] = array(
                'tagId' => "$key",
                'tagName'  => $value,
            );
        }
        $response['activeCampaignTags'] = $tag_items;
        wp_send_json_success($response);
    }

    public static function activeCampaignHeaders($queryParams)
    {
        if (
            empty($queryParams->api_key)
            || empty($queryParams->api_url)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        // $apiEndpoint = "{$queryParams->api_url}/api/3/fields";
        $apiEndpoint = self::_apiEndpoint($queryParams->api_url, 'fields');
        $authorizationHeader['Api-Token'] = $queryParams->api_key;
        $requestParams = [
            'limit' => 1000,
        ];
        $aCampaignResponse = HttpHelper::get($apiEndpoint, $requestParams, $authorizationHeader);

        $fields = [];
        if (!is_wp_error($aCampaignResponse)) {
            $allFields = $aCampaignResponse->fields;
            foreach ($allFields as $field) {
                $fields[$field->title] = (object) [
                    'fieldId' => $field->id,
                    'fieldName' => $field->title,
                    'required' => $field->isrequired === '0' ? false : true
                ];
            }
            $fields['FirstName'] = (object) ['fieldId' => 'firstName', 'fieldName' => 'First Name', 'required' => false];
            $fields['LastName'] = (object) ['fieldId' => 'lastName', 'fieldName' => 'Last Name', 'required' => false];
            $fields['Email'] = (object) ['fieldId' => 'email', 'fieldName' => 'Email', 'required' => true];
            $fields['Phone'] = (object) ['fieldId' => 'phone', 'fieldName' => 'Phone', 'required' => false];
            $response['activeCampaignField'] = $fields;
            wp_send_json_success($response);
        }
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $api_key = $integrationDetails->api_key;
        $api_url = $integrationDetails->api_url;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        $listId = $integrationDetails->listId;
        $tags = $integrationDetails->tagIds;

        if (
            empty($api_key)
            || empty($api_url)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for Sendinblue api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($api_key, $api_url, $this->_integrationID);
        $activeCampaignApiResponse = $recordApiHelper->execute(
            $integrationDetails,
            $fieldValues,
            $fieldMap,
            $actions,
            $listId,
            $tags
        );

        if (is_wp_error($activeCampaignApiResponse)) {
            return $activeCampaignApiResponse;
        }
        return $activeCampaignApiResponse;
    }
}



   
    // public static function activeCampaignTags($queryParams)
    // {
    //     if (empty($queryParams->api_key)
    //         || empty($queryParams->api_url)
    //     ) {
    //         wp_send_json_error(
    //             __(
    //                 'Requested parameter is empty',
    //                 'bit-integrations'
    //             ),
    //             400
    //         );
    //     }

    //     $apiEndpoint = self::_apiEndpoint($queryParams->api_url, 'tags');
    //     $authorizationHeader['Api-Token'] = $queryParams->api_key;
    //     $requestParams = [
    //         'limit' => 1000,
    //     ];
    //     $aCampaignResponse = HttpHelper::get($apiEndpoint, $requestParams, $authorizationHeader);

    //     $tags = [];
    //     if (!is_wp_error($aCampaignResponse)) {
    //         $allTags = $aCampaignResponse->tags;

    //         foreach ($allTags as $tag) {
    //             $tags[$tag->tag] = (object) [
    //                 'tagId' => $tag->id,
    //                 'tagName' => $tag->tag,
    //             ];
    //         }
    //         var_dump($tags,'tags');die;
    //         $response['activeCampaignTags'] = $tags;
    //         wp_send_json_success($response);
    //     }
    // }