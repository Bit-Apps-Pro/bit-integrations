<?php

/**
 * MailerPress Record Api
 */

namespace BitCode\FI\Actions\MailerPress;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, update
 */
class RecordApiHelper
{
    private $_integrationID;

    public function __construct($integId)
    {
        if (!class_exists('\MailerPress\Core\Kernel')) {
            return;
        }

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

        // Route to appropriate action method
        switch ($mainAction) {
            case 'createContact':
                $response = $this->insertRecord($fieldData, $lists, $tags);
                $actionType = 'create';

                break;

            case 'deleteContact':
                $response = $this->deleteContact($fieldData);
                $actionType = 'delete';

                break;

            case 'addTags':
                $response = $this->addTagsToContact($fieldData, $tags);
                $actionType = 'add_tags';

                break;

            case 'removeTags':
                $response = $this->removeTagsFromContact($fieldData, $tags);
                $actionType = 'remove_tags';

                break;

            case 'addToLists':
                $response = $this->addContactToLists($fieldData, $lists);
                $actionType = 'add_to_lists';

                break;

            case 'removeFromLists':
                $response = $this->removeContactFromLists($fieldData, $lists);
                $actionType = 'remove_from_lists';

                break;

            default:
                $response = $this->insertRecord($fieldData, $lists, $tags);
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
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        $tagIds = [];
        if (!empty($tags)) {
            $tagIds = array_map(
                function ($id) {
                    return ['id' => $id];
                },
                $tags
            );
        }

        $listIds = [];
        if (!empty($lists)) {
            $listIds = array_map(
                function ($id) {
                    return ['id' => $id];
                },
                $lists
            );
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

        if (!\function_exists('add_mailerpress_contact')) {
            return [
                'success' => false,
                'message' => __('MailerPress is not installed or activated', 'bit-integrations')
            ];
        }

        $result = add_mailerpress_contact($mailerPressContact);

        if (isset($result['success']) && $result['success']) {
            $contactId = $result['contact_id'] ?? 0;
            $isUpdate = $result['update'] ?? false;

            return [
                'success' => true,
                'result'  => $result,
                'message' => $isUpdate ? __('Contact updated successfully', 'bit-integrations') : __('Contact created successfully', 'bit-integrations')
            ];
        }
    }

    /**
     * Delete a contact
     *
     * @param array $contactData Contact data
     *
     * @return array
     */
    private function deleteContact($contactData)
    {
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        if (!class_exists('\MailerPress\Core\Kernel') || !class_exists('\MailerPress\Models\Contacts')) {
            return [
                'success' => false,
                'message' => __('MailerPress is not installed or activated', 'bit-integrations')
            ];
        }

        $contact = self::getContactData($email);

        if (!$contact) {
            return [
                'success' => false,
                'message' => __('Contact not found', 'bit-integrations')
            ];
        }

        $contactId = isset($contact['contact_id']) ? $contact['contact_id'] : (isset($contact['id']) ? $contact['id'] : '');

        $contactsModel = \MailerPress\Core\Kernel::getContainer()->get(\MailerPress\Models\Contacts::class);

        if (!$contactsModel || !method_exists($contactsModel, 'delete')) {
            return [
                'success' => false,
                'message' => __('MailerPress Contacts model is not available', 'bit-integrations')
            ];
        }

        $deleted = $contactsModel->delete($contactId);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => __('Failed to delete contact', 'bit-integrations')
            ];
        }

        do_action('mailerpress_contact_deleted', $contactId);

        return [
            'success' => true,
            'contact' => $contact,
            'message' => __('Contact deleted successfully', 'bit-integrations')
        ];
    }

    /**
     * Add tags to contact
     *
     * @param array $contactData Contact data
     * @param array $tags        Tags to add
     *
     * @return array
     */
    private function addTagsToContact($contactData, $tags)
    {
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        if (empty($tags)) {
            return [
                'success' => false,
                'message' => __('At least one tag is required', 'bit-integrations')
            ];
        }

        $contact = self::getContactData($email);

        if (!$contact) {
            return [
                'success' => false,
                'message' => __('Contact not found', 'bit-integrations')
            ];
        }

        $contactId = isset($contact['contact_id']) ? $contact['contact_id'] : (isset($contact['id']) ? $contact['id'] : '');

        global $wpdb;

        $tagsTable = $wpdb->prefix . 'mailerpress_contact_tags';
        $addedTags = [];

        foreach ($tags as $tagId) {
            if ($tagId > 0) {
                $wpdb->replace(
                    $tagsTable,
                    [
                        'contact_id' => $contactId,
                        'tag_id'     => $tagId,
                    ]
                );
                do_action('mailerpress_contact_tag_added', $contactId, $tagId);
                $addedTags[] = $tagId;
            }
        }

        return [
            'success' => true,
            'id'      => $contactId,
            'tags'    => $addedTags,
            'message' => \sprintf(__('%d tag(s) added successfully', 'bit-integrations'), \count($addedTags))
        ];
    }

