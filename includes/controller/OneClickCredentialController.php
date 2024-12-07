<?php

namespace BitCode\FI\controller;

use BitCode\FI\Core\Util\HttpHelper;

final class OneClickCredentialController
{
    public function getCredentials($params)
    {
        $actionName = sanitize_text_field($params->actionName);
        $apiEndpoint = 'https://auth-apps.bitapps.pro/apps/' . $actionName;

        return HttpHelper::get($apiEndpoint, null, null);
    }
}
