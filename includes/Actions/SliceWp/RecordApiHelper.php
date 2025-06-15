<?php

namespace BitCode\FI\Actions\SliceWp;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;

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

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->slicewpFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function addCommissionToUser($data, $statusId, $typeId)
    {
        $user_id = get_current_user_id();
        $affiliate_id = $this->slicewp_get_user_affiliate_id($user_id);
        if (!$affiliate_id) {
            return;
        }

        $commission_data = [
            'affiliate_id' => $affiliate_id,
            'visit_id'     => 0,
            'date_created' => date('Y-m-d H:i:s', strtotime($data['commission_date'])),
            // 'date_modified' => date('Y-m-d H:i:s', strtotime($date)),
            'type'        => $typeId,
            'status'      => $statusId,
            'reference'   => $data['reference'],
            'customer_id' => 0,
            'origin'      => 'bit-integrations',
            'amount'      => slicewp_sanitize_amount($data['amount']),
            'currency'    => slicewp_get_setting('active_currency', 'USD')
        ];

        return slicewp_insert_commission($commission_data);
    }

    public function slicewp_get_user_affiliate_id($user_id)
    {
        global $wpdb;
        $affiliate = $wpdb->get_results($wpdb->prepare("SELECT id FROM {$wpdb->prefix}slicewp_affiliates WHERE {$wpdb->prefix}slicewp_affiliates.user_id = %d", $user_id));

        return $affiliate[0]->id;
    }

    public function execute(
        $mainAction,
        $fieldValues,
        $fieldMap,
        $integrationDetails
    ) {
        $fieldData = [];
        $response = null;
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if ($mainAction === '1') {
            $statusId = $integrationDetails->statusId;
            $typeId = $integrationDetails->typeId;
            $response = $this->addCommissionToUser($finalData, $statusId, $typeId);
            if ($response && \gettype($response) === 'integer') {
                LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add commission', 'type_name' => 'add-commission-to-user']), 'success', wp_json_encode($response));
            } else {
                LogHandler::save(self::$integrationID, wp_json_encode(['type' => 'add commission', 'type_name' => 'add-commission-to-user']), 'error', wp_json_encode(__('Failed to add commission', 'bit-integrations')));
            }
        }

        return $response;
    }
}
