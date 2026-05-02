<?php

namespace BitApps\Integrations\Authorization\OAuth2;

if (!defined('ABSPATH')) {
    exit;
}

use BitApps\Integrations\Authorization\AbstractBaseAuthorization;
use BitApps\Integrations\Core\Util\HttpHelper;

class OAuth2Authorization extends AbstractBaseAuthorization
{
    private $bodyParams;

    private $refreshTokenUrl;

    private $tokenPrefix = 'Bearer ';

    public function setBodyParams(array $bodyParams)
    {
        $this->bodyParams = $bodyParams;

        return $this;
    }

    public function setRefreshTokenUrl($refreshTokenUrl)
    {
        $this->refreshTokenUrl = $refreshTokenUrl;

        return $this;
    }

    public function setTokenPrefix($prefix)
    {
        $this->tokenPrefix = $prefix === null ? '' : (string) $prefix;

        return $this;
    }

    public function getAuthDetails()
    {
        $authDetails = parent::getAuthDetails();

        if (empty($authDetails)) {
            return [
                'error'   => true,
                'message' => 'Connection auth details are missing',
            ];
        }

        $generatedAt = $authDetails['generated_at'] ?? null;
        $expiresIn = $authDetails['expires_in'] ?? null;

        if ($this->isTokenExpired($generatedAt, $expiresIn)) {
            return $this->refreshAccessToken($authDetails);
        }

        return $authDetails;
    }

    public function getAccessToken()
    {
        $authDetails = $this->getAuthDetails();

        if (isset($authDetails['error']) && $authDetails['error']) {
            return $authDetails;
        }

        if (empty($authDetails['access_token'])) {
            return [
                'error'   => true,
                'message' => 'Access token is missing',
            ];
        }

        return $this->tokenPrefix . $authDetails['access_token'];
    }

    public function refreshAccessToken(array $authDetails)
    {
        $url = $this->refreshTokenUrl ?: ($authDetails['refresh_token_url'] ?? ($authDetails['refreshTokenUrl'] ?? ''));

        if (empty($url)) {
            return [
                'error'   => true,
                'message' => 'Refresh token endpoint is missing',
            ];
        }

        $body = $this->bodyParams ?: $this->buildRefreshBody($authDetails);

        $response = HttpHelper::post($url, $body, ['Content-Type' => 'application/x-www-form-urlencoded']);

        if (HttpHelper::$responseCode !== 200 || (is_object($response) && isset($response->error))) {
            return [
                'error'    => true,
                'message'  => is_object($response) && isset($response->error) ? $response->error : 'Token refresh failed',
                'response' => $response,
            ];
        }

        $response = is_object($response) ? json_decode(wp_json_encode($response), true) : (array) $response;

        $authDetails['access_token'] = $response['access_token'] ?? ($authDetails['access_token'] ?? '');

        if (!empty($response['refresh_token'])) {
            $authDetails['refresh_token'] = $response['refresh_token'];
        }

        if (isset($response['expires_in'])) {
            $authDetails['expires_in'] = (int) $response['expires_in'];
        }

        $authDetails['generated_at'] = time();

        $this->updateAuthDetails($authDetails);

        return $authDetails;
    }

    private function buildRefreshBody(array $authDetails): array
    {
        $grantType = $authDetails['grant_type'] ?? 'authorization_code';

        $body = [
            'grant_type'    => $grantType === 'client_credentials' ? 'client_credentials' : 'refresh_token',
            'client_id'     => $authDetails['client_id'] ?? ($authDetails['clientId'] ?? ''),
            'client_secret' => $authDetails['client_secret'] ?? ($authDetails['clientSecret'] ?? ''),
        ];

        if (!empty($authDetails['refresh_token'])) {
            $body['refresh_token'] = $authDetails['refresh_token'];
        }

        return $body;
    }
}
