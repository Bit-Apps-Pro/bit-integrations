<?php

/**
 * Freshdesk Record Api
 */

namespace BitCode\FI\Actions\FluentSupport;

use BitCode\FI\Log\LogHandler;
use BitCode\FI\Core\Util\Common;
use FluentSupport\App\Models\Ticket;
use FluentSupport\App\Models\Customer;
use FluentSupport\App\Services\Helper;

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
            $actionValue = $value->fluentSupportFormField;
            if ($triggerValue === 'custom') {
                $dataFinal[$actionValue] = Common::replaceFieldWithValue($value->customValue, $data);
            } else if (!is_null($data[$triggerValue])) {
                $dataFinal[$actionValue] = $data[$triggerValue];
            }
        }
        return $dataFinal;
    }

    public function createCustomer($finalData)
    {
        $customer = Customer::maybeCreateCustomer($finalData);

        if (isset($customer->id)) {
            $finalData['customer_id'] = $customer->id;
            return $this->createTicketByExistCustomer($finalData);
        } else {
            wp_send_json_error(
                __(
                    'Create Customer Failed!',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    public function getCustomerExits($customer_email)
    {
        $customer = Customer::where('email', $customer_email)->first();
        return isset($customer->id) ? $customer->id : null;
    }

    public function createTicketByExistCustomer($finalData)
    {
        if (!isset($finalData['mailbox_id']) || empty($finalData['mailbox_id'])) {
            $mailbox = Helper::getDefaultMailBox();
            $finalData['mailbox_id'] = $mailbox->id;
        }
        $ticket = Ticket::create($finalData);

        if (isset($ticket->id)) {
            return $ticket;
        } else {
            wp_send_json_error(
                __(
                    'Create Ticket Failed!',
                    'bit-integrations'
                ),
                400
            );
        }
    }

    public function execute(
        $fieldValues,
        $fieldMap,
        $integrationDetails
    ) {
        $finalData                      = $this->generateReqDataFromFieldMap($fieldValues, $fieldMap);
        $customerExits                  = $this->getCustomerExits($finalData['email']);
        $finalData['client_priority']   = !empty($integrationDetails->actions->client_priority) ? $integrationDetails->actions->client_priority : 'normal';
        $finalData['agent_id']          = $integrationDetails->actions->support_staff;

        if (isset($integrationDetails->actions->business_inbox) && !empty($integrationDetails->actions->business_inbox)) {
            $finalData['mailbox_id'] = $integrationDetails->actions->business_inbox;
        }

        if ($customerExits) {
            $finalData['customer_id'] = $customerExits;
            $apiResponse = $this->createTicketByExistCustomer($finalData);
        } else {
            $apiResponse = $this->createCustomer($finalData);
        }

        if (isset($apiResponse->errors)) {
            LogHandler::save($this->_integrationID, ['type' => 'Ticket', 'type_name' => 'add-Ticket'], 'error', $apiResponse);
        } else {
            LogHandler::save($this->_integrationID, ['type' => 'Ticket', 'type_name' => 'add-Ticket'], 'success', $apiResponse);
        }

        return $apiResponse;
    }
}
