<?php

/**
 * FluentCart Record Api
 */

namespace BitCode\FI\Actions\FluentCart;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

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
    public function execute($fieldValues, $fieldMap, $actions)
    {
        if (!\defined('FLUENTCART_PLUGIN_PATH')) {
            return [
                'success' => false,
                'message' => __('FluentCart is not installed or activated', 'bit-integrations')
            ];
        }

        $fieldData = static::setFieldMap($fieldMap, $fieldValues);
        
        $mainAction = $this->_integrationDetails->mainAction ?? 'create_order';

        $defaultResponse = [
            'success' => false,
            'message' => wp_sprintf(__('%s plugin is not installed or activate', 'bit-integrations'), 'Bit Integrations')
        ];

        // Route to appropriate action method
        switch ($mainAction) {
            case 'create_order':
                $response = apply_filters('btcbi_fluentcart_create_order', $defaultResponse, $fieldData, $actions);
                $actionType = 'create_order';
                break;

            case 'update_order':
                $response = apply_filters('btcbi_fluentcart_update_order', $defaultResponse, $fieldData, $actions);
                $actionType = 'update_order';
                break;

            case 'delete_order':
                $response = apply_filters('btcbi_fluentcart_delete_order', $defaultResponse, $fieldData);
                $actionType = 'delete_order';
                break;

            case 'update_order_status':
                $response = apply_filters('btcbi_fluentcart_update_order_status', $defaultResponse, $fieldData);
                $actionType = 'update_order_status';
                break;

            case 'update_payment_status':
                $response = apply_filters('btcbi_fluentcart_update_payment_status', $defaultResponse, $fieldData);
                $actionType = 'update_payment_status';
                break;

            case 'update_shipping_status':
                $response = apply_filters('btcbi_fluentcart_update_shipping_status', $defaultResponse, $fieldData);
                $actionType = 'update_shipping_status';
                break;

            case 'create_customer':
                $response = apply_filters('btcbi_fluentcart_create_customer', $defaultResponse, $fieldData, $actions);
                $actionType = 'create_customer';
                break;

            case 'update_customer':
                $response = apply_filters('btcbi_fluentcart_update_customer', $defaultResponse, $fieldData, $actions);
                $actionType = 'update_customer';
                break;

            case 'delete_customer':
                $response = apply_filters('btcbi_fluentcart_delete_customer', $defaultResponse, $fieldData);
                $actionType = 'delete_customer';
                break;

            case 'create_product':
                $response = apply_filters('btcbi_fluentcart_create_product', $defaultResponse, $fieldData, $actions);
                $actionType = 'create_product';
                break;

            case 'delete_product':
                $response = apply_filters('btcbi_fluentcart_delete_product', $defaultResponse, $fieldData);
                $actionType = 'delete_product';
                break;

            case 'create_coupon':
                $response = apply_filters('btcbi_fluentcart_create_coupon', $defaultResponse, $fieldData, $actions);
                $actionType = 'create_coupon';
                break;

            case 'delete_coupon':
                $response = apply_filters('btcbi_fluentcart_delete_coupon', $defaultResponse, $fieldData);
                $actionType = 'delete_coupon';
                break;

            default:
                $response = [
                    'success' => false,
                    'message' => __('Invalid action', 'bit-integrations')
                ];
                $actionType = 'unknown';
                break;
        }

        if ($response['success']) {
            LogHandler::save($this->_integrationID, ['type' => 'FluentCart', 'type_name' => $actionType], 'success', $response);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'FluentCart', 'type_name' => $actionType], 'error', $response);
        }

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
        $data = [];
        foreach ($fieldMap as $fieldPair) {
            if (!empty($fieldPair->fluentCartFormField) && !empty($fieldPair->formField)) {
                $data[$fieldPair->fluentCartFormField] = $fieldValues[$fieldPair->formField] ?? '';
            }
        }

        return $data;
    }
}
