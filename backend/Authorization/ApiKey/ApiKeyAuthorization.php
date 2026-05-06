<?php

namespace BitApps\Integrations\Authorization\ApiKey;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\AbstractBaseAuthorization;

class ApiKeyAuthorization extends AbstractBaseAuthorization
{
    public function getAccessToken()
    {
        $authDetails = $this->getAuthDetails();

        if (empty($authDetails) || !isset($authDetails['value']) || $authDetails['value'] === '') {
            return [
                'error'   => true,
                'message' => 'token field is missing',
            ];
        }

        return $authDetails['value'];
    }

    public function getAuthHeadersOrParams()
    {
        $authDetails = $this->getAuthDetails();

        if (empty($authDetails) || !isset($authDetails['value'])) {
            return [
                'error'   => true,
                'message' => 'token field is missing',
            ];
        }

        $key = $authDetails['key'] ?? 'api_key';
        $location = $authDetails['addTo'] ?? 'header';

        return [
            'authLocation' => $location,
            'data'         => [$key => $authDetails['value']],
        ];
    }
}
