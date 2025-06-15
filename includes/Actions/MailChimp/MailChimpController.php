<?php

/**
 * MailChimp Integration
 */

namespace BitCode\FI\Actions\MailChimp;

use WP_Error;
use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for MailChimp integration
 */
class MailChimpController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * MailChimp API Endpoint
     *
     * @param mixed $dc
     */
    public static function apiEndPoint($dc)
    {
        return "https://{$dc}.api.mailchimp.com/3.0";
    }

    /**
     * MailChimp Actions
     *
     * @return array $allModules
     */
    public static function refreshModules()
    {
        $allModules = [
            [
                'name'  => 'add_a_member_to_an_audience',
                'label' => __('Add a member to an audience', 'bit-integrations'),
            ]
        ];

        if (Helper::isProActivate()) {
            $allModules = array_merge(
                $allModules,
                [
                    [
                        'name'  => 'add_tag_to_a_member',
                        'label' => __('Add tag to a member', 'bit-integrations'),
                    ],
                    [
                        'name'  => 'remove_tag_from_a_member',
                        'label' => __('Remove tag from a member', 'bit-integrations'),
                    ],
                ]
            );
        }

        return $allModules;
    }

    /**
     * Process ajax request for generate_token
     *
     * @param object $requestsParams Params for generate token
     *
     * @return JSON zoho crm api response and status
     */
    public static function generateTokens($requestsParams)
    {
        if (
            empty($requestsParams->clientId)
            || empty($requestsParams->clientSecret)
            || empty($requestsParams->redirectURI)
            || empty($requestsParams->code)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        $apiEndpoint = 'https://login.mailchimp.com/oauth2/token';
        $authorizationHeader['Content-Type'] = 'application/x-www-form-urlencoded';
        $requestParams = [
            'code'          => $requestsParams->code,
            'client_id'     => $requestsParams->clientId,
            'client_secret' => $requestsParams->clientSecret,
            'redirect_uri'  => $requestsParams->redirectURI,
            'grant_type'    => 'authorization_code'
        ];
        $apiResponse = HttpHelper::post($apiEndpoint, $requestParams, $authorizationHeader);

        $metaDataEndPoint = 'https://login.mailchimp.com/oauth2/metadata';

        $authorizationHeader['Authorization'] = "Bearer {$apiResponse->access_token}";
        $metaData = HttpHelper::post($metaDataEndPoint, null, $authorizationHeader);

        $apiResponse->dc = $metaData->dc;

        if (is_wp_error($apiResponse) || !empty($apiResponse->error)) {
            wp_send_json_error(
                empty($apiResponse->error) ? 'Unknown' : $apiResponse->error,
                400
            );
        }
        $apiResponse->generates_on = time();
        wp_send_json_success($apiResponse, 200);
    }

    /**
     * Process ajax request for refresh MailChimp Audience list
     *
     * @param $queryParams Params to refresh audience
     *
     * @return JSON MailChimp data
     */
    public static function refreshAudience($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->tokenDetails->dc)
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
        $apiEndpoint = self::apiEndPoint($queryParams->tokenDetails->dc) . '/lists?count=1000&offset=0';

        $authorizationHeader['Authorization'] = "Bearer {$queryParams->tokenDetails->access_token}";
        $audienceResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $allList = [];
        if (!is_wp_error($audienceResponse) && empty($audienceResponse->response->error)) {
            $audienceLists = $audienceResponse->lists;
            // wp_send_json_success($audienceLists);
            foreach ($audienceLists as $audienceList) {
                $allList[$audienceList->name] = (object) [
                    'listId'   => $audienceList->id,
                    'listName' => $audienceList->name
                ];
            }
            uksort($allList, 'strnatcasecmp');

            $response['audiencelist'] = $allList;
        } else {
            wp_send_json_error(
                $audienceResponse->response->error->message,
                400
            );
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh MailChimp Audience Fields
     *
     * @param $queryParams Params to refresh fields
     *
     * @return JSON MailChimp Audience fields
     */
    public static function refreshAudienceFields($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->listId)
            || empty($queryParams->tokenDetails->dc)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }

        if (isset($queryParams->module) && ($queryParams->module == 'add_tag_to_a_member' || $queryParams->module == 'remove_tag_from_a_member')) {
            $fields['Email'] = (object) ['tag' => 'email_address', 'name' => 'Email', 'required' => true];
            $response['audienceField'] = $fields;
            wp_send_json_success($response);

            return;
        }

        $apiEndpoint = self::apiEndPoint($queryParams->tokenDetails->dc) . "/lists/{$queryParams->listId}/merge-fields?count=1000&offset=0";
        $authorizationHeader['Authorization'] = "Bearer {$queryParams->tokenDetails->access_token}";
        $mergeFieldResponse = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $fields = [];
        if (!is_wp_error($mergeFieldResponse)) {
            $allFields = $mergeFieldResponse->merge_fields;
            foreach ($allFields as $field) {
                if ($field->name === 'Address') {
                    continue;
                }
                $fields[$field->tag] = (object) [
                    'tag'      => $field->tag,
                    'name'     => $field->name,
                    'required' => $field->required ?? false
                ];
            }
            $fields['Email'] = (object) ['tag' => 'email_address', 'name' => 'Email', 'required' => true];
            $response['audienceField'] = $fields;
            wp_send_json_success($response);
        }
    }

    /**
     * Process ajax request for refresh MailChimp Tags
     *
     * @param $queryParams Prams to refresh tag
     *
     * @return JSON MailChimp Tags
     */
    public static function refreshTags($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->listId)
            || empty($queryParams->tokenDetails->dc)
        ) {
            wp_send_json_error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = self::apiEndPoint($queryParams->tokenDetails->dc) . "/lists/{$queryParams->listId}/segments?count=1000&offset=0";
        $authorizationHeader['Authorization'] = "Bearer {$queryParams->tokenDetails->access_token}";
        $tagsList = HttpHelper::get($apiEndpoint, null, $authorizationHeader);

        $allList = [];
        foreach ($tagsList->segments as $tag) {
            $allList[$tag->name] = (object) [
                'tagId'   => $tag->id,
                'tagName' => $tag->name
            ];
        }
        uksort($allList, 'strnatcasecmp');
        $response['audienceTags'] = $allList;
        wp_send_json_success($response);
    }

    /**
     * Save updated access_token to avoid unnecessary token generation
     *
     * @param object $integrationData Details of flow
     * @param array  $fieldValues     Data to send Mail Chimp
     *
     * @return null
     */
    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;

        $tokenDetails = $integrationDetails->tokenDetails;
        $listId = $integrationDetails->listId;
        $module = isset($integrationDetails->module) ? $integrationDetails->module : '';
        $tags = $integrationDetails->tags;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        $defaultDataConf = $integrationDetails->default;
        $addressFields = $integrationDetails->address_field;

        if (
            empty($tokenDetails)
            || empty($listId)
            || empty($fieldMap)
            || empty($defaultDataConf)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Mail Chimp'));
        }
        $recordApiHelper = new RecordApiHelper($tokenDetails, $this->_integrationID, $integrationDetails);
        $mChimpApiResponse = $recordApiHelper->execute(
            $listId,
            $module,
            $tags,
            $defaultDataConf,
            $fieldValues,
            $fieldMap,
            $actions,
            $addressFields
        );

        if (is_wp_error($mChimpApiResponse)) {
            return $mChimpApiResponse;
        }

        return $mChimpApiResponse;
    }
}
