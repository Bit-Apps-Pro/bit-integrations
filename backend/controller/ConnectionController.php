<?php

namespace BitApps\Integrations\controller;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\AuthorizationType;
use BitApps\Integrations\Core\Database\ConnectionModel;
use BitApps\Integrations\Core\Util\Capabilities;
use BitApps\Integrations\Core\Util\Hash;
use WP_Error;

final class ConnectionController
{
    private const ALLOWED_AUTH_TYPES = [
        AuthorizationType::BASIC_AUTH,
        AuthorizationType::API_KEY,
        AuthorizationType::BEARER_TOKEN,
        AuthorizationType::OAUTH2,
        AuthorizationType::CUSTOM,
    ];

    private const COLUMNS = [
        'id',
        'app_slug',
        'auth_type',
        'connection_name',
        'account_name',
        'encrypt_keys',
        'auth_details',
        'status',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function index($request)
    {
        $this->guardRead();

        $appSlug = $this->sanitizeScalar($request->app_slug ?? '');
        $condition = ['status' => ConnectionModel::STATUS_VERIFIED];

        if ($appSlug !== '') {
            $condition['app_slug'] = $appSlug;
        }

        $rows = (new ConnectionModel())->get(self::COLUMNS, $condition, null, null, 'id', 'DESC');

        if (is_wp_error($rows)) {
            wp_send_json_success(['data' => []]);
        }

        $payload = [];

        foreach ($rows as $row) {
            $payload[] = $this->formatRow($row);
        }

        wp_send_json_success(['data' => $payload]);
    }

    public function getById($request)
    {
        $this->guardRead();

        $id = $this->normalizeId($request);

        if ($id === 0) {
            wp_send_json_error(__('Connection id is required', 'bit-integrations'));
        }

        $row = $this->findById($id);

        if (is_wp_error($row)) {
            wp_send_json_error($row->get_error_message());
        }

        wp_send_json_success(['data' => $this->formatRow($row)]);
    }

    public function save($request)
    {
        $this->guardWrite();

        $payload = $this->buildPayload($request, false);

        if (is_wp_error($payload)) {
            wp_send_json_error($payload->get_error_message());
        }

        $existingId = $this->findExistingIdForAccount($payload['app_slug'], $payload['account_name']);

        if ($existingId > 0) {
            $payload['id'] = $existingId;

            $updated = $this->persist($payload, $existingId);

            if (is_wp_error($updated)) {
                wp_send_json_error($updated->get_error_message());
            }

            wp_send_json_success(['data' => $this->formatRow($updated)]);
        }

        $created = $this->persist($payload, 0);

        if (is_wp_error($created)) {
            wp_send_json_error($created->get_error_message());
        }

        wp_send_json_success(['data' => $this->formatRow($created)]);
    }

    public function update($request)
    {
        $this->guardWrite();

        $id = $this->normalizeId($request);

        if ($id === 0) {
            wp_send_json_error(__('Connection id is required', 'bit-integrations'));
        }

        $name = $this->sanitizeScalar($request->connection_name ?? '');

        if ($name === '') {
            wp_send_json_error(__('Connection name is required', 'bit-integrations'));
        }

        $existing = $this->findById($id);

        if (is_wp_error($existing)) {
            wp_send_json_error($existing->get_error_message());
        }

        $update = [
            'connection_name' => $name,
            'updated_at'      => current_time('mysql'),
        ];

        if (isset($request->status)) {
            $update['status'] = absint($request->status);
        }

        $result = (new ConnectionModel())->update($update, ['id' => $id]);

        if (is_wp_error($result) && $result->get_error_code() !== 'result_empty') {
            wp_send_json_error($result->get_error_message());
        }

        $row = $this->findById($id);

        if (is_wp_error($row)) {
            wp_send_json_error($row->get_error_message());
        }

        wp_send_json_success(['data' => $this->formatRow($row)]);
    }

    public function reauthorize($request)
    {
        $this->guardWrite();

        $id = $this->normalizeId($request);

        if ($id === 0) {
            wp_send_json_error(__('Connection id is required', 'bit-integrations'));
        }

        if (empty($request->auth_details)) {
            wp_send_json_error(__('Authorization details are required', 'bit-integrations'));
        }

        $existing = $this->findById($id);

        if (is_wp_error($existing)) {
            wp_send_json_error($existing->get_error_message());
        }

        $payload = [
            'app_slug'        => $existing->app_slug,
            'auth_type'       => $existing->auth_type,
            'connection_name' => $existing->connection_name,
            'account_name'    => $existing->account_name,
            'status'          => ConnectionModel::STATUS_VERIFIED,
            'auth_details'    => $this->normalizeArray($request->auth_details),
            'encrypt_keys'    => $this->resolveEncryptKeys($request),
        ];

        if (!empty($request->account_name)) {
            $payload['account_name'] = $this->sanitizeScalar($request->account_name);
        }

        if (!empty($request->connection_name)) {
            $payload['connection_name'] = $this->sanitizeScalar($request->connection_name);
        }

        $row = $this->persist($payload, $id);

        if (is_wp_error($row)) {
            wp_send_json_error($row->get_error_message());
        }

        wp_send_json_success(['data' => $this->formatRow($row)]);
    }

    public function delete($request)
    {
        $this->guardWrite();

        $id = $this->normalizeId($request);

        if ($id === 0) {
            wp_send_json_error(__('Connection id is required', 'bit-integrations'));
        }

        $result = (new ConnectionModel())->delete(['id' => $id]);

        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }

        wp_send_json_success(['id' => $id]);
    }

