<?php

namespace BitCode\FI\Actions\PropovoiceCRM;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;

/**
 * Provide functionality for Record insert, upsert
 */
class RecordApiHelper
{
    private $_integrationID;

    public function __construct($integrationId)
    {
        $this->_integrationID = $integrationId;
    }

    public function generateReqDataFromFieldMap($data, $fieldMap)
    {
        $dataFinal = [];

        foreach ($fieldMap as $key => $value) {
            $triggerValue = $value->formField;
            $actionValue = $value->propovoiceCrmFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } elseif (!\is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }

        return $dataFinal;
    }

    public function createLead($finalData)
    {
        if ($finalData['img']) {
            $imgUpload = new FilesApiHelper();
            $upload = $imgUpload->uploadFile($finalData['img'][0]);
            $finalData['img'] = $upload['id'];
        }

        $propovoiceLeadInstance = new \Ndpv\Model\Lead();

        return $propovoiceLeadInstance->create($finalData);
    }

    public function execute(
        $fieldValues,
        $fieldMap,
        $integrationDetails,
        $mainAction
    ) {
        $finalData = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $apiResponse = null;
        if ($mainAction == '1') {
            // $tags = is_array($integrationDetails->tags) ? $integrationDetails->tags : explode(',', $integrationDetails->tags);
            // $label = $integrationDetails->label;
            // $finalData['tags'] = $tags;
            // $finalData['level_id'] = $label;
            $apiResponse = $this->createLead($finalData);

            if (!$apiResponse) {
                LogHandler::save($this->_integrationID, 'Lead', 'success', __('Lead Created Successfully', 'bit-integrations'));
            } else {
                LogHandler::save($this->_integrationID, 'Lead', 'error', wp_json_encode($apiResponse));
            }
        }

        return $apiResponse;
    }
}
