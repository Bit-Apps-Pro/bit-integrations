<?php

/**
 * Bento Record Api
 */

namespace BitCode\FI\Actions\Bento;

use BitCode\FI\Core\Util\HttpHelper;

/**
 * Provide functionality for Record insert, upsert
 */
class BentoHelper
{
    public static function checkResponseCode()
    {
        return empty(HttpHelper::$responseCode) ? false : substr(HttpHelper::$responseCode, 0, 2) == 20;
    }

    public static function setReqParams($siteUUID, $publishableKey, $secretKey)
    {
        return (object) [
            'site_uuid'       => $siteUUID,
            'publishable_key' => $publishableKey,
            'secret_key'      => $secretKey,
        ];
    }
}
