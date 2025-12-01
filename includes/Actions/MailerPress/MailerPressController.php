<?php

/**
 * MailerPress Integration
 */

namespace BitCode\FI\Actions\MailerPress;

use WP_Error;

/**
 * Provide functionality for MailerPress integration
 */
class MailerPressController
{
    /**
     * Validate if MailerPress plugin exists or not. If not exists then terminate
     * request and send an error response.
     *
     * @return void
     */
    public static function isExists()
    {
        if (!class_exists('\MailerPress\Core\Kernel')) {
            wp_send_json_error(
                __(
                    'MailerPress is not activated or not installed',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    /**
     * Process ajax request for authorization
     *
     * @return JSON response
     */
    public static function mailerPressAuthorize()
    {
        self::isExists();
        wp_send_json_success(true);
    }

    /**
     * Process ajax request for refresh lists
     *
     * @return JSON list data
     */
    public function refreshLists()
    {
        self::isExists();

        $lists = [];

        if (\function_exists('mailerpress_get_lists')) {
            $allLists = mailerpress_get_lists();
            foreach ($allLists as $list) {
                $lists[$list->name] = (object) [
                    'listId'   => $list->list_id ?? $list['list_id'],
                    'listName' => $list->name ?? $list['name']
                ];
            }
        } else {
            global $wpdb;
            $tableName = $wpdb->prefix . 'mailerpress_lists';

            $tableExists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName));

            if ($tableExists) {
                $allLists = $wpdb->get_results("SELECT list_id, name FROM {$tableName}", ARRAY_A);
                foreach ($allLists as $list) {
                    $lists[$list['name']] = (object) [
                        'listId'   => $list['list_id'],
                        'listName' => $list['name']
                    ];
                }
            }
        }

        $response['listList'] = $lists;
        wp_send_json_success($response, 200);
    }

    /**
     * Process ajax request for refresh tags
     *
     * @return JSON tag data
     */
    public function refreshTags()
    {
        self::isExists();

        $tags = [];

        if (\function_exists('mailerpress_get_tags')) {
            $allTags = mailerpress_get_tags();
            foreach ($allTags as $tag) {
                $tags[$tag->name] = (object) [
                    'tagId'   => $tag->tag_id ?? $tag['tag_id'],
                    'tagName' => $tag->name ?? $tag['name']
                ];
            }
        } else {
            global $wpdb;
            $tableName = $wpdb->prefix . 'mailerpress_tags';

            $tableExists = $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $tableName));

            if ($tableExists) {
                $allTags = $wpdb->get_results("SELECT tag_id, name FROM {$tableName}", ARRAY_A);
                foreach ($allTags as $tag) {
                    $tags[$tag['name']] = (object) [
                        'tagId'   => $tag['tag_id'],
                        'tagName' => $tag['name']
                    ];
                }
            }
        }

        $response['tagList'] = $tags;
        wp_send_json_success($response, 200);
    }

    /**
     * Execute integration
     *
     * @param object $integrationData Integration data
     * @param array  $fieldValues     Field values
     *
     * @return mixed
     */
    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;
        $mainAction = $integrationDetails->mainAction ?? '';
        $lists = self::convertStringToArray($integrationDetails->lists ?? []);
        $tags = self::convertStringToArray($integrationDetails->tags ?? []);
        error_log('Tags in MailerPressController: ' . print_r($tags, true));

        if (empty($fieldMap)) {
            return new WP_Error('REQ_FIELD_EMPTY', wp_sprintf(__('Field map is required for %s api', 'bit-integrations'), 'MailerPress'));
        }

        $recordApiHelper = new RecordApiHelper($integId);

        $mailerPressApiResponse = $recordApiHelper->execute(
            $fieldValues,
            $fieldMap,
            $lists,
            $tags,
            $mainAction
        );

        if (is_wp_error($mailerPressApiResponse)) {
            return $mailerPressApiResponse;
        }

        return $mailerPressApiResponse;
    }

    private static function convertStringToArray($value, $separator = ',')
    {
        if (\is_array($value)) {
            return $value;
        }

        $array = array_map('trim', explode($separator, $value));

        return array_filter($array);
    }
}
