<?php

/**
 * SEOPress Record Api
 */

namespace BitApps\BTCBI_FI\Actions\SeoPress;

use BitApps\BTCBI_FI\Core\Util\Common;
use BitApps\BTCBI_FI\Log\LogHandler;

/**
 * Provide functionality for Record insert, update
 */
class RecordApiHelper
{
    private $_integrationID;

    private $_integrationDetails;

    public function __construct($integrationDetails, $integId)
    {
        $this->_integrationDetails = $integrationDetails;
        $this->_integrationID = $integId;
    }

    /**
     * Execute the integration
     *
     * @param array $fieldValues Field values from form
     * @param array $fieldMap    Field mapping
     * @param array $actions     Actions to perform
     *
     * @return array
     */
    public function execute($fieldValues, $fieldMap)
    {
        if (!\defined('SEOPRESS_VERSION')) {
            return [
                'success' => false,
                'message' => __('SEOPress is not installed or activated', 'bit-integrations')
            ];
        }

        $fieldData = static::setFieldMap($fieldMap, $fieldValues);

        $mainAction = $this->_integrationDetails->mainAction ?? 'update_post_meta';

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations')
        ];

        switch ($mainAction) {
            case 'update_post_meta':
                $response = apply_filters('btcbi_seopress_update_post_meta', $defaultResponse, $fieldData);
                $actionType = 'update_post_meta';

                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
                $actionType = 'unknown';

                break;
        }

        $responseType = $response['success'] ? 'success' : 'error';

        LogHandler::save($this->_integrationID, ['type' => 'SEOPress', 'type_name' => $actionType], $responseType, $response);

        return $response;
    }

    /**
     * Prepare field data from field map
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
            if (!isset($fieldPair->seoPressField) || \is_null($fieldPair->seoPressField) || $fieldPair->seoPressField === '') {
                continue;
            }

            $fieldData[$fieldPair->seoPressField] = ($fieldPair->formField == 'custom' && isset($fieldPair->customValue))
                ? Common::replaceFieldWithValue($fieldPair->customValue, $fieldValues)
                : $fieldValues[$fieldPair->formField];
        }

        return $fieldData;
    }
}
