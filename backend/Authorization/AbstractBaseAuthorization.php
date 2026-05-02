<?php

namespace BitApps\Integrations\Authorization;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Core\Database\ConnectionModel;
use BitApps\Integrations\Core\Util\Hash;

abstract class AbstractBaseAuthorization
{
    protected $connectionId;

    protected $connection;

    public function __construct($connectionId)
    {
        $this->connectionId = (int) $connectionId;
    }

    abstract public function getAccessToken();

    public function getConnectionId(): int
    {
        return (int) $this->connectionId;
    }

    public function getConnection()
    {
        if ($this->connection === null) {
            $this->connection = $this->loadConnection();
        }

        return $this->connection;
    }

    public function getAuthDetails()
    {
        $connection = $this->getConnection();

        if (!$connection) {
            return null;
        }

        $authDetails = $this->decodeAuthDetails($connection->auth_details ?? null);

        if (empty($authDetails)) {
            return $authDetails;
        }

        $encryptKeys = $this->parseEncryptKeys($connection->encrypt_keys ?? '');

        if (empty($encryptKeys)) {
            return $authDetails;
        }

        foreach ($encryptKeys as $path) {
            $value = self::getNestedValue($authDetails, $path);

            if (!is_string($value) || $value === '') {
                continue;
            }

            self::setNestedValue($authDetails, $path, Hash::decrypt($value));
        }

        return $authDetails;
    }

    public function isTokenExpired($generatedAt, $expiresIn): bool
    {
        if (empty($generatedAt) || empty($expiresIn) || (int) $expiresIn <= 0) {
            return false;
        }

        return time() > ((int) $generatedAt + (int) $expiresIn - 30);
    }

    public function updateAuthDetails(array $authDetails): bool
    {
        $connection = $this->getConnection();

        if (!$connection) {
            return false;
        }

        $encryptKeys = $this->parseEncryptKeys($connection->encrypt_keys ?? '');

        foreach ($encryptKeys as $path) {
            $value = self::getNestedValue($authDetails, $path);

            if (!is_string($value) || $value === '') {
                continue;
            }

            self::setNestedValue($authDetails, $path, Hash::encrypt($value));
        }

        $connectionModel = new ConnectionModel();
        $result = $connectionModel->update(
            [
                'auth_details' => wp_json_encode($authDetails),
                'updated_at'   => current_time('mysql'),
            ],
            ['id' => $this->connectionId]
        );

        if (is_wp_error($result) && $result->get_error_code() !== 'result_empty') {
            return false;
        }

        $this->connection = null;

        return true;
    }

    protected function decodeAuthDetails($value): array
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

    protected function parseEncryptKeys($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value)));
        }

        if (is_string($value) && $value !== '') {
            return array_values(array_filter(array_map('trim', explode(',', $value))));
        }

        return [];
    }

    protected function http()
    {
        return new HttpHelper();
    }

    protected static function getNestedValue(array $data, string $path)
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

    protected static function setNestedValue(array &$data, string $path, $value): void
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

    private function loadConnection()
    {
        $connectionModel = new ConnectionModel();
        $result = $connectionModel->get(
            ['id', 'app_slug', 'auth_type', 'connection_name', 'account_name', 'encrypt_keys', 'auth_details', 'status'],
            ['id' => $this->connectionId],
            1
        );

        if (is_wp_error($result) || empty($result[0])) {
            return null;
        }

        return $result[0];
    }
}
