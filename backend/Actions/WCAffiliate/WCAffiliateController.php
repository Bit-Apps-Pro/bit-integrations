<?php

/**
 * WC Affiliate Integration
 */

namespace BitApps\Integrations\Actions\WCAffiliate;

use WP_Error;

/**
 * Provide functionality for WC Affiliate integration.
 */
class WCAffiliateController
{
    public static function authorize()
    {
        if (!self::isPluginReady()) {
            wp_send_json_error(
                __('WC Affiliate is not activated or not installed', 'bit-integrations'),
                400
            );
        }

        wp_send_json_success(true);
    }

    public function execute($integrationData, $fieldValues)
    {
        $integrationDetails = $integrationData->flow_details;
        $integId = $integrationData->id;
        $fieldMap = $integrationDetails->field_map;
        $utilities = isset($integrationDetails->utilities) ? $integrationDetails->utilities : [];

        if (empty($fieldMap)) {
            return new WP_Error('field_map_empty', __('Field map is empty', 'bit-integrations'));
        }

        $recordApiHelper = new RecordApiHelper($integrationDetails, $integId);
        $wcAffiliateResponse = $recordApiHelper->execute($fieldValues, $fieldMap, $utilities);

        if (is_wp_error($wcAffiliateResponse)) {
            return $wcAffiliateResponse;
        }

        return $wcAffiliateResponse;
    }

    private static function isPluginReady()
    {
        return class_exists('\WC_Affiliate\Models\Affiliate')
            && class_exists('\WC_Affiliate\Models\Referral')
            && class_exists('\WC_Affiliate\Models\Transaction');
    }
}
