<?php

namespace BitApps\Integrations\Authorization\Basic;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\AbstractBaseAuthorization;

class BasicAuthorization extends AbstractBaseAuthorization
{
    public function getAccessToken()
    {
        $authDetails = $this->getAuthDetails();

        if (empty($authDetails) || empty($authDetails['username']) || !isset($authDetails['password'])) {
            return [
                'error'   => true,
                'message' => 'username or password field is missing',
            ];
        }

        return 'Basic ' . base64_encode($authDetails['username'] . ':' . $authDetails['password']);
    }

    public function setAuthHeadersOrParams()
    {
        $token = $this->getAccessToken();

        if (is_array($token) && !empty($token['error'])) {
            return $token;
        }

        return [
            'authLocation' => 'header',
            'data'         => ['Authorization' => $token],
        ];
    }
}
