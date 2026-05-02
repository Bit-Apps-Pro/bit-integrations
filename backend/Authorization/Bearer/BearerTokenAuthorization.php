<?php

namespace BitApps\Integrations\Authorization\Bearer;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\AbstractBaseAuthorization;

class BearerTokenAuthorization extends AbstractBaseAuthorization
{
    public function getAccessToken()
    {
        $authDetails = $this->getAuthDetails();

        if (empty($authDetails) || empty($authDetails['token'])) {
            return [
                'error'   => true,
                'message' => 'access token field is missing',
            ];
        }

        return 'Bearer ' . $authDetails['token'];
    }
}
