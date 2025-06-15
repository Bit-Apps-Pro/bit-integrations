<?php

/**
 * ZohoRecruit Integration
 */

namespace BitCode\FI\Actions\ZohoRecruit;

use WP_Error;
use BitCode\FI\Flow\FlowController;
use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\controller\ZohoAuthController;

/**
 * Provide functionality for ZohoCrm integration
 */
class ZohoRecruitController
{
    private $_integrationID;

    public function __construct($integrationID)
    {
        $this->_integrationID = $integrationID;
    }

    /**
     * Process ajax request for refresh recruit modules
     *
     * @param Object $queryParams Params to refresh module
     *
     * @return JSON recruit module data
     */
    public static function refreshModules($queryParams)
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
        $zohosIntegratedModules = [
            'zohosign__ZohoSign_Document_Events',
            'zohoshowtime__ShowTime_Sessions',
            'zohoshowtime__Zoho_ShowTime',
            'zohosign__ZohoSign_Documents',
            'zohosign__ZohoSign_Recipients'
        ];
        $modulesMetaApiEndpoint = "https://recruit.{$queryParams->dataCenter}/recruit/private/json/Info/getModules?authtoken={$queryParams->tokenDetails->access_token}&scope=ZohoRecruit.modules.all&version=2";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $modulesMetaResponse = HttpHelper::get($modulesMetaApiEndpoint, null, $authorizationHeader);
        if (!is_wp_error($modulesMetaResponse) && (empty($modulesMetaResponse->status) || (!empty($modulesMetaResponse->status) && $modulesMetaResponse->status !== 'error'))) {
            $retriveModuleData = $modulesMetaResponse->response->result->row;
            $allModules = [
                'Tasks' => (object) [
                    'aMod' => 'Tasks',
                    'pl' => 'Tasks'
                ],
                'Events' => (object) [
                    'aMod' => 'Events',
                    'pl' => 'Events'
                ],
                'Calls' => (object) [
                    'aMod' => 'Calls',
                    'pl' => 'Calls'
                ],
            ];
            foreach ($retriveModuleData as $value) {
                if (preg_match('/CustomModule/', $value->aMod) || preg_match('/Candidates/', $value->aMod)) {
                    $allModules[$value->aMod] = (object) [
                        'aMod' => $value->aMod,
                        'pl' => $value->pl
                    ];
                }
            }
            uksort($allModules, 'strnatcasecmp');
            $response['modules'] = $allModules;
        } else {
            wp_send_json_error(
                empty($modulesMetaResponse->error) ? 'Unknown' : $modulesMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response['modules']);
        }
        wp_send_json_success($response, 200);
    }

    public static function refreshNoteTypes($queryParams)
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

        $notesMetaApiEndpoint = "https://recruit.{$queryParams->dataCenter}/recruit/private/json/Notes/getNoteTypes?authtoken={$queryParams->tokenDetails->access_token}&scope=ZohoRecruit.modules.call.all&version=2";

        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $notesMetaResponse = HttpHelper::get($notesMetaApiEndpoint, null, $authorizationHeader);

        // wp_send_json_success($notesMetaResponse, 200);

        if (!is_wp_error($notesMetaResponse) && (empty($notesMetaResponse->status) || (!empty($notesMetaResponse->status) && $notesMetaResponse->status !== 'error'))) {
            $retriveModuleData = $notesMetaResponse->response->result->Notes->row;
            $allNoteTypes = [];
            foreach ($retriveModuleData as $value) {
                $allNoteTypes[$value->FL[0]->dv] = (object) [
                    'noteTypeId' => $value->FL[1]->content,
                    'noteTypeName' => $value->FL[0]->dv
                ];
            }
            uksort($allNoteTypes, 'strnatcasecmp');
            $response['noteTypes'] = $allNoteTypes;
        } else {
            wp_send_json_error(
                empty($notesMetaResponse->error) ? 'Unknown' : $notesMetaResponse->error,
                400
            );
        }
        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response['notetypes']);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh recruit modules
     *
     * @return JSON recruit module data
     */
    public static function refreshRelatedModules($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->module)
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
        $relatedModules = [];
        $allModules = [
            'Tasks' => (object) [
                'aMod' => 'Tasks',
                'pl' => 'Tasks'
            ],
            'Events' => (object) [
                'aMod' => 'Events',
                'pl' => 'Events'
            ],
            'Calls' => (object) [
                'aMod' => 'Calls',
                'pl' => 'Calls'
            ],
            // 'Notes' => (object) array(
            //     'aMod' => 'Notes',
            //     'pl' => 'Notes'
            // ),
        ];
        foreach ($allModules as $module) {
            if ($module->aMod !== $queryParams->module) {
                $relatedModules[$module->aMod] = (object) [
                    'aMod' => $module->aMod,
                    'pl' => $module->pl
                ];
            }
        }
        uksort($relatedModules, 'strnatcasecmp');
        $response['related_modules'] = $relatedModules;

        if (!empty($response['tokenDetails']) && !empty($queryParams->id)) {
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response['related_modules']);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh users
     *
     * @param $queryParams Mandatory params
     *
     * @return JSON crm users data
     */
    public static function refreshUsers($queryParams)
    {
        if (
            empty($queryParams->tokenDetails)
            || empty($queryParams->dataCenter)
            || empty($queryParams->clientId)
            || empty($queryParams->clientSecret)
            || empty($queryParams->module)
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
        $usersApiEndpoint                       = "https://recruit.{$queryParams->dataCenter}/recruit/v2/users?type=AllUsers";
        $authorizationHeader['Authorization']   = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $requiredParams['module']               = $queryParams->module;
        // $usersResponse                          = HttpHelper::get($usersApiEndpoint, $requiredParams, $authorizationHeader);

        $retrivedUsersData  = [];
        $usersResponse      = null;
        do {
            $requiredParams = [];
            if ($usersResponse instanceof \stdClass && !empty($usersResponse->users)) {
                if (!empty($retrivedUsersData)) {
                    $retrivedUsersData = array_merge($retrivedUsersData, $usersResponse->users);
                } else {
                    $retrivedUsersData = $usersResponse->users;
                }
            }
            if ($usersResponse instanceof \stdClass && !empty($usersResponse->info->more_records) && $usersResponse->info->more_records) {
                $requiredParams["page"] = intval($usersResponse->info->page) + 1;
            }
            $usersResponse = HttpHelper::get($usersApiEndpoint, $requiredParams, $authorizationHeader);
        } while ($usersResponse == null || (!empty($usersResponse->info->more_records) && $usersResponse->info->more_records));

        if (empty($requiredParams) && !is_wp_error($usersResponse)) {
            $retrivedUsersData = $usersResponse->users;
        }
        if (!is_wp_error($usersResponse) && !empty($retrivedUsersData)) {
            $users = [];
            foreach ($retrivedUsersData as $userKey => $userValue) {
                $users[$userValue->full_name] = (object) array(
                    'id'        => $userValue->id,
                    'full_name' => $userValue->full_name,
                );
            }
            uksort($users, 'strnatcasecmp');
            $response["users"] = $users;
        } else {
            wp_send_json_error(
                $usersResponse->status === 'error' ? $usersResponse->message : 'Unknown',
                400
            );
        }
        if (!empty($response['tokenDetails']) && $response['tokenDetails'] && !empty($queryParams->id)) {
            $response['queryModule'] = $queryParams->module;
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response);
        }
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refesh recruit layouts
     *
     * @return JSON recruit layout data
     */
    public static function getFields($queryParams)
    {
        if (
            empty($queryParams->module)
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
        $fieldsMetaApiEndpoint = "https://recruit.{$queryParams->dataCenter}/recruit/private/json/{$queryParams->module}/getFields?authtoken={$queryParams->tokenDetails->access_token}&scope=recruitapi&version=2";
        $authorizationHeader['Authorization'] = "Zoho-oauthtoken {$queryParams->tokenDetails->access_token}";
        $requiredParams['module'] = $queryParams->module;
        $fieldsMetaResponse = HttpHelper::get($fieldsMetaApiEndpoint, $requiredParams, $authorizationHeader);

        if (!is_wp_error($fieldsMetaResponse) && (empty($fieldsMetaResponse->status) || (!empty($fieldsMetaResponse->status) && $fieldsMetaResponse->status !== 'error'))) {
            $retriveFieldsData = $fieldsMetaResponse->{$queryParams->module}->section;
            if (!is_array($retriveFieldsData)) {
                $retriveFieldsData = [$retriveFieldsData];
            }
            $fields = [];
            $fileUploadFields = [];
            $requiredFields = [];
            $requiredFileUploadFiles = [];
            if ($queryParams->module === 'Candidates') {
                $fileUploadFields['Candidate Photo'] = (object) [
                    'display_label' => 'Candidate Profile Photo',
                    'length' => 1000,
                    'data_type' => 'UploadText',
                    'required' => 'false'
                ];
            }
            if (count($retriveFieldsData)) {
                foreach ($retriveFieldsData as $fieldValue) {
                    foreach ($fieldValue->FL as $sectionValue) {
                        if ($sectionValue->dv === null) {
                            continue;
                        }
                        if ($sectionValue->type === 'UploadText') {
                            $fileUploadFields[$sectionValue->dv] = (object) [
                                'display_label' => $sectionValue->dv,
                                'length' => $sectionValue->maxlength,
                                'data_type' => $sectionValue->type,
                                'required' => $sectionValue->req
                            ];
                            if ($sectionValue->req === 'true') {
                                $requiredFileUploadFiles[] = $sectionValue->dv;
                            }
                        } else {
                            $fields[$sectionValue->dv] = (object) [
                                'display_label' => $sectionValue->dv,
                                'length' => $sectionValue->maxlength,
                                'data_type' => $sectionValue->type,
                                'required' => $sectionValue->req
                            ];
                            if ($sectionValue->req === 'true') {
                                $requiredFields[] = $sectionValue->dv;
                            }
                        }
                    }
                }
            } else {
                foreach ($retriveFieldsData->FL as $sectionValue) {
                    if ($sectionValue->dv === null) {
                        continue;
                    }
                    if ($sectionValue->aMod === 'Candidates') {
                        $fileUploadFields[$sectionValue->dv] = (object) [
                            'display_label' => 'Candidate Profile Photo',
                            'length' => 1000,
                            'data_type' => 'UploadText',
                            'required' => 'false'
                        ];
                    }
                    if ($sectionValue->type === 'UploadText') {
                        $fileUploadFields[$sectionValue->dv] = (object) [
                            'display_label' => $sectionValue->dv,
                            'length' => $sectionValue->maxlength,
                            'data_type' => $sectionValue->type,
                            'required' => $sectionValue->req
                        ];
                        if ($sectionValue->req === 'true') {
                            $requiredFileUploadFiles[] = $sectionValue->dv;
                        }
                    } else {
                        $fields[$sectionValue->dv] = (object) [
                            'display_label' => $sectionValue->dv,
                            'length' => $sectionValue->maxlength,
                            'data_type' => $sectionValue->type,
                            'required' => $sectionValue->req
                        ];
                        if ($sectionValue->req === 'true') {
                            $requiredFields[] = $sectionValue->dv;
                        }
                    }
                }
            }

            if ($queryParams->module === 'Candidates' && isset($fields['Zip/Postal Code'])) {
                $fields['Zip Code'] = $fields['Zip/Postal Code'];
                unset($fields['Zip/Postal Code']);
            }

            uksort($fields, 'strnatcasecmp');
            uksort($fileUploadFields, 'strnatcasecmp');
            usort($requiredFields, 'strnatcasecmp');
            usort($requiredFileUploadFiles, 'strnatcasecmp');

            $fieldDetails = (object) [
                'fields' => $fields,
                'fileUploadFields' => $fileUploadFields,
                'required' => $requiredFields,
                'requiredFileUploadFields' => $requiredFileUploadFiles
            ];
            $response['fieldDetails'] = $fieldDetails;
        } else {
            wp_send_json_error(
                $fieldsMetaResponse->status === 'error' ? $fieldsMetaResponse->message : 'Unknown',
                400
            );
        }
        if (!empty($response['tokenDetails']) && $response['tokenDetails'] && !empty($queryParams->id)) {
            $response['queryModule'] = $queryParams->module;
            ZohoAuthController::_saveRefreshedToken($queryParams->id, $response['tokenDetails'], $response);
        }
        wp_send_json_success($response, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $tokenDetails = $integrationDetails->tokenDetails;
        $module = $integrationDetails->module;
        $fieldMap = $integrationDetails->field_map;
        $actions = $integrationDetails->actions;
        $defaultDataConf = $integrationDetails->default;
        if (
            empty($tokenDetails)
            || empty($module)
            || empty($fieldMap)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for zoho recruit api', 'bit-integrations'));
        }
        if (empty($defaultDataConf->moduleData->{$module}->fields) || empty($defaultDataConf->modules->{$module})) {
            return new WP_Error('REQ_FIELD_EMPTY', __('module, fields are required for zoho recruit api', 'bit-integrations'));
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

        $required = !empty($defaultDataConf->moduleData->{$module}->required) ?
            $defaultDataConf->moduleData->{$module}->required : [];

        $actions = $integrationDetails->actions;
        $fileMap = $integrationDetails->upload_field_map;
        $dataCenter = $integrationDetails->dataCenter;
        $recordApiHelper = new RecordApiHelper($dataCenter, $tokenDetails, $this->_integrationID);
        $zRecruitApiResponse = $recordApiHelper->execute(
            $defaultDataConf,
            $module,
            $fieldValues,
            $fieldMap,
            $actions,
            $required,
            $fileMap
        );
        if (is_wp_error($zRecruitApiResponse)) {
            return $zRecruitApiResponse;
        }

        if (
            count($integrationDetails->relatedlists)
            && !empty($zRecruitApiResponse->response->result->row->success->details->FL[0])
            && $zRecruitApiResponse->response->result->row->success->details->FL[0]->val === 'Id'
        ) {
            foreach ($integrationDetails->relatedlists as $relatedlist) {
                if (!empty($relatedlist->module)) {
                    $recordID = $zRecruitApiResponse->response->result->row->success->details->FL[0]->content;
                    $relatedListModule = $relatedlist->module;
                    $defaultDataConf->moduleData->{$relatedListModule}->fields->{'SEMODULE'} = (object) [
                        'length' => \strlen($relatedListModule),
                        'required' => true,
                        'data_type' => 'string',
                    ];
                    $fieldValues['SEMODULE'] = $relatedListModule;
                    $relatedlist->field_map[] = (object)
                    [
                        'formField' => 'SEMODULE',
                        'zohoFormField' => 'SEMODULE'
                    ];

                    $defaultDataConf->moduleData->{$relatedListModule}->fields->{'SEID'} = (object) [
                        'length' => \strlen($recordID),
                        'required' => true,
                        'data_type' => 'string',
                    ];
                    $fieldValues['SEID'] = $recordID;
                    $relatedlist->field_map[] = (object)
                    [
                        'formField' => 'SEID',
                        'zohoFormField' => 'SEID'
                    ];

                    $zRecruitRelatedRecResp = $recordApiHelper->execute(
                        $this->_formID,
                        $entryID,
                        $defaultDataConf,
                        $relatedListModule,
                        $fieldValues,
                        $relatedlist->field_map,
                        $relatedlist->actions,
                        !empty($defaultDataConf->moduleData->{$relatedListModule}->required) ?
                            $defaultDataConf->moduleData->{$relatedListModule}->required : [],
                        $relatedlist->upload_field_map
                    );
                }
            }
        }
        return $zRecruitApiResponse;
    }
}
