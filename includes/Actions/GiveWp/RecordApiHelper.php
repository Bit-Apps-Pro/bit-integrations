<?php

namespace BitCode\FI\Actions\GiveWp;

use BitCode\FI\Core\Util\Common;
use BitCode\FI\Log\LogHandler;

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
            } elseif (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function createGiveWpDonar($finalData)
    {
        $donor = new \Give_Donor();
        $donor_id = $donor->create($finalData);
        return $donor_id;
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
                LogHandler::save($integId, json_encode(['type' => 'create-donar', 'type_name' => 'create-donar-giveWp']), 'success', json_encode('Donar crated successfully and id is' . $response));
            } else {
                LogHandler::save($integId, json_encode(['type' => 'create-donar', 'type_name' => 'create-donar-giveWp']), 'error', json_encode('Failed to create donar'));
            }
        }

        return $response;
    }
}
