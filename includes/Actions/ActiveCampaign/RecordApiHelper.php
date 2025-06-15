<?php

/**
 * Active Campaign Record Api
 */

namespace BitCode\FI\Actions\ActiveCampaign;

use BitCode\FI\Core\Util\HttpHelper;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert,update, exist
 */
class RecordApiHelper
{
    private $_defaultHeader;

    private $_integrationID;

    private $_apiEndpoint;

    public function __construct($api_key, $api_url, $integId)
    {
        // wp_send_json_success($tokenDetails);
        $this->_defaultHeader['Api-Token'] = $api_key;
        $this->_apiEndpoint = $api_url . '/api/3';
        $this->_integrationID = $integId;
    }

    // for insert data
    public function storeOrModifyRecord($method, $data)
    {
        $insertRecordEndpoint = "{$this->_apiEndpoint}/{$method}";

        return HttpHelper::post($insertRecordEndpoint, $data, $this->_defaultHeader);
    }

    public function updateRecord($id, $data, $existContact)
    {
        $contactData = $data['contact'];
        foreach ($contactData as $key => $value) {
            if ($value === '') {
                $contactData->{$key} = $existContact->contacts[0]->{$key};
            }
        }

        $updateRecordEndpoint = "{$this->_apiEndpoint}/contacts/{$id}";

        return HttpHelper::request($updateRecordEndpoint, 'PUT', wp_json_encode($data), $this->_defaultHeader);
    }

    public function execute($integrationDetails, $fieldValues, $fieldMap, $actions, $listId, $tags)
    {
        $fieldData = [];
        $customFields = [];

        foreach ($fieldMap as $fieldKey => $fieldPair) {
            if (!empty($fieldPair->activeCampaignField)) {
                if ($fieldPair->formField === 'custom' && isset($fieldPair->customValue) && !is_numeric($fieldPair->activeCampaignField)) {
                    $fieldData[$fieldPair->activeCampaignField] = $fieldPair->customValue;
                } elseif (is_numeric($fieldPair->activeCampaignField) && $fieldPair->formField === 'custom' && isset($fieldPair->customValue)) {
                    $customFields[] = ['field' => (int) $fieldPair->activeCampaignField, 'value' => $fieldPair->customValue];
                } elseif (is_numeric($fieldPair->activeCampaignField)) {
                    $customFields[] = ['field' => (int) $fieldPair->activeCampaignField, 'value' => $fieldValues[$fieldPair->formField]];
                } else {
                    $fieldData[$fieldPair->activeCampaignField] = $fieldValues[$fieldPair->formField];
                }
            }
        }

        if (!empty($customFields)) {
            $fieldData['fieldValues'] = $customFields;
        }
        $activeCampaign['contact'] = (object) $fieldData;
        $existContact = $this->existContact($activeCampaign['contact']->email);

        $type = 'notSet';
        $updateContact = $actions->update;
        if (!$updateContact && empty($existContact->contacts)) {
            $recordApiResponse = $this->storeOrModifyRecord('contacts', wp_json_encode($activeCampaign));
            $type = 'insert';
            if (isset($recordApiResponse->contact)) {
                $recordApiResponse = ['success' => true, 'id' => $recordApiResponse->contact->id];
                if (isset($listId) && !empty($listId)) {
                    $data['contactList'] = (object) [
                        'list'    => $listId,
                        'contact' => $recordApiResponse['id'],
                        'status'  => 1
                    ];
                    $this->storeOrModifyRecord('contactLists', wp_json_encode($data));
                }
                if (isset($tags) && !empty($tags)) {
                    foreach ($tags as $tag) {
                        $data['contactTag'] = (object) [
                            'contact' => $recordApiResponse['id'],
                            'tag'     => $tag
                        ];
                        $this->storeOrModifyRecord('contactTags', wp_json_encode($data));
                    }
                }
                if (isset($integrationDetails->selectedAccount) && !empty($integrationDetails->selectedAccount)) {
                    $data['accountContact'] = [
                        'account' => $listId,
                        'contact' => $recordApiResponse['id'],
                    ];
                    if (isset($integrationDetails->job_title)) {
                        $data['accountContact'] += ['jobTitle' => $integrationDetails->job_title];
                    }
                    $this->storeOrModifyRecord('accountContacts', wp_json_encode((object) $data));
                }
            }
        } elseif ($updateContact && !empty($existContact->contacts)) {
            $recordApiResponse = $this->updateRecord($existContact->contacts[0]->id, $activeCampaign, $existContact);
            if (isset($tags) && !empty($tags)) {
                foreach ($tags as $tag) {
                    $data['contactTag'] = (object) [
                        'contact' => $recordApiResponse->contact->id,
                        'tag'     => $tag
                    ];
                    $this->storeOrModifyRecord('contactTags', wp_json_encode($data));
                }
            }
            if (isset($recordApiResponse->contact)) {
                $recordApiResponse = ['success' => true, 'id' => $recordApiResponse->contact->id];
            }
            if (isset($integrationDetails->selectedAccount) && !empty($integrationDetails->selectedAccount)) {
                $data['accountContact'] = [
                    'account' => $listId,
                    'contact' => $recordApiResponse->contact->id,
                ];
                if (isset($integrationDetails->job_title)) {
                    $data['accountContact'] += ['jobTitle' => $integrationDetails->job_title];
                }
                $this->storeOrModifyRecord('accountContacts', wp_json_encode((object) $data));
            }
            $type = 'update';
        } elseif ($updateContact && empty($existContact->contacts)) {
            $recordApiResponse = $this->storeOrModifyRecord('contacts', wp_json_encode($activeCampaign));
            $type = 'insert';
            if (isset($recordApiResponse->contact)) {
                $recordApiResponse = ['success' => true, 'id' => $recordApiResponse->contact->id];
                if (isset($listId) && !empty($listId)) {
                    $data['contactList'] = (object) [
                        'list'    => $listId,
                        'contact' => $recordApiResponse['id'],
                        'status'  => 1
                    ];
                    $this->storeOrModifyRecord('contactLists', wp_json_encode($data));
                }
                if (isset($tags) && !empty($tags)) {
                    foreach ($tags as $tag) {
                        $data['contactTag'] = (object) [
                            'contact' => $recordApiResponse['id'],
                            'tag'     => $tag
                        ];
                        $this->storeOrModifyRecord('contactTags', wp_json_encode($data));
                    }
                }
                if (isset($integrationDetails->selectedAccount) && !empty($integrationDetails->selectedAccount)) {
                    $data['accountContact'] = [
                        'account' => $listId,
                        'contact' => $recordApiResponse['id'],
                    ];
                    if (isset($integrationDetails->job_title)) {
                        $data['accountContact'] += ['jobTitle' => $integrationDetails->job_title];
                    }
                    $this->storeOrModifyRecord('accountContacts', wp_json_encode((object) $data));
                }
            }
        }

        if ($type === 'notSet') {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => 'insert'], 'error', __('Email already exist', 'bit-integrations'));

            return false;
        }
        if ($recordApiResponse && isset($recordApiResponse->errors)) {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'error', $recordApiResponse->errors);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'record', 'type_name' => $type], 'success', $recordApiResponse);
        }

        return $recordApiResponse;
    }

    private function existContact($email)
    {
        $searchEndPoint = "{$this->_apiEndpoint}/contacts?email={$email}";

        return HttpHelper::get($searchEndPoint, null, $this->_defaultHeader);
    }
}
