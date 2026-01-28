<?php

namespace BitCode\FI\Triggers\Webhook;

use BitCode\FI\Core\Util\Helper;
use BitCode\FI\Flow\Flow;
use WP_Error;
use WP_REST_Request;

class WebhookController
{
    protected $webhookIntegrationsList = ['BitAssist'];

    public function getNewHook()
    {
        $hook_id = wp_generate_uuid4();

        if (!$hook_id) {
            wp_send_json_error(__('Failed to generate new hook', 'bit-integrations-pro'));
        }
        add_option('btcbi_webhook_' . $hook_id, [], '', 'no');
        wp_send_json_success(['hook_id' => $hook_id]);
    }

    public function getTestData($data)
    {
        $missing_field = null;

        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = \is_null($missing_field) ? 'Webhook ID' : $missing_field . ', Webhook ID';
        }
        if (!\is_null($missing_field)) {
            wp_send_json_error(\sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations-pro'), $missing_field));
        }

        $testData = get_option('btcbi_webhook_' . $data->hook_id);
        if ($testData === false) {
            update_option('btcbi_webhook_' . $data->hook_id, []);
        }
        if (!$testData || empty($testData)) {
            wp_send_json_error(new WP_Error('webhook_test', __('Webhook data is empty', 'bit-integrations-pro')));
        }
        wp_send_json_success(['webhook' => $testData]);
    }

    public function removeTestData($data)
    {
        $missing_field = null;

        if (!Helper::isUserLoggedIn()) {
            wp_send_json_error(__('Logged in user required!', 'bit-integrations-pro'));
        }
        if (!property_exists($data, 'hook_id') || (property_exists($data, 'hook_id') && !wp_is_uuid($data->hook_id))) {
            $missing_field = \is_null($missing_field) ? 'Webhook ID' : $missing_field . ', Webhook ID';
        }
        if (!\is_null($missing_field)) {
            wp_send_json_error(\sprintf(__('%s can\'t be empty or need to be valid', 'bit-integrations-pro'), $missing_field));
        }

        if (property_exists($data, 'reset') && $data->reset) {
            $testData = update_option('btcbi_webhook_' . $data->hook_id, []);
        } else {
            $testData = delete_option('btcbi_webhook_' . $data->hook_id);
        }
        if (!$testData) {
            wp_send_json_error(new WP_Error('webhook_test', __('Failed to remove test data', 'bit-integrations-pro')));
        }
        wp_send_json_success(__('Webhook test data removed successfully', 'bit-integrations-pro'));
    }

    public function handle(WP_REST_Request $request)
    {
        $headers = (array) $request->get_headers();
        $queryParams = $request->get_query_params();
        $fileParams = $request->get_file_params() ?? [];

        $bodyParams = $request->get_body_params();
        $decodedBody = \is_array($bodyParams) ? $bodyParams : [];

        if (empty($decodedBody)) {
            $rawBody = (string) $request->get_body();

            $decodedBody = Helper::isJson($rawBody)
                ? json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR)
                : [$rawBody];
        }

        $flattenedBody = self::flattenPreserveOriginal($decodedBody);
        $data = array_merge($headers, $flattenedBody, $queryParams, $fileParams);

        $params = $request->get_params();
        $hookId = $params['hook_id'] ?? null;

        if (empty(!$hookId)) {
            rest_ensure_response(['status' => 'failed', 'Hook Id is required.']);
        }

        unset($data['hook_id']);

        $finalData = self::overrideDataWithBody($data, $flattenedBody);

        $optionKey = 'btcbi_webhook_' . $hookId;
        if (get_option($optionKey) !== false) {
            update_option($optionKey, $data);
        }

        $flows = Flow::exists($this->webhookIntegrationsList, $hookId);

        if (empty($flows)) {
            return;
        }

        Flow::execute('Webhook', $hookId, $finalData, $flows);

        return rest_ensure_response(['status' => 'success']);
    }

    public static function flattenPreserveOriginal($array, $prefix = '', $depth = 0, $maxDepth = 30)
    {
        if ($depth > $maxDepth || !\is_array($array)) {
            error_log("Max depth reached or non-array at prefix: {$prefix}");

            return [];
        }

        $result = [];

        foreach ($array as $key => $value) {
            $newKey = $prefix === '' ? $key : $prefix . '_' . $key;

            if (\is_array($value)) {
                $result[$newKey] = $value;
                $result = array_merge($result, self::flattenPreserveOriginal($value, $newKey, $depth + 1, $maxDepth));
            } else {
                $result[$newKey] = $value;
            }
        }

        return $result;
    }

    private static function overrideDataWithBody($data, $body)
    {
        foreach ($data as $key => $value) {
            if (isset($body[$key]) && !empty($body[$key])) {
                $data[$key] = $body[$key];
            }
        }

        return $data;
    }
}
