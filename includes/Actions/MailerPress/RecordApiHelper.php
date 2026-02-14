<?php

/**
 * MailerPress Record Api
 */

namespace BitApps\BTCBI_FI\Actions\MailerPress;

use BitApps\BTCBI_FI\Core\Util\Common;
use BitApps\BTCBI_FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, update
 */
class RecordApiHelper
{
    private $_integrationID;

    public function __construct($integId)
    {
        $this->_integrationID = $integId;
    }

    /**
     * Execute the integration
     *
     * @param array $fieldValues Field values from form
     * @param array $fieldMap    Field mapping
     * @param array $lists       Lists to subscribe
     * @param array $tags        Tags to add
     * @param mixed $mainAction
     *
     * @return array
     */
    public function execute($fieldValues, $fieldMap, $lists, $tags, $mainAction)
    {
        if (!class_exists('\MailerPress\Core\Kernel')) {
            return [
                'success' => false,
                'message' => __('MailerPress is not installed or activated', 'bit-integrations')
            ];
        }

        $fieldData = static::setFieldMap($fieldMap, $fieldValues);

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations')
        ];

        // Route to appropriate action method
        switch ($mainAction) {
            case 'create_or_update_contact':
                $response = $this->insertRecord($fieldData, $lists, $tags);
                $actionType = 'create';

                break;

            case 'delete_contact':
                $response = apply_filters('btcbi_mailerpress_delete_contact', $defaultResponse, $fieldData);
                $actionType = 'delete';

                break;

            case 'add_tags':
                $response = apply_filters('btcbi_mailerpress_add_tags', $defaultResponse, $fieldData, $tags);
                $actionType = 'add_tags';

                break;

            case 'remove_tags':
                $response = apply_filters('btcbi_mailerpress_remove_tags', $defaultResponse, $fieldData, $tags);
                $actionType = 'remove_tags';

                break;

            case 'add_to_lists':
                $response = apply_filters('btcbi_mailerpress_add_to_lists', $defaultResponse, $fieldData, $lists);
                $actionType = 'add_to_lists';

                break;

            case 'remove_from_lists':
                $response = apply_filters('btcbi_mailerpress_remove_from_lists', $defaultResponse, $fieldData, $lists);
                $actionType = 'remove_from_lists';

                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
                $actionType = 'create';

                break;
        }

        if ($response['success']) {
            LogHandler::save($this->_integrationID, ['type' => 'Contact', 'type_name' => $actionType], 'success', $response);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'Contact', 'type_name' => $actionType], 'error', $response);
        }

        return $response;
    }

    /**
     * Insert or update contact record
     *
     * @param array $contactData Contact data
     * @param array $lists       Lists to subscribe
     * @param array $tags        Tags to add
     *
     * @return array
     */
    private function insertRecord($contactData, $lists, $tags)
    {
        $email = key_exists('email', $contactData) ? sanitize_email($contactData['email']) : null;

        if (\is_null($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        $tagIds = [];
        if (\is_array($tags)) {
            $tagIds = array_map(
                function ($id) {
                    return ['id' => $id];
                },
                $tags
            );
        }

        $listIds = [];
        if (\is_array($lists)) {
            $listIds = array_map(
                function ($id) {
                    return ['id' => $id];
                },
                $lists
            );
        }

        if (!\function_exists('add_mailerpress_contact')) {
            return [
                'success' => false,
                'message' => __('MailerPress is not installed or activated', 'bit-integrations')
            ];
        }

        $mailerPressContact = [
            'contactEmail'        => $email,
            'contactFirstName'    => isset($contactData['first_name']) ? sanitize_text_field($contactData['first_name']) : '',
            'contactLastName'     => isset($contactData['last_name']) ? sanitize_text_field($contactData['last_name']) : '',
            'contactStatus'       => isset($contactData['status']) ? sanitize_text_field($contactData['status']) : 'subscribed',
            'subscription_status' => isset($contactData['status']) ? sanitize_text_field($contactData['status']) : 'subscribed',
            'opt_in_source'       => 'bit-integrations',
            'tags'                => $tagIds,
            'lists'               => $listIds,
        ];

        $result = add_mailerpress_contact($mailerPressContact);

        if (isset($result['success']) && $result['success']) {
            $isUpdate = $result['update'] ?? false;

            return [
                'success' => true,
                'result'  => $result,
                'message' => $isUpdate ? __('Contact updated successfully', 'bit-integrations') : __('Contact created successfully', 'bit-integrations')
            ];
        }

        return [
            'success' => false,
            'message' => $result['message'] ?? __('Failed to create or update contact', 'bit-integrations')
        ];
    }

    /**
     * Map form fields to MailerPress fields
     *
     * @param array $fieldMap    Field mapping
     * @param array $fieldValues Field values
     *
     * @return array
     */
    private static function setFieldMap($fieldMap, $fieldValues)
    {
        $fieldData = [];

        foreach ($fieldMap as $fieldPair) {
            if (!isset($fieldPair->mailerPressField) || \is_null($fieldPair->mailerPressField) || $fieldPair->mailerPressField === '') {
                continue;
            }

            $fieldData[$fieldPair->mailerPressField] = ($fieldPair->formField == 'custom' && isset($fieldPair->customValue))
                ? Common::replaceFieldWithValue($fieldPair->customValue, $fieldValues)
                : $fieldValues[$fieldPair->formField];
        }

        return $fieldData;
    }
}
