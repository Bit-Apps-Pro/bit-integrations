<?php

namespace BitApps\Integrations\Authorization;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\ApiKey\ApiKeyAuthorization;
use BitApps\Integrations\Authorization\Basic\BasicAuthorization;
use BitApps\Integrations\Authorization\Bearer\BearerTokenAuthorization;
use BitApps\Integrations\Authorization\OAuth2\OAuth2Authorization;
use Exception;

class AuthorizationFactory
{
    public const FREE_NAMESPACE = 'BitApps\\Integrations\\Actions\\';

    public const PRO_NAMESPACE = 'BitApps\\IntegrationsPro\\Actions\\';

    public const PRO_NAMESPACE_LEGACY = 'BitApps\\BTCBI_PRO\\Actions\\';

    public static function getAuthorizationHandler($type, $connectionId, $appSlug = '')
    {
        switch ($type) {
            case AuthorizationType::BASIC_AUTH:
                return new BasicAuthorization($connectionId);

            case AuthorizationType::API_KEY:
                return new ApiKeyAuthorization($connectionId);

            case AuthorizationType::BEARER_TOKEN:
                return new BearerTokenAuthorization($connectionId);

            case AuthorizationType::OAUTH2:
                return new OAuth2Authorization($connectionId);

            case AuthorizationType::CUSTOM:
                $class = self::authorizationClassExists($appSlug);

                if ($class) {
                    return new $class($connectionId);
                }

                throw new Exception('Authorization class not found');

            default:
                throw new Exception('Invalid authorization type');
        }
    }

    public static function authorizationClassExists($appSlug)
    {
        $appSlug = ucfirst((string) $appSlug);

        $candidates = [
            self::FREE_NAMESPACE . "{$appSlug}\\{$appSlug}Authorization",
            self::PRO_NAMESPACE . "{$appSlug}\\{$appSlug}Authorization",
            self::PRO_NAMESPACE_LEGACY . "{$appSlug}\\{$appSlug}Authorization",
        ];

        foreach ($candidates as $class) {
            if (class_exists($class)) {
                return $class;
            }
        }

        return false;
    }
}