    private function buildPayload($request, bool $isUpdate)
    {
        $appSlug = $this->sanitizeScalar($request->app_slug ?? '');
        $authType = $this->sanitizeScalar($request->auth_type ?? '');

        if (!$isUpdate && $appSlug === '') {
            return new WP_Error('missing_app_slug', __('App slug is required', 'bit-integrations'));
        }

        if ($authType !== '' && !in_array($authType, self::ALLOWED_AUTH_TYPES, true)) {
            return new WP_Error('invalid_auth_type', __('Invalid auth type', 'bit-integrations'));
        }

        if (empty($request->auth_details)) {
            return new WP_Error('missing_auth_details', __('Authorization details are required', 'bit-integrations'));
        }

        $authDetails = $this->normalizeArray($request->auth_details);

        if (empty($authDetails)) {
            return new WP_Error('missing_auth_details', __('Authorization details are required', 'bit-integrations'));
        }

        $accountName = $this->sanitizeScalar($request->account_name ?? '');
        $connectionName = $this->sanitizeScalar($request->connection_name ?? '');

        if ($connectionName === '') {
            $connectionName = $accountName !== '' ? $accountName : $appSlug;
        }

        return [
            'app_slug'        => $appSlug,
            'auth_type'       => $authType !== '' ? $authType : AuthorizationType::OAUTH2,
            'connection_name' => $connectionName,
            'account_name'    => $accountName,
            'auth_details'    => $authDetails,
            'encrypt_keys'    => $this->resolveEncryptKeys($request),
            'status'          => isset($request->status) ? absint($request->status) : ConnectionModel::STATUS_VERIFIED,
        ];
    }

    private function persist(array $payload, int $existingId)
    {
        $authDetails = $payload['auth_details'];
        $encryptKeys = $payload['encrypt_keys'];

        if (!isset($authDetails['generated_at'])) {
            $authDetails['generated_at'] = time();
        }

        $authDetails = $this->encryptValues($authDetails, $encryptKeys);

        $now = current_time('mysql');

        $row = [
            'app_slug'        => $payload['app_slug'],
            'auth_type'       => $payload['auth_type'],
            'connection_name' => $payload['connection_name'],
            'account_name'    => $payload['account_name'],
            'encrypt_keys'    => implode(',', $encryptKeys),
            'auth_details'    => wp_json_encode($authDetails),
            'status'          => $payload['status'],
            'updated_at'      => $now,
        ];

        $connectionModel = new ConnectionModel();

        if ($existingId > 0) {
            $update = $connectionModel->update($row, ['id' => $existingId]);

            if (is_wp_error($update) && $update->get_error_code() !== 'result_empty') {
                return $update;
            }

            return $this->findById($existingId);
        }

        $row['user_id'] = get_current_user_id();
        $row['created_at'] = $now;

        $insertId = $connectionModel->insert($row);

        if (is_wp_error($insertId)) {
            return $insertId;
        }

        return $this->findById((int) $insertId);
    }

    private function encryptValues(array $authDetails, array $encryptKeys): array
    {
        foreach ($encryptKeys as $path) {
            $value = $this->getNestedValue($authDetails, $path);

            if (!is_string($value) || $value === '') {
                continue;
            }

            $this->setNestedValue($authDetails, $path, Hash::encrypt($value));
        }

        return $authDetails;
    }

    private function decryptValues(array $authDetails, array $encryptKeys): array
    {
        foreach ($encryptKeys as $path) {
            $value = $this->getNestedValue($authDetails, $path);

            if (!is_string($value) || $value === '') {
                continue;
            }

            $this->setNestedValue($authDetails, $path, Hash::decrypt($value));
        }

        return $authDetails;
    }

    private function findById(int $id)
    {
        $rows = (new ConnectionModel())->get(self::COLUMNS, ['id' => $id], 1);

        if (is_wp_error($rows) || empty($rows[0])) {
            return new WP_Error('connection_not_found', __('Connection not found', 'bit-integrations'));
        }

        return $rows[0];
    }

