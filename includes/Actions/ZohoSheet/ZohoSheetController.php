<?php

namespace BitCode\FI\Actions\ZohoSheet;

use WP_Error;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\controller\ZohoAuthController;
use BitCode\FI\Actions\ZohoSheet\RecordApiHelper;

class ZohoSheetController
{
    private $integrationID;

    public function __construct($integrationID)
    {
        $this->integrationID = $integrationID;
    }

    public static function getAllWorkbooks($requestParams)
    {
        if (
            empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret)
            || empty($requestParams->dataCenter)
        ) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret, $requestParams->dataCenter);
        $headers = [
            'Authorization' => 'Zoho-oauthtoken ' . $token->access_token,
        ];

        $apiEndpoint = "https://sheet.{$requestParams->dataCenter}/api/v2/workbooks?method=workbook.list";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($apiResponse->workbooks) && !empty($apiResponse->workbooks)) {
            foreach ($apiResponse->workbooks as $workbook) {
                $workbooks[] = [
                    'id'   => $workbook->resource_id,
                    'name' => $workbook->workbook_name
                ];
            }
            wp_send_json_success($workbooks, 200);
        } else {
            wp_send_json_error('Workbooks fetching failed', 400);
        }
    }

    public static function getAllWorksheets($requestParams)
    {
        if (
            empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret)
            || empty($requestParams->dataCenter) || empty($requestParams->workbook)
        ) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret, $requestParams->dataCenter);
        $headers = [
            'Authorization' => 'Zoho-oauthtoken ' . $token->access_token,
        ];

        $apiEndpoint = "https://sheet.{$requestParams->dataCenter}/api/v2/{$requestParams->workbook}?method=worksheet.list";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($apiResponse->worksheet_names) && !empty($apiResponse->worksheet_names)) {
            foreach ($apiResponse->worksheet_names as $worksheet) {
                $worksheets[] = [
                    'id'   => $worksheet->worksheet_name,
                    'name' => $worksheet->worksheet_name
                ];
            }
            wp_send_json_success($worksheets, 200);
        } else {
            wp_send_json_error('Workbooks fetching failed', 400);
        }
    }

    public static function getWorksheetHeader($requestParams)
    {
        if (
            empty($requestParams->tokenDetails) || empty($requestParams->clientId) || empty($requestParams->clientSecret)
            || empty($requestParams->dataCenter) || empty($requestParams->workbook) || empty($requestParams->worksheet)
            || empty($requestParams->headerRow)
        ) {
            wp_send_json_error(__('Requested parameter is empty', 'bit-integrations'), 400);
        }

        $token = self::tokenExpiryCheck($requestParams->tokenDetails, $requestParams->clientId, $requestParams->clientSecret, $requestParams->dataCenter);
        $headers = [
            'Authorization' => 'Zoho-oauthtoken ' . $token->access_token,
        ];

        $apiEndpoint = "https://sheet.{$requestParams->dataCenter}/api/v2/{$requestParams->workbook}?method=worksheet.records.fetch&worksheet_name={$requestParams->worksheet}&count=1&header_row={$requestParams->headerRow}";
        $apiResponse = HttpHelper::get($apiEndpoint, null, $headers);

        if (isset($apiResponse->records)) {
            if (!empty($apiResponse->records)) {
                $allHeaders = array_diff(array_keys((array) $apiResponse->records[0]), ['row_index']);
                foreach ($allHeaders as $header) {
                    $sheetHeaders[] = [
                        'key'      => $header,
                        'label'    => $header,
                        'required' => false
                    ];
                }
                wp_send_json_success($sheetHeaders, 200);
            } else {
                wp_send_json_error(__('No header found', 'bit-integrations'), 400);
            }
        } else {
            wp_send_json_error(__('Header fetching failed', 'bit-integrations'), 400);
        }
    }

    protected static function tokenExpiryCheck($token, $clientId, $clientSecret, $dataCenter)
    {
        if (!$token) {
            return false;
        }

        if ((intval($token->generates_on) + (55 * 60)) < time()) {
            $refreshToken = ZohoAuthController::_refreshAccessToken($token->refresh_token, $clientId, $clientSecret, $dataCenter);
            if (is_wp_error($refreshToken) || !empty($refreshToken->error)) {
                return false;
            }
            $token->access_token = $refreshToken->access_token;
            $token->expires_in = $refreshToken->expires_in;
            $token->generates_on = $refreshToken->generates_on;
        }

        return $token;
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId            = $integrationData->id;
        $fieldMap           = $integrationDetails->field_map;
        $tokenDetails       = self::tokenExpiryCheck($integrationDetails->tokenDetails, $integrationDetails->clientId, $integrationDetails->clientSecret, $integrationDetails->dataCenter);
        if ($tokenDetails->access_token !== $integrationDetails->tokenDetails->access_token) {
            ZohoAuthController::_saveRefreshedToken($this->integrationID, $tokenDetails);
        }

        if (empty($fieldMap) || empty($tokenDetails)) {
            return new WP_Error('REQ_FIELD_EMPTY', __('Field map, token details are required for ZohoSheet api', 'bit-integrations'));
        }

        $recordApiHelper   = new RecordApiHelper($integrationDetails, $integId, $tokenDetails->access_token);
        $zohoSheetApiResponse = $recordApiHelper->execute($fieldValues, $fieldMap);

        if (is_wp_error($zohoSheetApiResponse)) {
            return $zohoSheetApiResponse;
        }
        return $zohoSheetApiResponse;
    }
}
