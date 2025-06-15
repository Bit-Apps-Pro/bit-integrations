<?php

namespace BitCode\FI\Actions\MailMint;

use WP_Error;
use Mint\MRM\Constants;
use Mint\MRM\DataBase\Models\ContactGroupModel;
use Mint\MRM\DataBase\Tables\CustomFieldSchema;

class MailMintController
{
    public static function pluginActive()
    {
        return (bool) (class_exists('MailMint'))

        ;
    }

    public static function authorizeMailMint()
    {
        if (self::pluginActive()) {
            wp_send_json_success(true, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'Mail Mint'));
    }

    public static function allCustomFields()
    {
        if (class_exists('Mint\MRM\DataBase\Models\ContactGroupModel')) {
            global $wpdb;
            $allFields = [];
            $fields_table = $wpdb->prefix . CustomFieldSchema::$table_name;
            $primaryFields = get_option('mint_contact_primary_fields', Constants::$primary_contact_fields);
            $customFields = $wpdb->get_results($wpdb->prepare('SELECT title, slug, type, group_id FROM %s ', $fields_table), ARRAY_A);

            if (!empty($customFields)) {
                $primaryFields['other'] = array_merge($primaryFields['other'], $customFields);
            }

            foreach ($primaryFields as $moduleKey => $module) {
                foreach ($module as $field) {
                    $allFields[] = (object) [
                        'key'      => $moduleKey !== 'other' ? $field['slug'] : 'custom_meta_field_' . $field['slug'],
                        'label'    => $field['title'],
                        'required' => $field['slug'] == 'email' ? true : false
                    ];
                }
            }
            wp_send_json_success($allFields, 200);
        }
        wp_send_json_error(wp_sprintf(__('%s must be activated!', 'bit-integrations'), 'Mail Mint'));
    }

    public static function getAllList()
    {
        $allLists = [];
        if (class_exists('Mint\MRM\DataBase\Models\ContactGroupModel')) {
            $listData = ContactGroupModel::get_all('lists');

            if (!empty($listData)) {
                foreach ($listData['data'] as $list) {
                    $allLists[] = [
                        'id'   => $list['id'],
                        'name' => $list['title'],
                    ];
                }
            }
        }
        wp_send_json_success($allLists, 200);
    }

    public static function getAllTags()
    {
        $allTags = [];
        if (class_exists('Mint\MRM\DataBase\Models\ContactGroupModel')) {
            $tagData = ContactGroupModel::get_all('tags');

            if (!empty($tagData)) {
                foreach ($tagData['data'] as $tag) {
                    $allTags[] = [
                        'id'   => $tag['id'],
                        'name' => $tag['title'],
                    ];
                }
            }
        }
        wp_send_json_success($allTags, 200);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $mainAction = $integrationDetails->mainAction;
        $fieldMap = $integrationDetails->field_map;
        if (
            empty($integId)
            || empty($mainAction)
        ) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('module, fields are required for %s api', 'bit-integrations'), 'Mail Mint'));
        }
        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $mailMintApiResponse = $recordApiHelper->execute(
            $mainAction,
            $fieldValues,
            $fieldMap,
            $integrationDetails
        );

        if (is_wp_error($mailMintApiResponse)) {
            return $mailMintApiResponse;
        }

        return $mailMintApiResponse;
    }
}
