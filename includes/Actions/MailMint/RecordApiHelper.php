<?php

namespace BitCode\FI\Actions\MailMint;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use Mint\MRM\DataStores\ContactData;
use Mint\MRM\DataBase\Models\ContactModel;
use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\Admin\API\Controllers\MessageController;

class RecordApiHelper
{
    private static $integrationID;
    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        self::$integrationID = $integId;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $value) {
            $triggerValue               = $value->formField;
            $actionValue                = $value->mailMintFormField;
            $isDataTriggerValueSet      = isset($data[$triggerValue]);
            $containsCustomMetaField    = str_contains($actionValue, 'custom_meta_field_');

            if ($containsCustomMetaField) {
                $customFieldKey = str_replace('custom_meta_field_', '', $actionValue);
            }

            if ($triggerValue === 'custom') {
                if ($containsCustomMetaField) {
                    $dataFinal['meta_fields'][$customFieldKey] = Common::replaceFieldWithValue($value->customValue, $data);
                } else {
                    $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
                }
            } elseif ($isDataTriggerValueSet) {
                if ($containsCustomMetaField) {
                    $dataFinal['meta_fields'][$customFieldKey] = $data[$triggerValue];
                } else {
                    $dataFinal[$actionValue] = $data[$triggerValue];
                }
            }
        }
        return $dataFinal;
    }

    public function listFormat($selectedList)
    {
        $allLists = [];
        if (class_exists('Mint\MRM\DataBase\Models\ContactGroupModel')) {
            $listData = ContactGroupModel::get_all('lists');
            if (!empty($listData)) {
                foreach ($listData['data'] as $list) {
                    if (in_array($list['id'], $selectedList)) {
                        $allLists[] = [
                            'id' => $list['id'],
                            'name' => $list['title'],
                        ];
                    }
                }
            }
        }
        return $allLists;
    }

    public function tagFormat($selectedTags)
    {
        $allTags = [];
        if (class_exists('Mint\MRM\DataBase\Models\ContactGroupModel')) {
            $tagData = ContactGroupModel::get_all('tags');
            if (!empty($tagData)) {
                foreach ($tagData['data'] as $list) {
                    if (in_array($list['id'], $selectedTags)) {
                        $allTags[] = [
                            'id' => $list['id'],
                            'name' => $list['title'],
                        ];
                    }
                }
            }
        }
        return $allTags;
    }

    public function createContact($selectedList, $selectedTags, $selectedSubStatus, $finalData)
    {
        $selectedList   = explode(',', $selectedList);
        $selectedTags   = explode(',', $selectedTags);
        $listFormat     = $this->listFormat($selectedList);
        $tagFormat      = $this->tagFormat($selectedTags);

        $finalData['status']        = $selectedSubStatus;
        $finalData['_locale']       = 'user';
        $finalData['created_by']    = get_current_user_id();

        $contact_id = null;
        if (class_exists('Mint\MRM\DataStores\ContactData') && class_exists('Mint\MRM\DataBase\Models\ContactModel')) {
            $contact    = new ContactData($finalData['email'], $finalData);
            $contact_id = ContactModel::insert($contact);

            if ('pending' === $selectedSubStatus) {
                MessageController::get_instance()->send_double_opt_in($contact_id);
            }

            if (isset($tagFormat)) {
                ContactGroupModel::set_tags_to_contact($tagFormat, $contact_id);
            }

            if (isset($listFormat)) {
                ContactGroupModel::set_lists_to_contact($listFormat, $contact_id);
            }
        }
        return $contact_id;
    }

    public function updateContact($selectedList, $selectedTags, $selectedSubStatus, $finalData, $contact_id)
    {
        $selectedList = explode(',', $selectedList);
        $selectedTags = explode(',', $selectedTags);

        $listFormat = $this->listFormat($selectedList);
        $tagFormat = $this->tagFormat($selectedTags);

        $finalData['_locale'] = 'user';
        $finalData['status'] = $selectedSubStatus;
        $finalData['created_by'] = get_current_user_id();

        if (class_exists('Mint\MRM\DataStores\ContactData') && class_exists('Mint\MRM\DataBase\Models\ContactModel')) {
            $contact_id = ContactModel::update($finalData, $contact_id);
            if ('pending' === $selectedSubStatus) {
                MessageController::get_instance()->send_double_opt_in($contact_id);
            }

            if (isset($tagFormat)) {
                ContactGroupModel::set_tags_to_contact($tagFormat, $contact_id);
            }

            if (isset($listFormat)) {
                ContactGroupModel::set_lists_to_contact($listFormat, $contact_id);
            }
        }
        return $contact_id;
    }


    public function execute(
        $mainAction,
        $fieldValues,
        $fieldMap,
        $integrationDetails
    ) {
        $fieldData = [];
        $apiResponse = null;
        $update = $integrationDetails->update;
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $contactExist = ContactModel::is_contact_exist($finalData['email']);
        if ($mainAction === '1' && !$contactExist) {
            $selectedList = $integrationDetails->selectedList;
            $selectedTags = $integrationDetails->selectedTags;
            $selectedSubStatus = $integrationDetails->selectedSubStatus;
            $apiResponse = $this->createContact($selectedList, $selectedTags, $selectedSubStatus, $finalData);

            if ($apiResponse && gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, ['type' =>  'create', 'type_name' => 'create contact'], 'success', json_encode("Contact created successfully and id is " . $apiResponse));
            } else {
                LogHandler::save(self::$integrationID, ['type' =>  'create', 'type_name' => 'create contact'], 'error', "Failed to create contact");
            }
            return $apiResponse;
        } else if ($mainAction === '1' && $contactExist && $update) {
            $selectedList = $integrationDetails->selectedList;
            $selectedTags = $integrationDetails->selectedTags;
            $selectedSubStatus = $integrationDetails->selectedSubStatus;
            $apiResponse = $this->updateContact($selectedList, $selectedTags, $selectedSubStatus, $finalData, $contactExist);
            if ($apiResponse && gettype($apiResponse) === 'integer') {
                LogHandler::save(self::$integrationID, ['type' =>  'update', 'type_name' => 'update contact'], 'success', "Contact updated successfully");
            } else {
                LogHandler::save(self::$integrationID, ['type' =>  'update', 'type_name' => 'update contact'], 'error', "Failed to create contact");
            }
            return $apiResponse;
        } else {
            LogHandler::save(self::$integrationID, ['type' =>  'create', 'type_name' => 'create contact'], 'error', "Email already exist");
        }

        return $apiResponse;
    }
}