    /**
     * Remove tags from contact
     *
     * @param array $contactData Contact data
     * @param array $tags        Tags to remove
     *
     * @return array
     */
    private function removeTagsFromContact($contactData, $tags)
    {
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        if (empty($tags)) {
            return [
                'success' => false,
                'message' => __('At least one tag is required', 'bit-integrations')
            ];
        }

        global $wpdb;

        $contact = self::getContactData($email);

        if (!$contact) {
            return [
                'success' => false,
                'message' => __('Contact not found', 'bit-integrations')
            ];
        }

        $contactId = isset($contact['contact_id']) ? $contact['contact_id'] : (isset($contact['id']) ? $contact['id'] : '');
        $tagsTable = $wpdb->prefix . 'mailerpress_contact_tags';
        $removedTags = [];

        foreach ($tags as $tagId) {
            if ($tagId > 0) {
                $wpdb->delete(
                    $tagsTable,
                    [
                        'contact_id' => $contactId,
                        'tag_id'     => $tagId,
                    ],
                    ['%d', '%%d']
                );
                do_action('mailerpress_contact_tag_removed', $contactId, $tagId);
                $removedTags[] = $tagId;
            }
        }

        return [
            'success' => true,
            'id'      => $contactId,
            'tags'    => $removedTags,
            'message' => \sprintf(__('%d tag(s) removed successfully', 'bit-integrations'), \count($removedTags))
        ];
    }

    /**
     * Add contact to lists
     *
     * @param array $contactData Contact data
     * @param array $lists       Lists to add
     *
     * @return array
     */
    private function addContactToLists($contactData, $lists)
    {
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        if (empty($lists)) {
            return [
                'success' => false,
                'message' => __('At least one list is required', 'bit-integrations')
            ];
        }

        global $wpdb;

        $contact = self::getContactData($email);

        if (!$contact) {
            return [
                'success' => false,
                'message' => __('Contact not found', 'bit-integrations')
            ];
        }

        $contactId = isset($contact['contact_id']) ? $contact['contact_id'] : (isset($contact['id']) ? $contact['id'] : '');
        $listsTable = $wpdb->prefix . 'mailerpress_contact_lists';
        $addedLists = [];

        foreach ($lists as $listId) {
            if ($listId > 0) {
                $wpdb->replace(
                    $listsTable,
                    [
                        'contact_id' => $contactId,
                        'list_id'    => $listId,
                    ]
                );
                do_action('mailerpress_contact_list_added', $contactId, $listId);
                $addedLists[] = $listId;
            }
        }

        return [
            'success' => true,
            'id'      => $contactId,
            'lists'   => $addedLists,
            'message' => \sprintf(__('Added to %d list(s) successfully', 'bit-integrations'), \count($addedLists))
        ];
    }

    /**
     * Remove contact from lists
     *
     * @param array $contactData Contact data
     * @param array $lists       Lists to remove from
     *
     * @return array
     */
    private function removeContactFromLists($contactData, $lists)
    {
        $email = isset($contactData['email']) ? sanitize_email($contactData['email']) : '';

        if (empty($email)) {
            return [
                'success' => false,
                'message' => __('Email is required', 'bit-integrations')
            ];
        }

        if (empty($lists)) {
            return [
                'success' => false,
                'message' => __('At least one list is required', 'bit-integrations')
            ];
        }

        global $wpdb;

        $contact = self::getContactData($email);

        if (!$contact) {
            return [
                'success' => false,
                'message' => __('Contact not found', 'bit-integrations')
            ];
        }

        $contactId = isset($contact['contact_id']) ? $contact['contact_id'] : (isset($contact['id']) ? $contact['id'] : '');
        $listsTable = $wpdb->prefix . 'mailerpress_contact_lists';
        $removedLists = [];

        foreach ($lists as $listId) {
            if ($listId > 0) {
                $wpdb->delete(
                    $listsTable,
                    [
                        'contact_id' => $contactId,
                        'list_id'    => $listId,
                    ],
                    ['%d', '%d']
                );
                do_action('mailerpress_contact_list_removed', $contactId, $listId);
                $removedLists[] = $listId;
            }
        }

        return [
            'success' => true,
            'id'      => $contactId,
            'lists'   => $removedLists,
            'message' => \sprintf(__('Removed from %d list(s) successfully', 'bit-integrations'), \count($removedLists))
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
            if (empty($fieldPair->mailerPressField)) {
                continue;
            }

            $fieldData[$fieldPair->mailerPressField] = ($fieldPair->formField == 'custom' && !empty($fieldPair->customValue))
                ? Common::replaceFieldWithValue($fieldPair->customValue, $fieldValues)
                : $fieldValues[$fieldPair->formField];
        }

        return $fieldData;
    }

    private static function getContactData($email)
    {
        $contactsModel = \MailerPress\Core\Kernel::getContainer()->get(\MailerPress\Models\Contacts::class);
        $contact = $contactsModel->getContactByEmail($email);

        if ($contact) {
            return (array) $contact;
        }

        global $wpdb;
        $tableName = $wpdb->prefix . 'mailerpress_contact';

        $contact = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$tableName} WHERE email = %s",
                $email
            ),
            ARRAY_A
        );

        return $contact ? $contact : null;
    }
}