    private function findExistingIdForAccount(string $appSlug, string $accountName): int
    {
        if ($appSlug === '' || $accountName === '') {
            return 0;
        }

        $rows = (new ConnectionModel())->get(
            ['id'],
            [
                'app_slug'     => $appSlug,
                'account_name' => $accountName,
                'status'       => ConnectionModel::STATUS_VERIFIED,
            ],
            1,
            null,
            'id',
            'DESC'
        );

        if (is_wp_error($rows) || empty($rows[0])) {
            return 0;
        }

        return (int) $rows[0]->id;
    }

    private function formatRow($row): array
    {
        $encryptKeys = $this->parseEncryptKeys($row->encrypt_keys ?? '');
        $authDetails = $this->normalizeArray($row->auth_details ?? null);
        $authDetails = $this->decryptValues($authDetails, $encryptKeys);

        return [
            'id'              => (int) $row->id,
            'app_slug'        => $row->app_slug,
            'auth_type'       => $row->auth_type,
            'connection_name' => $row->connection_name,
            'account_name'    => $row->account_name,
            'encrypt_keys'    => $encryptKeys,
            'auth_details'    => $authDetails,
            'status'          => isset($row->status) ? (int) $row->status : ConnectionModel::STATUS_VERIFIED,
            'user_id'         => isset($row->user_id) ? (int) $row->user_id : 0,
            'created_at'      => $row->created_at ?? null,
            'updated_at'      => $row->updated_at ?? null,
        ];
    }

    private function resolveEncryptKeys($request): array
    {
        if (!isset($request->encrypt_keys)) {
            return [];
        }

        if (is_string($request->encrypt_keys)) {
            return $this->parseEncryptKeys($request->encrypt_keys);
        }

        if (is_array($request->encrypt_keys)) {
            $keys = [];
            foreach ($request->encrypt_keys as $key) {
                $key = $this->sanitizeScalar($key);

                if ($key !== '') {
                    $keys[] = $key;
                }
            }

            return array_values(array_unique($keys));
        }

        return [];
    }

    private function parseEncryptKeys($value): array
    {
        if (is_array($value)) {
            $keys = array_filter(array_map([$this, 'sanitizeScalar'], $value));
        } elseif (is_string($value) && $value !== '') {
            $keys = array_filter(array_map('trim', explode(',', $value)));
        } else {
            return [];
        }

        return array_values(array_unique($keys));
    }

    private function normalizeArray($value): array
    {
        if (is_array($value)) {
            return $value;
        }

        if (is_object($value)) {
            return json_decode(wp_json_encode($value), true) ?: [];
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);

            return is_array($decoded) ? $decoded : [];
        }

        return [];
    }

    private function getNestedValue(array $data, string $path)
    {
        if ($path === '') {
            return null;
        }

        $segments = explode('.', $path);
        $cursor = $data;

        foreach ($segments as $segment) {
            if (!is_array($cursor) || !array_key_exists($segment, $cursor)) {
                return null;
            }

            $cursor = $cursor[$segment];
        }

        return $cursor;
    }

    private function setNestedValue(array &$data, string $path, $value): void
    {
        if ($path === '') {
            return;
        }

        $segments = explode('.', $path);
        $last = array_pop($segments);
        $cursor = &$data;

        foreach ($segments as $segment) {
            if (!isset($cursor[$segment]) || !is_array($cursor[$segment])) {
                $cursor[$segment] = [];
            }

            $cursor = &$cursor[$segment];
        }

        $cursor[$last] = $value;
    }

    private function normalizeId($request): int
    {
        if (is_numeric($request)) {
            return absint($request);
        }

        if (is_object($request)) {
            foreach (['id', 'connection_id', 'connectionId'] as $key) {
                if (!empty($request->{$key})) {
                    return absint($request->{$key});
                }
            }
        }

        if (is_array($request)) {
            foreach (['id', 'connection_id', 'connectionId'] as $key) {
                if (!empty($request[$key])) {
                    return absint($request[$key]);
                }
            }
        }

        return 0;
    }

    private function sanitizeScalar($value): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        return sanitize_text_field((string) $value);
    }

    private function guardRead(): void
    {
        if (
            !Capabilities::Check('manage_options')
            && !Capabilities::Check('bit_integrations_manage_integrations')
            && !Capabilities::Check('bit_integrations_create_integrations')
            && !Capabilities::Check('bit_integrations_edit_integrations')
        ) {
            wp_send_json_error(__('You do not have permission to access connections', 'bit-integrations'));
        }
    }

    private function guardWrite(): void
    {
        if (
            !Capabilities::Check('manage_options')
            && !Capabilities::Check('bit_integrations_manage_integrations')
            && !Capabilities::Check('bit_integrations_create_integrations')
            && !Capabilities::Check('bit_integrations_edit_integrations')
        ) {
            wp_send_json_error(__('You do not have permission to manage connections', 'bit-integrations'));
        }
    }
}
