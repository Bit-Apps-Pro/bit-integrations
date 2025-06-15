<?php

namespace BitCode\FI\Triggers\Webhook;

use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Flow\Flow;
use WP_Error;
use WP_REST_Request;

class WebhookController
{
    protected $webhookIntegrationsList = [
        'Webhook',
        'KaliForms',
        'Amelia',
        'WPFunnels',
        'Typebot',
        'JetForm',
        'FluentSupport',
        'BitAssist',
    ];

    public static function info()
    {
        return [
            'name' => 'Webhook',
            'title' => 'Get callback data through an URL',
            'type' => 'webhook',
            'is_active' => true
        ];
    }

    public function getNewHook()
    {
        $hook_id = wp_generate_uuid4();

        if (!$hook_id) {
            wp_send_json_error(__('Failed to generate new hook', 'bit-integrations'));
        }
        add_option('btcbi_webhook_' . $hook_id, [], '', 'no');
        wp_send_json_success(['hook_id' => $hook_id]);
    }

    public function getTestData($data)
    {
        $missing_field = null;

        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = is_null($missing_field) ? 'Webhook ID' : $missing_field . ', Webhook ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        $testData = get_option('btcbi_webhook_' . $data->hook_id);
        if ($testData === false) {
            update_option('btcbi_webhook_' . $data->hook_id, []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('webhook_test', __('Webhook data is empty', 'bit-integrations')));
        }
        wp_send_json_success(['webhook' => $testData]);
    }

    public function removeTestData($data)
    {
        $missing_field = null;

        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = is_null($missing_field) ? 'Webhook ID' : $missing_field . ', Webhook ID';
        }
        if (!is_null($missing_field)) {
            wp_send_json_error(sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations'), $missing_field));
        }

        if (property_exists($data, 'reset') && $data->reset) {
            $testData = update_option('btcbi_webhook_' . $data->hook_id, []);
        } else {
            $testData = delete_option('btcbi_webhook_' . $data->hook_id);
        }
        if (!$testData) {
            wp_send_json_error(new WP_Error('webhook_test', __('Failed to remove test data', 'bit-integrations')));
        }
        wp_send_json_success(__('Webhook test data removed successfully', 'bit-integrations'));
    }

    public static function makeNonNestedRecursive(array &$out, $key, array $in)
    {
        foreach ($in as $k => $v) {
            if (is_array($v)) {
                self::makeNonNestedRecursive($out, $key . $k . '_', $v);
            } else {
                $out[$key . $k] = $v;
            }
        }
    }

    public static function makeNonNested(array $in)
    {
        $out = [];
        self::makeNonNestedRecursive($out, '', $in);
        return $out;
    }

    public static function testDataFormat($data)
    {
        if (!is_array($data)) {
            return $data;
        }

        $out = [];
        foreach ($data as $k => $v) {
            $rootAraVal = [];
            $flatAra = [];
            if (is_array($v)) {
                $rootAraVal[$k] = json_encode($v);
                $flatAra = self::makeNonNested([$k => $v]);
                $rootAraVal = array_merge($flatAra, $rootAraVal);
            } else {
                $rootAraVal[$k] = $v;
            }
            $out = array_merge($out, $rootAraVal);
        }
        return $out;
    }

    public function handle(WP_REST_Request $request)
    {
        $data = (array) $request->get_headers();
        $content_type = is_array($request->get_content_type()) ? $request->get_content_type()['value'] : '';
        if (Helper::isJson($request->get_body())) {
            $data = $data + (array) json_decode($request->get_body(), true);
        } else {
            $data = array_merge($data, (array) $request->get_body_params());
        }

        $data = (array) $data + $request->get_query_params();

        if (is_array($request->get_file_params())) {
            $data = (array) $data + $request->get_file_params();
        }
        $hook_id = $request->get_params()['hook_id'];
        unset($data['hook_id']);

        $formatedData = self::testDataFormat($data);
        if (get_option('btcbi_webhook_' . $hook_id) !== false) {
            update_option('btcbi_webhook_' . $hook_id, $formatedData);
        }

        if ($flows = Flow::exists($this->webhookIntegrationsList, $hook_id)) {
            Flow::execute('Webhook', $hook_id, $formatedData, $flows);
        }
        return rest_ensure_response(['status' => 'success']);
    }
}
