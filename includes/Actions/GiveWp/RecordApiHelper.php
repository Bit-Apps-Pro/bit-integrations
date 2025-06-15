<?php

namespace BitCode\FI\Actions\GiveWp;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;
use Give_Donor;

class RecordApiHelper
{
    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->giveWpFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function createGiveWpDonar($finalData)
    {
        $donor = new Give_Donor();

        return $donor->create($finalData);
    }

    public function execute(
        $mainAction,
        $fieldValues,
        $fieldMap,
        $integrationDetails,
        $integId
    ) {
        $fieldData = [];
        $response = null;
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        if ($mainAction === '1') {
            $response = $this->createGiveWpDonar($finalData);
            if (!empty($response)) {
                LogHandler::save($integId, wp_json_encode(['type' => 'create-donar', 'type_name' => 'create-donar-giveWp']), 'success', wp_json_encode(wp_sprintf(__('Donar crated successfully and id is %s', 'bit-integrations'), $response)));
            } else {
                LogHandler::save($integId, wp_json_encode(['type' => 'create-donar', 'type_name' => 'create-donar-giveWp']), 'error', wp_json_encode(__('Failed to create donar', 'bit-integrations')));
            }
        }

        return $response;
    }
}
