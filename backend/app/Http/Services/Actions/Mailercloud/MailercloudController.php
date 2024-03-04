<?php

/**
 * Mailercloud Integration
 */

namespace BitApps\BTCBI\Http\Services\Actions\Mailercloud;

use WP_Error;
use BTCBI\Deps\BitApps\WPKit\Http\Client\Http;
use BitApps\BTCBI\Http\Services\Actions\Mailercloud\RecordApiHelper;
use BTCBI\Deps\BitApps\WPKit\Http\Response;

/**
 * Provide functionality for Mailercloud integration
 */

class MailercloudController
{
    private $baseUrl = 'https://cloudapi.mailercloud.com/v1/';

    public function handleAuthorize($requestParams)
    {
        if (empty($requestParams->authKey)) {
            return Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = $this->baseUrl . 'client/plan' ;
        $headers = [
          'Content-Type' => 'application/json',
          'Authorization' => $requestParams->authKey
        ];
        $response = Http::request($apiEndpoint, 'Get', null, $headers);
        if ($response->code === "invalid_api_key") {
            return Response::error(
                __(
                    'Invalid token',
                    'bit-integrations'
                ),
                400
            );
        }
        return Response::success($response);
    }

    public function getAllLists($requestParams)
    {
        if (empty($requestParams->authKey)) {
            return Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = $this->baseUrl . 'lists/search' ;
        $headers = [
          'Content-Type' => 'application/json',
          'Authorization' => $requestParams->authKey
        ];
        $body = [
            "limit" => 100,
            "page" => 1
        ];
        $response = Http::request($apiEndpoint, 'Post', json_encode($body), $headers);

        if ($response->code === "invalid_api_key") {
            return Response::error(
                __(
                    'Invalid token',
                    'bit-integrations'
                ),
                400
            );
        }

        return Response::success($response);
    }

    public function getAllFields($requestParams)
    {
        if (empty($requestParams->authKey)) {
            return Response::error(
                __(
                    'Requested parameter is empty',
                    'bit-integrations'
                ),
                400
            );
        }
        $apiEndpoint = $this->baseUrl . 'contact/property/search' ;
        $headers = [
          'Content-Type' => 'application/json',
          'Authorization' => $requestParams->authKey
        ];
        $body = [
            "limit" => 100,
            "page" => 1
        ];
        $response = Http::request($apiEndpoint, 'Post', json_encode($body), $headers);

        if ($response->code === "invalid_api_key") {
            return Response::error(
                __(
                    'Invalid token',
                    'bit-integrations'
                ),
                400
            );
        }
        $fields = [];
        $staticFieldsKeys = ['city', 'country', "details", 'department', 'dob', 'email', 'industry', 'job_title', 'last_name', 'lead_source', 'middle_name', 'name', 'organization', 'phone', 'salary', 'state', 'zip','contact_type', 'list_id' , 'lead_source' , 'userip'];
        foreach ($response->data as $key => $field) {
            if (in_array($field->field_value, $staticFieldsKeys)) {
                $fields[] = (object) [
                    'label' => $field->field_name,
                    'key' => $field->field_value ,
                    'required' => $field->field_value == 'email' ? true : false ,
                ];
            } else {
                $fields[] = (object) [
                    'label' => $field->field_name,
                    'key' => $field->id ,
                    'required' => $field->field_value == 'email' ? true : false ,
                ];
            }
        }

        return Response::success($fields);
    }


    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $authKey = $integrationDetails->authKey;
        $listId = $integrationDetails->listId;
        $contactType = $integrationDetails->contactType;
        $field_map = $integrationDetails->field_map;

        if (
            empty($field_map)
             || empty($authKey)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for mailercloud api', 'bit-integrations'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $mailercloudApiResponse = $recordApiHelper->execute(
            $listId,
            $contactType,
            $fieldValues,
            $field_map,
            $authKey
        );

        if (is_wp_error($mailercloudApiResponse)) {
            return $mailercloudApiResponse;
        }
        return $mailercloudApiResponse;
    }
}