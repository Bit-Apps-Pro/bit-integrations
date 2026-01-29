<?php

namespace BitCode\FI\Core\Integration;

use BitCode\FI\Log\LogHandler;
use Exception;
use WP_Error;

/**
 * Integration Handler Wrapper
 * Automatically captures field data for all integrations to enable reexecution
 */
class IntegrationHandler
{
    /**
     * Execute an integration with automatic field data capture
     *
     * @param object $flowData    Integration flow data
     * @param mixed  $fieldValues Field values from trigger
     * @param object $handler     Integration handler instance
     *
     * @return mixed
     */
    public static function executeWithCapture($flowData, $fieldValues, $handler)
    {
        // Store the field values for this execution
        self::storeFieldValues($flowData->id, $fieldValues);

        // Execute the integration
        try {
            return $handler->execute($flowData, $fieldValues);
        } catch (Exception $e) {
            // Log the exception with field data
            LogHandler::save(
                $flowData->id,
                'Exception',
                'error',
                $e->getMessage(),
                $fieldValues
            );

            return new WP_Error('exception', $e->getMessage());
        }
    }

    /**
     * Get stored field values for a flow
     *
     * @param int $flowId Flow ID
     *
     * @return mixed|null
     */
    public static function getFieldValues($flowId)
    {
        global $btcbi_current_field_values;
        if (isset($btcbi_current_field_values[$flowId])) {
            return $btcbi_current_field_values[$flowId];
        }

    }

    /**
     * Store field values temporarily for this request
     *
     * @param int   $flowId      Flow ID
     * @param mixed $fieldValues Field values
     *
     * @return void
     */
    private static function storeFieldValues($flowId, $fieldValues)
    {
        global $btcbi_current_field_values;
        if (!isset($btcbi_current_field_values)) {
            $btcbi_current_field_values = [];
        }
        $btcbi_current_field_values[$flowId] = $fieldValues;
    }
}
